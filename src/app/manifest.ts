import { MetadataRoute } from 'next';
import { SEO_CONSTANTS } from '@/lib/seo/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONSTANTS.siteName,
    short_name: SEO_CONSTANTS.author,
    description: SEO_CONSTANTS.description,
    start_url: '/',
    display: 'standalone',
    background_color: SEO_CONSTANTS.themeColor,
    theme_color: SEO_CONSTANTS.themeColor,
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
