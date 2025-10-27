import { getRequestConfig } from 'next-intl/server';

export { defaultLocale, localePrefix, locales, pathnames } from '@/i18n/i18n-config';
export type { Locale } from '@/i18n/i18n-config';

import { defaultLocale, locales, type Locale } from '@/i18n/i18n-config';

export default getRequestConfig(async ({ locale }) => {
  const requestedLocale = locale as Locale | undefined;
  const resolvedLocale =
    requestedLocale && locales.includes(requestedLocale) ? requestedLocale : defaultLocale;

  const messages = (await import(`@/locales/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages,
  };
});
