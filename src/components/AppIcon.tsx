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

  // 2. Google Gemini
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

  // 3. ChatGPT
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#10A37F]`} fill="currentColor">
        <path d="M22.28 9.37a5.98 5.98 0 0 0-.52-4.93 6.07 6.07 0 0 0-6.49-2.87 6.05 6.05 0 0 0-4.66-2.07c-2.86 0-5.32 1.99-5.91 4.79a6.08 6.08 0 0 0-3.99 2.89 6.05 6.05 0 0 0 .74 7.08 6.06 6.06 0 0 0 .52 4.93 6.07 6.07 0 0 0 6.49 2.87 6.05 6.05 0 0 0 4.66 2.07c2.86 0 5.32-1.99 5.91-4.79a6.08 6.08 0 0 0 3.99-2.89 6.05 6.05 0 0 0-.74-7.08zm-9.17 12.3c-1.4 0-2.69-.6-3.6-1.63l.11-.06 4.35-2.51a.84.84 0 0 0 .42-.73v-6.14l1.84 1.06v5.08a4.4 4.4 0 0 1-3.12 4.93zm-7.66-3.87a4.4 4.4 0 0 1-.58-3.41c.18.3.4.58.67.81l4.35 2.51a.84.84 0 0 0 .84 0l5.32-3.07v2.13l-4.4 2.54a4.4 4.4 0 0 1-6.2-1.51zm-1.4-8.8a4.4 4.4 0 0 1 2.54-2.36v.12l-.01 5.03a.84.84 0 0 0 .42.73l5.32 3.07-1.84 1.06-4.4-2.54a4.4 4.4 0 0 1-2.03-5.11zm15.42 2.64l-5.32-3.07 1.84-1.06 4.4 2.54a4.4 4.4 0 0 1 2.03 5.11 4.4 4.4 0 0 1-2.54 2.36v-.12l.01-5.03a.84.84 0 0 0-.42-.73zm2.08-3.41a4.4 4.4 0 0 1-2.54 2.36l-4.35-2.51a.84.84 0 0 0-.84 0L8.54 11.2V9.07l4.4-2.54a4.4 4.4 0 0 1 6.2 1.51c.4.67.6 1.45.58 2.24zM10.88 13.5l2.25-1.3 2.25 1.3v2.6l-2.25 1.3-2.25-1.3v-2.6z"/>
      </svg>
    );
  }

  // 4. Google Suite
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

  // 5. DeepL
  if (key.includes('deepl')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#0F2B46]`} fill="currentColor">
        <path d="M12.87 2.2c-.44-.26-.98-.26-1.42 0L3.77 6.64c-.45.26-.72.74-.72 1.26v8.2c0 .52.27 1 .72 1.26l7.68 4.44c.44.26.98.26 1.42 0l7.68-4.44c.45-.26.72-.74.72-1.26V7.9c0-.52-.27-1-.72-1.26L12.87 2.2zm-1.87 3.52l4.8 2.77-4.8 2.77-4.8-2.77 4.8-2.77zm-6.2 4.35l4.8 2.77v5.54l-4.8-2.77V10.07zm14.4 5.54l-4.8 2.77v-5.54l4.8-2.77v5.54z"/>
      </svg>
    );
  }

  // 6. WeChat
  if (key.includes('wechat') || key.includes('微信')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#07C160]`} fill="currentColor">
        <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.98 3.79 2.54 5.03L3 17.5l4.31-1.44C7.79 16.14 8.14 16.17 8.5 16.17c.21 0 .42-.01.63-.03-.23-.62-.36-1.28-.36-1.97 0-3.41 3.19-6.17 7.13-6.17 1.05 0 2.04.2 2.92.56C18.25 4.8 13.8 2 8.5 2zm-2.25 5c.69 0 1.25.56 1.25 1.25S6.94 9.5 6.25 9.5 5 8.94 5 8.25 5.56 7 6.25 7zm4.5 0c.69 0 1.25.56 1.25 1.25S11.44 9.5 10.75 9.5s-1.25-.56-1.25-1.25S10.06 7 10.75 7zm5.15 2.17c-3.26 0-5.9 2.29-5.9 5.11 0 2.82 2.64 5.11 5.9 5.11.36 0 .72-.03 1.06-.09L20 20.5l-.89-2.67c1.3-1.02 2.12-2.5 2.12-4.14 0-2.82-2.64-5.11-5.9-5.11zm-1.77 4.15c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03zm3.54 0c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03z"/>
      </svg>
    );
  }

  // 7. Alipay
  if (key.includes('alipay') || key.includes('支付宝')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#1677FF]`} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.6 15.2c-.8.5-2.1.8-3.4.8-2.6 0-4.4-1.2-4.4-3.1 0-1.7 1.4-2.8 3.5-3.1 1.2-.2 2.6-.2 3.8-.1v-.7c0-.9-.6-1.4-1.8-1.4-1.1 0-2.2.3-3.1.8l-.5-1.4c1.1-.6 2.6-1 4-1 2.3 0 3.7 1.1 3.7 3.2v4.8c0 .7.1 1.4.3 1.9h-1.9l-.2-.8zm-4.1-1.3c1.7 0 3-.7 3.7-1.4v-1.6c-1 0-2.2 0-3.3.2-1.3.2-2.1.8-2.1 1.7 0 .9.8 1.1 1.7 1.1z"/>
      </svg>
    );
  }

  // 8. DiDi
  if (key.includes('didi') || key.includes('滴滴')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#FF7A00]`} fill="currentColor">
        <path d="M18.9 4H5.1C4.5 4 4 4.5 4 5.1v13.8c0 .6.5 1.1 1.1 1.1h13.8c.6 0 1.1-.5 1.1-1.1V5.1c0-.6-.5-1.1-1.1-1.1zm-8.4 12.8H7.7V7.2h2.8c2.9 0 4.7 1.7 4.7 4.8 0 3.1-1.8 4.8-4.7 4.8zm5.5 0h-2.1V7.2h2.1v9.6zm-5.5-2.2c1.7 0 2.6-1.1 2.6-2.6s-.9-2.6-2.6-2.6H9.7v5.2h.8z"/>
      </svg>
    );
  }

  // 9. Shadowrocket / Clash / v2ray / Proxy
  if (key.includes('shadowrocket') || key.includes('clash') || key.includes('v2ray') || key.includes('proxy')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#007AFF]`} fill="currentColor">
        <path d="M13.13 2.05c-.32-.05-.65.11-.79.41L9.2 8.44 3.73 10.3c-.34.12-.55.45-.52.81.03.35.29.63.64.69l4.58.76 2.22 4.44c.16.31.48.5.83.47.34-.03.63-.26.73-.59l1.76-5.87 5.76-3.2c.3-.17.46-.5.41-.84-.06-.34-.29-.61-.62-.68l-5.41-1.24L13.13 2.05zM20 20l-4-4 1.5-1.5 4 4L20 20z"/>
      </svg>
    );
  }

  // 10. Pleco
  if (key.includes('pleco') || key.includes('dictionary') || key.includes('鱼')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#DC2626]`} fill="currentColor">
        <path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z" fill="#DC2626"/>
        <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // 11. Baidu Maps
  if (key.includes('baidu') || key.includes('百度')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#2932E1]`} fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    );
  }

  // 12. MetroMan Transit
  if (key.includes('metro') || key.includes('subway') || key.includes('transit')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#0086F6]`} fill="currentColor">
        <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-6H7V5h10v6z"/>
      </svg>
    );
  }

  // 13. Meituan
  if (key.includes('meituan') || key.includes('美团')) {
    return (
      <svg viewBox="0 0 24 24" className={`${className} text-[#FFC300]`} fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="#FFC300"/>
        <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
