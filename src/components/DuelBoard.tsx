import React, { useState } from 'react';
import { DuelSession, HextechCard } from '../types';
import { HextechCardView } from './HextechCardView';
import { sounds } from '../utils/sound';
import { DiceAndCoinModal } from './DiceAndCoinModal';
import { CustomLpModal } from './CustomLpModal';
import {
  Globe,
  Swords,
  ShieldAlert,
  RotateCcw,
  Copy,
  Check,
  Dices,
  Sparkles,
  Smartphone,
  Edit2,
  Sliders,
  Flame,
  HeartPulse,
} from 'lucide-react';

interface DuelBoardProps {
  session: DuelSession;
  onNewDuel: () => void;
  onSaveHistory: (session: DuelSession) => void;
}

export const DuelBoard: React.FC<DuelBoardProps> = ({
  session,
  onNewDuel,
  onSaveHistory,
}) => {
  const [lp1, setLp1] = useState(session.initialLp);
  const [lp2, setLp2] = useState(session.initialLp);
  const [turnCount, setTurnCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [tabletopMode, setTabletopMode] = useState(false);
  const [showDiceModal, setShowDiceModal] = useState(false);

  // Custom LP modal states
  const [activeCustomLpPlayer, setActiveCustomLpPlayer] = useState<'p1' | 'p2' | null>(null);

  // Inline edit state
  const [inlineEditP1, setInlineEditP1] = useState(false);
  const [inlineValP1, setInlineValP1] = useState(session.initialLp.toString());
  const [inlineEditP2, setInlineEditP2] = useState(false);
  const [inlineValP2, setInlineValP2] = useState(session.initialLp.toString());

  // Tactical counters during the duel
  const [p1SpecialSummons, setP1SpecialSummons] = useState(0);
  const [p2SpecialSummons, setP2SpecialSummons] = useState(0);
  const [p2MonsterEffects, setP2MonsterEffects] = useState(0); // for 天下独步
  const [p2LianyingDraws, setP2LianyingDraws] = useState(0); // for 连营 (max 5)

  // Max LP for health bar calculation (handles LP exceeding initial)
  const maxLp1 = Math.max(session.initialLp, lp1);
  const maxLp2 = Math.max(session.initialLp, lp2);
  const lp1Percentage = Math.min(100, Math.max(0, (lp1 / maxLp1) * 100));
  const lp2Percentage = Math.min(100, Math.max(0, (lp2 / maxLp2) * 100));

  // LP modification helper
  const modifyLp = (player: 'p1' | 'p2', delta: number) => {
    sounds.playLp(delta > 0);
    if (player === 'p1') {
      setLp1((prev) => Math.max(0, prev + delta));
    } else {
      setLp2((prev) => Math.max(0, prev + delta));
    }
  };

  const halveLp = (player: 'p1' | 'p2') => {
    sounds.playLp(false);
    if (player === 'p1') {
      setLp1((prev) => Math.ceil(prev / 2));
    } else {
      setLp2((prev) => Math.ceil(prev / 2));
    }
  };

  const doubleLp = (player: 'p1' | 'p2') => {
    sounds.playLp(true);
    if (player === 'p1') {
      setLp1((prev) => prev * 2);
    } else {
      setLp2((prev) => prev * 2);
    }
  };

  // Set LP to 1 directly
  const setLpToOne = (player: 'p1' | 'p2') => {
    sounds.playReveal('prismatic');
    if (player === 'p1') {
      setLp1(1);
    } else {
      setLp2(1);
    }
  };

  // Handle direct inline edit confirm
  const handleConfirmInline = (player: 'p1' | 'p2') => {
    if (player === 'p1') {
      const val = parseInt(inlineValP1, 10);
      if (!isNaN(val)) {
        sounds.playLp(val > lp1);
        setLp1(Math.max(0, val));
      }
      setInlineEditP1(false);
    } else {
      const val = parseInt(inlineValP2, 10);
      if (!isNaN(val)) {
        sounds.playLp(val > lp2);
        setLp2(Math.max(0, val));
      }
      setInlineEditP2(false);
    }
  };

  // Copy hextech summary for sharing
  const copyDuelSummary = () => {
    sounds.playClick();
    const text = [
      `🔥【游戏王海克斯大乱斗 对决设定】🔥`,
      `━━━━━━━━━━━━━━━━━`,
      `🌐 全局海克斯：【${session.globalCard?.name || '无'}】`,
      `   效果：${session.globalCard?.description || ''}`,
      `━━━━━━━━━━━━━━━━━`,
      `⚔️ 先手【${session.player1Name}】专属海克斯：【${session.player1Card?.name || '无'}】`,
      `   效果：${session.player1Card?.description || ''}`,
      `━━━━━━━━━━━━━━━━━`,
      `🛡️ 后手【${session.player2Name}】专属海克斯：【${session.player2Card?.name || '无'}】`,
      `   效果：${session.player2Card?.description || ''}`,
      `━━━━━━━━━━━━━━━━━`,
      `当前生命值：【${session.player1Name}】${lp1} LP vs 【${session.player2Name}】${lp2} LP`,
      `决斗开始！`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Color helper for health bar
  const getHealthBarColor = (pct: number, lp: number, theme: 'cyan' | 'rose') => {
    if (lp === 1) {
      return 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 animate-pulse';
    }
    if (pct <= 25) {
      return 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse';
    }
    if (pct <= 50) {
      return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    }
    return theme === 'cyan'
      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400'
      : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-amber-500/30">
            T{turnCount}
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="text-cyan-400">{session.player1Name}</span>
              <span className="text-slate-500 text-xs">VS</span>
              <span className="text-rose-400">{session.player2Name}</span>
            </div>
            <div className="text-xs text-slate-400">
              当前第 {turnCount} 回合 · 初始 {session.initialLp} LP
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Next Turn */}
          <button
            onClick={() => {
              sounds.playClick();
              setTurnCount((prev) => prev + 1);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            进入下个回合 (+1)
          </button>

          {/* Dice & Coin */}
          <button
            onClick={() => setShowDiceModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Dices className="w-3.5 h-3.5 text-cyan-400" />
            掷骰/硬币
          </button>

          {/* Tabletop Mode Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setTabletopMode(!tabletopMode);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
              tabletopMode
                ? 'bg-amber-500 text-black border-amber-400 shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {tabletopMode ? '对坐模式已开启' : '对坐视角'}
          </button>

          {/* Copy Rule Summary */}
          <button
            onClick={copyDuelSummary}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                已复制海克斯设定
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                复制/分享规则
              </>
            )}
          </button>

          {/* New Duel */}
          <button
            onClick={() => {
              if (window.confirm('确定要开启新一轮抽卡仪式吗？当前对决状态将被保存至历史。')) {
                onSaveHistory({
                  ...session,
                  winner: lp1 <= 0 ? 'p2' : lp2 <= 0 ? 'p1' : undefined,
                });
                onNewDuel();
              }
            }}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black shadow transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            开始新对决
          </button>
        </div>
      </div>

      {/* LP COUNTERS & COMBAT ASSISTANT PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Player 1 (先手) LP Calculator */}
        <div
          className={`p-5 rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 shadow-xl transition-all ${
            tabletopMode ? 'transform md:rotate-180' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-400 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Swords className="w-4 h-4" /> 先手 · {session.player1Name}
            </span>
            <div className="flex items-center gap-1.5">
              {lp1 === 1 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/50 flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" />
                  1 LP 绝境锁血！
                </span>
              )}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  lp1 <= 0
                    ? 'bg-rose-900/80 text-rose-200'
                    : lp1 <= 2000
                    ? 'bg-amber-900/80 text-amber-200 animate-pulse'
                    : 'bg-cyan-950 text-cyan-300'
                }`}
              >
                {lp1 <= 0 ? 'DEFEATED' : lp1 <= 2000 ? 'LP告急' : 'DUELING'}
              </span>
            </div>
          </div>

          {/* Large LP display with inline edit support */}
          <div className="py-1 flex items-baseline justify-between">
            {inlineEditP1 ? (
              <div className="flex items-center gap-2 flex-1 my-1">
                <input
                  type="number"
                  autoFocus
                  value={inlineValP1}
                  onChange={(e) => setInlineValP1(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmInline('p1');
                    if (e.key === 'Escape') setInlineEditP1(false);
                  }}
                  className="w-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 text-3xl font-black font-mono px-3 py-1 rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => handleConfirmInline('p1')}
                  className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs"
                >
                  确定
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setInlineValP1(lp1.toString());
                  setInlineEditP1(true);
                }}
                className="cursor-pointer group flex items-baseline gap-2"
                title="点击直接输入任意精确数值"
              >
                <span
                  className={`text-4xl md:text-5xl font-black tracking-tight font-mono transition-colors ${
                    lp1 <= 0
                      ? 'text-rose-500 line-through'
                      : lp1 === 1
                      ? 'text-amber-300 underline decoration-amber-400'
                      : 'text-cyan-300 group-hover:text-cyan-200'
                  }`}
                >
                  {lp1.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-500">LP</span>
                <Edit2 className="w-3.5 h-3.5 text-cyan-500/50 group-hover:text-cyan-300 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <button
              onClick={() => setActiveCustomLpPlayer('p1')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              自定义血量
            </button>
          </div>

          {/* VISUAL HEALTH BAR (血量条) */}
          <div className="my-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>血量条 (Health Bar)</span>
              <span className="font-mono text-cyan-300">
                {lp1} / {maxLp1} ({lp1Percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getHealthBarColor(
                  lp1Percentage,
                  lp1,
                  'cyan'
                )}`}
                style={{ width: `${Math.max(lp1 > 0 ? 1.5 : 0, lp1Percentage)}%` }}
              />
            </div>
          </div>

          {/* Quick LP adjust buttons */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            <button
              onClick={() => modifyLp('p1', -1000)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -1000
            </button>
            <button
              onClick={() => modifyLp('p1', -500)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -500
            </button>
            <button
              onClick={() => modifyLp('p1', -100)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -100
            </button>
            <button
              onClick={() => halveLp('p1')}
              className="py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-700/60 transition-all"
            >
              ÷ 2 (神宣)
            </button>

            <button
              onClick={() => modifyLp('p1', 1000)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +1000
            </button>
            <button
              onClick={() => modifyLp('p1', 500)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +500
            </button>
            <button
              onClick={() => modifyLp('p1', 100)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +100
            </button>
            <button
              onClick={() => setLpToOne('p1')}
              className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-black border border-amber-500/40 transition-all"
              title="经典奇迹锁血 1 LP"
            >
              设为 1 LP
            </button>
          </div>

          {/* Quick tracker for P1 */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>特殊召唤计数：</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setP1SpecialSummons((p) => Math.max(0, p - 1))}
                className="w-6 h-6 rounded bg-slate-800 text-white font-bold"
              >
                -
              </button>
              <span className="font-mono font-bold text-white px-2">
                {p1SpecialSummons} 次
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setP1SpecialSummons((p) => p + 1);
                }}
                className="w-6 h-6 rounded bg-cyan-800 hover:bg-cyan-700 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Player 2 (后手) LP Calculator */}
        <div className="p-5 rounded-2xl border-2 border-rose-500/60 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-400 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> 后手 · {session.player2Name}
            </span>
            <div className="flex items-center gap-1.5">
              {lp2 === 1 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/50 flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" />
                  1 LP 绝境锁血！
                </span>
              )}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  lp2 <= 0
                    ? 'bg-rose-900/80 text-rose-200'
                    : lp2 <= 2000
                    ? 'bg-amber-900/80 text-amber-200 animate-pulse'
                    : 'bg-rose-950 text-rose-300'
                }`}
              >
                {lp2 <= 0 ? 'DEFEATED' : lp2 <= 2000 ? 'LP告急' : 'DUELING'}
              </span>
            </div>
          </div>

          {/* Large LP display with inline edit support */}
          <div className="py-1 flex items-baseline justify-between">
            {inlineEditP2 ? (
              <div className="flex items-center gap-2 flex-1 my-1">
                <input
                  type="number"
                  autoFocus
                  value={inlineValP2}
                  onChange={(e) => setInlineValP2(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmInline('p2');
                    if (e.key === 'Escape') setInlineEditP2(false);
                  }}
                  className="w-full bg-slate-950 border-2 border-rose-400 text-rose-300 text-3xl font-black font-mono px-3 py-1 rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => handleConfirmInline('p2')}
                  className="px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-black text-xs"
                >
                  确定
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setInlineValP2(lp2.toString());
                  setInlineEditP2(true);
                }}
                className="cursor-pointer group flex items-baseline gap-2"
                title="点击直接输入任意精确数值"
              >
                <span
                  className={`text-4xl md:text-5xl font-black tracking-tight font-mono transition-colors ${
                    lp2 <= 0
                      ? 'text-rose-500 line-through'
                      : lp2 === 1
                      ? 'text-amber-300 underline decoration-amber-400'
                      : 'text-rose-300 group-hover:text-rose-200'
                  }`}
                >
                  {lp2.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-500">LP</span>
                <Edit2 className="w-3.5 h-3.5 text-rose-500/50 group-hover:text-rose-300 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <button
              onClick={() => setActiveCustomLpPlayer('p2')}
              className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              自定义血量
            </button>
          </div>

          {/* VISUAL HEALTH BAR (血量条) */}
          <div className="my-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>血量条 (Health Bar)</span>
              <span className="font-mono text-rose-300">
                {lp2} / {maxLp2} ({lp2Percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getHealthBarColor(
                  lp2Percentage,
                  lp2,
                  'rose'
                )}`}
                style={{ width: `${Math.max(lp2 > 0 ? 1.5 : 0, lp2Percentage)}%` }}
              />
            </div>
          </div>

          {/* Quick LP adjust buttons */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            <button
              onClick={() => modifyLp('p2', -1000)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -1000
            </button>
            <button
              onClick={() => modifyLp('p2', -500)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -500
            </button>
            <button
              onClick={() => modifyLp('p2', -100)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              -100
            </button>
            <button
              onClick={() => halveLp('p2')}
              className="py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-700/60 transition-all"
            >
              ÷ 2 (神宣)
            </button>

            <button
              onClick={() => modifyLp('p2', 1000)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +1000
            </button>
            <button
              onClick={() => modifyLp('p2', 500)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +500
            </button>
            <button
              onClick={() => modifyLp('p2', 100)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all"
            >
              +100
            </button>
            <button
              onClick={() => setLpToOne('p2')}
              className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-black border border-amber-500/40 transition-all"
              title="经典奇迹锁血 1 LP"
            >
              设为 1 LP
            </button>
          </div>

          {/* Quick tracker for P2: Special Summons & Monster Effects */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <span>对手特召：</span>
              <button
                onClick={() => setP2SpecialSummons((p) => Math.max(0, p - 1))}
                className="w-5 h-5 rounded bg-slate-800 text-white font-bold"
              >
                -
              </button>
              <span className="font-mono font-bold text-white px-1">
                {p2SpecialSummons}/2
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  const next = p2SpecialSummons + 1;
                  setP2SpecialSummons(next);
                  if (next === 2) {
                    sounds.playReveal('prismatic');
                  }
                }}
                className={`w-5 h-5 rounded font-bold text-white ${
                  p2SpecialSummons >= 2 ? 'bg-amber-600' : 'bg-rose-800'
                }`}
              >
                +
              </button>
              {p2SpecialSummons >= 2 && (
                <span className="text-[10px] text-amber-300 font-bold ml-1 animate-pulse">
                  (王牌G触发!)
                </span>
              )}
            </div>

            {/* 天下独步 tracker */}
            {session.player2Card?.name.includes('天下独步') && (
              <div className="flex items-center gap-1">
                <span>对手怪效：</span>
                <span className="font-mono font-bold text-amber-400">{p2MonsterEffects}/3</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setP2MonsterEffects((p) => p + 1);
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200"
                >
                  +1
                </button>
              </div>
            )}

            {/* 连营 tracker */}
            {session.player2Card?.name.includes('连营') && (
              <div className="flex items-center gap-1">
                <span>连营摸牌：</span>
                <span className="font-mono font-bold text-emerald-400">{p2LianyingDraws}/5</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setP2LianyingDraws((p) => Math.min(5, p + 1));
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200"
                >
                  +1
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THE 3 ACTIVE HEXTECH CARDS IN PLAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            本局已激活海克斯矩阵
          </h2>
          <span className="text-xs text-slate-400">
            全场生效规则随时查阅 · 违规将由冥界裁判制裁！
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Global */}
          {session.globalCard && (
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                全场共有规则 (GLOBAL)
              </div>
              <HextechCardView card={session.globalCard} interactive={false} size="lg" />
            </div>
          )}

          {/* Card 2: First Player */}
          {session.player1Card && (
            <div className={`flex flex-col ${tabletopMode ? 'transform md:rotate-180' : ''}`}>
              <div className="mb-2 text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                <Swords className="w-4 h-4" />
                先手【{session.player1Name}】专属
              </div>
              <HextechCardView card={session.player1Card} interactive={false} size="lg" />
            </div>
          )}

          {/* Card 3: Second Player */}
          {session.player2Card && (
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                后手【{session.player2Name}】专属
              </div>
              <HextechCardView card={session.player2Card} interactive={false} size="lg" />
            </div>
          )}
        </div>
      </div>

      {/* Custom Exact LP Calculator Modal */}
      {activeCustomLpPlayer && (
        <CustomLpModal
          isOpen={true}
          onClose={() => setActiveCustomLpPlayer(null)}
          playerName={
            activeCustomLpPlayer === 'p1' ? session.player1Name : session.player2Name
          }
          currentLp={activeCustomLpPlayer === 'p1' ? lp1 : lp2}
          initialLp={session.initialLp}
          playerTheme={activeCustomLpPlayer === 'p1' ? 'cyan' : 'rose'}
          onApplyLp={(newLp) => {
            if (activeCustomLpPlayer === 'p1') {
              setLp1(newLp);
            } else {
              setLp2(newLp);
            }
          }}
        />
      )}

      {/* Quick Tool Modal */}
      <DiceAndCoinModal
        isOpen={showDiceModal}
        onClose={() => setShowDiceModal(false)}
        p1Name={session.player1Name}
        p2Name={session.player2Name}
      />
    </div>
  );
};
