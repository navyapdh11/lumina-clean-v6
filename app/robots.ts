import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard', '/api/', '/sign-in', '/sign-up'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://perthclean.com.au'}/sitemap.xml`,
  };
}
