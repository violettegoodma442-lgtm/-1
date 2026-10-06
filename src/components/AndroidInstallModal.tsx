import React from 'react';
import { sounds } from '../utils/sound';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  Globe,
  ExternalLink,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isWeChat: boolean;
  isAndroid: boolean;
  onTriggerInstall: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isWeChat,
  isAndroid,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/40 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">安卓软件安装与部署指引</h3>
              <p className="text-[11px] text-emerald-400 font-semibold">
                支持原生独立App体验 · 离线可用 · 免应用商店
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Direct Install CTA button if supported by browser */}
          {isInstallable && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-slate-900 border border-emerald-500/50 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 检测到浏览器支持一键安装！
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3">
                点击下方按钮即可直接将「游戏王海克斯大乱斗」安装到安卓手机主屏幕，像原生独立 App 一样全屏流畅运行。
              </p>
              <button
                onClick={() => {
                  sounds.playClick();
                  onTriggerInstall();
                }}
                className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                立即一键安装到安卓手机
              </button>
            </div>
          )}

          {/* WeChat warning */}
          {isWeChat && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">微信内置浏览器限制提示</strong>
                <span>
                  您当前在微信中浏览。请点击右上角三个点 <strong>「···」</strong>，选择 <strong>「在浏览器中打开」</strong>（推荐 Chrome / Edge / 系统自带浏览器），即可直接安装到手机桌面！
                </span>
              </div>
            </div>
          )}

          {/* How to install on Android Phones */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-black text-sm text-white mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" /> 各品牌安卓手机安装步骤
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">
                  1. 谷歌 Chrome / 微软 Edge 浏览器（最推荐）：
                </strong>
                点击浏览器右上角「···」菜单 → 点击 <strong>「安装应用」</strong> 或 <strong>「添加到主屏幕」</strong>，手机桌面将生成专属决斗 App 图标。
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-amber-300 block mb-1">
                  2. 小米 (MIUI/HyperOS) / 华为 (HarmonyOS) / OPPO / vivo 自带浏览器：
                </strong>
                点击底部或右上角菜单栏 → 找到 <strong>「添加到桌面」</strong> 或 <strong>「桌面快捷方式」</strong>，确认添加即可。
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-purple-300 block mb-1">
                  3. 三星手机 (Samsung Internet)：
                </strong>
                点击地址栏右侧出现的 <strong>「下载/安装」</strong> 小图标，或底部菜单 → <strong>「添加页面至」</strong> → <strong>「主屏幕」</strong>。
              </div>
            </div>
          </div>

          {/* Vercel Deployment Guide */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-black text-sm text-white mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" /> 在 Vercel (https://vercel.com) 平台部署与使用
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <p>本项目已为您完美预置了全套 Vercel 静态与 PWA 路由规则（包含 <code>vercel.json</code>、单页重写与 Service Worker 缓存配置）：</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                <li>
                  登录 <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">vercel.com</a>，点击 <strong>「Add New...」→「Project」</strong>。
                </li>
                <li>
                  导入本代码仓库（GitHub / GitLab），构建框架选择 <strong>Vite</strong>。
                </li>
                <li>
                  点击 <strong>「Deploy」</strong>，几秒钟后即可获得专属在线网址（例如 <code>xxx.vercel.app</code>）。
                </li>
                <li>
                  用手机直接访问该网址，即可实现全屏无缝安装，全球 CDN 极速加载且自动支持离线缓存！
                </li>
              </ol>
            </div>
          </div>

          {/* Optional APK Packaging Guide */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-black text-sm text-white mb-1.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" /> 想生成独立 .APK 安装包？
            </h4>
            <p className="text-[11px] text-slate-400">
              由于本项目已完全遵循 Google PWA 规范，部署至 Vercel 后，只需复制您的 Vercel 网址到 Google 官方支持的{' '}
              <a href="https://www.pwabuilder.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">
                PWABuilder.com <ExternalLink className="w-3 h-3" />
              </a>
              ，即可一键打包生成原生的 Android <strong>.apk</strong> 安装包或发布至 Google Play！
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
