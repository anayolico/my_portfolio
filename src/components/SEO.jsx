import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, type = 'website' }) => {
  const siteUrl = 'https://anayolico.name.ng';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = `${siteUrl}/hero-3d.png`;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'CaleByte',
    'alternateName': ['CaleByte Technologies', 'CaleByte Technology', 'Caleb Anayolico', 'Caleb Anayo'],
    'url': siteUrl,
    'image': ogImage,
    'jobTitle': 'Full-Stack & Backend Software Engineer | Mobile Application Developer | Cloud Infrastructure Architect',
    'worksFor': {
      '@type': 'Organization',
      'name': 'CaleByte Technologies'
    },
    'sameAs': [
      'https://github.com/anayolico',
      'https://www.linkedin.com/in/caleb-anayolico-9861a8350'
    ],
    'knowsAbout': [
      'Full-Stack Web Development',
      'Backend Architecture',
      'React.js & Next.js',
      'Node.js & Express.js',
      'Python & FastAPI',
      'PostgreSQL & Prisma ORM',
      'React Native & Mobile App Development',
      'Cloud Infrastructure & DevOps',
      'WebAuthn & Biometric Security',
      'SaaS Platforms'
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
      <meta name="author" content="CaleByte Technologies" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="CaleByte Technologies" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="CaleByte Technologies — Better Code. Smarter Solutions." />

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
