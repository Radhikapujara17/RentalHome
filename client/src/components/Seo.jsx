import { useEffect } from 'react';

const DEFAULT_SITE_NAME = 'RentNest';
const DEFAULT_TITLE = 'RentNest — Zero Brokerage Rental Homes & Commercial Spaces in Gujarat';
const DEFAULT_DESCRIPTION =
  "Rajkot & Gujarat's transparent rental marketplace with verified PGVCL electricity meters, water supply reality, and zero hidden costs.";

export const getSiteUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'http://localhost:5173';
};

const upsertMetaTag = (selector, attributes, content) => {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector(selector);
  if (!content) {
    if (element) element.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, val]) => {
      element.setAttribute(key, val);
    });
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertCanonicalLink = (href) => {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (link) link.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const upsertJsonLd = (data) => {
  if (typeof document === 'undefined') return;
  const existing = document.head.querySelector('script[data-seo-jsonld="true"]');
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const script = existing || document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-jsonld', 'true');
  script.textContent = JSON.stringify(data);
  if (!existing) {
    document.head.appendChild(script);
  }
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  ogType = 'website',
  image = '',
  noIndex = false,
  jsonLd = null,
}) => {
  const serializedJsonLd = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const resolvedPath =
      canonicalPath !== undefined
        ? canonicalPath
        : typeof window !== 'undefined'
          ? window.location.pathname
          : '/';
    const normalizedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
    const fullUrl = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;

    document.title = title;

    upsertMetaTag('meta[name="description"]', { name: 'description' }, description);
    upsertMetaTag(
      'meta[name="robots"]',
      { name: 'robots' },
      noIndex ? 'noindex, nofollow' : 'index, follow'
    );

    upsertCanonicalLink(noIndex ? null : fullUrl);

    upsertMetaTag('meta[property="og:site_name"]', { property: 'og:site_name' }, DEFAULT_SITE_NAME);
    upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale' }, 'en_IN');
    upsertMetaTag('meta[property="og:type"]', { property: 'og:type' }, ogType);
    upsertMetaTag('meta[property="og:title"]', { property: 'og:title' }, title);
    upsertMetaTag('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMetaTag('meta[property="og:url"]', { property: 'og:url' }, fullUrl);
    upsertMetaTag('meta[property="og:image"]', { property: 'og:image' }, image);

    upsertMetaTag(
      'meta[name="twitter:card"]',
      { name: 'twitter:card' },
      image ? 'summary_large_image' : 'summary'
    );
    upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    upsertMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, image);

    upsertJsonLd(serializedJsonLd ? JSON.parse(serializedJsonLd) : null);

    return () => {
      upsertJsonLd(null);
    };
  }, [title, description, canonicalPath, ogType, image, noIndex, serializedJsonLd]);

  return null;
};

export default Seo;
