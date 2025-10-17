// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://concretecalculatormax.com/sitemap.xml',
    host: 'https://concretecalculatormax.com',
  };
}
