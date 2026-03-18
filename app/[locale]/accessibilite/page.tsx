import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Déclaration d\'accessibilité',
    description: 'Déclaration d\'accessibilité de perfectaiagent.xyz — état de conformité RGAA 4.1.2 et voies de recours.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/accessibilite`,
      languages: {
        en: `${SITE_URL}/en/accessibility`,
        fr: `${SITE_URL}/fr/accessibilite`,
      },
    },
    openGraph: {
      type: 'website',
      title: 'Déclaration d\'accessibilité',
      description: 'Déclaration d\'accessibilité de perfectaiagent.xyz — état de conformité RGAA 4.1.2.',
      url: `${SITE_URL}/${locale}/accessibilite`,
    },
  }
}

export default async function AccessibilitePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
    <Breadcrumb items={[
      { label: 'Accueil', href: `/${locale}` },
      { label: 'Déclaration d\'accessibilité' },
    ]} />
    <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      <header className="mb-12">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">Légal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
          Déclaration d&apos;accessibilité
        </h1>
        <p className="text-muted font-sans">Publiée le 18 mars 2026 — Mise à jour le 18 mars 2026</p>
      </header>

      <div className="prose-chapter text-gray-300 space-y-8">
        <section>
          <h2 className="font-serif text-2xl text-white mb-4">État de conformité</h2>
          <p>
            <strong className="text-white">perfectaiagent.xyz</strong>, édité par ElPi Corp, est{' '}
            <strong className="text-white">partiellement conforme</strong> avec le Référentiel Général
            d&apos;Amélioration de l&apos;Accessibilité (RGAA) 4.1.2.
          </p>
          <p className="mt-3">
            Taux de conformité&nbsp;: <strong className="text-accent">58 %</strong> (31 critères conformes sur 53 applicables).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Technologies utilisées</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-400">
            <li>HTML5</li>
            <li>CSS3 (Tailwind CSS)</li>
            <li>JavaScript (Next.js 15, React)</li>
            <li>JSON-LD (Schema.org)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Pages ayant fait l&apos;objet de la vérification</h2>
          <ol className="list-decimal pl-6 space-y-1 text-gray-400">
            <li>Page d&apos;accueil — <code>/en</code> et <code>/fr</code></li>
            <li>Index des chapitres — <code>/en/chapters</code></li>
            <li>Page de chapitre — <code>/en/chapters/prologue</code> et <code>/fr/chapters/prologue</code></li>
            <li>Politique de confidentialité — <code>/en/privacy</code></li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Contenus non accessibles</h2>
          <p>Les non-conformités suivantes ont été identifiées&nbsp;:</p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-gray-400">
            <li>
              <strong className="text-white">Champ email sans label accessible</strong> (Critère 11.1, 11.2) — Le
              champ email de la newsletter ne disposait pas d&apos;association programmatique à un label.{' '}
              <span className="text-accent">Corrigé le 18 mars 2026.</span>
            </li>
            <li>
              <strong className="text-white">Absence de lien d&apos;évitement</strong> (Critère 12.7) — Aucun
              mécanisme permettant aux utilisateurs clavier de sauter la navigation.{' '}
              <span className="text-accent">Corrigé le 18 mars 2026.</span>
            </li>
            <li>
              <strong className="text-white">Contraste insuffisant sur les textes secondaires</strong> (Critère 3.2) —
              Certains textes de sous-titres et légendes utilisaient des couleurs avec un ratio de contraste
              inférieur au seuil AA (4,5:1).
            </li>
            <li>
              <strong className="text-white">Hiérarchie des titres incohérente</strong> (Critère 9.1) — Sur la page
              d&apos;accueil, des éléments h2 apparaissaient avant le h1. Sur l&apos;index des chapitres, la
              hiérarchie sautait le niveau h2.
            </li>
            <li>
              <strong className="text-white">Titre de page non traduit sur les pages françaises</strong> (Critère 8.6) —
              L&apos;élément &lt;title&gt; restait en anglais sur les pages en langue française.
            </li>
            <li>
              <strong className="text-white">Rendu serveur partiel sur les pages de chapitres</strong> (Critère 8.3) —
              Les pages de chapitres retournaient un shell HTML sans attribut <code>lang</code> avant l&apos;hydratation
              JavaScript, affectant les lecteurs d&apos;écran.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Dérogations</h2>
          <p>Aucune dérogation n&apos;est invoquée.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Contact</h2>
          <p>
            Si vous ne pouvez pas accéder à un contenu ou à un service, vous pouvez contacter le responsable
            du site pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
          </p>
          <p className="mt-3">
            <strong className="text-white">Email&nbsp;:</strong>{' '}
            <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
              contact@perello.consulting
            </a>
          </p>
          <p className="mt-1">
            <strong className="text-white">Responsable du site&nbsp;:</strong> Laurent Perello / ElPi Corp
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-white mb-4">Voies de recours</h2>
          <p>
            Si vous signalez un défaut d&apos;accessibilité et ne recevez pas de réponse satisfaisante dans un
            délai raisonnable, vous pouvez adresser votre réclamation à&nbsp;:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
            <li>
              <a
                href="https://formulaire.defenseurdesdroits.fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Défenseur des droits — formulaire en ligne (nouvelle fenêtre)"
                className="text-accent hover:underline"
              >
                Défenseur des droits — formulaire en ligne{' '}
                <span aria-hidden="true" className="text-muted text-sm">(nouvelle fenêtre)</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.defenseurdesdroits.fr/saisir/delegues"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Le délégué du Défenseur des droits dans votre région (nouvelle fenêtre)"
                className="text-accent hover:underline"
              >
                Le délégué du Défenseur des droits dans votre région{' '}
                <span aria-hidden="true" className="text-muted text-sm">(nouvelle fenêtre)</span>
              </a>
            </li>
            <li>
              Par courrier postal (gratuit, sans timbre)&nbsp;:<br />
              <address className="not-italic mt-1 text-gray-400">
                Défenseur des droits<br />
                Libre réponse 71120<br />
                75342 Paris CEDEX 07
              </address>
            </li>
          </ul>
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
