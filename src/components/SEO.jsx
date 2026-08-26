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
    'jobTitle': 'Full-Stack & Backend Engineer / Mobile Application Developer',
    'worksFor': {
      '@type': 'Organization',
      'name': 'Full-Stack Software Engineer & SaaS Builder'
    },
    'sameAs': [
      'https://github.com/anayolico',
      'https://www.linkedin.com/in/caleb-anayolico-9861a8350'
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
      'PWA',
      'SaaS Architecture'
    ]
  };

  const sitelinksSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Site Navigation Links',
    'itemListElement': [
      {
        '@type': 'SiteNavigationElement',
        'position': 1,
        'name': 'Caleb Anayolico — CV / Resume',
        'description': 'Executive CV and technical resume of Caleb Anayolico.',
        'url': `${siteUrl}/cv`
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 2,
        'name': 'Projects Showcase',
        'description': 'Featured production software and SaaS applications.',
        'url': `${siteUrl}#projects`
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 3,
        'name': 'About Caleb Anayolico',
        'description': 'Background, skills, and full-stack software experience.',
        'url': `${siteUrl}#about`
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 4,
        'name': 'Contact & Collaboration',
        'description': 'Get in touch for software projects and consulting.',
        'url': `${siteUrl}#contact`
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
        {JSON.stringify(sitelinksSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
