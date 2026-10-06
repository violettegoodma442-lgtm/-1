import React from 'react';
import { DuelSession } from '../types';
import { sounds } from '../utils/sound';
import { X, History, Trash2, Globe, Swords, ShieldAlert, Calendar } from 'lucide-react';

interface DuelHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DuelSession[];
  onClearHistory: () => void;
  onLoadSession: (session: DuelSession) => void;
}

export const DuelHistoryModal: React.FC<DuelHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onLoadSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-amber-500/40 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">历史决斗对局记录</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              共 {history.length} 局
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('确定清空所有历史对战记录吗？')) {
                    onClearHistory();
                  }
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              暂无已保存的历史对局，进行一次对战后会自动保存记录。
            </div>
          ) : (
            history.map((h) => {
              const dateStr = new Date(h.timestamp).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={h.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {dateStr}
                    </span>
                    <span className="font-bold text-white">
                      <strong className="text-cyan-400">{h.player1Name}</strong> (先手) VS{' '}
                      <strong className="text-rose-400">{h.player2Name}</strong> (后手)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-amber-500/20 text-slate-300">
                      <span className="text-[10px] text-amber-400 block font-bold mb-0.5">
                        <Globe className="w-3 h-3 inline mr-1" />
                        全局海克斯
                      </span>
                      <span className="font-bold text-white">{h.globalCard?.name || '无'}</span>
                    </div>

                    <div className="p-2 rounded bg-slate-900 border border-cyan-500/20 text-slate-300">
                      <span className="text-[10px] text-cyan-400 block font-bold mb-0.5">
                        <Swords className="w-3 h-3 inline mr-1" />
                        先手专属
                      </span>
                      <span className="font-bold text-white">{h.player1Card?.name || '无'}</span>
                    </div>

                    <div className="p-2 rounded bg-slate-900 border border-rose-500/20 text-slate-300">
                      <span className="text-[10px] text-rose-400 block font-bold mb-0.5">
                        <ShieldAlert className="w-3 h-3 inline mr-1" />
                        后手专属
                      </span>
                      <span className="font-bold text-white">{h.player2Card?.name || '无'}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onLoadSession(h);
                        onClose();
                      }}
                      className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40"
                    >
                      载入此局看板 →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
