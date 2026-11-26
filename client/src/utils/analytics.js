/**
 * Central Google Analytics (GA4) helper for page views and activity events.
 * Never send PII (phone numbers, emails, names, PANs) in event parameters.
 */

const cleanParams = (params = {}) => {
  const sanitized = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

export const trackPageView = (path) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !eventName) return;
  window.gtag('event', eventName, cleanParams(params));
};
