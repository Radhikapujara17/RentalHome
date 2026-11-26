const Property = require('../models/Property');

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const resolveSiteBaseUrl = (req) => {
  const configured = process.env.CLIENT_URL;
  if (configured && configured.trim() && !configured.includes('localhost')) {
    return configured.trim().replace(/\/+$/, '');
  }
  const forwardedProto = req.get('x-forwarded-proto');
  const forwardedHost = req.get('x-forwarded-host');
  if (forwardedHost) {
    return `${forwardedProto || req.protocol}://${forwardedHost}`.replace(/\/+$/, '');
  }
  if (configured && configured.trim()) {
    return configured.trim().replace(/\/+$/, '');
  }
  return `${req.protocol}://${req.get('host')}`.replace(/\/+$/, '');
};

exports.getRobotsTxt = (req, res) => {
  const baseUrl = resolveSiteBaseUrl(req);
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /admin',
    'Disallow: /post-property',
    'Disallow: /edit-property',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n');

  res.type('text/plain').send(content);
};

exports.getSitemapXml = async (req, res) => {
  const baseUrl = resolveSiteBaseUrl(req);
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { path: '/', changefreq: 'daily', priority: '1.0', lastmod: today },
    { path: '/explore', changefreq: 'hourly', priority: '0.9', lastmod: today },
    { path: '/explore?category=commercial', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/explore?city=Rajkot', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/explore?city=Ahmedabad', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/explore?city=Surat', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/explore?city=Vadodara', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/roommates', changefreq: 'daily', priority: '0.8', lastmod: today },
    { path: '/tools/hra-calculator', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/tools/rental-agreement', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/tools/move-in-checklist', changefreq: 'monthly', priority: '0.6', lastmod: today },
  ];

  let properties = [];
  try {
    properties = await Property.find({
      status: 'active',
      isQuarantined: { $ne: true },
    })
      .select('slug _id updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean();
  } catch (err) {
    console.warn('Sitemap property query skipped:', err.message);
  }

  const propertyUrls = properties.map((prop) => {
    const slugOrId = prop.slug || prop._id;
    const lastmodDate = prop.updatedAt || prop.createdAt;
    const lastmod = lastmodDate ? new Date(lastmodDate).toISOString().split('T')[0] : today;
    return {
      path: `/property/${slugOrId}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod,
    };
  });

  const allUrls = [...staticRoutes, ...propertyUrls];
  const urlEntries = allUrls
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${baseUrl}${entry.path}`)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.set('Cache-Control', 'public, max-age=3600');
  res.type('application/xml').send(xml);
};
