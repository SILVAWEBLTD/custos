import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { locales, type Locale } from '@/i18n';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
