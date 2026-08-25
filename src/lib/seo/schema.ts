import { SEO_CONSTANTS, SITE_URL } from './constants';

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SEO_CONSTANTS.siteName,
    image: `${SITE_URL}/og-image.jpg`,
    '@id': `${SITE_URL}/#organization`,
    url: SITE_URL,
    telephone: SEO_CONSTANTS.contact.phone,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SEO_CONSTANTS.address.streetAddress,
      addressLocality: SEO_CONSTANTS.address.addressLocality,
      addressRegion: SEO_CONSTANTS.address.addressRegion,
      postalCode: SEO_CONSTANTS.address.postalCode,
      addressCountry: SEO_CONSTANTS.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SEO_CONSTANTS.geo.latitude,
      longitude: SEO_CONSTANTS.geo.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'New York City' },
      { '@type': 'City', name: 'Brooklyn' },
      { '@type': 'City', name: 'Manhattan' },
      { '@type': 'State', name: 'New York' },
      { '@type': 'Country', name: 'United States' }
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ],
      opens: '09:00',
      closes: '18:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '128'
    },
    knowsAbout: [
      'Wedding Photography',
      'Portrait Photography',
      'Event Photography',
      'Engagement Photography',
      'Fine Art Photography'
    ],
    sameAs: Object.values(SEO_CONSTANTS.socials),
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SEO_CONSTANTS.author,
    url: SITE_URL,
    image: `${SITE_URL}/profile.jpg`,
    sameAs: Object.values(SEO_CONSTANTS.socials),
    jobTitle: 'Professional Photographer',
    description: SEO_CONSTANTS.description,
    knowsAbout: [
      'Wedding Photography',
      'Portrait Photography',
      'Event Photography',
      'Fine Art Editorial'
    ],
    award: [
      'Top 10 Wedding Photographers in US - 2025',
      'Awwwards Best Photography Portfolio'
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'New York Academy of Art'
    },
    worksFor: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.siteName,
    },
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONSTANTS.siteName,
    url: SITE_URL,
    description: SEO_CONSTANTS.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// GEO-Specific: Citable Article Schema for Blogs
export function generateArticleSchema({
  title,
  headline,
  image,
  datePublished,
  dateModified,
  authorName = SEO_CONSTANTS.author,
}: {
  title: string;
  headline: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL,
    },
    headline,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

// EEAT-Specific: Review Schema for Trust Signals
export function generateReviewSchema(reviews: { author: string; rating: number; body: string }[]) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
    },
    reviewBody: review.body,
    itemReviewed: {
      '@type': 'ProfessionalService',
      name: SEO_CONSTANTS.siteName,
    }
  }));
}
