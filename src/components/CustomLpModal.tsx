import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import { X, Check, ArrowDown, ArrowUp, Sparkles, HeartPulse, RefreshCw } from 'lucide-react';

interface CustomLpModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  currentLp: number;
  initialLp: number;
  onApplyLp: (newLp: number) => void;
  playerTheme: 'cyan' | 'rose';
}

export const CustomLpModal: React.FC<CustomLpModalProps> = ({
  isOpen,
  onClose,
  playerName,
  currentLp,
  initialLp,
  onApplyLp,
  playerTheme,
}) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleKeyClick = (val: string) => {
    sounds.playClick();
    if (val === 'C') {
      setInputValue('');
    } else if (val === 'DEL') {
      setInputValue((prev) => prev.slice(0, -1));
    } else {
      setInputValue((prev) => {
        const next = prev + val;
        // Limit to 6 digits (max 999,999)
        return next.length > 6 ? prev : next;
      });
    }
  };

  // Set LP directly to entered value
  const handleSetExact = (val?: number) => {
    const target = val !== undefined ? val : parseInt(inputValue, 10);
    if (isNaN(target)) return;
    const finalLp = Math.max(0, target);
    sounds.playReveal(finalLp === 1 ? 'prismatic' : 'gold');
    onApplyLp(finalLp);
    onClose();
  };

  // Add entered value to current LP
  const handleAdd = () => {
    const delta = parseInt(inputValue, 10);
    if (isNaN(delta) || delta <= 0) return;
    sounds.playLp(true);
    onApplyLp(currentLp + delta);
    onClose();
  };

  // Subtract entered value from current LP
  const handleSubtract = () => {
    const delta = parseInt(inputValue, 10);
    if (isNaN(delta) || delta <= 0) return;
    sounds.playLp(false);
    onApplyLp(Math.max(0, currentLp - delta));
    onClose();
  };

  const isCyan = playerTheme === 'cyan';
  const themeBorder = isCyan ? 'border-cyan-500/50' : 'border-rose-500/50';
  const themeHeader = isCyan ? 'text-cyan-400' : 'text-rose-400';
  const themeBadge = isCyan ? 'bg-cyan-950 text-cyan-300' : 'bg-rose-950 text-rose-300';

  const numVal = parseInt(inputValue, 10);
  const isValidNum = !isNaN(numVal) && numVal >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-sm rounded-2xl border ${themeBorder} bg-slate-900 p-5 shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartPulse className={`w-5 h-5 ${themeHeader}`} />
            <div>
              <h3 className="text-base font-black text-white">精确生命值自由修改</h3>
              <p className="text-[11px] text-slate-400">
                针对 <strong className={themeHeader}>{playerName}</strong> · 当前：
                <strong className="text-white font-mono">{currentLp} LP</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Screen */}
        <div className="my-3">
          <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3">
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-1 flex items-center justify-between">
              <span>输入任意数值 (支持个位数/任意数字)</span>
              {isValidNum && (
                <span className="text-amber-400 font-bold">
                  {currentLp} → 设为 {numVal} (变动: {numVal - currentLp > 0 ? '+' : ''}
                  {numVal - currentLp})
                </span>
              )}
            </div>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="如：1, 375, 50, 12000"
              className="w-full bg-transparent text-2xl font-black font-mono text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Shortcut Chips (especially 1 LP for YGO comeback) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => handleSetExact(1)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            设为 1 LP (绝境锁血)
          </button>
          <button
            type="button"
            onClick={() => handleSetExact(initialLp)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            重置 {initialLp}
          </button>
          <button
            type="button"
            onClick={() => handleSetExact(0)}
            className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition-all"
          >
            0 LP (归零)
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', 'DEL'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyClick(key)}
              className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-mono font-bold text-sm border border-slate-700/60 transition-colors"
            >
              {key === 'DEL' ? '⌫' : key}
            </button>
          ))}
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
          <button
            disabled={!isValidNum}
            onClick={handleAdd}
            className="py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-black text-xs flex flex-col items-center justify-center gap-0.5 disabled:opacity-40 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>+{inputValue || 0} (恢复)</span>
          </button>

          <button
            disabled={!isValidNum}
            onClick={handleSubtract}
            className="py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-black text-xs flex flex-col items-center justify-center gap-0.5 disabled:opacity-40 transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>-{inputValue || 0} (扣除)</span>
          </button>

          <button
            disabled={!isValidNum}
            onClick={() => handleSetExact()}
            className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-md shadow-amber-500/20 disabled:opacity-40 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>直接设为 {inputValue || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
