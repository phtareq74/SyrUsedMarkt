import { allProducts, fullCategories, Product, Category } from "./data";

/**
 * Filter products by a given category path.
 * E.g., ["Electronics", "Phones", "Smartphones"]
 */
export function getProductsByCategoryPath(path: string[]): Product[] {
  return allProducts.filter(product =>
    path.every((segment, i) => product.categoryPath[i] === segment)
  );
}

/**
 * Recursively find a category object by a given path.
 * E.g., ["Home", "Furniture", "Sofas"]
 */
export function getCategoryFromPath(path: string[], categories = fullCategories): Category | null {
  if (path.length === 0) return null;

  let currentLevel: Category[] = categories;
  let found: Category | undefined;

  for (const segment of path) {
    found = currentLevel.find(cat => cat.name === segment);
    if (!found) return null;
    currentLevel = found.children || [];
  }

  return found || null;
}

/**
 * Convert a category name to a URL-safe slug (if needed)
 */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .toLowerCase();
}

export function getCategoryLink(categoryPath: string[]): string {
  const encodedPath = categoryPath.map(encodeURIComponent).join('/');
  return `/category/${encodedPath}`;
}