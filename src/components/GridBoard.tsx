import React from 'react';
import { DIRECTION_NAMES } from '../types/game';
import type {
  DoorObject,
  GeneratorObject,
  KeyObject,
  LevelData,
  RobotState,
  SwitchObject,
} from '../types/game';
import { Cpu, Key, Power, Zap, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface GridBoardProps {
  level: LevelData;
  robot: RobotState;
  doors: DoorObject[];
  keys: KeyObject[];
  switches: SwitchObject[];
  generators: GeneratorObject[];
  errorReason: string | null;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'SUCCESS' | 'FAILED';
  visitedPath?: { x: number; y: number; step: number }[];
}

export const GridBoard: React.FC<GridBoardProps> = ({
  level,
  robot,
  doors,
  keys,
  switches,
  generators,
  errorReason,
  status,
  visitedPath,
}) => {
  const { width, height } = level.gridSize;

  // Rotation angles for robot directions: 0: 0deg (North), 1: 90deg (East), 2: 180deg (South), 3: 270deg (West)
  const robotRotation = robot.dir * 90;

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD Bar above Grid */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 mb-2 rounded-xl glass-panel text-xs text-slate-300 font-mono border border-slate-800/80 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan"></span>
            UNIT-07
          </span>
          <span className="text-slate-400">
            [{robot.x}, {robot.y}]
          </span>
          <span className="hidden sm:inline text-slate-400">
            • HADAP: <span className="text-purple-300 font-semibold">{DIRECTION_NAMES[robot.dir]}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {robot.inventory.keys.length > 0 && (
            <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
              <Key size={13} /> Kunci: {robot.inventory.keys.length}
            </span>
          )}
          {status === 'SUCCESS' && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
              <CheckCircle2 size={13} /> TUJUAN TERCAPAI
            </span>
          )}
          {status === 'FAILED' && (
            <span className="text-red-400 flex items-center gap-1 font-semibold text-[11px]">
              <ShieldAlert size={13} /> TERHALANG
            </span>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative p-3 rounded-2xl glass-panel-glow border border-border-glow overflow-hidden bg-slate-950/80 shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none"></div>

        <div
          className="grid gap-1.5 relative select-none"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(44px, 58px))`,
            gridTemplateRows: `repeat(${height}, minmax(44px, 58px))`,
          }}
        >
          {Array.from({ length: height }).map((_, y) =>
            Array.from({ length: width }).map((_, x) => {
              const isWall = level.walls.some((w) => w.x === x && w.y === y);
              const isTerminal =
                level.targetTerminal.x === x && level.targetTerminal.y === y;
              const door = doors.find((d) => d.x === x && d.y === y);
              const key = keys.find((k) => k.x === x && k.y === y && !k.isCollected);
              const sw = switches.find((s) => s.x === x && s.y === y);
              const gen = generators.find((g) => g.x === x && g.y === y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex items-center justify-center rounded-lg transition-colors duration-200 aspect-square text-xs font-mono ${
                    isWall
                      ? 'bg-slate-900 border border-slate-700/80 shadow-inner'
                      : 'bg-slate-900/40 border border-slate-800/60 hover:border-cyan/30'
                  }`}
                  title={`(${x}, ${y})`}
                >
                  {/* Subtle Coordinate Marker on empty cells */}
                  {!isWall && !isTerminal && (
                    <span className="absolute bottom-1 right-1 text-[9px] text-slate-700 pointer-events-none">
                      {x},{y}
                    </span>
                  )}

                  {/* Neon Ghost Trail / Breadcrumbs */}
                  {!isWall && visitedPath && (
                    (() => {
                      const trailIndex = visitedPath.findIndex(
                        (p) => p.x === x && p.y === y
                      );
                      if (trailIndex >= 0) {
                        return (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan/60 shadow-sm shadow-cyan"></div>
                            <span className="absolute top-1 left-1 text-[8px] font-mono text-cyan/70 font-semibold leading-none">
                              {trailIndex + 1}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}

                  {/* Wall Texture */}
                  {isWall && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700/50">
                      <div className="w-2.5 h-2.5 rounded-sm bg-red-500/20 border border-red-500/30"></div>
                    </div>
                  )}

                  {/* Terminal Goal */}
                  {isTerminal && (
                    <div className="flex flex-col items-center justify-center anim-pulse-term z-10">
                      <div className="w-8 h-8 rounded-lg bg-cyan/20 border-2 border-cyan flex items-center justify-center text-cyan shadow-lg shadow-cyan/40">
                        <Flag size={18} className="animate-bounce" />
                      </div>
                      <span className="text-[8px] font-bold text-cyan mt-0.5 tracking-wider uppercase">
                        TERMINAL
                      </span>
                    </div>
                  )}

                  {/* Generator */}
                  {gen && (
                    <div className="flex flex-col items-center justify-center z-10">
                      <div
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                          gen.isActive
                            ? 'bg-purple/30 border-purple text-purple shadow-lg shadow-purple/50 anim-pulse-gen'
                            : 'bg-slate-800/60 border-slate-600 text-slate-400'
                        }`}
                      >
                        <Zap size={18} />
                      </div>
                      <span
                        className={`text-[8px] font-bold mt-0.5 tracking-wider uppercase ${
                          gen.isActive ? 'text-purple' : 'text-slate-500'
                        }`}
                      >
                        {gen.isActive ? 'GEN: ON' : 'GEN: OFF'}
                      </span>
                    </div>
                  )}

                  {/* Automatic Door */}
                  {door && (
                    <div className="flex flex-col items-center justify-center z-10 w-full h-full p-1">
                      <div
                        className={`w-full h-full rounded border-2 flex flex-col items-center justify-center transition-all ${
                          door.isOpen
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400 border-dashed'
                            : 'bg-red-950/50 border-red-500 text-red-400 shadow-md shadow-red-500/30'
                        }`}
                      >
                        <span className="text-[10px] font-bold">
                          {door.isOpen ? '🔓 BUKA' : '🔒 PINTU'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Access Key */}
                  {key && (
                    <div className="flex flex-col items-center justify-center z-10 animate-bounce">
                      <div className="w-7 h-7 rounded-full bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-400/40">
                        <Key size={15} />
                      </div>
                    </div>
                  )}

                  {/* Switch */}
                  {sw && (
                    <div className="flex flex-col items-center justify-center z-10">
                      <div
                        className={`w-7 h-7 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          sw.isOn
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/40'
                            : 'bg-amber-500/20 border-amber-500 text-amber-400'
                        }`}
                      >
                        <Power size={15} />
                      </div>
                      <span
                        className={`text-[8px] font-bold mt-0.5 ${
                          sw.isOn ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {sw.isOn ? 'SAKELAR ON' : 'SAKELAR'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* UNIT-07 Robot Avatar (Dynamic Absolute Smooth Movement) */}
          <div
            className="absolute z-20 pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
            style={{
              width: `calc(100% / ${width})`,
              height: `calc(100% / ${height})`,
              left: `calc(100% / ${width} * ${robot.x})`,
              top: `calc(100% / ${height} * ${robot.y})`,
            }}
          >
            <div
              className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                status === 'FAILED'
                  ? 'bg-red-500/30 border-2 border-red-500 shadow-lg shadow-red-500/60'
                  : 'bg-cyan/25 border-2 border-cyan shadow-lg shadow-cyan/50'
              }`}
              style={{
                transform: `rotate(${robotRotation}deg)`,
              }}
            >
              {/* Directional Sensor Radar Cone Beam */}
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-14 h-14 pointer-events-none z-10 opacity-50"
                style={{
                  background:
                    status === 'FAILED'
                      ? 'linear-gradient(to top, rgba(239, 68, 68, 0.45), transparent)'
                      : 'linear-gradient(to top, rgba(0, 229, 255, 0.45), transparent)',
                  clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
                }}
              ></div>

              {/* Visor Sensor / Front indicator */}
              <div
                className={`absolute -top-1.5 w-3 h-3 rotate-45 border-t-2 border-l-2 ${
                  status === 'FAILED'
                    ? 'border-red-400 bg-red-600'
                    : 'border-cyan bg-cyan shadow-sm shadow-cyan'
                }`}
              ></div>

              {/* Robot Core Icon */}
              <Cpu
                size={22}
                className={status === 'FAILED' ? 'text-red-400' : 'text-cyan'}
              />

              {/* Pulsing Aura */}
              <span
                className={`absolute inset-0 rounded-xl animate-ping opacity-30 ${
                  status === 'FAILED' ? 'bg-red-500' : 'bg-cyan'
                }`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorReason && (
        <div className="mt-3 w-full p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} className="text-red-400 shrink-0" />
          <span className="font-mono text-[11px] leading-relaxed">{errorReason}</span>
        </div>
      )}
    </div>
  );
};
