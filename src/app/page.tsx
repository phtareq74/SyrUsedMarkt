"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CategoryDropdown from "@/components/CategoryDropdown";
import { allProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const tabs = [
  { key: "forYou", label: "لك", slice: [0, 4] },
  { key: "inYourArea", label: "في منطقتك", slice: [2, 6] },
  { key: "trending", label: "الأكثر رواجاً", slice: [1, 5] },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("forYou");

  // Provide fallback to avoid undefined currentTab
  const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 text-right space-y-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* الأقسام الرئيسية */}
          <section className="bg-white p-3 rounded-lg shadow text-sm">
            <div className="max-w-5xl mx-auto">
              <CategoryDropdown />
            </div>
          </section>

          {/* Tabs */}
          <nav className="flex justify-center gap-6 border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-6 font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-b-4 border-cyan-600 text-cyan-600"
                    : "border-b-4 border-transparent hover:text-cyan-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Cards for active tab */}
          <section className="bg-white rounded-lg p-4 shadow space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {allProducts
                .slice(currentTab.slice[0], currentTab.slice[1])
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
