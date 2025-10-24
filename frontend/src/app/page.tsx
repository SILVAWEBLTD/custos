import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/custos-logo.svg"
          alt="Custos logo"
          width={160}
          height={160}
          priority
        />

        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-4xl text-left max-w-xl mb-4">
          custos.space
        </h1>
        <p className="max-w-xl text-md text-muted-foreground text-justify">
          <b className="text-gray-400">Custos which is coming soon</b> is a
          next-generation decentralized finance (DeFi) platform designed to
          deliver core financial DEX functionalities such as liquidity
          provision, staking, trading, and asset pooling within the
          EVM-compatible blockchain ecosystem.
        </p>
        <p className="max-w-xl text-md text-muted-foreground text-justify">
          Our mission is to create a powerful, secure, user-friendly
          decentralized exchange (DEX) built on transparency, security, and
          efficiency.
        </p>
      </div>
    </main>
  );
}
