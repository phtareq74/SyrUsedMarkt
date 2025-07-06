// helpers.ts
export type Category = {
  name: string;
  children?: Category[];
};

import { fullCategories } from "./data";

export function getTopCategories(): Category[] {
  return fullCategories;
}

export function getSubcategoriesByName(name: string): Category[] {
  for (const parent of fullCategories) {
    if (parent.name === name) {
      return parent.children || [];
    }

    const foundChild = parent.children?.find((child) => child.name === name);
    if (foundChild) {
      return parent.children || [];
    }
  }

  return [];
}
