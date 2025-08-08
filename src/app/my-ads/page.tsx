"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountNav from "@/components/account/AccountNav";
import { getAllAds, AdData, deleteAd } from "@/lib/indexedDB";

export default function MyAdsPage() {
  const { data: session, status } = useSession();
  const [ads, setAds] = useState<AdData[]>([]);
  const [adCount, setAdCount] = useState(0);
  const router = useRouter();
  const [selectedAds, setSelectedAds] = useState<number[]>([]);

  // const objectUrlLoader = ({ src }: { src: string }) => src;

  useEffect(() => {
    const fetchAds = async () => {
      if (!session?.user?.email) return;

      const allAds = await getAllAds();
      const userAds = allAds.filter((ad) => ad.userId === session.user.email);
      setAds(userAds);
      setAdCount(userAds.length);
    };

    fetchAds();
  }, [session]);

  if (status === "loading") return null;
  if (!session) {
    router.push("/login");
    return null;
  }
  const handleBulkDelete = async () => {
    if (!selectedAds.length) {
      alert("يرجى تحديد إعلان واحد على الأقل للحذف");
      return;
    }

    const confirmDelete = confirm(
      "هل أنت متأكد أنك تريد حذف الإعلانات المحددة؟"
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedAds) {
        await deleteAd(id);
      }

      const updatedAds = ads.filter((ad) => !selectedAds.includes(ad.id!));
      setAds(updatedAds);
      setAdCount(updatedAds.length);
      setSelectedAds([]); // clear selection

      console.log("تم حذف الإعلانات المحددة");
    } catch (error) {
      console.error("خطأ أثناء حذف الإعلانات:", error);
      alert("حدث خطأ أثناء الحذف. حاول مرة أخرى.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation bar */}
      <AccountNav />

      {/* Ad count */}
      <div className="text-right text-lg font-semibold">
        إعلاناتي ({adCount})
      </div>

      {/* Show 'Add Ad' button only when there are no ads */}
      {ads.length === 0 && (
        <div className="flex justify-center">
          <Link
            href="/post-ad"
            className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 text-sm font-semibold"
          >
            أضف إعلان
          </Link>
        </div>
      )}

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="text-center text-gray-500 text-sm mt-4">
          لم تقم بإضافة أي إعلان بعد.
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {/* Header Row */}
          <div className="grid grid-cols-6 items-center text-sm font-semibold bg-gray-100 p-2 rounded text-center">
            <div className="flex items-center justify-start gap-2 col-span-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAds(ads.map((ad) => ad.id!).filter(Boolean));
                  } else {
                    setSelectedAds([]);
                  }
                }}
                checked={selectedAds.length === ads.length && ads.length > 0}
              />
              <span>حذف المحدد</span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
              >
                حذف
              </button>
            </div>
            <div>الحالة</div>
            <div>المشاهدات</div>
            <div>الترتيب</div>
            <div>إجراءات</div>
          </div>

          {/* Ads Rows */}
          <ul className="space-y-2">
            {ads.map((ad, idx) => {
              const imageUrl = ad.images?.[0]
                ? URL.createObjectURL(ad.images[0])
                : null;

              return (
                <li
                  key={idx}
                  className="grid grid-cols-6 items-center text-sm border rounded p-2 text-center"
                >
                  {/* Column 1–2: Checkbox + thumbnail + title + price */}
                  <div className="flex items-center gap-3 col-span-2 text-right">
                    <input
                      type="checkbox"
                      checked={selectedAds.includes(ad.id!)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setSelectedAds([...selectedAds, ad.id!]);
                        } else {
                          setSelectedAds(
                            selectedAds.filter((id) => id !== ad.id)
                          );
                        }
                      }}
                    />
                    {imageUrl && (
                      <Image
                        loader={({ src }) => src}
                        src={imageUrl}
                        alt="Ad"
                        width={60}
                        height={60}
                        className="rounded object-cover"
                        unoptimized
                      />
                    )}
                    <div className="text-right">
                      <div className="font-semibold">{ad.title}</div>
                      <div className="flex items-center gap-3">
                        {(typeof ad.askingPrice === "number" ||
                          typeof ad.askingPrice === "string") && (
                          <div className="text-gray-600 font-medium">
                            {ad.askingPrice} ل.س
                          </div>
                        )}
                        <button className="text-xs text-yellow-600 underline">
                          حجز / مباعة
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Status */}
                  <div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      نشط
                    </span>
                  </div>

                  {/* Column 4: Views */}
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="text-xs">
                      {typeof ad.viewCount === "number" ? ad.viewCount : 0}
                    </span>
                  </div>

                  {/* Column 5: Position placeholder */}
                  <div className="text-xs text-gray-500">#؟</div>

                  {/* Column 6: Actions */}
                  <div className="flex flex-col items-center gap-1">
                    <Link
                      href={`/post-ad/edit/${ad.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      تعديل
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
