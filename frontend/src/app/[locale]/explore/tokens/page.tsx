import { getTranslations } from 'next-intl/server';

import { TokensTable } from '@/components/TokensTable';

export default async function ExploreTokensPage() {
  const t = await getTranslations('ExploreTokensPage');

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-12 pb-16">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">{t('subtitle')}</p>
        </header>
        <TokensTable className="shadow-xl" />
      </div>
    </main>
  );
}
