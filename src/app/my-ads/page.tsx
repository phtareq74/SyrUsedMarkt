'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountNav from "@/components/account/AccountNav";

export default function MyAdsPage() {
  const { data: session, status } = useSession();
  const [adCount, setAdCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch ad count here if connected to backend
    // For now, assume 0
    setAdCount(0);
  }, []);

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

      {/* Placeholder for list of ads */}
      <div className="text-center text-gray-500 text-sm mt-4">
        لم تقم بإضافة أي إعلان بعد.
      </div>
    </div>
  );
}
