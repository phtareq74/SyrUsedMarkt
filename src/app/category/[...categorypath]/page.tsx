'use client';

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { allProducts } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

type Product = {
  id: string;
  title: string;
  image: string;
  price: string;
  categoryPath: string[];
};

const TABS = [
  { key: "forYou", label: "لك" },
  { key: "inYourArea", label: "في منطقتك" },
];

export default function CategoryPage() {
  const params = useParams();
  const categoryPath = (params.categorypath ?? []) as string[];

  const [activeTab, setActiveTab] = useState("forYou");

  if (categoryPath.length === 0) {
    return <div>Category not specified</div>;
  }

  const categoryPathString = categoryPath.join("/");
  const currentCategory = decodeURIComponent(categoryPath[categoryPath.length - 1]);

  const filteredProducts: Product[] = allProducts.filter(
    (product) => product.categoryPath.join("/") === categoryPathString
  );

  return (
    <main className="max-w-7xl mx-auto p-4 text-right flex gap-6">
      {/* Reusable Sidebar */}
      <Sidebar categoryName={currentCategory} />

      {/* Main Content */}
      <section className="w-3/4">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-cyan-600">
          <Link href="/">الرئيسية</Link> &gt;{" "}
          {categoryPath.map((cat, idx) => {
            const path = categoryPath.slice(0, idx + 1).join("/");
            return (
              <span key={path}>
                <Link href={`/category/${path}`}>{decodeURIComponent(cat)}</Link>
                {idx < categoryPath.length - 1 && " > "}
              </span>
            );
          })}
        </nav>

        <h1 className="text-2xl font-bold mb-4">
          {decodeURIComponent(categoryPath[categoryPath.length - 1])}
        </h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-4 border-b pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded font-bold ${
                activeTab === tab.key
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-cyan-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p
                    className={`text-sm mt-1 ${
                      product.price.includes("عرض")
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.price}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">لا توجد منتجات في هذه الفئة حالياً.</p>
          )}
        </div>
      </section>
    </main>
  );
}
