import { defineRouting } from 'next-intl/routing';

import { defaultLocale, localePrefix, locales, pathnames } from '@/i18n/i18n-config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames,
  localePrefix,
});
