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
  Smartphone,
  Download,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'draw' | 'board' | 'manager';
  onNavigate: (view: 'draw' | 'board' | 'manager') => void;
  hasActiveSession: boolean;
  onOpenDiceModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenHelpModal: () => void;
  onOpenInstallModal: () => void;
  isInstalled: boolean;
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
  onOpenInstallModal,
  isInstalled,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/30 bg-slate-950/85 backdrop-blur-md pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand */}
        <div
          onClick={() => onNavigate('draw')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-black text-base sm:text-lg">𓂀</span>
          </div>
          <div>
            <div className="text-xs sm:text-base font-black tracking-tight text-white flex items-center gap-1">
              <span>海克斯大乱斗</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                YGO HEXTECH
              </span>
            </div>
            <div className="text-[9px] text-slate-400 hidden sm:block">
              全局 / 先手 / 后手 三库对决助手
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          {/* Draw View */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('draw');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              currentView === 'manager'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">海克斯</span>卡库
          </button>
        </nav>

        {/* Action Tools & Mobile Install Button */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Install as Android / Mobile App button */}
          {!isInstalled && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenInstallModal();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-extrabold border border-emerald-500/40 flex items-center gap-1 transition-all shadow-sm shadow-emerald-500/10 active:scale-95"
              title="安装为安卓/手机原生独立软件"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">安装安卓App</span>
              <span className="sm:hidden">安装App</span>
            </button>
          )}

          {/* Quick Dice/Coin */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDiceModal();
            }}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors"
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
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
            title="历史对局记录"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Help & Vercel deployment info */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHelpModal();
            }}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="玩法与规则说明"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
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
