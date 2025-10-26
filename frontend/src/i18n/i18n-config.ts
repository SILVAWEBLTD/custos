import type { LocalePrefix, Pathnames } from 'next-intl/routing';

export const locales = ['en', 'es', 'fr', 'zh'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localePrefix: LocalePrefix = 'always';

export const pathnames = {
  '/': '/',
  '/portfolio': {
    en: '/portfolio',
    es: '/cartera',
    fr: '/portefeuille',
    zh: '/投资组合',
  },
  '/explore': {
    en: '/explore',
    es: '/explorar',
    fr: '/explorer',
    zh: '/探索',
  },
  '/swap': {
    en: '/swap',
    es: '/intercambiar',
    fr: '/echanger',
    zh: '/兑换',
  },
  '/tokens': {
    en: '/tokens',
    es: '/tokens',
    fr: '/jetons',
    zh: '/代币',
  },
  '/pool': {
    en: '/pool',
    es: '/fondo',
    fr: '/piscine',
    zh: '/资金池',
  },
  '/about': {
    en: '/about',
    es: '/acerca-de',
    fr: '/a-propos',
    zh: '/关于',
  },
  '/docs': {
    en: '/docs',
    es: '/documentos',
    fr: '/docs',
    zh: '/文档',
  },
  '/support': {
    en: '/support',
    es: '/soporte',
    fr: '/support',
    zh: '/支持',
  },
  '/faq': {
    en: '/faq',
    es: '/preguntas-frecuentes',
    fr: '/faq',
    zh: '/常见问题',
  },
  '/privacy-policy': {
    en: '/privacy-policy',
    es: '/politica-de-privacidad',
    fr: '/politique-de-confidentialite',
    zh: '/隐私政策',
  },
} as const satisfies Pathnames<typeof locales>;
