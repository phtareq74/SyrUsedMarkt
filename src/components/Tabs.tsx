"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { allProducts } from "@/lib/data";

const tabs = [
  { key: "latest", label: "الأحدث" },
  { key: "popular", label: "الأكثر مشاهدة" },
];

// For demo, just split products by index for each tab
function getProductsForTab(key: string) {
  if (key === "latest") return allProducts.slice(0, 4);
  if (key === "popular") return allProducts.slice(4, 8);
  return [];
}

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("latest");

  const currentProducts = getProductsForTab(activeTab);

  return (
    <div>
      <div className="flex flex-row-reverse gap-4 border-b pb-2 text-sm sm:text-base font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-1 border-b-2 ${
              activeTab === tab.key
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent hover:text-cyan-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
