import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/constants';

// In a real application, you would fetch dynamic portfolio/blog slugs from your CMS here
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/portfolio',
    '/about',
    '/contact',
    '/weddings',
    '/engagement',
    '/portraits',
    '/events',
    '/pricing',
    '/faq'
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
