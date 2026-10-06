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
          // If there's an active session, user might want to continue it or start fresh
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
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
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

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
    </div>
  );
}
