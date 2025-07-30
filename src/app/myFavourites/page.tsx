"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import AccountNav from "@/components/account/AccountNav";

export default function MyFavouritesPage() {
  const { data: session } = useSession();
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const favouriteAds = [
    {
      id: "1",
      title: "نشافة AEG بتقنية المضخة الحرارية A+++",
      location: "ماتيجس كيه | أمستردام",
      price: "€185.00",
      status: "محجوز",
      imageUrl: "/images/sample-ad.jpg",
    },
  ];

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelected(!selectAll ? favouriteAds.map((ad) => ad.id) : []);
  };

  const handleSelectAd = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((adId) => adId !== id) : [...prev, id]
    );
  };
  if (!session) {
    return (
      <p className="text-center py-10">
        Please log in to view your favourites.
      </p>
    );
  }

  return (
    <section
      className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-right"
      dir="rtl"
    >
      <AccountNav />
      {/* شريط الفلاتر */}
      <div className="flex flex-wrap gap-3 justify-between items-center border-b pb-3">
        <div className="flex gap-2 flex-wrap">
          <select className="border p-2 rounded bg-white">
            <option>القسم...</option>
            {/* أضف الأقسام ديناميكياً هنا */}
          </select>
          <select className="border p-2 rounded bg-white">
            <option>المحفوظ / المزايدات</option>
            <option>الإعلانات المحفوظة</option>
            <option>المزايدات الفعالة</option>
          </select>
        </div>
        <button className="text-blue-600 hover:underline">مسح الفلاتر</button>
      </div>

      {/* رأس الجدول */}
      <div className="flex items-center border-b py-2 font-semibold text-sm text-gray-700">
        <input
          type="checkbox"
          className="ml-2"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <button className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 ml-4">
          🗑 حذف
        </button>
        <div className="mr-auto flex gap-10">
          <span className="w-32 text-center">السعر والمزايدات</span>
          <span className="w-32 text-center">خيارات</span>
        </div>
      </div>

      {/* قائمة الإعلانات */}
      {favouriteAds.map((ad) => (
        <div key={ad.id} className="flex items-center border-b py-4 text-sm">
          <input
            type="checkbox"
            className="ml-2"
            checked={selected.includes(ad.id)}
            onChange={() => handleSelectAd(ad.id)}
          />
          <Image
            src={ad.imageUrl}
            alt="صورة الإعلان"
            width={64}
            height={64}
            className="object-cover ml-4 rounded"
          />
          <div>
            <p className="text-blue-600 hover:underline font-semibold cursor-pointer">
              {ad.title}
            </p>
            <p className="text-gray-500 text-xs">{ad.location}</p>
          </div>
          <div className="mr-auto flex gap-10 items-center text-gray-700">
            <div className="w-32 text-center">
              <p>{ad.status}</p>
              <p>مزايدتي: {ad.price}</p>
            </div>
            <div className="w-32 text-center text-blue-600 hover:underline cursor-pointer">
              تواصل معنا
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
