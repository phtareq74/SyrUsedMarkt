"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const hidePostAd = pathname.startsWith("/post-ad");

  let authDisplay;

  if (status === "loading") {
    authDisplay = null;
  } else if (status === "authenticated") {
    authDisplay = (
      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
        <User size={18} />
        <span>{session.user?.name ?? session.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="text-red-600 hover:underline text-sm"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  } else {
    authDisplay = (
      <Link href="/login" className="hover:underline font-bold text-emerald-600">
        تسجيل الدخول
      </Link>
    );
  }

  return (
    <header className="bg-white shadow p-2">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center text-right">
        <div className="flex items-center gap-2 text-xl font-bold text-cyan-600">
          <Image src="/images/UsedMarket.png" alt="Logo" width={32} height={32} />
          سوق المستعمل السوري
        </div>

        <nav className="flex flex-row-reverse gap-3 text-sm sm:text-base items-center">
          <Link href="/information" className="hover:underline">
            معلومات
          </Link>
          <Link href="/terms" className="hover:underline">
            الشروط
          </Link>
          <Link href="/messages" className="hover:underline">
            الرسائل
          </Link>
          <Link href="/notifications" className="hover:underline">
            الإشعارات
          </Link>

          {!hidePostAd && (
            <Link href="/post-ad" className="hover:underline font-semibold text-amber-600">
              أضف إعلان
            </Link>
          )}

          {authDisplay}
        </nav>
      </div>
    </header>
  );
}
