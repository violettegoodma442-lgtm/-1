import React, { useState } from 'react';
import { HextechCard, PoolType, Rarity } from '../types';
import { sounds } from '../utils/sound';
import {
  Globe,
  Swords,
  ShieldAlert,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Search,
  Check,
  Download,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';

interface PoolManagerProps {
  cards: HextechCard[];
  onSaveCards: (cards: HextechCard[]) => void;
  onResetDefault: () => void;
  onBackToDuel: () => void;
}

export const PoolManager: React.FC<PoolManagerProps> = ({
  cards,
  onSaveCards,
  onResetDefault,
  onBackToDuel,
}) => {
  const [activeTab, setActiveTab] = useState<PoolType>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<HextechCard | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    pool: PoolType;
    description: string;
    rarity: Rarity;
    tag: string;
    flavorText: string;
  }>({
    name: '',
    pool: 'global',
    description: '',
    rarity: 'gold',
    tag: '自定义特权',
    flavorText: '',
  });

  // Export / Import states
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Filter cards by tab, search, and rarity
  const filteredCards = cards.filter((c) => {
    if (c.pool !== activeTab) return false;
    if (rarityFilter !== 'all' && c.rarity !== rarityFilter) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.tag.toLowerCase().includes(query)
    );
  });

  // Open Add modal
  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingCard(null);
    setFormData({
      name: '',
      pool: activeTab,
      description: '',
      rarity: 'gold',
      tag: '战术强化',
      flavorText: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (card: HextechCard) => {
    sounds.playClick();
    setEditingCard(card);
    setFormData({
      name: card.name,
      pool: card.pool,
      description: card.description,
      rarity: card.rarity,
      tag: card.tag,
      flavorText: card.flavorText || '',
    });
    setIsModalOpen(true);
  };

  // Save Card (Add or Edit)
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('请输入卡片名称和效果描述！');
      return;
    }

    sounds.playReveal(formData.rarity);

    if (editingCard) {
      // Edit
      const updated = cards.map((c) =>
        c.id === editingCard.id
          ? {
              ...c,
              name: formData.name.trim(),
              pool: formData.pool,
              description: formData.description.trim(),
              rarity: formData.rarity,
              tag: formData.tag.trim() || '战术强化',
              flavorText: formData.flavorText.trim(),
            }
          : c
      );
      onSaveCards(updated);
    } else {
      // Add
      const newCard: HextechCard = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: formData.name.trim(),
        pool: formData.pool,
        description: formData.description.trim(),
        rarity: formData.rarity,
        tag: formData.tag.trim() || '自定义特权',
        flavorText: formData.flavorText.trim(),
        isCustom: true,
        enabled: true,
        createdAt: Date.now(),
      };
      onSaveCards([newCard, ...cards]);
    }

    setIsModalOpen(false);
  };

  // Toggle enabled
  const handleToggleEnabled = (id: string) => {
    sounds.playClick();
    const updated = cards.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    onSaveCards(updated);
  };

  // Delete card
  const handleDeleteCard = (card: HextechCard) => {
    if (window.confirm(`确定要从海克斯库中删除【${card.name}】吗？`)) {
      sounds.playClick();
      const updated = cards.filter((c) => c.id !== card.id);
      onSaveCards(updated);
    }
  };

  // Reset to default
  const handleResetConfirm = () => {
    if (window.confirm('确定要恢复初始默认海克斯库吗？您新增或修改的卡片将被覆盖。')) {
      sounds.playClick();
      onResetDefault();
    }
  };

  // Export JSON
  const handleOpenExport = () => {
    sounds.playClick();
    setJsonText(JSON.stringify(cards, null, 2));
    setImportError('');
    setIsExportImportOpen(true);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImportJson = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('无效的卡片数据格式：必须是包含海克斯卡片的数组');
      }
      // Basic validation
      for (const item of parsed) {
        if (!item.name || !item.pool || !item.description) {
          throw new Error('部分卡片缺少 name, pool 或 description 字段');
        }
      }
      onSaveCards(parsed);
      sounds.playReveal('prismatic');
      alert(`成功导入 ${parsed.length} 张海克斯卡片！`);
      setIsExportImportOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'JSON 解析失败';
      setImportError(msg);
    }
  };

  // Counts for each tab
  const getPoolCounts = (pool: PoolType) => {
    const total = cards.filter((c) => c.pool === pool).length;
    const enabled = cards.filter((c) => c.pool === pool && c.enabled).length;
    return { total, enabled };
  };

  const globalCounts = getPoolCounts('global');
  const firstCounts = getPoolCounts('first');
  const secondCounts = getPoolCounts('second');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-white">海克斯卡库管理</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              总计 {cards.length} 张卡
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            自由添加、修改或禁用全局/先手/后手三大库海克斯，定制你们专属的娱乐开黑规则！
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            添加新海克斯
          </button>

          <button
            onClick={handleOpenExport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            导入 / 导出
          </button>

          <button
            onClick={handleResetConfirm}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            title="恢复初始默认卡库"
          >
            <RotateCcw className="w-4 h-4" />
            重置默认
          </button>

          <button
            onClick={onBackToDuel}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition-all"
          >
            返回决斗 →
          </button>
        </div>
      </div>

      {/* 3 Library Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Global Pool Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('global');
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            activeTab === 'global'
              ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-extrabold flex items-center gap-2 text-amber-400">
              <Globe className="w-4 h-4" /> 全局海克斯库
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {globalCounts.enabled}/{globalCounts.total} 可用
            </span>
          </div>
          <p className="text-xs text-slate-300/80">
            牌局开局抽取，影响全场所有玩家的规则与机制
          </p>
        </button>

        {/* First Player Pool Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('first');
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            activeTab === 'first'
              ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-extrabold flex items-center gap-2 text-cyan-400">
              <Swords className="w-4 h-4" /> 先手海克斯库
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {firstCounts.enabled}/{firstCounts.total} 可用
            </span>
          </div>
          <p className="text-xs text-slate-300/80">
            先手决斗者专享，展开增益、启动资源与先攻特权
          </p>
        </button>

        {/* Second Player Pool Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('second');
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
            activeTab === 'second'
              ? 'border-rose-400 bg-rose-950/40 shadow-lg shadow-rose-500/20 ring-1 ring-rose-400'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-extrabold flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-4 h-4" /> 后手海克斯库
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              {secondCounts.enabled}/{secondCounts.total} 可用
            </span>
          </div>
          <p className="text-xs text-slate-300/80">
            后手决斗者专享，后攻突破、解场神技与强力反制
          </p>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索卡名、效果描述或标签（如：割草、G、手卡、怪兽）..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">品质过滤：</span>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">全部品质</option>
            <option value="prismatic">棱镜 ★★★</option>
            <option value="gold">黄金 ★★</option>
            <option value="silver">白银 ★</option>
          </select>
        </div>
      </div>

      {/* Cards List in current pool */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          return (
            <div
              key={card.id}
              className={`flex flex-col justify-between rounded-xl border p-4 bg-slate-900/90 transition-all ${
                !card.enabled
                  ? 'border-slate-800 opacity-60 bg-slate-950/60'
                  : card.pool === 'global'
                  ? 'border-amber-500/50 hover:border-amber-400'
                  : card.pool === 'first'
                  ? 'border-cyan-500/50 hover:border-cyan-400'
                  : 'border-rose-500/50 hover:border-rose-400'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        card.rarity === 'prismatic'
                          ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-black'
                          : card.rarity === 'gold'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-300 text-slate-950'
                      }`}
                    >
                      {card.rarity === 'prismatic'
                        ? '棱镜'
                        : card.rarity === 'gold'
                        ? '黄金'
                        : '白银'}
                    </span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                      #{card.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Enable/Disable toggle */}
                    <button
                      onClick={() => handleToggleEnabled(card.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                        card.enabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title={card.enabled ? '点击禁用（抽卡时将不出现）' : '点击启用'}
                    >
                      {card.enabled ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          已启用
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          已禁用
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Name */}
                <h3 className="text-base font-extrabold text-white flex items-center justify-between">
                  <span>{card.name}</span>
                  {card.isCustom && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      自定义
                    </span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {card.description}
                </p>

                {/* Flavor Text */}
                {card.flavorText && (
                  <p className="text-[10px] italic text-amber-200/60 mt-2">
                    “{card.flavorText}”
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(card)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  编辑
                </button>
                <button
                  onClick={() => handleDeleteCard(card)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">当前没有符合筛选条件的海克斯卡片</p>
          <button
            onClick={handleOpenAdd}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
          >
            立即添加一张
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingCard ? '编辑海克斯卡片' : '添加全新海克斯'}
            </h3>

            <form onSubmit={handleSaveCard} className="space-y-4">
              {/* Pool Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  所属海克斯库
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pool: 'global' })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.pool === 'global'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    全局海克斯
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pool: 'first' })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.pool === 'first'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    先手海克斯
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pool: 'second' })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.pool === 'second'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    后手海克斯
                  </button>
                </div>
              </div>

              {/* Name & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    海克斯名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如：超速决斗、裤裆藏龙"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    战术标签 (Tag)
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="如：手牌补给、解场突破"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Rarity */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">品质层级</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['silver', 'gold', 'prismatic'] as Rarity[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, rarity: r })}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        formData.rarity === r
                          ? 'bg-amber-500 text-black border-amber-300 shadow'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {r === 'prismatic'
                        ? '棱镜 (强力)'
                        : r === 'gold'
                        ? '黄金 (进阶)'
                        : '白银 (常规)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  效果描述 (精确对决效果) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细写明什么时候触发、获得什么卡片或改变何种规则..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Flavor Text */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  趣味台词 / 原作风味语录 (选填)
                </label>
                <input
                  type="text"
                  value={formData.flavorText}
                  onChange={(e) => setFormData({ ...formData, flavorText: e.target.value })}
                  placeholder="如：“这就是我与卡组的羁绊！”"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md"
                >
                  {editingCard ? '保存修改' : '确认添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT / IMPORT MODAL */}
      {isExportImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsExportImportOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-cyan-400" />
              导入 / 导出海克斯卡库配置
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              可直接复制下方 JSON 文本备份或分享给好友；亦可将好友分享的卡库配置粘贴到此处导入。
            </p>

            <textarea
              rows={10}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="在此粘贴海克斯卡库 JSON 数据..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400"
            />

            {importError && (
              <div className="mt-2 p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" /> 已复制到剪贴板
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-400" /> 复制配置文本
                  </>
                )}
              </button>

              <button
                onClick={handleImportJson}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-black shadow flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                解析并导入卡库
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
