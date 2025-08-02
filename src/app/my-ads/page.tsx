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
  const objectUrlLoader = ({ src }: { src: string }) => src;

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation bar */}
      <AccountNav />

      {/* Ad count */}
      <div className="text-right text-lg font-semibold">
        إعلاناتي ({adCount})
      </div>

      {/* Post Ad button */}
      <div className="flex justify-center">
        <Link
          href="/post-ad"
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 text-sm font-semibold"
        >
          أضف إعلان
        </Link>
      </div>

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="text-center text-gray-500 text-sm mt-4">
          لم تقم بإضافة أي إعلان بعد.
        </div>
      ) : (
        <ul className="grid gap-4 mt-4">
          {ads.map((ad, idx) => {
            const imageUrl = ad.images?.[0]
              ? URL.createObjectURL(ad.images[0])
              : null;

            const handleDelete = async () => {
              if (ad.id === undefined) {
                console.warn("Ad has no ID — cannot delete.");
                return;
              }

              const confirmDelete = confirm(
                "هل أنت متأكد أنك تريد حذف هذا الإعلان؟"
              );
              if (!confirmDelete) return;

              try {
                await deleteAd(ad.id);

                // Refresh local state
                const updatedAds = ads.filter((a) => a.id !== ad.id);
                setAds(updatedAds);
                setAdCount(updatedAds.length);

                console.log("Ad deleted successfully.");
              } catch (error) {
                console.error("فشل حذف الإعلان:", error);
                alert("حدث خطأ أثناء حذف الإعلان. حاول مرة أخرى.");
              }
            };

            return (
              <div key={idx} className="border rounded p-4 text-right relative">
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:underline text-sm"
                  >
                    حذف
                  </button>

                  <Link
                    href={`/post-ad/edit/${ad.createdAt}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    تعديل
                  </Link>
                </div>
                {imageUrl && (
                  <Image
                    loader={objectUrlLoader}
                    src={imageUrl}
                    alt="Ad"
                    width={160}
                    height={160}
                    className="object-cover rounded mb-2"
                    unoptimized // <-- Important for blob URLs
                  />
                )}

                <div className="font-bold">{ad.title}</div>
                <div className="text-gray-600">{ad.description}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {ad.createdAt && new Date(ad.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
