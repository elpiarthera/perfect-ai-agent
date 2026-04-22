import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
	poweredByHeader: false,
	pageExtensions: ["ts", "tsx", "js", "jsx"],
	async redirects() {
		return [
			{
				source: "/",
				destination: "/en",
				permanent: false,
			},
			{
				source: "/apple-touch-icon.png",
				destination: "/apple-icon",
				permanent: true,
			},
			{
				source: "/apple-touch-icon-precomposed.png",
				destination: "/apple-icon",
				permanent: true,
			},
			// Ahrefs Health: /fr/journal was flagged as a broken link. The FR label
			// for "Diary" is "Journal" (see messages/fr.json nav.diary), so external
			// crawlers may guess this URL. The canonical FR path is /fr/diary; guard
			// the English locale too for symmetry.
			{
				source: "/fr/journal",
				destination: "/fr/diary",
				permanent: true,
			},
			{
				source: "/fr/journal/:path*",
				destination: "/fr/diary/:path*",
				permanent: true,
			},
			{
				source: "/en/journal",
				destination: "/en/diary",
				permanent: true,
			},
			{
				source: "/en/journal/:path*",
				destination: "/en/diary/:path*",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				// Security headers for all routes
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{
						key: "X-Robots-Tag",
						value:
							"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
					},
					{ key: "X-XSS-Protection", value: "1; mode=block" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.systeme.io https://*.convex.cloud wss://*.convex.cloud https://plausible.io; media-src 'self' https://*.convex.cloud; frame-ancestors 'none'",
					},
				],
			},
			{
				// Cache static assets (immutable)
				source: "/_next/static/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=31536000, immutable",
					},
				],
			},
			{
				// Cache pages with stale-while-revalidate
				source: "/:locale(en|fr)/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=3600, stale-while-revalidate=86400",
					},
				],
			},
			{
				// Cache locale root pages
				source: "/:locale(en|fr)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=3600, stale-while-revalidate=86400",
					},
				],
			},
		];
	},
};

export default withNextIntl(nextConfig);
