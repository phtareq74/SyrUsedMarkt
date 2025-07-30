"use client";

import Link from "next/link";
import { useState } from "react";
import { getSubcategoriesByName, getTopCategories } from "@/lib/helpers";
import FiltersPanel from "./FiltersPanel";
import { getFiltersForCategory } from "@/lib/filtersByCategory";

interface SidebarProps {
  readonly categoryName?: string;
}
export default function Sidebar({ categoryName }: SidebarProps) {
  const isCategoryPage = Boolean(categoryName);

  const categories = isCategoryPage && categoryName
    ? getSubcategoriesByName(categoryName)
    : getTopCategories();

  const title = isCategoryPage ? "الفئات الفرعية" : "الأقسام الرئيسية";

  const [showAll, setShowAll] = useState(false);

  const visibleCategories = (() => {
    if (!isCategoryPage) return categories;
    return showAll ? categories : categories.slice(0, 5);
  })();

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow text-sm space-y-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>

      <ul className="space-y-2 text-sm pr-4">
        {visibleCategories.length > 0 ? (
          visibleCategories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/category/${encodeURIComponent(cat.name)}`}
                className="text-cyan-700 hover:underline cursor-pointer"
              >
                {cat.name}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-400">لا توجد فئات</li>
        )}
      </ul>

      {/* ✅ Toggle only on category page with >5 items */}
      {isCategoryPage && categories.length > 5 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-gray-700 font-semibold hover:underline text-sm pr-4"
        >
          {showAll ? "<<<عرض أقل" : "المزيد>>>"}
        </button>
      )}

      {/* ✅ Filters only on category page */}
      {isCategoryPage && categoryName && (
        <FiltersPanel filters={getFiltersForCategory(categoryName)} />
      )}

      {/* ✅ Extra links only on home page */}
      {!isCategoryPage && (
        <div className="border-t pt-4 space-y-2 text-right">
          <Link href="/favorites" className="block text-cyan-700 hover:underline">
            المفضلة
          </Link>
          <Link href="/my-ads" className="block text-cyan-700 hover:underline">
            إعلاناتي
          </Link>
          <Link href="/settings" className="block text-cyan-700 hover:underline">
            الإعدادات
          </Link>
        </div>
      )}
    </aside>
  );
}
