"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { allProducts } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";
import { FaEye, FaHeart, FaClock } from "react-icons/fa";

export default function ProductDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = allProducts.find((p) => p.id === id);

  const [offerAmount, setOfferAmount] = useState("");
  const [offers, setOffers] = useState<{ amount: string; date: string; user: string }[]>([]);
  const currentUser = "Omar"; // Replace with real user logic later
  const minimumOffer = product?.minimumOffer ?? 1000;

  if (!product) return notFound();

  const addOffer = () => {
    const amount = parseFloat(offerAmount);
    if (!offerAmount.trim() || isNaN(amount)) return;

    const lastAmount = offers[0] ? parseFloat(offers[0].amount) : 0;

    if (amount < minimumOffer) {
      alert(`العرض يجب أن لا يقل عن ${minimumOffer} ل.س`);
      return;
    }

    if (offers.length > 0 && amount <= lastAmount) {
      alert("العرض الجديد يجب أن يكون أعلى من العرض السابق");
      return;
    }

    const newOffer = {
      amount: offerAmount,
      date: new Date().toISOString(),
      user: currentUser,
    };

    setOffers([newOffer, ...offers]);
    setOfferAmount("");
  };

  const deleteOffer = (index: number) => {
    const updatedOffers = offers.filter((_, i) => i !== index);
    setOffers(updatedOffers);
  };

  return (
    <main className="max-w-6xl mx-auto p-4 text-right">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-cyan-600">
        <Link href="/">الرئيسية</Link> &gt;{" "}
        {product.categoryPath.map((cat, idx, arr) => {
          const path = product.categoryPath.slice(0, idx + 1).join("/");
          return (
            <span key={`${cat}-${path}`}>
              <Link href={`/category/${path}`}>{cat}</Link>
              {idx < arr.length - 1 && " > "}
            </span>
          );
        })}
      </nav>

      <div className="flex gap-8">
        {/* Right 2/3 Section */}
        <section className="w-2/3 bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <button
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
              aria-label="Save this ad"
            >
              حفظ الإعلان
            </button>
          </div>

          <div className="flex gap-8 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <FaEye />
              <span>{product.views ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart />
              <span>{product.favorites ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock />
              <span>{product.postedAt ?? "غير معروف"}</span>
            </div>
          </div>

          <div className="flex gap-8 items-start mb-4">
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={400}
              className="rounded object-cover max-w-[600px]"
            />
            <p className="text-3xl font-extrabold text-green-600 whitespace-nowrap">
              {product.price}
            </p>
          </div>

          {product.photos && product.photos.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {product.photos.map((photo, idx) => (
                <Image
                  key={photo}
                  src={photo}
                  alt={`${product.title} - صورة ${idx + 1}`}
                  width={100}
                  height={100}
                  className="rounded object-cover cursor-pointer"
                />
              ))}
            </div>
          )}

          <hr className="my-4" />

          <div className="mb-4">
            <p className="font-bold mb-1">الحالة:</p>
            <p>{product.condition ?? "غير محدد"}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold mb-1">الوصف:</p>
            <p>{product.description ?? "لا يوجد وصف."}</p>
          </div>

          <hr className="my-4" />
          <div className="mb-8 text-gray-500">رقم الإعلان: {product.id}</div>

          <section>
            <h2 className="text-xl font-bold mb-4">إعلانات أخرى من نفس البائع</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded p-2 text-center">
                  <Image
                    src={product.image}
                    alt={`${product.title} ${i}`}
                    width={200}
                    height={120}
                    className="object-cover rounded mb-2"
                  />
                  <h3 className="text-sm font-semibold">{product.title}</h3>
                  <p className="text-green-600 font-bold">{product.price}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        {/* Left 1/3 Section */}
        <aside className="w-1/3 space-y-6">
          <section className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="font-bold text-lg mb-2">{product.sellerName ?? "اسم البائع"}</h2>
            <p>مدة النشاط: {product.sellerActiveYears ?? 0} سنوات</p>
            <Link href={`/seller/${product.sellerName ?? ""}`}>
              <button className="mt-2 w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800">
                مشاهدة جميع إعلاناته
              </button>
            </Link>
            <hr className="my-4" />
            <p>المنطقة: {product.sellerArea ?? "غير محددة"}</p>
            <hr className="my-4" />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              إرسال رسالة
            </button>
          </section>

          {/* Offer section */}
          <section className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="font-bold text-lg mb-2">العرض</h2>
            <p>من: {minimumOffer} ليرة سورية</p>

            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="أدخل مبلغ العرض"
              className="mt-2 w-full p-2 border rounded text-right"
            />

            <button
              onClick={addOffer}
              className="mt-2 w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800"
            >
              أضف عرضك
            </button>

            <div className="mt-4 max-h-60 overflow-auto border p-2 rounded space-y-2 text-sm">
              {offers.length === 0 && (
                <p className="text-gray-400">لا توجد عروض بعد</p>
              )}

              {offers.map((offer, index) => {
                const date = new Date(offer.date);
                const formattedDate = date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "2-digit",
                });

                return (
                  <div
                    key={`${offer.amount}-${offer.date}-${offer.user}`}
                    className="border-b pb-2 last:border-none flex justify-between items-center text-sm"
                  >
                    <span className="font-semibold">{offer.user}</span>
                    <span className="text-green-700 font-bold whitespace-nowrap">
                      ل.س {parseFloat(offer.amount).toFixed(2)}
                    </span>
                    <span className="text-gray-500 whitespace-nowrap">{formattedDate}</span>
                    {offer.user === currentUser && (
                      <button
                        onClick={() => deleteOffer(index)}
                        className="text-red-500 font-bold hover:text-red-700 ml-2"
                        aria-label="Delete offer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
