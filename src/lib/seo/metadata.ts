import { Metadata } from 'next';
import { SITE_URL, SEO_CONSTANTS } from './constants';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
}

export function constructMetadata({
  title,
  description,
  image,
  path = '',
  noindex = false,
  type = 'website',
  keywords
}: GenerateMetadataProps = {}): Metadata {
  const customTitle = title ? `${title} | ${SEO_CONSTANTS.siteName}` : SEO_CONSTANTS.title;
  const customDescription = description || SEO_CONSTANTS.description;
  const url = `${SITE_URL}${path}`;
  const customImage = image || `${SITE_URL}/og-image.jpg`;

  return {
    title: customTitle,
    description: customDescription,
    keywords: keywords || SEO_CONSTANTS.keywords,
    authors: [{ name: SEO_CONSTANTS.author }],
    creator: SEO_CONSTANTS.author,
    publisher: SEO_CONSTANTS.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: customTitle,
      description: customDescription,
      url,
      siteName: SEO_CONSTANTS.siteName,
      images: [
        {
          url: customImage,
          width: 1200,
          height: 630,
          alt: customTitle,
        },
      ],
      locale: SEO_CONSTANTS.locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: customTitle,
      description: customDescription,
      creator: SEO_CONSTANTS.twitterHandle,
      images: [customImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
