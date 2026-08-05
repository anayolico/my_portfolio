import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, type = 'website' }) => {
  const siteUrl = 'https://anayolico.name.ng';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = `${siteUrl}/hero-3d.png`;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Caleb Anayolico',
    'alternateName': ['Anayolico', 'Caleb Anayo', 'Anayolico Full-Stack Engineer'],
    'url': siteUrl,
    'image': ogImage,
    'jobTitle': 'Full-Stack Engineer & Mobile App Developer',
    'worksFor': {
      '@type': 'Organization',
      'name': 'Self-Employed / Independent Contractor'
    },
    'sameAs': [
      'https://github.com/anayolico',
      'https://nigeria-secure-vote.vercel.app'
    ],
    'knowsAbout': [
      'React.js',
      'Node.js',
      'Express.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Prisma ORM',
      'WebAuthn',
      'PWA'
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Caleb Anayolico — Official Portfolio',
        'item': siteUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Caleb Anayolico — Executive CV & Resume',
        'item': `${siteUrl}/cv`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Caleb Anayolico — Projects Showcase',
        'item': `${siteUrl}/projects`
      }
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Caleb Anayolico" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Caleb Anayolico Portfolio" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Caleb Anayolico — Full-Stack Engineer" />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={fullUrl} />

      {/* JSON-LD Structured Data for Search Engine Indexing */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
