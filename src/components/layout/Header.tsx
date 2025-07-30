"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const hidePostAd = pathname.startsWith("/post-ad");

  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  if (!mounted) return null; // Prevent hydration mismatch

  const userMenu = (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline text-sm"
      >
        <User size={18} />
        <span>{session?.user?.name ?? session?.user?.email}</span>
        <ChevronDown size={14} />
      </button>
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md text-right z-50">
          <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100" onClick={() =>{setDropdownOpen(false);router.push("/my-ads")}}>إعلاناتي</button>
          <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {setDropdownOpen(false);router.push("/myFavourites")}}>المفضلة</button>
          <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {setDropdownOpen(false);router.push("/saved-searches")}}>عمليات البحث المحفوظة</button>
          <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {setDropdownOpen(false);router.push("/recently-viewed")}}>المشاهدات الأخيرة</button>
          <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {setDropdownOpen(false);router.push("/profile")}}>ملفي الشخصي</button>
          <hr className="my-1" />
          <button className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => signOut()}>تسجيل الخروج</button>
        </div>
      )}
    </div>
  );

if (!mounted || status === "loading") return null;
  const authDisplay = session ? (
    userMenu
  ) : (
    <Link href="/login" className="hover:underline font-bold text-emerald-600">
      تسجيل الدخول
    </Link>
  );

  return (
    <header className="bg-white shadow p-2">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center text-right">
        <div className="flex items-center gap-2 text-xl font-bold text-cyan-600">
          <Image src="/images/UsedMarket.png" alt="Logo" width={32} height={32} />
          سوق المستعمل السوري
        </div>

        <nav className="flex flex-row-reverse gap-3 text-sm sm:text-base items-center">
          <Link href="/information" className="hover:underline">معلومات</Link>
          <Link href="/terms" className="hover:underline">الشروط</Link>
          <Link href="/messages" className="hover:underline">الرسائل</Link>
          <Link href="/notifications" className="hover:underline">الإشعارات</Link>

          {!hidePostAd && (
            <Link href="/post-ad" className="hover:underline font-semibold text-amber-600">أضف إعلان</Link>
          )}

          {authDisplay}
        </nav>
      </div>
    </header>
  );
}
