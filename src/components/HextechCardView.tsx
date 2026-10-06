import React from 'react';
import { HextechCard, PoolType } from '../types';
import { Sparkles, Globe, Swords, ShieldAlert, Award } from 'lucide-react';

interface HextechCardViewProps {
  card: HextechCard;
  isSelected?: boolean;
  onSelect?: () => void;
  showSelectButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isFlipped?: boolean;
  interactive?: boolean;
}

export const HextechCardView: React.FC<HextechCardViewProps> = ({
  card,
  isSelected = false,
  onSelect,
  showSelectButton = false,
  size = 'md',
  isFlipped = false,
  interactive = true,
}) => {
  const getPoolInfo = (pool: PoolType) => {
    switch (pool) {
      case 'global':
        return {
          title: '全局海克斯',
          sub: '双方共同遵守',
          border: 'border-amber-500/70 shadow-amber-500/20',
          badgeBg: 'bg-gradient-to-r from-amber-600 to-yellow-500 text-black',
          headerBg: 'from-amber-950/90 via-stone-900 to-yellow-950/80',
          accent: 'text-amber-400',
          icon: Globe,
          frameGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]',
        };
      case 'first':
        return {
          title: '先手专属海克斯',
          sub: '先手决斗者独享',
          border: 'border-cyan-500/70 shadow-cyan-500/20',
          badgeBg: 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white',
          headerBg: 'from-cyan-950/90 via-slate-900 to-blue-950/80',
          accent: 'text-cyan-400',
          icon: Swords,
          frameGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]',
        };
      case 'second':
        return {
          title: '后手专属海克斯',
          sub: '后手决斗者独享',
          border: 'border-rose-500/70 shadow-rose-500/20',
          badgeBg: 'bg-gradient-to-r from-rose-600 to-orange-500 text-white',
          headerBg: 'from-rose-950/90 via-zinc-900 to-orange-950/80',
          accent: 'text-rose-400',
          icon: ShieldAlert,
          frameGlow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]',
        };
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'prismatic':
        return {
          label: '棱镜 ★★★',
          className: 'bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-slate-950 font-black shadow-sm shadow-pink-500/40',
        };
      case 'gold':
        return {
          label: '黄金 ★★',
          className: 'bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950 font-bold',
        };
      default:
        return {
          label: '白银 ★',
          className: 'bg-slate-300 text-slate-900 font-semibold',
        };
    }
  };

  const poolInfo = getPoolInfo(card.pool);
  const rarityInfo = getRarityBadge(card.rarity);
  const PoolIcon = poolInfo.icon;

  const sizeClasses = {
    sm: 'p-3 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-5 text-base',
  };

  if (isFlipped) {
    // Card back design like Yu-Gi-Oh card back / Hextech back
    return (
      <div
        className={`relative aspect-[3/4.2] w-full max-w-[320px] rounded-xl border-2 border-amber-600/60 bg-gradient-to-br from-amber-950 via-slate-950 to-stone-900 p-4 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden`}
      >
        <div className="absolute inset-2 rounded-lg border border-amber-500/30 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-black/40">
            <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
        </div>
        <div className="relative z-10 text-amber-200/90 font-bold tracking-widest text-sm uppercase">
          YU-GI-OH!
          <div className="text-xs text-amber-400/80 font-mono tracking-normal mt-1">
            HEXTECH AUGMENT
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={interactive && onSelect ? onSelect : undefined}
      className={`group relative flex flex-col justify-between rounded-xl border-2 ${poolInfo.border} bg-slate-950/90 backdrop-blur-md shadow-lg transition-all duration-300 ${
        interactive ? `cursor-pointer ${poolInfo.frameGlow} hover:-translate-y-1` : ''
      } ${
        isSelected
          ? 'ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-[1.02]'
          : ''
      } ${sizeClasses[size]} overflow-hidden`}
    >
      {/* Holographic shimmer effect on hover */}
      <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-x-full group-hover:translate-y-full transform rotate-12" />

      {/* Header Bar */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${poolInfo.badgeBg}`}
            >
              <PoolIcon className="w-3 h-3" />
              {poolInfo.title}
            </span>
            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              #{card.tag}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] tracking-tight ${rarityInfo.className}`}>
            {rarityInfo.label}
          </span>
        </div>

        {/* Card Name */}
        <div className="relative pb-2 mb-2 border-b border-slate-800">
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center justify-between">
            <span>{card.name}</span>
            {card.isCustom && (
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                自定义
              </span>
            )}
          </h3>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Award className="w-3 h-3 text-amber-400/80" />
            <span>{poolInfo.sub}</span>
          </div>
        </div>

        {/* Card Effect / Description Box */}
        <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 my-1 min-h-[90px] flex items-center">
          <p className="text-slate-200 leading-relaxed font-medium text-xs md:text-sm">
            {card.description}
          </p>
        </div>
      </div>

      {/* Footer / Lore & Action */}
      <div className="mt-3 pt-2 border-t border-slate-800/70 flex flex-col justify-end">
        {card.flavorText && (
          <p className="text-[11px] italic text-amber-200/70 mb-2 leading-tight">
            “{card.flavorText}”
          </p>
        )}

        {showSelectButton && onSelect && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`w-full py-2 px-3 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 shadow ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/40 ring-2 ring-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isSelected ? '✓ 已选中' : '选择此海克斯'}
          </button>
        )}
      </div>
    </div>
  );
};
