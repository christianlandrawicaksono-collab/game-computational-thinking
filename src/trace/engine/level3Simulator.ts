import { SystemModuleRecord, ProcedureInstruction, SystemExecutionStep, Level3EvaluationResult } from '../types';

export interface SimulationTrace {
  steps: SystemExecutionStep[];
  evaluation: Level3EvaluationResult;
}

/**
 * Runs the simulation of multi-procedure security pipeline
 */
export function simulateSystemPipeline(
  pipeline: ProcedureInstruction[],
  dataset: SystemModuleRecord[]
): SimulationTrace {
  const steps: SystemExecutionStep[] = [];
  let stepCounter = 1;

  // Track bugs identified & fixed
  // Bug 1: Redundant CHECK_LOGIN (> 1 CHECK_LOGIN in pipeline)
  const checkLoginCount = pipeline.filter(p => p.enabled && p.procedure === 'CHECK_LOGIN').length;
  const hasRedundantCheckLogin = checkLoginCount > 1;

  // Bug 2: Procedure order - GENERATE_REPORT must be at the very end
  const enabledProcs = pipeline.filter(p => p.enabled);
  const reportIndex = enabledProcs.findIndex(p => p.procedure === 'GENERATE_REPORT');
  const isReportPremature = reportIndex !== -1 && reportIndex < enabledProcs.length - 1;
  const hasReport = reportIndex !== -1;

  // Bug 3: ANALYZE_ACTIVITY must be enabled and present
  const hasActivityAnalyzer = enabledProcs.some(p => p.procedure === 'ANALYZE_ACTIVITY');

  // Bug 4: VERIFY_ACCESS condition must not be restricted strictly to PUBLIC
  const verifyAccessProc = enabledProcs.find(p => p.procedure === 'VERIFY_ACCESS');
  const hasFlawedAccessFilter = verifyAccessProc && verifyAccessProc.conditionField === 'resourceTier' && verifyAccessProc.conditionVal === 'PUBLIC';

  // Calculate bugs fixed (out of 4 main design bugs)
  let bugsFixed = 0;
  if (!hasRedundantCheckLogin && checkLoginCount === 1) bugsFixed++;
  if (hasReport && !isReportPremature) bugsFixed++;
  if (hasActivityAnalyzer) bugsFixed++;
  if (verifyAccessProc && !hasFlawedAccessFilter) bugsFixed++;

  const verdictLogs: Level3EvaluationResult['verdictLogs'] = [];
  let correctVerdicts = 0;
  let threatsDetected = 0;
  let falseAlarms = 0;
  let safePassed = 0;

  // Simulate record by record
  dataset.forEach((record) => {
    let loginRisk = 0;
    let activityRisk = 0;
    let accessRisk = 0;
    let finalVerdict: 'CRITICAL_THREAT' | 'WARNING' | 'SAFE' = 'SAFE';

    // Step through each enabled procedure in player's sequence
    for (const instruction of enabledProcs) {
      let isExecuted = false;
      let logMsg = "";

      switch (instruction.procedure) {
        case 'CHECK_LOGIN': {
          isExecuted = true;
          if (record.loginModule.geoMismatched) loginRisk += 40;
          if (!record.loginModule.mfaVerified) loginRisk += 30;
          if (record.loginModule.attemptCount >= 3) loginRisk += 30;
          logMsg = `[CHECK_LOGIN] IP: ${record.loginModule.loginIp} | GeoMatch: ${!record.loginModule.geoMismatched} | MFA: ${record.loginModule.mfaVerified} | Attempts: ${record.loginModule.attemptCount} -> Risk: ${loginRisk}%`;
          break;
        }

        case 'ANALYZE_ACTIVITY': {
          // If condition is set on privilegeEscalated
          if (instruction.conditionField === 'privilegeEscalated' && instruction.conditionVal === true) {
            if (record.activityModule.privilegeEscalated) {
              isExecuted = true;
              activityRisk += 50;
            } else {
              isExecuted = false;
              logMsg = `[ANALYZE_ACTIVITY] Dilewati (privilegeEscalated == false).`;
            }
          } else {
            // Always run
            isExecuted = true;
          }

          if (isExecuted) {
            if (record.activityModule.privilegeEscalated) activityRisk += 50;
            if (record.activityModule.actionType === 'MASS_EXPORT' || record.activityModule.actionType === 'FILE_DELETION') {
              activityRisk += 40;
            }
            if (record.activityModule.bytesTransferred > 100000000) { // > 100MB
              activityRisk += 20;
            }
            logMsg = `[ANALYZE_ACTIVITY] Action: ${record.activityModule.actionType} | Escalated: ${record.activityModule.privilegeEscalated} | Transferred: ${Math.round(record.activityModule.bytesTransferred / 1024 / 1024)}MB -> Activity Risk: ${activityRisk}%`;
          }
          break;
        }

        case 'VERIFY_ACCESS': {
          // If flawed condition (only checks PUBLIC), RESTRICTED and ROOT pass without inspection!
          if (hasFlawedAccessFilter) {
            if (record.accessModule.resourceTier === 'PUBLIC') {
              isExecuted = true;
              logMsg = `[VERIFY_ACCESS (FLAWED)] Hanya memeriksa berkas PUBLIC. Sumber daya krusial diabaikan!`;
            } else {
              isExecuted = false;
              logMsg = `[VERIFY_ACCESS (BUG)] Mengabaikan tier ${record.accessModule.resourceTier} karena filter kondisi terlalu sempit (Hanya PUBLIC)!`;
            }
          } else {
            isExecuted = true;
            if (!record.accessModule.authorized) accessRisk += 60;
            if (record.accessModule.resourceTier === 'ROOT_SYSTEM') accessRisk += 30;
            if (record.accessModule.resourceTier === 'RESTRICTED') accessRisk += 20;
            if (record.accessModule.accessHour < 6 || record.accessModule.accessHour > 22) accessRisk += 15;
            logMsg = `[VERIFY_ACCESS] Tier: ${record.accessModule.resourceTier} | Auth: ${record.accessModule.authorized} | Hour: ${record.accessModule.accessHour}:00 -> Access Risk: ${accessRisk}%`;
          }
          break;
        }

        case 'GENERATE_REPORT': {
          isExecuted = true;
          // If premature report, risks not yet gathered are 0!
          const aggregateScore = loginRisk + activityRisk + accessRisk;

          if (isReportPremature) {
            logMsg = `[GENERATE_REPORT (PREMATURE)] Laporan dihasilkan terlalu dini! Data modul berikutnya belum diperhitungkan (Skor parsial: ${aggregateScore}).`;
          } else {
            logMsg = `[GENERATE_REPORT] Agregat Total Risiko: ${aggregateScore}% (Login: ${loginRisk}%, Activity: ${activityRisk}%, Access: ${accessRisk}%)`;
          }

          if (aggregateScore >= 70) {
            finalVerdict = 'CRITICAL_THREAT';
          } else if (aggregateScore >= 35) {
            finalVerdict = 'WARNING';
          } else {
            finalVerdict = 'SAFE';
          }
          break;
        }
      }

      steps.push({
        stepNumber: stepCounter++,
        procedure: instruction.procedure,
        inputRecordId: record.id,
        status: isExecuted ? 'EXECUTED' : 'SKIPPED',
        log: logMsg,
        contextState: {
          recordId: record.id,
          user: record.userId,
          loginRisk,
          activityRisk,
          accessRisk,
          currentVerdict: finalVerdict
        }
      });
    }

    const isMatch = finalVerdict === record.groundTruthVerdict;
    if (isMatch) correctVerdicts++;
    if (finalVerdict === 'CRITICAL_THREAT') threatsDetected++;
    else if (finalVerdict === 'WARNING' && record.groundTruthVerdict === 'SAFE') falseAlarms++;
    else if (finalVerdict === 'SAFE') safePassed++;

    verdictLogs.push({
      recordId: record.id,
      actualVerdict: finalVerdict,
      expectedVerdict: record.groundTruthVerdict,
      isMatch
    });
  });

  const accuracy = Math.round((correctVerdicts / dataset.length) * 100);

  // Efficiency rating (penalize redundant calls and unneeded instructions)
  let efficiency = 100;
  if (hasRedundantCheckLogin) efficiency -= 25;
  if (isReportPremature) efficiency -= 20;
  if (!hasActivityAnalyzer) efficiency -= 25;
  if (hasFlawedAccessFilter) efficiency -= 20;
  efficiency = Math.max(20, efficiency);

  return {
    steps,
    evaluation: {
      accuracy,
      bugsFixedCount: bugsFixed,
      totalBugs: 4,
      efficiencyRating: efficiency,
      threatsDetected,
      falseAlarms,
      safePassed,
      verdictLogs
    }
  };
}
