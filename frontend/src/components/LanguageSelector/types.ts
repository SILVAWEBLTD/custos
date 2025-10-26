import type { Locale } from '@/i18n';

export type HandleLocaleChangeConfig = {
  skipStateUpdate?: boolean;
};

export type LanguageOption = {
  value: Locale;
  label: string;
};
