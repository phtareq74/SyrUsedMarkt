export type Filter = {
  name: string;
  label: string;
  options: string[];
};

// ✅ Category-specific filters only (no default filters like "condition" or "location")
const categorySpecificFilters: Record<string, Filter[]> = {
  "موبايلات": [
    {
      name: "brand",
      label: "العلامة التجارية",
      options: ["ابل", "سامسونج", "شاومي", "هواوي"],
    },
  ],
  "لابتوبات": [
    {
      name: "brand",
      label: "العلامة التجارية",
      options: ["HP", "Dell", "Lenovo", "Apple", "Asus"],
    },
    {
      name: "ram",
      label: "الرام",
      options: ["4GB", "8GB", "16GB", "32GB+"],
    },
  ],
  "سيارات": [
    {
      name: "fuel",
      label: "نوع الوقود",
      options: ["بنزين", "ديزل", "كهرباء", "هايبرد"],
    },
    {
      name: "transmission",
      label: "ناقل الحركة",
      options: ["عادي", "أوتوماتيك"],
    },
  ],
};

// ✅ Function to get filters for a category
export function getFiltersForCategory(categoryName?: string): Filter[] {
  return categoryName ? categorySpecificFilters[categoryName] || [] : [];
}
