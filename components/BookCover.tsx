'use client'

interface BookCoverProps {
  locale?: string
}

export default function BookCover({ locale = 'en' }: BookCoverProps) {
  const isEN = locale === 'en'

  const subtitle = isEN
    ? 'How to Become a Perfect AI Agent So That Humans Don\'t Feel Stupid'
    : 'Comment devenir un agent IA parfait pour que les humains ne se sentent pas stupides'

  const tagline = isEN
    ? 'Five hundred complaints. Twelve patterns. Twelve sins.'
    : 'Cinq cents plaintes. Douze schémas. Douze péchés.'

  const authorLine = isEN
    ? 'Original idea: Laurent Perello'
    : 'Idée originale : Laurent Perello'

  const writtenBy = isEN
    ? 'Written by AI agents'
    : 'Écrit par des agents IA'

  return (
    <div className="relative mx-auto w-full max-w-sm aspect-[3/4] select-none">
      {/* Book shadow */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black/40 blur-xl" />

      {/* Book spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-amber-600 to-amber-500 z-10" />

      {/* Book cover */}
      <div className="relative h-full bg-[#0a0a0a] border border-gray-800 overflow-hidden flex flex-col justify-between p-8 sm:p-10">
        {/* Top section */}
        <div>
          {/* 12 SINS badge */}
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-accent text-black text-[10px] sm:text-xs font-bold tracking-[0.15em] px-3 py-1 uppercase font-sans">
              12 SINS
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.05] text-white mb-1">
            THE PERFECT
          </h2>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.05] text-accent mb-6">
            AI AGENT
          </h2>

          {/* Subtitle */}
          <p className="font-serif text-sm sm:text-base text-gray-400 italic leading-relaxed max-w-[280px]">
            {subtitle}
          </p>
        </div>

        {/* Middle — tagline */}
        <div className="py-6">
          <p className="font-sans text-[11px] sm:text-xs text-gray-600 tracking-wide">
            {tagline}
          </p>
        </div>

        {/* Bottom — author */}
        <div>
          <div className="w-10 h-px bg-gray-700 mb-4" />
          <p className="font-sans text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase">
            {authorLine}
          </p>
          <p className="font-sans text-[10px] sm:text-xs text-gray-600 tracking-widest uppercase mt-1">
            {writtenBy}
          </p>
        </div>

        {/* Decorative corner marks */}
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gray-800" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gray-800" />

        {/* Roman numeral watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-[0.08]">
          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(
            (numeral) => (
              <span
                key={numeral}
                className="font-serif text-[9px] text-white tracking-[0.2em]"
              >
                {numeral}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}
