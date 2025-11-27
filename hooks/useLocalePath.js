"use client";

import { usePathname } from "next/navigation";
import { locales as SUPPORTED_LOCALES, defaultLocale } from "../i18n/config";

export function useLocalePath() {
  const pathname = usePathname();
  const match = pathname.match(/^\/(en|es)(?=\/|$)/);
  const locale = match ? match[1] : null;
  const localePrefix = locale ? `/${locale}` : "";

  const buildHref = (path = "/") => {
    if (!path.startsWith("/")) {
      return path;
    }
    if (path === "/") {
      return localePrefix || "/";
    }
    return `${localePrefix}${path}`.replace(/\/{2,}/g, "/");
  };

  const stripLocale = (path = pathname) => {
    if (!path) return "/";
    if (locale) {
      const without = path.replace(new RegExp(`^/${locale}`), "") || "/";
      return without.startsWith("/") ? without : `/${without}`;
    }
    return path;
  };

  return {
    locale: locale || defaultLocale,
    localePrefix,
    pathname,
    buildHref,
    stripLocale,
    hasLocale: Boolean(locale),
    supportedLocales: SUPPORTED_LOCALES,
  };
}


