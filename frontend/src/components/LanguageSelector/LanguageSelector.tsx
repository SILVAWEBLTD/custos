"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

import { usePathname, useRouter } from '@/navigation';
import { locales, type Locale } from '@/i18n';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { HandleLocaleChangeConfig, LanguageOption } from './types';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Language');
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasDetectedBrowserLocale = useRef(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const options = useMemo<LanguageOption[]>(
    () =>
      locales.map((value) => ({
        value,
        label: t(`options.${value}`),
      })),
    [t]
  );

  const handleLocaleChange = useCallback(
    (
      nextLocale: Locale,
      { skipStateUpdate = false }: HandleLocaleChangeConfig = {}
    ) => {
      if (!skipStateUpdate) {
        setSelectedLocale(nextLocale);
      }

      setIsOpen(false);

      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;

      startTransition(() => {
        router.replace(pathname, { locale: nextLocale });
        router.refresh();
      });
    },
    [pathname, router, startTransition]
  );

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (hasDetectedBrowserLocale.current || typeof window === 'undefined') {
      return;
    }

    const existingLocaleCookie = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith('NEXT_LOCALE='));

    if (existingLocaleCookie) {
      hasDetectedBrowserLocale.current = true;
      return;
    }

    const navigatorLocales = navigator.languages?.length
      ? navigator.languages
      : navigator.language
      ? [navigator.language]
      : [];

    const matchedLocale = navigatorLocales
      .map((navLocale) => navLocale.toLowerCase())
      .map((navLocale) => navLocale.split(/[-_]/)[0])
      .find((navLocale) => locales.includes(navLocale as Locale));

    if (matchedLocale && matchedLocale !== locale) {
      hasDetectedBrowserLocale.current = true;
      handleLocaleChange(matchedLocale as Locale, { skipStateUpdate: true });
    } else {
      hasDetectedBrowserLocale.current = true;
    }
  }, [handleLocaleChange, locale]);

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <div className="flex items-center">
        <button
          type="button"
          className="mr-2 inline-flex h-6 w-6 items-center justify-center text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          title={t('label')}
          aria-label={t('label')}
          onClick={() => {
            setIsOpen(true);
            triggerRef.current?.focus();
          }}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
        </button>
        <Select
          value={selectedLocale}
          onValueChange={(value) => handleLocaleChange(value as Locale)}
          open={isOpen}
          onOpenChange={setIsOpen}
          disabled={isPending}
        >
          <SelectTrigger
            ref={triggerRef}
            className="min-w-[160px] border-gray-700 bg-black/80 text-sm text-white hover:bg-gray-900 focus-visible:ring-gray-500"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-black/95 text-white">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
