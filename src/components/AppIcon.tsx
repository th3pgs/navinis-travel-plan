import React from 'react';

interface AppIconProps {
  name?: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name = '', className = 'w-5 h-5' }) => {
  const key = name?.toLowerCase().trim() || '';

  // 1. China Eastern Airlines (Clean SVG without any white background obstruction)
  if (key.includes('china-eastern') || key.includes('ce-air') || key.includes('东方航空')) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <path d="M18 52 C32 30, 68 25, 84 35 C70 42, 52 45, 38 48 Z" fill="#E60012" />
        <path d="M18 52 C30 52, 60 55, 76 68 C62 64, 42 60, 24 55 Z" fill="#003580" />
        <circle cx="28" cy="46" r="3" fill="#E60012" />
      </svg>
    );
  }

  // 2. Hiddify (Official Cross-Platform Proxy Client - Sleek Hexagonal H Logo)
  if (key.includes('hiddify')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#181824" />
        <path
          d="M12 3.5L4.5 7.8V16.2L12 20.5L19.5 16.2V7.8L12 3.5Z"
          stroke="#A855F7"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.5V15.5M15 8.5V15.5M9 12H15"
          stroke="#C084FC"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 3. Astrill VPN Client (Official Astrill Blue & Star Badge)
  if (key.includes('astrill')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0284C7" />
        <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M12 5V19M5 12H19" stroke="#E0F2FE" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
        <path d="M8.5 16.5L12 7.5L15.5 16.5M10 13.5H14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 4. Claude (Anthropic Claude - Official Terracotta Starburst / Sparkle)
  if (key.includes('claude') || key.includes('anthropic')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#D97706" />
        <path
          d="M12 4.5V19.5M4.5 12H19.5M6.7 6.7L17.3 17.3M17.3 6.7L6.7 17.3"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 5. Gmail (Official Red/White/Blue Envelope M)
  if (key.includes('gmail')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFFFFF" />
        <path d="M4 6.5C4 5.67 4.67 5 5.5 5H7L12 9.5L17 5H18.5C19.33 5 20 5.67 20 6.5V17.5C20 18.33 19.33 19 18.5 19H17V9.5L12 14L7 9.5V19H5.5C4.67 19 4 18.33 4 17.5V6.5Z" fill="#EA4335" />
        <path d="M4 6.5L12 13L20 6.5V6C20 5.45 19.55 5 19 5H5C4.45 5 4 5.45 4 6V6.5Z" fill="#EA4335" />
        <path d="M4 6.5V17.5C4 18.33 4.67 19 5.5 19H7V9.5L4 6.5Z" fill="#4285F4" />
        <path d="M20 6.5V17.5C20 18.33 19.33 19 18.5 19H17V9.5L20 6.5Z" fill="#34A853" />
        <path d="M17 5H18.5C19.33 5 20 5.67 20 6.5L17 9.5V5Z" fill="#FBBC04" />
      </svg>
    );
  }

  // 6. Google Maps (Official Google Maps Map Pin)
  if (key.includes('google-maps') || key.includes('gmaps') || (key.includes('maps') && !key.includes('amap') && !key.includes('baidu'))) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFFFFF" />
        <path d="M12 3C8.13 3 5 6.13 5 10C5 14.5 11.1 20.4 11.36 20.65C11.72 21 12.28 21 12.64 20.65C12.9 20.4 19 14.5 19 10C19 6.13 15.87 3 12 3ZM12 12.5C10.62 12.5 9.5 11.38 9.5 10C9.5 8.62 10.62 7.5 12 7.5C13.38 7.5 14.5 8.62 14.5 10C14.5 11.38 13.38 12.5 12 12.5Z" fill="#EA4335" />
        <circle cx="12" cy="10" r="2.5" fill="#4285F4" />
      </svg>
    );
  }

  // 7. Google Drive (Official 3-Color Triangle)
  if (key.includes('drive') || key.includes('google-drive')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFFFFF" />
        <path d="M7.7 15.5L4.5 21H13.2L16.4 15.5H7.7Z" fill="#4285F4" />
        <path d="M16.4 15.5L19.6 21L14.7 12.5L11.5 7H8.3L16.4 15.5Z" fill="#FFBA00" />
        <path d="M8.3 7L3.5 15.5L6.7 21L11.5 7H8.3Z" fill="#00AC47" />
      </svg>
    );
  }

  // 8. Google Chrome (Official 4-Color Swirl)
  if (key.includes('chrome') || key.includes('google-chrome')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="8" fill="#FBBC05" />
        <path d="M12 4C14.6 4 16.9 5.2 18.4 7.2L13.8 15.2C13.3 15.7 12.7 16 12 16C9.8 16 8 14.2 8 12C8 11.6 8.1 11.2 8.2 10.8L4.2 4.9C6.2 4.3 8.3 4 12 4Z" fill="#EA4335" />
        <path d="M12 16C13.2 16 14.3 15.5 15.1 14.6L19.8 14.6C18.9 17.8 16.2 20 12 20C9.6 20 7.4 19 5.8 17.4L9.8 10.5C9.3 11.3 9 12.1 9 13C9 14.7 10.3 16 12 16Z" fill="#34A853" />
        <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="3" fill="#4285F4" />
      </svg>
    );
  }

  // 9. Dialog MyAccount (Sri Lanka Dialog Axiata Red & Yellow Triangles)
  if (key.includes('dialog')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#881337" />
        <polygon points="5,17 12,5 12,17" fill="#E11D48" />
        <polygon points="12,5 19,17 12,17" fill="#FBBF24" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 10. Google / Microsoft Authenticator (Key / Shield 2FA)
  if (key.includes('authenticator') || key.includes('auth')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#475569" />
        <circle cx="12" cy="12" r="7" stroke="#38BDF8" strokeWidth="2" />
        <path d="M12 8V12L15 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#38BDF8" />
      </svg>
    );
  }

  // 11. WhatsApp (Official Green Speech Bubble & Phone)
  if (key.includes('whatsapp')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#25D366" />
        <path
          d="M12 4C7.58 4 4 7.58 4 12C4 13.53 4.43 14.97 5.18 16.2L4 20L7.95 18.84C9.17 19.57 10.55 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z"
          fill="#FFFFFF"
        />
        <path
          d="M15.5 13.6C15.3 13.5 14.3 13 14.1 12.9C13.9 12.8 13.8 12.8 13.7 13C13.6 13.2 13.2 13.7 13.1 13.8C13 13.9 12.9 13.9 12.7 13.8C12.5 13.7 11.8 13.5 11 12.8C10.3 12.2 9.9 11.5 9.8 11.3C9.7 11.1 9.8 11 9.9 10.9C10 10.8 10.1 10.7 10.2 10.5C10.3 10.4 10.3 10.3 10.4 10.2C10.5 10.1 10.4 10 10.4 9.9C10.3 9.8 9.9 8.8 9.7 8.4C9.5 7.9 9.3 8 9.2 8H8.8C8.6 8 8.4 8.1 8.2 8.3C8 8.5 7.5 9 7.5 10C7.5 11 8.2 12 8.3 12.1C8.4 12.2 9.7 14.2 11.7 15C12.2 15.2 12.6 15.3 12.9 15.4C13.5 15.6 14 15.6 14.4 15.5C14.9 15.4 15.9 14.9 16.1 14.3C16.3 13.7 16.3 13.2 16.2 13.1C16.1 13 15.7 12.9 15.5 13.6Z"
          fill="#25D366"
        />
      </svg>
    );
  }

  // 12. BOC SmartPay / People's Wave (Sri Lankan Banking App)
  if (key.includes('boc') || key.includes('peoples-wave') || key.includes('smartpay')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0F172A" />
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M7 8H17M7 12H17M7 16H13" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="15.5" cy="15.5" r="1.5" fill="#10B981" />
      </svg>
    );
  }

  // 13. Google Gemini - Official 4-point Sparkle Gradient Star
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

  // 14. ChatGPT - Official OpenAI Swirled Blossom Logo
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#10A37F]`} fill="currentColor">
        <path d="M22.28 9.37a5.98 5.98 0 0 0-.52-4.93 6.07 6.07 0 0 0-6.49-2.87 6.05 6.05 0 0 0-4.66-2.07c-2.86 0-5.32 1.99-5.91 4.79a6.08 6.08 0 0 0-3.99 2.89 6.05 6.05 0 0 0 .74 7.08 6.06 6.06 0 0 0 .52 4.93 6.07 6.07 0 0 0 6.49 2.87 6.05 6.05 0 0 0 4.66 2.07c2.86 0 5.32-1.99 5.91-4.79a6.08 6.08 0 0 0 3.99-2.89 6.05 6.05 0 0 0-.74-7.08zm-9.17 12.3c-1.4 0-2.69-.6-3.6-1.63l.11-.06 4.35-2.51a.84.84 0 0 0 .42-.73v-6.14l1.84 1.06v5.08a4.4 4.4 0 0 1-3.12 4.93zm-7.66-3.87a4.4 4.4 0 0 1-.58-3.41c.18.3.4.58.67.81l4.35 2.51a.84.84 0 0 0 .84 0l5.32-3.07v2.13l-4.4 2.54a4.4 4.4 0 0 1-6.2-1.51zm-1.4-8.8a4.4 4.4 0 0 1 2.54-2.36v.12l-.01 5.03a.84.84 0 0 0 .42.73l5.32 3.07-1.84 1.06-4.4-2.54a4.4 4.4 0 0 1-2.03-5.11zm15.42 2.64l-5.32-3.07 1.84-1.06 4.4 2.54a4.4 4.4 0 0 1 2.03 5.11 4.4 4.4 0 0 1-2.54 2.36v-.12l.01-5.03a.84.84 0 0 0-.42-.73zm2.08-3.41a4.4 4.4 0 0 1-2.54 2.36l-4.35-2.51a.84.84 0 0 0-.84 0L8.54 11.2V9.07l4.4-2.54a4.4 4.4 0 0 1 6.2 1.51c.4.67.6 1.45.58 2.24zM10.88 13.5l2.25-1.3 2.25 1.3v2.6l-2.25 1.3-2.25-1.3v-2.6z"/>
      </svg>
    );
  }

  // 15. DeepL Translate - Official DeepL Dark Navy & Cyan Chevron
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

  // 16. Google Translate
  if (key.includes('translate')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#1A73E8"/>
        <path d="M11.5 6.5h-7v2h4.8c-.4 1.8-1.5 3.3-3 4.3l1.2 1.6c2-1.3 3.3-3.3 3.8-5.9h1.2v-2h-1z" fill="#FFFFFF"/>
        <path d="M14.5 9h-2l3.5 9h2l3.5-9h-2l-.8 2.2h-3.4l-.8-2.2zm1.4 3.8h2.2l-1.1 3-1.1-3z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 17. WeChat (微信) - Authentic Dual Chat Bubble with Eyes
  if (key.includes('wechat') || key.includes('微信')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#07C160]`} fill="currentColor">
        <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.98 3.79 2.54 5.03L3 17.5l4.31-1.44C7.79 16.14 8.14 16.17 8.5 16.17c.21 0 .42-.01.63-.03-.23-.62-.36-1.28-.36-1.97 0-3.41 3.19-6.17 7.13-6.17 1.05 0 2.04.2 2.92.56C18.25 4.8 13.8 2 8.5 2zm-2.25 5c.69 0 1.25.56 1.25 1.25S6.94 9.5 6.25 9.5 5 8.94 5 8.25 5.56 7 6.25 7zm4.5 0c.69 0 1.25.56 1.25 1.25S11.44 9.5 10.75 9.5s-1.25-.56-1.25-1.25S10.06 7 10.75 7zm5.15 2.17c-3.26 0-5.9 2.29-5.9 5.11 0 2.82 2.64 5.11 5.9 5.11.36 0 .72-.03 1.06-.09L20 20.5l-.89-2.67c1.3-1.02 2.12-2.5 2.12-4.14 0-2.82-2.64-5.11-5.9-5.11zm-1.77 4.15c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03zm3.54 0c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03z"/>
      </svg>
    );
  }

  // 18. Alipay (支付宝) - Official Blue "支" Emblem
  if (key.includes('alipay') || key.includes('支付宝')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className}`} fill="none">
        <rect width="24" height="24" rx="5" fill="#1677FF"/>
        <path d="M12 4.5c2.5 0 4.5.3 5.5.8l-.8 1.8c-.8-.4-2.2-.6-4.7-.6H7.5v2.2h8v1.8h-8v1.6c1.8.8 4 1.7 6.3 2.6-.9 2.5-2.6 4.3-5.3 5.3l-1.2-1.8c2-.7 3.2-1.9 3.9-3.6-1.8-.7-3.4-1.3-4.7-1.8-.8 3-2.6 5.2-5.5 6.2l-1-1.8c2.4-.7 3.8-2.4 4.5-4.8H5V10.5h2.5V8.5H5V6.7h7z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 19. Meituan (美团) - Official Bright Yellow Kangaroo / Delivery Emblem
  if (key.includes('meituan') || key.includes('美团')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FFD000"/>
        <path d="M6 13c1.5-3.5 5.5-4 10-4-.5 4.5-2.5 7.5-6 8-2 .3-4-1.5-4-4z" fill="#222222"/>
        <circle cx="10" cy="11" r="1.5" fill="#FFD000"/>
      </svg>
    );
  }

  // 20. Ele.me (饿了么) - Official Alibaba Food Delivery Blue Emblem
  if (key.includes('eleme') || key.includes('ele.me') || key.includes('饿了么')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0088FF"/>
        <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="26 8" />
        <path d="M9 12H15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 21. Taobao & Pinduoduo
  if (key.includes('taobao') || key.includes('淘宝')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FF5000"/>
        <text x="12" y="17.5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">淘</text>
      </svg>
    );
  }

  if (key.includes('pinduoduo') || key.includes('拼多多')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#E02E24"/>
        <circle cx="9" cy="9" r="3" fill="#FFFFFF" opacity="0.9" />
        <circle cx="15" cy="9" r="3" fill="#FFFFFF" opacity="0.9" />
        <circle cx="9" cy="15" r="3" fill="#FFFFFF" opacity="0.9" />
        <circle cx="15" cy="15" r="3" fill="#FFFFFF" opacity="0.9" />
      </svg>
    );
  }

  // 22. DiDi Ride Hailing (滴滴出行)
  if (key.includes('didi') || key.includes('滴滴')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#FF7A00"/>
        <path d="M6 6h6c3.3 0 6 2.7 6 6s-2.7 6-6 6H6V6zm3.5 3v6H12c1.65 0 3-1.35 3-3s-1.35-3-3-3H9.5z" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#FF7A00"/>
      </svg>
    );
  }

  // 23. Amap / Gaode Maps (高德地图)
  if (key.includes('amap') || key.includes('gaode') || key.includes('高德')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0091FF"/>
        <path d="M12 4l7 14-7-3-7 3 7-14z" fill="#FFFFFF"/>
        <circle cx="12" cy="13.5" r="1.5" fill="#0091FF"/>
      </svg>
    );
  }

  // 24. Baidu Maps (百度地图)
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

  // 25. Trip.com
  if (key.includes('trip')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#0066FF"/>
        <path d="M5 8.5h14v2H5v-2zm0 5h10v2H5v-2z" fill="#FFFFFF"/>
        <circle cx="17" cy="15.5" r="2.5" fill="#FF7700"/>
      </svg>
    );
  }

  // 26. Pleco Chinese Dictionary
  if (key.includes('pleco') || key.includes('dictionary') || key.includes('鱼')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="5" fill="#DC2626"/>
        <text x="12" y="17" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">鱼</text>
      </svg>
    );
  }

  // 27. MetroMan Transit
  if (key.includes('metro') || key.includes('subway') || key.includes('transit')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#0086F6]`} fill="currentColor">
        <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-6H7V5h10v6z"/>
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
