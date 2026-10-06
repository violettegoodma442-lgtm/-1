import React from 'react';
import { sounds } from '../utils/sound';
import {
  Sparkles,
  Dices,
  Layers,
  History,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Swords,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'draw' | 'board' | 'manager';
  onNavigate: (view: 'draw' | 'board' | 'manager') => void;
  hasActiveSession: boolean;
  onOpenDiceModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenHelpModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  hasActiveSession,
  onOpenDiceModal,
  onOpenHistoryModal,
  onOpenHelpModal,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/30 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          onClick={() => onNavigate('draw')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-black text-lg">𓂀</span>
          </div>
          <div>
            <div className="text-sm md:text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>游戏王海克斯大乱斗</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                YGO HEXTECH
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              全局 / 先手 / 后手 三库对决抽取助手
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Draw View */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('draw');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'draw'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">抽卡仪式</span>
          </button>

          {/* Duel Board View (if active session) */}
          {hasActiveSession && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('board');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'board'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>对战看板</span>
            </button>
          )}

          {/* Pool Manager View */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('manager');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'manager'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>海克斯卡库</span>
          </button>
        </nav>

        {/* Action Tools */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Dice/Coin */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDiceModal();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors"
            title="先后手硬币/骰子小工具"
          >
            <Dices className="w-4 h-4" />
          </button>

          {/* History */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHistoryModal();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
            title="历史对局记录"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHelpModal();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="玩法与规则说明"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isMuted
                ? 'text-slate-600 hover:text-slate-400'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80'
            }`}
            title={isMuted ? '点击开启音效' : '点击静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
