// app/sitemap.ts

// app/sitemap.ts
import type { MetadataRoute } from 'next';

// Cache the sitemap for an hour to keep responses stable for crawlers
export const revalidate = 3600;

const base = 'https://concretecalculatormax.com';

// Add ALL your paths here (no trailing slashes)
// Tip: keep this list alphabetical to avoid duplicates creeping in.
const routes = [
  '',                         // homepage
  '/about-us',
  '/privacy-policy',
  '/terms-of-service',
  '/calculators',
  '/calculators/beam-concrete-calculator',
  '/calculators/column-concrete-calculator',
  '/calculators/concrete-yards-calculator',
  '/calculators/footing-concrete-calcualator',
  '/calculators/nominal-mix-m5-m25-calculator',
  '/calculators/pier-caisson-concrete-calculator',
  '/calculators/slab-concrete-calculator',
  '/calculators/staircase-concrete-calculator',
  '/calculators/tank-or-trench-concrete-calculator',
  '/calculators/wall-concrete-calculator',

] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => {
    const isHome = path === '';
    const isCatalog = path === '/calculators';
    const isCalculator = path.startsWith('/calculators/');

    return {
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: isHome || isCatalog ? 'monthly' : 'yearly',
      priority: isHome ? 1 : isCalculator ? 0.8 : 0.5,
    };
  });
}












// import { MetadataRoute } from 'next';

// export default function sitemap(): MetadataRoute.Sitemap {
//   return [
//     {
//       url: 'https://concretecalculatormax.com',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 1,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/beam-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/column-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/concrete-yards-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/footing-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/staircase-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/calculators/wall-concrete-calculator',
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: 'https://concretecalculatormax.com/about-us',
//       lastModified: new Date(),
//       changeFrequency: 'yearly',
//       priority: 0.5,
//     },
//     { url: 'https://concretecalculatormax.com/privacy-policy',
//       lastModified: new Date(),
//       changeFrequency: 'yearly',
//       priority: 0.5, 
//     },
//     { url: 'https://concretecalculatormax.com/terms-of-service', 
//       lastModified: new Date(),
//       changeFrequency: 'yearly',
//       priority: 0.5, 
//     },
//   ];
// }