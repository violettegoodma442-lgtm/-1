import React from 'react';
import { X, BookOpen, Globe, Swords, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpRulesModal: React.FC<HelpRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-amber-500/40 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">海克斯大乱斗 玩法与规则说明</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-300 text-xs md:text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <h4 className="font-extrabold text-sm mb-1 flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" /> 什么是“游戏王海克斯大乱斗”？
            </h4>
            <p className="text-xs leading-relaxed text-amber-200/90">
              将竞技自走棋/卡牌游戏中的「海克斯强化（Augments）」融入传统游戏王对战！在正式开局洗切卡组前，抽取特殊规则与强化效果，极大提升对局娱乐性、战术变数与戏剧性！
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 对局抽取仪式标准流程
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
              <li>
                <strong className="text-white">确定先后手：</strong> 使用内置的“千年月影硬币”或“命运骰子”决定先后手决斗者。
              </li>
              <li>
                <strong className="text-amber-400">第一阶段 · 抽取全局海克斯：</strong>
                从「全局海克斯库」抽取1张，该规则对双方决斗者无差别全场生效（例如：巨人战争生命值翻倍至16000、超速决斗通召不限等）。
              </li>
              <li>
                <strong className="text-cyan-400">第二阶段 · 先手专属海克斯：</strong>
                由先手玩家从「先手海克斯库」专属抽取1张，仅对先手玩家生效（例如：裤裆藏网络小龙、制衡万宝槌等）。
              </li>
              <li>
                <strong className="text-rose-400">第三阶段 · 后手专属海克斯：</strong>
                由后手玩家从「后手海克斯库」专属抽取1张，仅对后手玩家生效（例如：王牌怪兽增殖的G、冠军连招等）。
              </li>
              <li>
                <strong className="text-white">决斗开始：</strong> 进入决斗看板，随时查阅三张已激活海克斯规则，使用内置生命值计分板与计数器。
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> 全局库 (Global)
              </div>
              <p className="text-[11px] text-slate-400">
                改变生命值、抽牌规则、公开情报或墓地机制等宏观环境。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
              <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5" /> 先手库 (First)
              </div>
              <p className="text-[11px] text-slate-400">
                启动调配、特定单卡外挂、护航与展开防打断特权。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
              <div className="text-rose-400 font-bold mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> 后手库 (Second)
              </div>
              <p className="text-[11px] text-slate-400">
                后攻突破、解场神技、防压制反打与手坑触发。
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <span className="font-bold text-white block mb-1">💡 自定义小提示：</span>
            你可以在「海克斯卡库」随时添加朋友们喜欢的专属恶搞或平衡卡片，也可以暂时禁用某些过于强力的卡片，支持一键导出备份或分享！
          </div>
        </div>
      </div>
    </div>
  );
};
