import React, { useState, useEffect } from 'react';
import { HextechCard, PoolType, DuelSession } from '../types';
import { HextechCardView } from './HextechCardView';
import { sounds } from '../utils/sound';
import { DiceAndCoinModal } from './DiceAndCoinModal';
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Globe,
  Swords,
  ShieldAlert,
  Dices,
  Play,
  Shuffle,
} from 'lucide-react';

interface DuelDrawFlowProps {
  allCards: HextechCard[];
  onCompleteDuelSetup: (session: DuelSession) => void;
  onOpenPoolManager: () => void;
}

type FlowPhase = 'setup' | 'global' | 'first' | 'second';

export const DuelDrawFlow: React.FC<DuelDrawFlowProps> = ({
  allCards,
  onCompleteDuelSetup,
  onOpenPoolManager,
}) => {
  const [phase, setPhase] = useState<FlowPhase>('setup');
  const [p1Name, setP1Name] = useState('先手玩家');
  const [p2Name, setP2Name] = useState('后手玩家');
  const [drawMode, setDrawMode] = useState<'choose3' | 'instant'>('choose3');

  // Selected cards
  const [globalCard, setGlobalCard] = useState<HextechCard | null>(null);
  const [firstCard, setFirstCard] = useState<HextechCard | null>(null);
  const [secondCard, setSecondCard] = useState<HextechCard | null>(null);

  // Candidate cards for 3-choose-1 or instant
  const [candidates, setCandidates] = useState<HextechCard[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<HextechCard | null>(null);

  // Reroll counters
  const [globalRerollsLeft, setGlobalRerollsLeft] = useState(1);
  const [p1RerollsLeft, setP1RerollsLeft] = useState(1);
  const [p2RerollsLeft, setP2RerollsLeft] = useState(1);

  // Tool modal
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Helpers to draw random cards from pool
  const drawCardsFromPool = (pool: PoolType, count: number): HextechCard[] => {
    const poolCards = allCards.filter((c) => c.pool === pool && c.enabled);
    if (poolCards.length === 0) return [];
    
    // Shuffle copy
    const shuffled = [...poolCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, poolCards.length));
  };

  const startDrawRitual = () => {
    sounds.playDraw();
    setPhase('global');
    rollGlobal();
  };

  const rollGlobal = () => {
    setIsRevealing(true);
    sounds.playDraw();
    const count = drawMode === 'choose3' ? 3 : 1;
    const drawn = drawCardsFromPool('global', count);
    setCandidates(drawn);
    setSelectedCandidate(drawn[0] || null);

    setTimeout(() => {
      setIsRevealing(false);
      sounds.playReveal(drawn[0]?.rarity || 'gold');
    }, 400);
  };

  const rerollGlobal = () => {
    if (globalRerollsLeft <= 0) return;
    setGlobalRerollsLeft((prev) => prev - 1);
    rollGlobal();
  };

  const confirmGlobal = () => {
    if (!selectedCandidate) return;
    setGlobalCard(selectedCandidate);
    sounds.playClick();

    // Move to First player
    setPhase('first');
    rollFirst();
  };

  const rollFirst = () => {
    setIsRevealing(true);
    sounds.playDraw();
    const count = drawMode === 'choose3' ? 3 : 1;
    const drawn = drawCardsFromPool('first', count);
    setCandidates(drawn);
    setSelectedCandidate(drawn[0] || null);

    setTimeout(() => {
      setIsRevealing(false);
      sounds.playReveal(drawn[0]?.rarity || 'gold');
    }, 400);
  };

  const rerollFirst = () => {
    if (p1RerollsLeft <= 0) return;
    setP1RerollsLeft((prev) => prev - 1);
    rollFirst();
  };

  const confirmFirst = () => {
    if (!selectedCandidate) return;
    setFirstCard(selectedCandidate);
    sounds.playClick();

    // Move to Second player
    setPhase('second');
    rollSecond();
  };

  const rollSecond = () => {
    setIsRevealing(true);
    sounds.playDraw();
    const count = drawMode === 'choose3' ? 3 : 1;
    const drawn = drawCardsFromPool('second', count);
    setCandidates(drawn);
    setSelectedCandidate(drawn[0] || null);

    setTimeout(() => {
      setIsRevealing(false);
      sounds.playReveal(drawn[0]?.rarity || 'gold');
    }, 400);
  };

  const rerollSecond = () => {
    if (p2RerollsLeft <= 0) return;
    setP2RerollsLeft((prev) => prev - 1);
    rollSecond();
  };

  const confirmSecondAndStart = () => {
    if (!selectedCandidate || !globalCard || !firstCard) return;
    const chosenSecond = selectedCandidate;
    setSecondCard(chosenSecond);

    sounds.playDuelStart();

    // Initial LP check (if '巨人战争', default to 16000, otherwise 8000)
    const isGiantWar = globalCard.name.includes('巨人战争') || globalCard.id === 'global-1';
    const initialLp = isGiantWar ? 16000 : 8000;

    const session: DuelSession = {
      id: 'duel_' + Date.now(),
      timestamp: Date.now(),
      player1Name: p1Name.trim() || '先手玩家',
      player2Name: p2Name.trim() || '后手玩家',
      globalCard,
      player1Card: firstCard,
      player2Card: chosenSecond,
      initialLp,
    };

    onCompleteDuelSetup(session);
  };

  const swapPlayers = () => {
    sounds.playClick();
    const temp = p1Name;
    setP1Name(p2Name);
    setP2Name(temp);
  };

  // Check card counts
  const globalCount = allCards.filter((c) => c.pool === 'global' && c.enabled).length;
  const firstCount = allCards.filter((c) => c.pool === 'first' && c.enabled).length;
  const secondCount = allCards.filter((c) => c.pool === 'second' && c.enabled).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* PHASE 0: SETUP SCREEN */}
      {phase === 'setup' && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-amber-950/20 text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              游戏王 YU-GI-OH! 海克斯大乱斗
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
              开始全新决斗抽卡仪式
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              每次牌局开始前，依次抽取：<strong className="text-amber-400">1张全局海克斯</strong>（双方共有），随后为
              <strong className="text-cyan-400">先手玩家</strong> 与{' '}
              <strong className="text-rose-400">后手玩家</strong> 分别抽取独立专属海克斯。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {/* Player 1 Box */}
            <div className="p-5 rounded-xl border border-cyan-500/40 bg-cyan-950/20">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
                  <Swords className="w-4 h-4" /> 先手决斗者
                </span>
                <span className="text-[10px] text-cyan-300/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  TURN 1
                </span>
              </div>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="输入先手玩家名称"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-semibold"
              />
            </div>

            {/* Player 2 Box */}
            <div className="p-5 rounded-xl border border-rose-500/40 bg-rose-950/20">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                  <ShieldAlert className="w-4 h-4" /> 后手决斗者
                </span>
                <span className="text-[10px] text-rose-300/80 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/60">
                  TURN 2
                </span>
              </div>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="输入后手玩家名称"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-rose-500/30 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Quick tools: Swap, Dice/Coin */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={swapPlayers}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              交换先后手名字
            </button>
            <button
              onClick={() => setShowDiceModal(true)}
              className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all"
            >
              <Dices className="w-3.5 h-3.5" />
              硬币 / 骰子 决定先后手
            </button>
          </div>

          {/* Draw mode settings */}
          <div className="max-w-md mx-auto mb-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">抽取规则模式</div>
              <div className="text-xs text-slate-400">
                {drawMode === 'choose3'
                  ? '三选一模式：每阶段翻出3张，挑1张（带1次重抽）'
                  : '单抽直出模式：每次直接随机抽取1张'}
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setDrawMode('choose3')}
                className={`px-3 py-1.5 text-xs font-bold rounded ${
                  drawMode === 'choose3'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                三选一
              </button>
              <button
                onClick={() => setDrawMode('instant')}
                className={`px-3 py-1.5 text-xs font-bold rounded ${
                  drawMode === 'instant'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                单张直抽
              </button>
            </div>
          </div>

          {/* Card Pool Status Banner */}
          <div className="max-w-2xl mx-auto mb-8 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
            <div className="flex items-center gap-4">
              <span>
                全局库: <strong className="text-amber-400">{globalCount}</strong> 张可用
              </span>
              <span>
                先手库: <strong className="text-cyan-400">{firstCount}</strong> 张可用
              </span>
              <span>
                后手库: <strong className="text-rose-400">{secondCount}</strong> 张可用
              </span>
            </div>
            <button
              onClick={onOpenPoolManager}
              className="text-amber-400 hover:underline font-semibold"
            >
              管理/添加海克斯库 →
            </button>
          </div>

          {/* Start CTA */}
          <div className="text-center">
            <button
              disabled={globalCount === 0 || firstCount === 0 || secondCount === 0}
              onClick={startDrawRitual}
              className="px-8 py-3.5 rounded-xl font-black text-base bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              开启海克斯抽卡仪式
            </button>
            {(globalCount === 0 || firstCount === 0 || secondCount === 0) && (
              <p className="text-xs text-rose-400 mt-2">
                提示：某个海克斯库内没有启用的卡片，请前往管理库启用或添加卡片后再开始。
              </p>
            )}
          </div>
        </div>
      )}

      {/* PHASE 1: GLOBAL HEXTECH DRAW */}
      {phase === 'global' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase mb-2">
              <Globe className="w-4 h-4" />
              第 1 阶段：全局海克斯 (GLOBAL)
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              抽取影响双方的全局核心规则
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
              此效果为本场决斗的底层基准，双方均须严格遵守。请选择一张生效！
            </p>
          </div>

          {/* Cards Display */}
          <div
            className={`grid gap-5 justify-center ${
              candidates.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            }`}
          >
            {candidates.map((card) => (
              <HextechCardView
                key={card.id}
                card={card}
                isSelected={selectedCandidate?.id === card.id}
                onSelect={() => {
                  sounds.playClick();
                  setSelectedCandidate(card);
                }}
                showSelectButton={true}
                size="md"
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              disabled={globalRerollsLeft <= 0}
              onClick={rerollGlobal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              <RefreshCw className="w-4 h-4" />
              重抽洗牌 ({globalRerollsLeft > 0 ? `剩余 ${globalRerollsLeft} 次` : '已耗尽'})
            </button>

            <button
              disabled={!selectedCandidate}
              onClick={confirmGlobal}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              锁定全局：【{selectedCandidate?.name || '请先选一张'}】 并进入先手抽取
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: FIRST PLAYER HEXTECH DRAW */}
      {phase === 'first' && (
        <div className="space-y-6 animate-fade-in">
          {/* Confirmed Global Summary Pill */}
          {globalCard && (
            <div className="max-w-2xl mx-auto p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs text-amber-200">
              <span className="font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                已锁定全局海克斯：
                <strong className="text-white underline decoration-amber-400">
                  {globalCard.name}
                </strong>
              </span>
              <span className="text-[11px] text-amber-300/80 truncate max-w-xs hidden sm:inline">
                {globalCard.description}
              </span>
            </div>
          )}

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase mb-2">
              <Swords className="w-4 h-4" />
              第 2 阶段：【{p1Name}】先手专属海克斯
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              先手决斗者专享特权强化
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
              专为先手展开、起手资源调配或护航设计的海克斯，只对先手玩家生效！
            </p>
          </div>

          {/* Candidates Display */}
          <div
            className={`grid gap-5 justify-center ${
              candidates.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            }`}
          >
            {candidates.map((card) => (
              <HextechCardView
                key={card.id}
                card={card}
                isSelected={selectedCandidate?.id === card.id}
                onSelect={() => {
                  sounds.playClick();
                  setSelectedCandidate(card);
                }}
                showSelectButton={true}
                size="md"
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              disabled={p1RerollsLeft <= 0}
              onClick={rerollFirst}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-cyan-800 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              <RefreshCw className="w-4 h-4" />
              先手重抽 ({p1RerollsLeft > 0 ? `剩余 ${p1RerollsLeft} 次` : '已耗尽'})
            </button>

            <button
              disabled={!selectedCandidate}
              onClick={confirmFirst}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              确认先手：【{selectedCandidate?.name || '请选择'}】 并进入后手抽取
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: SECOND PLAYER HEXTECH DRAW */}
      {phase === 'second' && (
        <div className="space-y-6 animate-fade-in">
          {/* Confirmed Previous Cards Pill */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {globalCard && (
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  全局：<strong>{globalCard.name}</strong>
                </span>
              </div>
            )}
            {firstCard && (
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  先手({p1Name})：<strong>{firstCard.name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase mb-2">
              <ShieldAlert className="w-4 h-4" />
              第 3 阶段：【{p2Name}】后手专属海克斯
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              后手决斗者反击神技抽选
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
              专为后攻破阵、诱捕打断或绝境翻盘打造的海克斯，只对后手玩家生效！
            </p>
          </div>

          {/* Candidates Display */}
          <div
            className={`grid gap-5 justify-center ${
              candidates.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            }`}
          >
            {candidates.map((card) => (
              <HextechCardView
                key={card.id}
                card={card}
                isSelected={selectedCandidate?.id === card.id}
                onSelect={() => {
                  sounds.playClick();
                  setSelectedCandidate(card);
                }}
                showSelectButton={true}
                size="md"
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              disabled={p2RerollsLeft <= 0}
              onClick={rerollSecond}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-rose-800 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              <RefreshCw className="w-4 h-4" />
              后手重抽 ({p2RerollsLeft > 0 ? `剩余 ${p2RerollsLeft} 次` : '已耗尽'})
            </button>

            <button
              disabled={!selectedCandidate}
              onClick={confirmSecondAndStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 hover:from-rose-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/40 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              锁定后手并进入决斗！ (DUEL START!)
            </button>
          </div>
        </div>
      )}

      {/* Dice & Coin Tool Modal */}
      <DiceAndCoinModal
        isOpen={showDiceModal}
        onClose={() => setShowDiceModal(false)}
        p1Name={p1Name}
        p2Name={p2Name}
      />
    </div>
  );
};
