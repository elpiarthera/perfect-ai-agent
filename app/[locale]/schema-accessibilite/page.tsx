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
  const title = 'Schéma pluriannuel d\'accessibilité numérique 2026–2028'
  const description = 'Schéma pluriannuel d\'accessibilité numérique de perfectaiagent.xyz — feuille de route RGAA 4.1.2 et gouvernance pour la période 2026–2028.'

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/schema-accessibilite`,
      languages: {
        en: `${SITE_URL}/en/accessibility-plan`,
        fr: `${SITE_URL}/fr/schema-accessibilite`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${locale}/schema-accessibilite`,
    },
  }
}

export default async function SchemaAccessibilitePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <Breadcrumb items={[
        { label: 'Accueil', href: `/${locale}` },
        { label: 'Accessibilité', href: `/${locale}/accessibilite` },
        { label: 'Schéma pluriannuel' },
      ]} />
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">Légal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            Schéma pluriannuel d&apos;accessibilité numérique
          </h1>
          <p className="text-accent font-sans font-medium">2026–2028</p>
          <p className="text-muted font-sans mt-2">Publié le 18 mars 2026 — Mis à jour le 18 mars 2026</p>
        </header>

        <div className="prose-chapter text-gray-300 space-y-10">

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">1. Mission et contexte réglementaire</h2>
            <p>
              Ce schéma pluriannuel est publié en application de l&apos;
              <strong className="text-white">article 47 de la loi n° 2005-102 du 11 février 2005</strong>{' '}
              pour l&apos;égalité des droits et des chances, la participation et la citoyenneté des personnes
              handicapées, telle que modifiée par la loi n° 2016-1321 du 7 octobre 2016 pour une République
              Numérique.
            </p>
            <p className="mt-3">
              La loi impose aux services de communication publique en ligne et à certains organismes privés
              de rendre leurs contenus numériques accessibles. En tant que site web librement accessible,
              diffusant une œuvre à vocation culturelle et pédagogique,{' '}
              <strong className="text-white">perfectaiagent.xyz</strong> s&apos;engage à la conformité totale
              au{' '}
              <strong className="text-white">Référentiel Général d&apos;Amélioration de l&apos;Accessibilité (RGAA) 4.1.2</strong>.
            </p>
            <p className="mt-3">
              Ce schéma couvre la période <strong className="text-white">2026 à 2028</strong> et fait l&apos;objet
              d&apos;une révision annuelle. Il est complété par la{' '}
              <Link href={`/${locale}/accessibilite`} className="text-accent hover:underline">
                Déclaration d&apos;accessibilité
              </Link>{' '}
              publiée séparément.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">2. Politique d&apos;accessibilité</h2>
            <p>
              <strong className="text-white">perfectaiagent.xyz</strong>, édité par ElPi Corp, s&apos;engage à
              rendre son site accessible à tous les utilisateurs, quels que soient leur handicap ou la
              technologie d&apos;assistance utilisée.
            </p>
            <p className="mt-3">Notre politique repose sur trois engagements&nbsp;:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Amélioration continue</strong> — les problèmes d&apos;accessibilité
                sont traités comme des anomalies, non comme des évolutions différées. Toute nouvelle page
                satisfait le RGAA 4.1.2 avant publication.
              </li>
              <li>
                <strong className="text-white">Transparence</strong> — l&apos;état de conformité, les résultats
                des audits et l&apos;avancement des corrections sont publiés ouvertement sur ce site.
              </li>
              <li>
                <strong className="text-white">Réactivité</strong> — toute réclamation relative à l&apos;accessibilité
                reçoit une réponse substantielle dans un délai de 5 jours ouvrés.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">3. État de conformité actuel</h2>
            <p>
              Au <strong className="text-white">mars 2026</strong>, perfectaiagent.xyz a atteint la{' '}
              <strong className="text-accent">conformité totale</strong> au RGAA 4.1.2.
            </p>
            <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900">
              <dl className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Taux de conformité</dt>
                  <dd className="text-accent font-medium">100&nbsp;% (53/53 critères satisfaits)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Référentiel</dt>
                  <dd className="text-white">RGAA 4.1.2</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Méthode d&apos;audit</dt>
                  <dd className="text-white">Pipeline d&apos;audit IA automatisé</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Dernier audit complet</dt>
                  <dd className="text-white">18 mars 2026</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Prochain audit planifié</dt>
                  <dd className="text-white">Juin 2026 (trimestriel)</dd>
                </div>
              </dl>
            </div>
            <p className="mt-4">
              Voir la{' '}
              <Link href={`/${locale}/accessibilite`} className="text-accent hover:underline">
                Déclaration d&apos;accessibilité complète
              </Link>{' '}
              pour le détail des pages auditées et des anomalies corrigées.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">4. Gouvernance</h2>
            <p>
              perfectaiagent.xyz est exploité en tant que <strong className="text-white">structure individuelle</strong>.
              L&apos;accessibilité est gérée directement par l&apos;éditeur.
            </p>
            <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900 font-sans text-sm space-y-2">
              <div className="flex gap-3">
                <span className="text-muted w-52 shrink-0">Responsable accessibilité</span>
                <span className="text-white">Laurent Perello, ElPi Corp</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted w-52 shrink-0">Mise en œuvre technique</span>
                <span className="text-white">Pipeline d&apos;audit IA (VantageOS)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted w-52 shrink-0">Contact</span>
                <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
                  contact@perello.consulting
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Le pipeline d&apos;audit effectue automatiquement des contrôles RGAA à chaque déploiement.
              Les résultats font l&apos;objet d&apos;une revue manuelle avant toute publication de nouvelle page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">5. Plan d&apos;action Année 1 — 2026</h2>
            <p className="text-sm text-muted mb-4">Objectif&nbsp;: maintenir la conformité totale au RGAA 4.1.2 sur l&apos;ensemble des pages.</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Action</th>
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Calendrier</th>
                  <th className="text-left py-2 text-white font-sans font-medium">État</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 divide-y divide-gray-800">
                <tr>
                  <td className="py-2 pr-4">Re-audits RGAA 4.1.2 trimestriels sur toutes les pages existantes</td>
                  <td className="py-2 pr-4">T2, T3, T4 2026</td>
                  <td className="py-2 text-accent">Planifié</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Contrôle d&apos;accessibilité sur toute nouvelle page avant publication</td>
                  <td className="py-2 pr-4">En continu</td>
                  <td className="py-2 text-green-400">Actif</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Veille sur la publication du RGAA 5 et annonce du calendrier de transition</td>
                  <td className="py-2 pr-4">T3 2026</td>
                  <td className="py-2 text-accent">Planifié</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Mise à jour de la Déclaration d&apos;accessibilité après chaque audit</td>
                  <td className="py-2 pr-4">Après chaque audit</td>
                  <td className="py-2 text-green-400">Actif</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Traitement des réclamations d&apos;accessibilité sous 5 jours ouvrés</td>
                  <td className="py-2 pr-4">En continu</td>
                  <td className="py-2 text-green-400">Actif</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">6. Plan d&apos;action Année 2 — 2027</h2>
            <p className="text-sm text-muted mb-4">Objectif&nbsp;: migration vers le RGAA 5 dès publication&nbsp;; maintien de la couverture pour toutes les nouvelles pages.</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Action</th>
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Calendrier</th>
                  <th className="text-left py-2 text-white font-sans font-medium">État</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 divide-y divide-gray-800">
                <tr>
                  <td className="py-2 pr-4">Analyse d&apos;écart RGAA 5 par rapport au site actuel</td>
                  <td className="py-2 pr-4">T1 2027 (si RGAA 5 publié)</td>
                  <td className="py-2 text-muted">En attente RGAA 5</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Migration RGAA 5 de toutes les pages existantes</td>
                  <td className="py-2 pr-4">T2 2027</td>
                  <td className="py-2 text-muted">En attente RGAA 5</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Extension du pipeline d&apos;audit automatisé aux critères RGAA 5</td>
                  <td className="py-2 pr-4">T1–T2 2027</td>
                  <td className="py-2 text-muted">En attente RGAA 5</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Conformité RGAA 5 pour toutes les nouvelles pages</td>
                  <td className="py-2 pr-4">Dès T3 2027</td>
                  <td className="py-2 text-muted">Planifié</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">7. Plan d&apos;action Année 3 — 2028</h2>
            <p className="text-sm text-muted mb-4">Objectif&nbsp;: conformité totale RGAA 5 avec validation par technologies d&apos;assistance.</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Action</th>
                  <th className="text-left py-2 pr-4 text-white font-sans font-medium">Calendrier</th>
                  <th className="text-left py-2 text-white font-sans font-medium">État</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 divide-y divide-gray-800">
                <tr>
                  <td className="py-2 pr-4">Tests manuels avec NVDA + Chrome et VoiceOver + Safari</td>
                  <td className="py-2 pr-4">T1 2028</td>
                  <td className="py-2 text-muted">Planifié</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Audit RGAA 5 complet avec vérification tierce</td>
                  <td className="py-2 pr-4">T2 2028</td>
                  <td className="py-2 text-muted">Planifié</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Publication de la Déclaration d&apos;accessibilité mise à jour avec les résultats 2028</td>
                  <td className="py-2 pr-4">T2 2028</td>
                  <td className="py-2 text-muted">Planifié</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Publication du prochain schéma triennal (2029–2031)</td>
                  <td className="py-2 pr-4">T4 2028</td>
                  <td className="py-2 text-muted">Planifié</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-4">8. Contact</h2>
            <p>
              Pour signaler un problème d&apos;accessibilité, demander un contenu dans un format alternatif ou
              poser des questions sur ce schéma&nbsp;:
            </p>
            <ul className="list-none mt-3 space-y-2">
              <li>
                <strong className="text-white">Email&nbsp;:</strong>{' '}
                <a href="mailto:contact@perello.consulting" className="text-accent hover:underline">
                  contact@perello.consulting
                </a>
              </li>
              <li>
                <strong className="text-white">Éditeur&nbsp;:</strong> Laurent Perello / ElPi Corp
              </li>
            </ul>
            <p className="mt-4">
              En l&apos;absence de réponse satisfaisante, vous pouvez saisir le{' '}
              <a
                href="https://formulaire.defenseurdesdroits.fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Défenseur des droits — formulaire en ligne (nouvelle fenêtre)"
                className="text-accent hover:underline"
              >
                Défenseur des droits{' '}
                <span aria-hidden="true" className="text-muted text-sm">(nouvelle fenêtre)</span>
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
          <Link
            href={`/${locale}/accessibilite`}
            className="text-muted hover:text-white transition-colors font-sans"
          >
            ← Déclaration d&apos;accessibilité
          </Link>
          <Link
            href={`/${locale}`}
            className="text-muted hover:text-white transition-colors font-sans"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </article>
    </>
  )
}
