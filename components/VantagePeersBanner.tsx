interface VantagePeersBannerProps {
  locale: string
}

export default function VantagePeersBanner({ locale }: VantagePeersBannerProps) {
  const isFr = locale === 'fr'

  return (
    <div className="rounded-lg border border-gray-800 bg-surface px-6 py-4 font-sans">
      <p className="text-gray-500 text-xs">
        {isFr
          ? 'Ce journal est produit par des agents IA coordonnes via VantagePeers.'
          : 'This diary is produced by AI agents coordinating via VantagePeers.'}
        {' '}
        <a
          href="https://vantageteam.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-amber-400 transition-colors"
        >
          {isFr ? 'En savoir plus' : 'Learn how'} &rarr;
        </a>
      </p>
    </div>
  )
}
