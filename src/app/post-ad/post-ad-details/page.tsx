'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fullCategories } from "@/lib/data";

export default function PostAdStep1() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // ✅ Load from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("postAdStep1");
    if (saved) {
      try {
        const { title, category, subcategory } = JSON.parse(saved);
        setTitle(title || "");
        setSelectedCategory(category || "");
        setSelectedSubcategory(subcategory || "");
      } catch (e) {
        console.error("Invalid saved data", e);
      }
    }
  }, []);

  const subcategories =
    fullCategories.find((cat) => cat.name === selectedCategory)?.children || [];

  function findCategory() {
    const lowerTitle = title.toLowerCase();

    const allSubcategories = fullCategories.flatMap((cat) =>
      cat.children?.map((sub) => sub.name) ?? []
    );

    const matches = allSubcategories.filter((cat) =>
      lowerTitle.includes(cat.toLowerCase())
    );

    setSuggestedCategories(matches.length ? matches : allSubcategories.slice(0, 5));
  }

  function handleNext() {
    if (!title || !selectedCategory) {
      alert("يرجى إدخال العنوان واختيار القسم");
      return;
    }

    // ✅ Save to localStorage
    localStorage.setItem("postAdStep1", JSON.stringify({
      title,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    }));

    router.push("/post-ad/post-ad-details");
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8 text-right">
      <h1 className="text-2xl font-semibold mb-4">أضف إعلان - الخطوة الأولى</h1>

      <label htmlFor="title" className="block mb-2 font-semibold">العنوان</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-3"
        placeholder="اكتب عنوان الإعلان"
      />

      <button
        onClick={findCategory}
        className="mb-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700"
      >
        ابحث عن القسم
      </button>

      {suggestedCategories.length > 0 && (
        <div className="mb-4">
          <p className="mb-1 font-semibold">الأقسام المقترحة:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSubcategory(cat)}
                className={`px-3 py-1 rounded border ${
                  selectedSubcategory === cat
                    ? "bg-cyan-700 text-white border-cyan-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <label htmlFor="category" className="block mb-2 font-semibold">اختر القسم</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setSelectedSubcategory(""); // Reset subcategory
        }}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">-- اختر القسم --</option>
        {fullCategories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {subcategories.length > 0 && (
        <>
          <label htmlFor="subcategory" className="block mb-2 font-semibold">
            اختر القسم الفرعي
          </label>
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">-- اختر القسم الفرعي --</option>
            {subcategories.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </>
      )}

      <button
        onClick={handleNext}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-semibold"
      >
        التالي
      </button>
    </div>
  );
}
