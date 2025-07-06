import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { fullCategories } from "@/lib/data";

export default function MainCategoriesSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="bg-white p-3 rounded-lg shadow text-sm">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-base font-bold mb-3 text-right">الأقسام الرئيسية</h2>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start relative">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              الكل
            </button>

            {isDropdownOpen && (
              <div className="absolute z-30 mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 max-w-screen-md w-fit text-right">
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                  {fullCategories.map((category) => (
                    <div key={category.name} className="break-inside-avoid mb-2">
                      <Link
                        href={`/category/${encodeURIComponent(category.name)}`}
                        className="block hover:bg-gray-100 px-3 py-1 rounded whitespace-nowrap"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* First 6 categories inline */}
          {fullCategories.slice(0, 6).map((category) => (
            <Link
              key={category.name}
              href={`/category/${encodeURIComponent(category.name)}`}
              className="px-3 py-1 border border-cyan-600 text-cyan-600 rounded hover:bg-cyan-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
