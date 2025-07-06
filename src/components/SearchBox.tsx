//SearchBox.tsx

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getTopCategories, getSubcategoriesByName } from "@/lib/helpers";

export default function SearchBox() {
  const pathname = usePathname();
  const showSearch = !pathname.startsWith("/post-ad");

  const categorySlug = pathname.startsWith("/category")
    ? decodeURIComponent(pathname.replace("/category/", "")).split("/")
    : [];

  const isOnCategoryPage = categorySlug.length > 0;
  const selectedCategoryName = categorySlug[0];

  const categoryOptions = isOnCategoryPage
    ? getSubcategoriesByName(selectedCategoryName)
    : getTopCategories();

  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDistance, setSearchDistance] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCategory) params.set("category", searchCategory);
    if (searchQuery) params.set("q", searchQuery);
    if (searchLocation) params.set("location", searchLocation);
    if (searchDistance) params.set("distance", searchDistance);

    if (searchCategory) {
      const categoryPath = encodeURIComponent(searchCategory);
      const base = `/category/${categoryPath}`;
      const queryString = params.toString();
      window.location.href = queryString ? `${base}?${queryString}` : base;
    } else {
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return showSearch? (
    <section className="bg-white p-3 rounded-lg shadow text-sm">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-base font-bold mb-3 text-right">ابحث عن إعلان</h2>
        <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="ما الذي تبحث عنه؟"
            className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded bg-white"
          >
            <option value="">كل الأقسام</option>
            {categoryOptions.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="المدينة أو المنطقة"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded"
          />
          <select
            value={searchDistance}
            onChange={(e) => setSearchDistance(e.target.value)}
            className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded bg-white"
          >
            <option>المسافة</option>
            <option>&lt; 5 كم</option>
            <option>&lt; 10 كم</option>
            <option>&lt; 15 كم</option>
            <option>&lt; 25 كم</option>
            <option>&lt; 50 كم</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 whitespace-nowrap"
          >
            بحث
          </button>
        </div>
      </div>
    </section>
  ): null;
}
