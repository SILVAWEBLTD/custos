import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppProviders } from '@/components/Providers/AppProviders';
import { locales, type Locale } from '@/i18n';

const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

type LocaleLayoutProps = {
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale;

  setRequestLocale(resolvedLocale);
  const messages = await getMessages({ locale: resolvedLocale });

  return (
    <NextIntlClientProvider key={resolvedLocale} locale={resolvedLocale} messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
