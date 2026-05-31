import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/graj/'],
      },
    ],
    sitemap: 'https://pokero.pl/sitemap.xml',
  };
}
