import React from 'react';

interface AppIconProps {
  name?: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'wechat':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#07C160]`} fill="currentColor">
          <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.98 3.79 2.54 5.03L3 17.5l4.31-1.44C7.79 16.14 8.14 16.17 8.5 16.17c.21 0 .42-.01.63-.03-.23-.62-.36-1.28-.36-1.97 0-3.41 3.19-6.17 7.13-6.17 1.05 0 2.04.2 2.92.56C18.25 4.8 13.8 2 8.5 2zm-2.25 5c.69 0 1.25.56 1.25 1.25S6.94 9.5 6.25 9.5 5 8.94 5 8.25 5.56 7 6.25 7zm4.5 0c.69 0 1.25.56 1.25 1.25S11.44 9.5 10.75 9.5s-1.25-.56-1.25-1.25S10.06 7 10.75 7zm5.15 2.17c-3.26 0-5.9 2.29-5.9 5.11 0 2.82 2.64 5.11 5.9 5.11.36 0 .72-.03 1.06-.09L20 20.5l-.89-2.67c1.3-1.02 2.12-2.5 2.12-4.14 0-2.82-2.64-5.11-5.9-5.11zm-1.77 4.15c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03zm3.54 0c.57 0 1.03.46 1.03 1.03s-.46 1.03-1.03 1.03-1.03-.46-1.03-1.03.46-1.03 1.03-1.03z"/>
        </svg>
      );
    case 'alipay':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#1677FF]`} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.6 15.2c-.8.5-2.1.8-3.4.8-2.6 0-4.4-1.2-4.4-3.1 0-1.7 1.4-2.8 3.5-3.1 1.2-.2 2.6-.2 3.8-.1v-.7c0-.9-.6-1.4-1.8-1.4-1.1 0-2.2.3-3.1.8l-.5-1.4c1.1-.6 2.6-1 4-1 2.3 0 3.7 1.1 3.7 3.2v4.8c0 .7.1 1.4.3 1.9h-1.9l-.2-.8zm-4.1-1.3c1.7 0 3-.7 3.7-1.4v-1.6c-1 0-2.2 0-3.3.2-1.3.2-2.1.8-2.1 1.7 0 .9.8 1.1 1.7 1.1z"/>
        </svg>
      );
    case 'didi':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#FF7A00]`} fill="currentColor">
          <path d="M18.9 4H5.1C4.5 4 4 4.5 4 5.1v13.8c0 .6.5 1.1 1.1 1.1h13.8c.6 0 1.1-.5 1.1-1.1V5.1c0-.6-.5-1.1-1.1-1.1zm-8.4 12.8H7.7V7.2h2.8c2.9 0 4.7 1.7 4.7 4.8 0 3.1-1.8 4.8-4.7 4.8zm5.5 0h-2.1V7.2h2.1v9.6zm-5.5-2.2c1.7 0 2.6-1.1 2.6-2.6s-.9-2.6-2.6-2.6H9.7v5.2h.8z"/>
        </svg>
      );
    case 'shadowrocket':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#3B82F6]`} fill="currentColor">
          <path d="M13.13 2.05c-.32-.05-.65.11-.79.41L9.2 8.44 3.73 10.3c-.34.12-.55.45-.52.81.03.35.29.63.64.69l4.58.76 2.22 4.44c.16.31.48.5.83.47.34-.03.63-.26.73-.59l1.76-5.87 5.76-3.2c.3-.17.46-.5.41-.84-.06-.34-.29-.61-.62-.68l-5.41-1.24L13.13 2.05zM20 20l-4-4 1.5-1.5 4 4L20 20z"/>
        </svg>
      );
    case 'pleco':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#DC2626]`} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
        </svg>
      );
    case 'dialog':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#EF4444]`} fill="currentColor">
          <path d="M12 3a9 9 0 0 0-9 9c0 1.95.63 3.76 1.7 5.24L3 21l3.87-1.63A8.96 8.96 0 0 0 12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9zm-1 5h2v6h-2V8zm1 10a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
        </svg>
      );
    case 'bank':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#003580]`} fill="currentColor">
          <path d="M11.5 1L2 6v2h19V6l-9.5-5zM4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 19v2h19v-2H2z"/>
        </svg>
      );
    case 'trip':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-[#0086F6]`} fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      );
    case 'battery':
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-amber-600`} fill="currentColor">
          <path d="M16 20H8V6h8v14zm2-16h-3V2H9v2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={`${className} text-slate-500`} fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      );
  }
};
