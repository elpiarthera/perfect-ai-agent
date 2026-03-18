import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME, AUTHOR, PUBLISHER_ORG } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  const title = locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'
  const description =
    locale === 'fr'
      ? `Politique de confidentialité de ${SITE_NAME} — comment nous collectons et utilisons vos données.`
      : `Privacy policy for ${SITE_NAME} — how we collect and use your data.`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/privacy`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/privacy`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${locale}/privacy`,
    },
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFR = locale === 'fr'

  if (isFR) {
    return (
      <>
      <Breadcrumb items={[
        { label: 'Accueil', href: `/${locale}` },
        { label: 'Politique de confidentialité' },
      ]} />
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">Légal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            Politique de confidentialité
          </h1>
          <p className="text-muted font-sans">Dernière mise à jour : 14 mars 2026</p>
        </header>

        <div className="prose-chapter text-gray-300 space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-white mb-4">1. Responsable du traitement</h2>
            <p>
              Les données personnelles collectées sur ce site sont traitées par&nbsp;:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
              <li><strong className="text-white">Responsable&nbsp;:</strong> Laurent Perello</li>
              <li><strong className="text-white">Société&nbsp;:</strong> {PUBLISHER_ORG.name}</li>
              <li><strong className="text-white">Site&nbsp;:</strong> perfectaiagent.xyz</li>
              <li>
                <strong className="text-white">Contact&nbsp;:</strong>{' '}
                <a
                  href="mailto:contact@perello.consulting"
                  className="text-accent hover:underline"
                >
                  contact@perello.consulting
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">2. Données collectées</h2>
            <p>Nous collectons uniquement les données suivantes&nbsp;:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
              <li>
                <strong className="text-white">Adresse e-mail</strong> — lors de votre
                inscription à notre newsletter ou pour recevoir l&apos;accès aux chapitres du
                livre.
              </li>
            </ul>
            <p className="mt-4">
              Nous ne collectons pas de données sensibles, de données de géolocalisation, ni
              d&apos;informations de paiement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">3. Finalité du traitement</h2>
            <p>Votre adresse e-mail est utilisée pour&nbsp;:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
              <li>Vous envoyer les chapitres du livre gratuitement</li>
              <li>Vous informer des nouvelles publications et mises à jour du livre</li>
              <li>Vous contacter en lien avec le contenu du site</li>
            </ul>
            <p className="mt-4">
              Base légale&nbsp;: consentement explicite (article 6.1.a du RGPD).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">4. Conservation des données</h2>
            <p>
              Vos données sont conservées jusqu&apos;à votre désinscription ou pendant une
              durée maximale de 3 ans à compter du dernier contact.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">5. Partage des données</h2>
            <p>
              Nous utilisons <strong className="text-white">Resend</strong> comme prestataire
              d&apos;envoi d&apos;e-mails. Votre adresse e-mail est transmise à Resend
              uniquement dans le cadre de l&apos;envoi des communications mentionnées ci-dessus.
              Nous ne vendons pas vos données à des tiers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">6. Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants&nbsp;:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
              <li>Droit d&apos;opposition au traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, écrivez à{' '}
              <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
                contact@perello.consulting
              </a>
              . Vous pouvez également introduire une réclamation auprès de la{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CNIL (nouvelle fenêtre)"
                className="text-accent hover:underline"
              >
                CNIL
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">7. Cookies et traceurs</h2>
            <p>
              Ce site utilise <strong className="text-white">Vercel Analytics</strong> et{' '}
              <strong className="text-white">Vercel Speed Insights</strong> pour mesurer les
              performances. Ces outils n&apos;utilisent pas de cookies de suivi tiers. Aucun
              cookie publicitaire n&apos;est déposé.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">8. Contact</h2>
            <p>
              Pour toute question relative à cette politique ou au traitement de vos données,
              contactez-nous à{' '}
              <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
                contact@perello.consulting
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link
            href={`/${locale}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </article>
      </>
    )
  }

  // English version
  return (
    <>
    <Breadcrumb items={[
      { label: 'Home', href: `/${locale}` },
      { label: 'Privacy Policy' },
    ]} />
    <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      <header className="mb-12">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-muted font-sans">Last updated: March 14, 2026</p>
      </header>

      <div className="prose-chapter text-gray-300 space-y-8">
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">1. Data Controller</h2>
          <p>
            Personal data collected on this site is processed by:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
            <li><strong className="text-white">Controller:</strong> {AUTHOR.name}</li>
            <li><strong className="text-white">Company:</strong> {PUBLISHER_ORG.name}</li>
            <li><strong className="text-white">Website:</strong> perfectaiagent.xyz</li>
            <li>
              <strong className="text-white">Contact:</strong>{' '}
              <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
                contact@perello.consulting
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">2. Data We Collect</h2>
          <p>We collect only the following data:</p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
            <li>
              <strong className="text-white">Email address</strong> — when you sign up for our
              newsletter or to receive access to the book chapters.
            </li>
          </ul>
          <p className="mt-4">
            We do not collect sensitive data, location data, or payment information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">3. Purpose of Processing</h2>
          <p>Your email address is used to:</p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
            <li>Send you the book chapters for free</li>
            <li>Notify you of new chapters and updates</li>
            <li>Contact you about site content</li>
          </ul>
          <p className="mt-4">
            Legal basis: explicit consent (GDPR Article 6.1.a).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">4. Data Retention</h2>
          <p>
            Your data is retained until you unsubscribe or for a maximum of 3 years from last
            contact.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">5. Data Sharing</h2>
          <p>
            We use <strong className="text-white">Resend</strong> as our email delivery
            provider. Your email address is shared with Resend solely for the purpose of sending
            communications described above. We do not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">6. Your Rights (GDPR)</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
            <li>Right of access to your data</li>
            <li>Right of rectification</li>
            <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
            <li>Right to object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, write to{' '}
            <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
              contact@perello.consulting
            </a>
            . You may also file a complaint with your national data protection authority (in
            France: the{' '}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CNIL (opens in new window)"
              className="text-accent hover:underline"
            >
              CNIL
            </a>
            ).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">7. Cookies and Tracking</h2>
          <p>
            This site uses <strong className="text-white">Vercel Analytics</strong> and{' '}
            <strong className="text-white">Vercel Speed Insights</strong> for performance
            measurement. These tools do not use third-party tracking cookies. No advertising
            cookies are set.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">8. Contact</h2>
          <p>
            For any questions about this policy or our data processing, contact us at{' '}
            <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
              contact@perello.consulting
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-800">
        <Link
          href={`/${locale}`}
          className="text-muted hover:text-white transition-colors font-sans text-sm"
        >
          ← Back to home
        </Link>
      </div>
    </article>
    </>
  )
}
