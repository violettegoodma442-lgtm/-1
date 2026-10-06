import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import { X, Dices, Coins, Trophy } from 'lucide-react';

interface DiceAndCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultWinner?: (winner: 'p1' | 'p2', note: string) => void;
  p1Name: string;
  p2Name: string;
}

export const DiceAndCoinModal: React.FC<DiceAndCoinModalProps> = ({
  isOpen,
  onClose,
  onResultWinner,
  p1Name,
  p2Name,
}) => {
  const [activeTab, setActiveTab] = useState<'dice' | 'coin'>('coin');
  const [isRolling, setIsRolling] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [diceResults, setDiceResults] = useState<{ d1: number; d2: number } | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFlipCoin = () => {
    if (isRolling) return;
    setIsRolling(true);
    setAnnouncement(null);
    sounds.playDice();

    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      const res = isHeads ? 'heads' : 'tails';
      setCoinResult(res);
      setIsRolling(false);
      sounds.playReveal('gold');

      const winner = isHeads ? p1Name : p2Name;
      const resultText = `${isHeads ? '正面 (金眼)' : '反面 (字纹)'}！建议由 【${winner}】 选择先后手！`;
      setAnnouncement(resultText);
    }, 900);
  };

  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setAnnouncement(null);
    sounds.playDice();

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDiceResults({ d1, d2 });
      setIsRolling(false);
      sounds.playReveal(d1 === d2 ? 'prismatic' : 'gold');

      if (d1 > d2) {
        setAnnouncement(`【${p1Name}】(${d1}点) 胜过 【${p2Name}】(${d2}点)！【${p1Name}】获得先后手优先选择权！`);
      } else if (d2 > d1) {
        setAnnouncement(`【${p2Name}】(${d2}点) 胜过 【${p1Name}】(${d1}点)！【${p2Name}】获得先后手优先选择权！`);
      } else {
        setAnnouncement(`双方均为 ${d1} 点平局！请再次投掷决出胜负！`);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-amber-300 flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          先后手决定仪式
        </h3>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-800 p-1 mb-6">
          <button
            onClick={() => {
              setActiveTab('coin');
              setAnnouncement(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'coin'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            抛掷千年月影金币
          </button>
          <button
            onClick={() => {
              setActiveTab('dice');
              setAnnouncement(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'dice'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" />
            命运骰子点数对决
          </button>
        </div>

        {activeTab === 'coin' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 transition-all duration-700 ${
                isRolling ? 'animate-spin scale-110' : ''
              }`}
            >
              {coinResult === null ? (
                <Coins className="w-12 h-12 text-amber-950" />
              ) : coinResult === 'heads' ? (
                <>
                  <span className="text-2xl">𓂀</span>
                  <span className="text-xs uppercase font-extrabold mt-1">正面·金眼</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">⚖</span>
                  <span className="text-xs uppercase font-extrabold mt-1">反面·字纹</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              正面对应 <strong className="text-cyan-300">{p1Name}</strong> | 反面对应{' '}
              <strong className="text-rose-300">{p2Name}</strong>
            </p>

            <button
              disabled={isRolling}
              onClick={handleFlipCoin}
              className="mt-5 w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRolling ? '硬币在空中飞旋...' : '抛掷硬币'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center justify-center gap-8 my-2">
              <div className="text-center">
                <span className="text-xs font-bold text-cyan-400 block mb-2">{p1Name}</span>
                <div
                  className={`w-16 h-16 rounded-xl border-2 border-cyan-400 bg-slate-800 flex items-center justify-center text-2xl font-black text-cyan-300 shadow-lg ${
                    isRolling ? 'animate-bounce' : ''
                  }`}
                >
                  {diceResults?.d1 ?? '?'}
                </div>
              </div>

              <div className="text-xl font-black text-slate-500">VS</div>

              <div className="text-center">
                <span className="text-xs font-bold text-rose-400 block mb-2">{p2Name}</span>
                <div
                  className={`w-16 h-16 rounded-xl border-2 border-rose-400 bg-slate-800 flex items-center justify-center text-2xl font-black text-rose-300 shadow-lg ${
                    isRolling ? 'animate-bounce' : ''
                  }`}
                >
                  {diceResults?.d2 ?? '?'}
                </div>
              </div>
            </div>

            <button
              disabled={isRolling}
              onClick={handleRollDice}
              className="mt-6 w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRolling ? '骰子疾速翻滚中...' : '双方掷骰子'}
            </button>
          </div>
        )}

        {announcement && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs md:text-sm font-semibold text-center leading-relaxed">
            {announcement}
          </div>
        )}
      </div>
    </div>
  );
};
