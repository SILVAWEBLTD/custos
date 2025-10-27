import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { LanguageSelector } from '@/components/LanguageSelector';
import { FlipWords } from '@/components/ui/flip-words';
import type { Locale } from '@/i18n';

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  const flipWordKeys = ['space', 'defi', 'dex', 'ai'] as const;
  const flipWords = flipWordKeys.map((key) => t(`flipWords.${key}`));

  return (
    <main className="flex min-h-screen flex-col bg-black px-4 py-10 text-center">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <div className="mb-6 flex w-full justify-end">
          <LanguageSelector />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <Image src="/custos-logo.svg" alt={t('brand')} width={160} height={160} priority />

            <h1 className="mb-4 flex max-w-xl flex-wrap items-center bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-left text-4xl font-bold text-transparent md:text-4xl">
              <span>{t('brand')}</span>
              <FlipWords words={flipWords} className="ml-[-4px] text-4xl text-white" />
            </h1>

            <p className="text-md text-muted-foreground max-w-xl text-justify">
              <b className="text-gray-400">{t('introHighlight')}</b> {t('introText')}
            </p>
            <p className="text-md text-muted-foreground max-w-xl text-justify">{t('mission')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
