import { LoginEventLog, LogicRuleBlock, RuleEvaluationResult, RuleAction } from '../types';

/**
 * Validates the AST / structure of user rule blocks
 */
export function validateRuleBlocks(blocks: LogicRuleBlock[]): { isValid: boolean; error?: string } {
  if (!blocks || blocks.length === 0) {
    return { isValid: false, error: "Editor aturan masih kosong. Tambahkan minimal satu blok IF untuk menganalisis data." };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === 'IF_THEN' || block.type === 'IF_ELSE') {
      if (!block.conditionGroup || block.conditionGroup.conditions.length === 0) {
        return { isValid: false, error: `Blok #${i + 1} (${block.type}) tidak memiliki kondisi perbandingan.` };
      }
      for (const cond of block.conditionGroup.conditions) {
        if (cond.value === '' || cond.value === undefined || cond.value === null) {
          return { isValid: false, error: `Blok #${i + 1}: Nilai pembanding untuk atribut '${cond.field}' belum diisi.` };
        }
      }
      if (!block.thenAction) {
        return { isValid: false, error: `Blok #${i + 1}: Aksi 'THEN' belum ditentukan (misal: MARK AS SUSPICIOUS).` };
      }
    }
  }

  return { isValid: true };
}

/**
 * Evaluates a single condition against a login record
 */
function evaluateCondition(cond: { field: string; comparator: string; value: string | number }, record: LoginEventLog): boolean {
  const actualValue = (record as any)[cond.field];
  const targetValue = cond.value;

  if (typeof actualValue === 'number') {
    const numTarget = Number(targetValue);
    if (isNaN(numTarget)) return false;
    switch (cond.comparator) {
      case 'GREATER_THAN': return actualValue > numTarget;
      case 'LESS_THAN': return actualValue < numTarget;
      case 'EQUALS': return actualValue === numTarget;
      case 'NOT_EQUALS': return actualValue !== numTarget;
      default: return false;
    }
  }

  const strActual = String(actualValue).toUpperCase();
  const strTarget = String(targetValue).toUpperCase();

  switch (cond.comparator) {
    case 'EQUALS': return strActual === strTarget;
    case 'NOT_EQUALS': return strActual !== strTarget;
    default: return false;
  }
}

/**
 * Runs the AST rule blocks over the dataset without eval()
 */
export function executeRules(blocks: LogicRuleBlock[], dataset: LoginEventLog[]): RuleEvaluationResult {
  const validation = validateRuleBlocks(blocks);
  if (!validation.isValid) {
    return {
      totalProcessed: 0,
      truePositives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      falseNegatives: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      feedback: {
        status: 'SYNTAX_ERROR',
        title: "Kesalahan Struktur Logika",
        description: validation.error || "Validasi aturan gagal.",
        tips: ["Pastikan setiap blok kondisi memiliki atribut, operator perbandingan, dan nilai target."]
      },
      rowDecisions: []
    };
  }

  let tp = 0; // True Positive: Deteksi benar ancaman
  let fp = 0; // False Positive: Salah tuduh (aturan terlalu ketat)
  let tn = 0; // True Negative: Deteksi benar aktivitas aman
  let fn = 0; // False Negative: Ancaman lolos (aturan terlalu longgar)

  const rowDecisions: RuleEvaluationResult['rowDecisions'] = [];

  // Execute rules on each log row
  dataset.forEach((record) => {
    let resolvedAction: RuleAction = 'PASS'; // default action if no rule hits
    let matchedReason = "Tidak ada kondisi yang cocok (Default PASS)";

    for (const block of blocks) {
      // Handle REPEAT wrapper if present (safeguarded against infinite loops, max 5 iterations)
      const repeatLimit = Math.min(block.repeatTimes || 1, 5);

      for (let r = 0; r < repeatLimit; r++) {
        if (!block.conditionGroup) continue;

        const { operator, conditions } = block.conditionGroup;
        let groupMatched = false;

        if (operator === 'AND') {
          groupMatched = conditions.every(c => evaluateCondition(c, record));
        } else {
          // OR operator
          groupMatched = conditions.some(c => evaluateCondition(c, record));
        }

        if (groupMatched) {
          resolvedAction = block.thenAction;
          matchedReason = `Cocok dengan Aturan #${blocks.indexOf(block) + 1} (THEN: ${block.thenAction})`;
          break;
        } else if (block.type === 'IF_ELSE' && block.elseAction) {
          resolvedAction = block.elseAction;
          matchedReason = `Kondisi tidak terpenuhi (ELSE: ${block.elseAction})`;
        }
      }

      if (resolvedAction === 'MARK_SUSPICIOUS' || resolvedAction === 'SEND_REVIEW') {
        break; // Threat detected, take immediate action
      }
    }

    const isThreatAction = resolvedAction === 'MARK_SUSPICIOUS' || resolvedAction === 'SEND_REVIEW';
    const isGroundTruthThreat = record.isSuspicious;

    let isCorrect = false;

    if (isThreatAction && isGroundTruthThreat) {
      tp++;
      isCorrect = true;
    } else if (isThreatAction && !isGroundTruthThreat) {
      fp++;
      isCorrect = false;
    } else if (!isThreatAction && !isGroundTruthThreat) {
      tn++;
      isCorrect = true;
    } else if (!isThreatAction && isGroundTruthThreat) {
      fn++;
      isCorrect = false;
    }

    rowDecisions.push({
      recordId: record.id,
      action: resolvedAction,
      expected: isGroundTruthThreat ? 'SUSPICIOUS' : 'NORMAL',
      isCorrect,
      reason: matchedReason
    });
  });

  const total = dataset.length;
  const accuracy = Math.round(((tp + tn) / total) * 100);
  const precision = (tp + fp) > 0 ? Math.round((tp / (tp + fp)) * 100) : 0;
  const recall = (tp + fn) > 0 ? Math.round((tp / (tp + fn)) * 100) : 0;
  const f1Score = (precision + recall) > 0 ? Math.round((2 * precision * recall) / (precision + recall)) : 0;

  // Construct educational feedback adapted for SMA students
  let feedbackStatus: RuleEvaluationResult['feedback']['status'] = 'EXCELLENT';
  let title = "Deteksi Sangat Akurat!";
  let description = "Aturan Anda berhasil membedakan serangan siber dengan staf resmi secara seimbang.";
  const tips: string[] = [];

  if (accuracy >= 90) {
    feedbackStatus = 'EXCELLENT';
    title = "Aturan Logika Sangat Efektif (Akurasi Tinggi)";
    description = `Sistem berhasil mendeteksi ancaman dengan tingkat akurasi ${accuracy}%. Pola ancaman tertangkap dengan tepat tanpa mengganggu aktivitas sah.`;
    tips.push("Anda menunjukkan pemahaman Sequence & Conditions yang sangat kuat.");
  } else if (fp > 4 && fn === 0) {
    feedbackStatus = 'TOO_STRICT';
    title = "Aturan Terlalu Ketat (Over-Strict / False Positive Tinggi)";
    description = `Aturan Anda menangkap semua penyerang, tetapi menuduh ${fp} staf resmi sebagai ancaman (False Positives). Ini akan menghentikan operasional perusahaan!`;
    tips.push("Periksa nilai ambang batas (threshold), misalnya Failed Attempt Count jangan disetel terlalu rendah (< 2).");
    tips.push("Gunakan operator AND untuk menggabungkan kondisi agar lebih spesifik (misal: gagal > 4 AND perangkat TOR).");
  } else if (fn > 3 && fp <= 2) {
    feedbackStatus = 'TOO_LOOSE';
    title = "Aturan Terlalu Longgar (Under-Strict / False Negative Tinggi)";
    description = `Ada ${fn} serangan siber yang berhasil menyusup tanpa terdeteksi (False Negatives). Sistem keamanan Anda masih mudah ditembus.`;
    tips.push("Periksa apakah ada jenis serangan lain seperti TOR_PROXY atau API Spray yang belum dicakup kondisi IF.");
    tips.push("Gunakan operator OR untuk mencakup lebih banyak indikator ancaman.");
  } else {
    feedbackStatus = 'INCOMPLETE';
    title = "Keseimbangan Logika Perlu Ditingkatkan";
    description = `Akurasi deteksi saat ini adalah ${accuracy}%. Masih ada ${fp} alarm palsu dan ${fn} ancaman yang terlewat.`;
    tips.push("Gunakan blok IF-ELSE secara berjenjang untuk memisahkan kasus ekstrim dari aktivitas biasa.");
  }

  return {
    totalProcessed: total,
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn,
    accuracy,
    precision,
    recall,
    f1Score,
    feedback: {
      status: feedbackStatus,
      title,
      description,
      tips
    },
    rowDecisions
  };
}
