"use client";

import { useEffect, useState } from "react";
import { getAllAds, saveAd } from "@/lib/indexedDB";
import { AdData } from "@/lib/indexedDB";
import { notFound } from "next/navigation";
import Image from "next/image";

interface WrapperProps {
  params: Promise<{ id: string }>;
}

export default function EditAdPageWrapper({ params }: WrapperProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return <div>جاري التحميل...</div>;

  return <EditAdPage adId={Number(resolvedParams.id)} />;
}

function EditAdPage({ adId }: { adId: number }) {
  const [form, setForm] = useState<AdData>({
    title: "",
    description: "",
    askingPrice: "",
    province: "",
    place: "",
    addressDetails: "",
    priceType: "",
    mustGo: false,
    highlightAd: false,
    images: [],
  });

  useEffect(() => {
    getAllAds().then((ads) => {
      const found = ads.find((a) => a.id === adId);
      if (!found) {
        notFound();
      } else {
        setForm({ ...found, images: found.images ?? [] });
      }
    });
  }, [adId]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      setForm((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveAd({ ...form, id: adId });
      const allAds = await getAllAds();
      console.log(allAds);
    alert("✅ تم حفظ التعديلات بنجاح");
  }

  return (
    <div dir="rtl" className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل الإعلان</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="عنوان الإعلان"
          title="عنوان الإعلان"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="وصف الإعلان"
          title="وصف الإعلان"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="askingPrice"
          value={form.askingPrice}
          onChange={handleChange}
          placeholder="السعر المطلوب"
          title="السعر المطلوب"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="province"
          value={form.province}
          onChange={handleChange}
          placeholder="المحافظة"
          title="المحافظة"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="place"
          value={form.place}
          onChange={handleChange}
          placeholder="المنطقة / المدينة"
          title="المنطقة / المدينة"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="addressDetails"
          value={form.addressDetails}
          onChange={handleChange}
          placeholder="تفاصيل العنوان"
          title="تفاصيل العنوان"
          className="w-full p-2 border rounded"
        />

        <select
          name="priceType"
          value={form.priceType}
          onChange={handleChange}
          title="نوع السعر"
          className="w-full p-2 border rounded"
        >
          <option value="">اختر نوع السعر</option>
          <option value="fixed">ثابت</option>
          <option value="negotiable">قابل للتفاوض</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="mustGo"
            checked={!!form.mustGo}
            onChange={handleChange}
          />
          يجب البيع بسرعة
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="highlightAd"
            checked={!!form.highlightAd}
            onChange={handleChange}
          />
          تمييز الإعلان
        </label>

        <div>
          <label htmlFor="images" className="block mb-1">
            تحميل الصور
          </label>

          {/* Hidden file input, always in the DOM */}
          <input
            id="images"
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {(form.images ?? []).length > 0 ? (
            <button
              type="button"
              onClick={() => document.getElementById("images")?.click()}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              إضافة المزيد من الصور
            </button>
          ) : (
            <label
              htmlFor="images"
              className="w-full bg-gray-100 px-3 py-2 rounded cursor-pointer text-center"
            >
              اختر الصور
            </label>
          )}

          {(form.images ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(form.images ?? []).map((file, i) => (
                <Image
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`صورة ${i + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
