// app/sitemap.ts

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://concretecalculatormax.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/beam-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/column-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/concrete-yards-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/footing-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/staircase-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/calculators/wall-concrete-calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://concretecalculatormax.com/about-us',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    { url: 'https://concretecalculatormax.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5, 
    },
    { url: 'https://concretecalculatormax.com/terms-of-service', 
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5, 
    },
  ];
}