const SITE_URL = "https://concretecalculatormax.com";

export function categoryPagePath(slug: string, page: number): string {
  return page <= 1
    ? `/blog/category/${slug}`
    : `/blog/category/${slug}?page=${page}`;
}

export function categoryPageUrl(slug: string, page: number): string {
  return new URL(categoryPagePath(slug, page), SITE_URL).toString();
}

type BuildCategoryPaginationInput = {
  slug: string;
  page: number;
  totalPosts: number;
  perPage: number;
};

type CategoryPagination = {
  canonical: string;
  prev?: string;
  next?: string;
  totalPages: number;
  currentPage: number;
  isPageWithinRange: boolean;
};

export function buildCategoryPagination({
  slug,
  page,
  totalPosts,
  perPage,
}: BuildCategoryPaginationInput): CategoryPagination {
  const safePage = Math.max(1, Math.floor(page));
  const totalPages = Math.max(1, Math.ceil(totalPosts / perPage));
  const prevPage = safePage - 1;
  const nextPage = safePage + 1;

  return {
    canonical: categoryPageUrl(slug, safePage),
    prev: prevPage >= 1 ? categoryPageUrl(slug, prevPage) : undefined,
    next: safePage < totalPages ? categoryPageUrl(slug, nextPage) : undefined,
    totalPages,
    currentPage: safePage,
    isPageWithinRange: safePage <= totalPages,
  };
}
