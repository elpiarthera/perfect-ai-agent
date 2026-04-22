import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

// Explicit metadata for the 404 page prevents Next.js from emitting its
// default `<title>404: This page could not be found.</title>` on top of the
// root layout's template title — Ahrefs flagged the duplicate `<title>` tag.
export const metadata: Metadata = {
	// `absolute` bypasses the root layout's `title.template` suffix.
	title: { absolute: "Page not found — How to Become a Perfect AI Agent" },
	description:
		"The page you are looking for does not exist. Return to the home page to continue reading.",
	robots: {
		index: false,
		follow: true,
	},
	alternates: {
		canonical: `${SITE_URL}/en`,
	},
};

export default function NotFound() {
	return (
		<div className="max-w-2xl mx-auto px-6 pt-24 pb-24 text-center">
			<p className="text-accent text-xs uppercase tracking-widest font-sans mb-4">
				404
			</p>
			<h1 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
				Page not found
			</h1>
			<p className="text-gray-400 font-sans mb-10">
				The page you are looking for does not exist or has moved. Try the home
				page, the chapter list, or the diary.
			</p>
			<div className="flex flex-wrap justify-center gap-4 text-sm font-sans">
				<Link
					href="/en"
					className="border border-accent text-accent px-6 py-3 hover:bg-accent hover:text-black transition-colors"
				>
					Home
				</Link>
				<Link
					href="/en/chapters"
					className="border border-gray-700 text-gray-300 px-6 py-3 hover:border-gray-500 transition-colors"
				>
					Chapters
				</Link>
				<Link
					href="/en/diary"
					className="border border-gray-700 text-gray-300 px-6 py-3 hover:border-gray-500 transition-colors"
				>
					AI Diary
				</Link>
			</div>
		</div>
	);
}
