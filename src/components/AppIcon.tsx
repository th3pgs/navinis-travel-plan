import React from 'react';

interface AppIconProps {
  name?: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name = '', className = 'w-5 h-5' }) => {
  const key = name?.toLowerCase().trim() || '';

  // 1. China Eastern Airlines
  if (key.includes('china-eastern') || key.includes('ce-air') || key.includes('东方航空')) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <path d="M18 52 C32 30, 68 25, 84 35 C70 42, 52 45, 38 48 Z" fill="#E60012" />
        <path d="M18 52 C30 52, 60 55, 76 68 C62 64, 42 60, 24 55 Z" fill="#003580" />
        <circle cx="28" cy="46" r="3" fill="#E60012" />
      </svg>
    );
  }

  // 2. Google Gemini - Official 4-point Sparkle Gradient Star
  if (key.includes('gemini')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <defs>
          <linearGradient id="gemini-grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A73E8" />
            <stop offset="50%" stopColor="#8AB4F8" />
            <stop offset="100%" stopColor="#C58AF9" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
          fill="url(#gemini-grad-icon)"
        />
      </svg>
    );
  }

  // 3. ChatGPT - Official OpenAI Swirled Blossom Logo
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#10A37F]`} fill="currentColor">
        <path d="M22.28 9.37a5.98 5.98 0 0 0-.52-4.93 6.07 6.07 0 0 0-6.49-2.87 6.05 6.05 0 0 0-4.66-2.07c-2.86 0-5.32 1.99-5.91 4.79a6.08 6.08 0 0 0-3.99 2.89 6.05 6.05 0 0 0 .74 7.08 6.06 6.06 0 0 0 .52 4.93 6.07 6.07 0 0 0 6.49 2.87 6.05 6.05 0 0 0 4.66 2.07c2.86 0 5.32-1.99 5.91-4.79a6.08 6.08 0 0 0 3.99-2.89 6.05 6.05 0 0 0-.74-7.08zm-9.17 12.3c-1.4 0-2.69-.6-3.6-1.63l.11-.06 4.35-2.51a.84.84 0 0 0 .42-.73v-6.14l1.84 1.06v5.08a4.4 4.4 0 0 1-3.12 4.93zm-7.66-3.87a4.4 4.4 0 0 1-.58-3.41c.18.3.4.58.67.81l4.35 2.51a.84.84 0 0 0 .84 0l5.32-3.07v2.13l-4.4 2.54a4.4 4.4 0 0 1-6.2-1.51zm-1.4-8.8a4.4 4.4 0 0 1 2.54-2.36v.12l-.01 5.03a.84.84 0 0 0 .42.73l5.32 3.07-1.84 1.06-4.4-2.54a4.4 4.4 0 0 1-2.03-5.11zm15.42 2.64l-5.32-3.07 1.84-1.06 4.4 2.54a4.4 4.4 0 0 1 2.03 5.11 4.4 4.4 0 0 1-2.54 2.36v-.12l.01-5.03a.84.84 0 0 0-.42-.73zm2.08-3.41a4.4 4.4 0 0 1-2.54 2.36l-4.35-2.51a.84.84 0 0 0-.84 0L8.54 11.2V9.07l4.4-2.54a4.4 4.4 0 0 1 6.2 1.51c.4.67.6 1.45.58 2.24zM10.88 13.5l2.25-1.3 2.25 1.3v2.6l-2.25 1.3-2.25-1.3v-2.6z"/>
      </svg>
    );
  }

  // 4. Google Suite (Gmail, Drive) - Official Multi-Color Google G
  if (key.includes('google') || key.includes('gsuite') || key.includes('drive') || key.includes('gmail')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    );
  }

  // 5. DeepL Translate - Official DeepL Dark Navy & Cyan Chevron
  if (key.includes('deepl')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0F2B46"/>
        <path d="M7 6h5c3.31 0 6 2.69 6 6s-2.69 6-6 6H7V6z" fill="#0F2B46"/>
        <path d="M9 8h3c2.21 0 4 1.79 4 4s-1.79 4-4 4H9V8z" fill="#00D2D2"/>
        <path d="M12 10.5l-2.5 3h5l-2.5-3z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 6. Google Translate
  if (key.includes('translate')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#1A73E8"/>
        <path d="M11.5 6.5h-7v2h4.8c-.4 1.8-1.5 3.3-3 4.3l1.2 1.6c2-1.3 3.3-3.3 3.8-5.9h1.2v-2h-1z" fill="#FFFFFF"/>
        <path d="M14.5 9h-2l3.5 9h2l3.5-9h-2l-.8 2.2h-3.4l-.8-2.2zm1.4 3.8h2.2l-1.1 3-1.1-3z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 7. WeChat (微信) - Authentic Dual Chat Bubble with Eyes
  if (key.includes('wechat') || key.includes('微信')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#07C160]`} fill="currentColor">
        <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.98 3.79 2.54 5.03L3 17.5l4.31-1.44C7.79 16.14 8.14 16.17 8.5 16.17c.21 0 .42-.01.63-.03-.23-.62-.36-1.28-.36-1.97 0-3.41 3.19-6.17 7.13-6.17 1.05 0 2.04.2 2.92.56C18.25 4.8 13.8 2 8.5 2zm-2.25 5c.69 0 1.25.56 1.25 1.25S6.94 9.5 6.25 9.5 5 8.94 5 8.25 5.56 7 6.25 7zm4.5 0c.69 0 1.25.56 1.25 1.25S11.44 9.5 10.75 9.5s-1.25-.56-1.25-1.25S10.06 7 10.75 7zm5.15 2.17c-3.26 0-5.9 2.29-5.9 5.11 0 2.82 2.64 5.11 5.9 5.11.36 0 .72-.03 1.06-.09L20 20.5l-.89-2.67c1.3-1.02 2.12-2.5 2.12-4.14 0-2.82-2.64-5.11-5.9-5.11zm-1.77 4.15c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03zm3.54 0c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03z"/>
      </svg>
    );
  }

  // 8. Alipay (支付宝) - Official Blue "支" Emblem
  if (key.includes('alipay') || key.includes('支付宝')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className}`} fill="none">
        <rect width="24" height="24" rx="5" fill="#1677FF"/>
        <path d="M12 4.5c2.5 0 4.5.3 5.5.8l-.8 1.8c-.8-.4-2.2-.6-4.7-.6H7.5v2.2h8v1.8h-8v1.6c1.8.8 4 1.7 6.3 2.6-.9 2.5-2.6 4.3-5.3 5.3l-1.2-1.8c2-.7 3.2-1.9 3.9-3.6-1.8-.7-3.4-1.3-4.7-1.8-.8 3-2.6 5.2-5.5 6.2l-1-1.8c2.4-.7 3.8-2.4 4.5-4.8H5V10.5h2.5V8.5H5V6.7h7z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 9. DiDi Ride Hailing (滴滴出行) - Official Orange "D" Emblem
  if (key.includes('didi') || key.includes('滴滴')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FF7A00"/>
        <path d="M6 6h6c3.3 0 6 2.7 6 6s-2.7 6-6 6H6V6zm3.5 3v6H12c1.65 0 3-1.35 3-3s-1.35-3-3-3H9.5z" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#FF7A00"/>
      </svg>
    );
  }

  // 10. Shadowrocket - Official Blue Proxy Rocket Icon
  if (key.includes('shadowrocket')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className}`} fill="none">
        <rect width="24" height="24" rx="5" fill="#007AFF"/>
        <path d="M12 4c-2.2 0-4 1.8-4 4 0 1.2.5 2.3 1.4 3.1l1.6 1.6v2.3l1 1 1-1V12.7l1.6-1.6c.9-.8 1.4-1.9 1.4-3.1 0-2.2-1.8-4-4-4zm0 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" fill="#FFFFFF"/>
        <path d="M8 17l-2 3 3-1-1-2zm8 0l1 2 3 1-2-3-2 0z" fill="#FFCC00"/>
      </svg>
    );
  }

  // 11. v2rayNG - Official Stylized V2Ray Node Network 'V'
  if (key.includes('v2ray')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#1A56DB"/>
        <path d="M5 6l5 12h4l5-12h-3.2l-3.8 9.5L8.2 6H5z" fill="#FFFFFF"/>
        <circle cx="12" cy="18" r="1.5" fill="#38BDF8"/>
        <circle cx="5" cy="6" r="1.2" fill="#38BDF8"/>
        <circle cx="19" cy="6" r="1.2" fill="#38BDF8"/>
      </svg>
    );
  }

  // 12. Clash Verge Rev - Official Clash Cat Silhouette & Shield
  if (key.includes('clash')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#5856D6"/>
        <path d="M6 7l3 2h6l3-2-1 8c-.5 3-4.5 5-5 5s-4.5-2-5-5L6 7z" fill="#FFFFFF"/>
        <circle cx="9.5" cy="12" r="1" fill="#5856D6"/>
        <circle cx="14.5" cy="12" r="1" fill="#5856D6"/>
        <path d="M11 14h2" stroke="#5856D6" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // 13. Amap / Gaode Maps (高德地图) - Official Blue Navigation Paperplane
  if (key.includes('amap') || key.includes('gaode') || key.includes('高德')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0091FF"/>
        <path d="M12 4l7 14-7-3-7 3 7-14z" fill="#FFFFFF"/>
        <circle cx="12" cy="13.5" r="1.5" fill="#0091FF"/>
      </svg>
    );
  }

  // 14. Baidu Maps (百度地图) - Official Blue Bear Paw & Compass
  if (key.includes('baidu') || key.includes('百度')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#2932E1"/>
        <ellipse cx="12" cy="14" rx="3.5" ry="3" fill="#FFFFFF"/>
        <ellipse cx="7.5" cy="10" rx="1.5" ry="2" fill="#FFFFFF"/>
        <ellipse cx="10" cy="7.5" rx="1.3" ry="1.8" fill="#FFFFFF"/>
        <ellipse cx="14" cy="7.5" rx="1.3" ry="1.8" fill="#FFFFFF"/>
        <ellipse cx="16.5" cy="10" rx="1.5" ry="2" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 15. Taobao (淘宝) - Official Orange "淘" Emblem
  if (key.includes('taobao') || key.includes('淘宝')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FF5000"/>
        <text x="12" y="17.5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">淘</text>
      </svg>
    );
  }

  // 16. Pleco Chinese Dictionary - Crisp Red Chinese Seal with "鱼"
  if (key.includes('pleco') || key.includes('dictionary') || key.includes('鱼')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#DC2626"/>
        <text x="12" y="17" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">鱼</text>
      </svg>
    );
  }

  // 17. MetroMan Transit
  if (key.includes('metro') || key.includes('subway') || key.includes('transit')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#0086F6]`} fill="currentColor">
        <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-6H7V5h10v6z"/>
      </svg>
    );
  }

  // 18. Meituan (美团) - Official Bright Yellow Kangaroo / Delivery Emblem
  if (key.includes('meituan') || key.includes('美团')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFD000"/>
        <path d="M6 13c1.5-3.5 5.5-4 10-4-.5 4.5-2.5 7.5-6 8-2 .3-4-1.5-4-4z" fill="#222222"/>
        <circle cx="10" cy="11" r="1.5" fill="#FFD000"/>
      </svg>
    );
  }

  // 19. Trip.com - Authentic Blue & Orange Wave Emblem
  if (key.includes('trip')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0066FF"/>
        <path d="M5 8.5h14v2H5v-2zm0 5h10v2H5v-2z" fill="#FFFFFF"/>
        <circle cx="17" cy="15.5" r="2.5" fill="#FF7700"/>
      </svg>
    );
  }

  // 20. Zotero & Academic Research - Official Red "Z"
  if (key.includes('zotero') || key.includes('scholar')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#CC292B"/>
        <path d="M7 6h10l-7.5 9H17v3H7l7.5-9H7V6z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Default clean iOS tool badge
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-[#007AFF]`} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/>
    </svg>
  );
};
