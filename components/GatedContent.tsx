import EmailCapture from './EmailCapture'

export default function GatedContent({
  preview,
  locale,
}: {
  preview: string
  locale: string
}) {
  // Show first ~3 paragraphs blurred, then email capture
  const lines = preview.split('\n').filter(Boolean).slice(0, 6).join('\n\n')

  return (
    <div>
      {/* Blurred preview */}
      <div className="prose-chapter text-gray-300 gated-blur pointer-events-none select-none mb-0">
        <div dangerouslySetInnerHTML={{ __html: lines.replace(/\n\n/g, '</p><p>') }} />
      </div>

      {/* Email gate */}
      <div className="border-t border-gray-800 pt-16 mt-4">
        <EmailCapture locale={locale} />
      </div>
    </div>
  )
}
