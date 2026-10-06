/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HextechCard, DuelSession } from './types';
import {
  loadCards,
  saveCards,
  resetCardsToDefault,
  loadDuelHistory,
  saveDuelToHistory,
  clearDuelHistory,
} from './utils/storage';
import { sounds } from './utils/sound';
import { Navbar } from './components/Navbar';
import { DuelDrawFlow } from './components/DuelDrawFlow';
import { DuelBoard } from './components/DuelBoard';
import { PoolManager } from './components/PoolManager';
import { DiceAndCoinModal } from './components/DiceAndCoinModal';
import { DuelHistoryModal } from './components/DuelHistoryModal';
import { HelpRulesModal } from './components/HelpRulesModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Smartphone, Download, WifiOff, X } from 'lucide-react';

export default function App() {
  const [cards, setCards] = useState<HextechCard[]>([]);
  const [currentSession, setCurrentSession] = useState<DuelSession | null>(null);
  const [history, setHistory] = useState<DuelSession[]>([]);
  const [currentView, setCurrentView] = useState<'draw' | 'board' | 'manager'>('draw');
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // Global modals
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [hasDismissedInstallBanner, setHasDismissedInstallBanner] = useState(false);

  // PWA & Connectivity hooks
  const { isInstallable, isInstalled, isAndroid, isWeChat, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Initialize data on mount
  useEffect(() => {
    const loadedCards = loadCards();
    setCards(loadedCards);

    const loadedHistory = loadDuelHistory();
    setHistory(loadedHistory);

    // Try loading saved current session if any
    try {
      const savedSession = localStorage.getItem('ygo_hextech_current_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) {
          setCurrentSession(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cards changes
  const handleSaveCards = (newCards: HextechCard[]) => {
    setCards(newCards);
    saveCards(newCards);
  };

  // Reset cards to default
  const handleResetCards = () => {
    const defaults = resetCardsToDefault();
    setCards(defaults);
  };

  // Complete duel draw ritual
  const handleCompleteDuelSetup = (session: DuelSession) => {
    setCurrentSession(session);
    try {
      localStorage.setItem('ygo_hextech_current_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
    // Auto save to history as well
    saveDuelToHistory(session);
    setHistory(loadDuelHistory());

    // Switch to Duel Board
    setCurrentView('board');
  };

  // New duel
  const handleNewDuel = () => {
    sounds.playDraw();
    setCurrentView('draw');
  };

  // Save history from board
  const handleSaveSessionFromBoard = (session: DuelSession) => {
    saveDuelToHistory(session);
    setHistory(loadDuelHistory());
  };

  // Load a session from history
  const handleLoadSessionFromHistory = (session: DuelSession) => {
    setCurrentSession(session);
    try {
      localStorage.setItem('ygo_hextech_current_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
    setCurrentView('board');
  };

  // Clear history
  const handleClearHistory = () => {
    clearDuelHistory();
    setHistory([]);
  };

  // Toggle audio
  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-safe">
      {/* Background Graphic Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-black" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        hasActiveSession={currentSession !== null}
        onOpenDiceModal={() => setIsDiceModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="sticky top-16 z-30 w-full bg-amber-600/90 text-black py-1.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
          <WifiOff className="w-3.5 h-3.5" />
          <span>离线模式 — 已启用本地缓存，无网络也可顺畅进行海克斯抽卡决斗！</span>
        </div>
      )}

      {/* Mobile Floating Install Banner (if not standalone and not dismissed) */}
      {!isInstalled && !hasDismissedInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:w-96 rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md animate-fade-in flex items-center justify-between gap-3">
          <div
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1">
                <span>安装为安卓/手机原生App</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                全屏无地址栏 · 离线秒开 · 极速决斗体验
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isInstallable ? (
              <button
                onClick={async () => {
                  sounds.playClick();
                  const success = await install();
                  if (!success) setIsInstallModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow"
              >
                <Download className="w-3 h-3" />
                安装
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsInstallModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40"
              >
                查看
              </button>
            )}

            <button
              onClick={() => setHasDismissedInstallBanner(true)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300"
              title="稍后提醒"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col">
        {currentView === 'draw' && (
          <DuelDrawFlow
            allCards={cards}
            onCompleteDuelSetup={handleCompleteDuelSetup}
            onOpenPoolManager={() => setCurrentView('manager')}
          />
        )}

        {currentView === 'board' && currentSession && (
          <DuelBoard
            session={currentSession}
            onNewDuel={handleNewDuel}
            onSaveHistory={handleSaveSessionFromBoard}
          />
        )}

        {currentView === 'manager' && (
          <PoolManager
            cards={cards}
            onSaveCards={handleSaveCards}
            onResetDefault={handleResetCards}
            onBackToDuel={() => setCurrentView(currentSession ? 'board' : 'draw')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>游戏王海克斯大乱斗 (YGO Hextech Duel) · 为决斗带来无限欢乐</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-emerald-400 hover:underline font-semibold"
            >
              安卓软件安装指南
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              玩法规则
            </button>
            <button
              onClick={() => setCurrentView('manager')}
              className="hover:text-amber-400 transition-colors"
            >
              卡库管理
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              对战历史
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <DiceAndCoinModal
        isOpen={isDiceModalOpen}
        onClose={() => setIsDiceModalOpen(false)}
        p1Name={currentSession?.player1Name || '先手玩家'}
        p2Name={currentSession?.player2Name || '后手玩家'}
      />

      <DuelHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onLoadSession={handleLoadSessionFromHistory}
      />

      <HelpRulesModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Android & Vercel Installation Guide Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isWeChat={isWeChat}
        isAndroid={isAndroid}
        onTriggerInstall={async () => {
          await install();
          setIsInstallModalOpen(false);
        }}
      />
    </div>
  );
}
