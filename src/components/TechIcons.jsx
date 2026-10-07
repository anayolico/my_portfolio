import React from 'react'

// Authentic brand SVG icons for tech stacks
export function getTechIcon(name = '', className = 'w-5 h-5') {
  const n = name.toLowerCase().trim()

  // HTML5
  if (n.includes('html')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.8 17.5L12 22l6.2-1.5L20 3H4z" fill="#E34F26"/>
        <path d="M12 4.5v15.7l4.8-1.2L18.2 4.5H12z" fill="#EF652A"/>
        <path d="M12 7.7H8.3l.3 3.3H12v2.7H8.7l.3 3.5 3 .8v2.7l-5.6-1.5-.7-8.5h6.3V7.7zm0 5.4h3.3l-.3 3.5-3 .8v2.7l5.6-1.5.6-8.2H12v2.7z" fill="#FFF"/>
      </svg>
    )
  }

  // CSS3 & Sass
  if (n.includes('css') || n.includes('sass')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.8 17.5L12 22l6.2-1.5L20 3H4z" fill="#1572B6"/>
        <path d="M12 4.5v15.7l4.8-1.2L18.2 4.5H12z" fill="#33A9DC"/>
        <path d="M12 7.7H8.3l.3 3.3H12v2.7H8.7l.3 3.5 3 .8v2.7l-5.6-1.5-.7-8.5h6.3V7.7zm0 5.4h3.3l-.3 3.5-3 .8v2.7l5.6-1.5.6-8.2H12v2.7z" fill="#FFF"/>
      </svg>
    )
  }

  // TypeScript
  if (n.includes('typescript') || n === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M11.5 13.2h-2v5.8H7.3v-5.8h-2v-1.9h6.2v1.9zm3 3.6c.5.5 1.1.8 1.8.8.6 0 1-.2 1-.6 0-.4-.4-.6-1.3-.9l-.6-.2c-1.5-.5-2.4-1.2-2.4-2.6 0-1.4 1.1-2.4 2.8-2.4 1.2 0 2.2.4 2.8 1.1l-1.2 1.3c-.4-.4-.9-.7-1.6-.7-.5 0-.8.2-.8.5 0 .3.3.5 1.1.8l.6.2c1.7.6 2.6 1.4 2.6 2.7 0 1.6-1.2 2.5-3 2.5-1.5 0-2.6-.5-3.3-1.4l1.4-1.4z" fill="#FFF"/>
      </svg>
    )
  }

  // JavaScript / ES6+
  if (n.includes('javascript') || (n.includes('js') && !n.includes('react') && !n.includes('node') && !n.includes('next'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M6.5 17.5l2-1.2c.4.7.8 1.2 1.5 1.2.8 0 1.2-.4 1.2-1.3v-6.7h2.5v6.7c0 2.2-1.3 3.3-3.6 3.3-2 0-3.1-1-3.6-2zm8.3-.3l2-1.2c.5.8 1.2 1.3 2.1 1.3.9 0 1.5-.4 1.5-1 0-.7-.5-1-1.6-1.4l-.8-.3c-2-.8-3.3-1.8-3.3-3.8 0-2 1.6-3.4 3.9-3.4 1.8 0 3 .7 3.8 2.2l-2 1.2c-.4-.7-.9-1.1-1.8-1.1-.8 0-1.4.4-1.4.9 0 .6.4.9 1.4 1.3l.8.3c2.3.9 3.5 1.9 3.5 4 0 2.3-1.8 3.6-4.2 3.6-2.4 0-3.9-1.1-4.7-2.6z" fill="#000"/>
      </svg>
    )
  }

  // React & React Native
  if (n.includes('react')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)"/>
        <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
      </svg>
    )
  }

  // Next.js
  if (n.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#000" stroke="#FFF" strokeWidth="0.5"/>
        <path d="M15.5 8.5v7m-7-7v7l7.5-8" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  // Tailwind CSS
  if (n.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C15 11.8 16.5 13.5 20 13.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C17 7.7 15.5 6 12 6zm-8 7.5c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8 1.3 1.3 2.8 3 6.3 3 3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8-1.3-1.3-2.8-3-6.3-3z" fill="#06B6D4"/>
      </svg>
    )
  }

  // MongoDB
  if (n.includes('mongo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C11.5 3.5 7 8 7 13.5c0 4.2 3.2 7.7 5 8.5 1.8-.8 5-4.3 5-8.5C17 8 12.5 3.5 12 2z" fill="#47A248"/>
        <path d="M12 2v20c.3 0 .7-.1 1-.2 1.8-.8 4-4.3 4-8.3 0-5.5-4.5-10-5-11.5z" fill="#499D4A"/>
        <path d="M12 17.5v4.5c-.3 0-.7-.1-1-.2-1.8-.8-4-4.3-4-8.3 0-2 .6-4 1.5-5.8L12 17.5z" fill="#3FA037"/>
      </svg>
    )
  }

  // Node.js & Express
  if (n.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9L12 2z" fill="#339933"/>
        <path d="M12 6.5l5 2.9v5.8l-5 2.9-5-2.9V9.4l5-2.9z" fill="#FFF"/>
      </svg>
    )
  }

  if (n.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 12h16M14 6l6 6-6 6" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="1.5"/>
      </svg>
    )
  }

  // Python
  if (n.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.8 2c-4.2 0-4 1.8-4 1.8l.01 1.9h4.1v.6H5.2S2 5.9 2 10.2c0 4.2 2.8 4.1 2.8 4.1h1.6v-2.3s-.1-2.8 2.7-2.8h4.7s2.7.1 2.7-2.6V4.6S16.8 2 11.8 2zm-1.8 1.4c.4 0 .7.3.7.8s-.3.8-.7.8-.8-.4-.8-.8.4-.8.8-.8z" fill="#3776AB"/>
        <path d="M12.2 22c4.2 0 4-1.8 4-1.8l-.01-1.9h-4.1v-.6h6.7s3.2.4 3.2-3.9c0-4.2-2.8-4.1-2.8-4.1h-1.6v2.3s.1 2.8-2.7 2.8H10.2s-2.7-.1-2.7 2.6v2S7.2 22 12.2 22zm1.8-1.4c-.4 0-.7-.3-.7-.8s.3-.8.7-.8.8.4.8.8-.4.8-.8.8z" fill="#FFD43B"/>
      </svg>
    )
  }

  // FastAPI
  if (n.includes('fastapi')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#009688"/>
        <path d="M13 3L6 14h5l-1 7 7-11h-5l1-7z" fill="#FFF"/>
      </svg>
    )
  }

  // Django
  if (n.includes('django')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#092E20"/>
        <path d="M12.8 5.5h2.5v11.8c-.8.2-1.8.3-2.5.3-2.8 0-4.5-1.5-4.5-4.2 0-2.8 1.8-4.3 4.5-4.3v1.8c-1.5 0-2.3.8-2.3 2.5 0 1.6.8 2.4 2.3 2.4V5.5zm5.5 4.5h2.3v7.6h-2.3V10z" fill="#FFF"/>
      </svg>
    )
  }

  // PostgreSQL & Prisma
  if (n.includes('postgres') || n.includes('sql') || n.includes('prisma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#336791"/>
        <path d="M16.5 15.5c-1.2.9-2.8 1.5-4.5 1.5-3.6 0-6.5-2.5-6.5-6s2.9-6 6.5-6c2.5 0 4.7 1.2 5.8 3.1" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="11" r="2.5" fill="#5AC8FA"/>
      </svg>
    )
  }

  // Java / Kotlin / Android
  if (n.includes('java') || n.includes('android')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M9.5 18.5s-1.8.2-2.5.7c-.8.5 0 1 0 1s3.7.2 6.5-.2c2.2-.3 3.5-.8 3.5-.8s-.8-.5-2.2-.7c-1.8-.3-4.3-.2-5.3.2zm-1.2-2.8s-2.1.4-2.8 1.1c-.8.8.2 1.3.2 1.3s4.2.2 7.7-.3c3-.4 4.3-1.1 4.3-1.1s-.9-.6-2.6-.9c-2.3-.4-5.4-.3-6.8.2zm6.2-7.4c.8.9.5 2-1 3.5-1.9 1.8-2.6 2.8-1.5 4.2.3.4.8.8 1.5 1.1 0 0-1.8-.2-2.8-1.2-1.2-1.2-.6-2.5.9-4 1.8-1.8 1.9-2.5 1.4-3.1-.3-.4-1-.6-1.8-.5.5-.3 2.5-.9 3.3 0z" fill="#E76F00"/>
        <path d="M14.2 3.5c-1 .9-2 2-2 3.5 0 1 .4 1.8 1.1 2.5.6.6 1.3 1.2 1.3 2 0 1.2-1.2 2.2-2.8 2.7.2-.3.4-.6.4-1 0-1.1-.9-2-2-2.9-1.2-1-2-2.2-2-3.7 0-1.7 1.3-3.2 3.5-4.1.9-.4 2-.7 2.5-1.5.1 0 0 1.5 0 2.5z" fill="#5382A1"/>
      </svg>
    )
  }

  // Git / GitHub / CI/CD
  if (n.includes('git') || n.includes('github') || n.includes('ci/cd')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21.7 10.9L13.1 2.3c-.4-.4-1-.4-1.4 0L9.4 4.6l2.3 2.3c.4-.1.8-.1 1.2.1.7.3 1.1.9 1.1 1.6l2.4 1.4c.7-.4 1.6-.3 2.1.3.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.6-.6-.7-1.4-.3-2.1l-2.2-1.3v5.2c.2.2.4.4.5.7.5 1 .1 2.2-.9 2.7-1 .5-2.2.1-2.7-.9-.5-1-.1-2.2.9-2.7.4-.2.8-.2 1.2-.1V8.5c-.4-.1-.8-.3-1.1-.6L9 10.2l-6.7 6.7c-.4.4-.4 1 0 1.4l8.6 8.6c.4.4 1 .4 1.4 0l9.4-9.4c.4-.4.4-1 0-1.4z" fill="#F05032"/>
      </svg>
    )
  }

  // Vercel / Render / VPS / Cloud
  if (n.includes('vercel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 20H2L12 2z" fill="#FFF"/>
      </svg>
    )
  }

  if (n.includes('render') || n.includes('hostinger') || n.includes('vps') || n.includes('deployment')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#46E3B7"/>
        <path d="M6 16V8l6-4 6 4v8l-6 4-6-4z" stroke="#000" strokeWidth="1.5" fill="none"/>
        <path d="M6 8l6 4 6-4M12 12v8" stroke="#000" strokeWidth="1.5"/>
      </svg>
    )
  }

  // AWS / S3 / Cloud Services
  if (n.includes('aws') || n.includes('s3') || n.includes('cloud')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M18.8 14.8c-2.4 1.8-6.1 2.7-9.1 2.7-4.3 0-8.2-1.6-11.1-4.2-.2-.2 0-.5.3-.4 3.1 1.8 7 2.8 11 2.8 2.6 0 5.8-.7 8.5-2.1.4-.3.7.2.4.2z" fill="#FF9900"/>
        <path d="M19.8 13.7c-.3-.4-2-.2-3-.1-.3 0-.3-.3-.1-.4 1.4-.9 3.6-.6 3.9-.2.3.4-.1 2.5-1.4 3.6-.2.2-.4.1-.3-.1.4-.8.9-2.4.9-2.8z" fill="#FF9900"/>
        <path d="M8.2 6.5c-1.3 0-2.3.7-2.7 1.8h-.1V6.8H4v7.7h1.4v-3.7c0-1.8.9-2.9 2.4-2.9 1.3 0 1.9.8 1.9 2.2v4.4h1.4V9.6c0-2-.9-3.1-2.9-3.1z" fill="#FFF"/>
      </svg>
    )
  }

  // Supabase / Clerk
  if (n.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M13.5 2.5L2 14.8h9.8l-1.3 6.7 11.5-12.3h-9.8l1.3-6.7z" fill="#3ECF8E"/>
      </svg>
    )
  }

  if (n.includes('clerk') || n.includes('auth')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#6C47FF"/>
        <path d="M12 6a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4zm-5 6h10v6H7v-6z" fill="#FFF"/>
      </svg>
    )
  }

  // Stripe / Paystack / Flutterwave
  if (n.includes('stripe') || n.includes('paystack') || n.includes('flutterwave') || n.includes('payment')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#635BFF"/>
        <path d="M14.5 10.3c0-.9-.7-1.4-1.9-1.4-1.5 0-2.9.5-3.9 1.1l-.6-2c1.3-.7 2.9-1.1 4.7-1.1 3.2 0 5.2 1.6 5.2 4.4 0 4.1-5.7 3.5-5.7 5.3 0 1 .9 1.4 2.2 1.4 1.7 0 3.3-.6 4.3-1.3l.6 2.1c-1.3.8-3.2 1.3-5.1 1.3-3.3 0-5.5-1.7-5.5-4.4 0-4.3 5.7-3.6 5.7-5.4z" fill="#FFF"/>
      </svg>
    )
  }

  // Figma
  if (n.includes('figma') || n.includes('ui') || n.includes('design')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M8 2h4v5H8a2.5 2.5 0 010-5z" fill="#F24E1E"/>
        <path d="M12 2h4a2.5 2.5 0 010 5h-4V2z" fill="#FF7262"/>
        <path d="M8 7h4v5H8a2.5 2.5 0 010-5z" fill="#A259FF"/>
        <path d="M12 7h4a2.5 2.5 0 010 5h-4V7z" fill="#1ABCFE"/>
        <path d="M8 12h4v5a2.5 2.5 0 01-2.5 2.5A2.5 2.5 0 017 17a2.5 2.5 0 011-5z" fill="#0ACF83"/>
      </svg>
    )
  }

  // Docker
  if (n.includes('docker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M13 10.5h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2H7v-2zm6-3h2v2h-2V7.5zm-3 0h2v2h-2V7.5zm-3 0h2v2H7V7.5zm9 0h2v2h-2V7.5z" fill="#2496ED"/>
        <path d="M22.5 12.3c-.6-.4-1.7-.5-2.6-.1-.2-.8-.7-1.5-1.4-2l-.6-.4-.4.6c-.6.9-.7 2.1-.3 3.1-1 .7-2.3 1.1-4.2 1.1H3c-.6 0-1 .4-1 1 0 3.3 2.7 6 6 6 4.7 0 8.6-3.1 9.8-7.5 1.5-.1 2.8-.7 3.7-1.8l.5-.6-.5-.5z" fill="#2496ED"/>
      </svg>
    )
  }

  // Fallback Code Chip Icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}
