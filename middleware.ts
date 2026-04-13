import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./lib/i18n";

const intlMiddleware = createMiddleware({
	locales,
	defaultLocale,
});

export default function middleware(request: NextRequest) {
	const response = intlMiddleware(request);

	// Remove restrictive cache headers that next-intl sets,
	// so that statically generated pages can be cached by the CDN.
	// API routes and dynamic routes will set their own headers.
	response.headers.delete("cache-control");
	response.headers.delete("x-middleware-cache");

	return response;
}

export const config = {
	matcher: [
		"/((?!_next|feed\\.xml|robots\\.txt|llms\\.txt|llms-full\\.txt|opengraph-image|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml)).*)",
	],
};
