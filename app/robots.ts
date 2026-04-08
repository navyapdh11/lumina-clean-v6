import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard', '/api/', '/sign-in', '/sign-up'],
    },
    sitemap: 'https://perth-clean-v6.vercel.app/sitemap.xml',
  };
}
