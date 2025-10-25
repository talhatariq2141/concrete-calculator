import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = "concretecalculatormax.com";

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `https://${host}/sitemap.xml`,
    host, // domain only per spec
  };
}
