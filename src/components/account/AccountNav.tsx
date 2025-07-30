"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/my-ads", label: "إعلاناتي" },
  { href: "/myFavourites", label: "المفضلة" },
  { href: "/saved-searches", label: "عمليات البحث المحفوظة" },
  { href: "/recently-viewed", label: "المشاهدات الأخيرة" },
  { href: "/profile", label: "ملفي الشخصي" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex justify-end flex-wrap gap-3 text-sm border-b pb-3 mb-6 max-w-6xl mx-auto px-4 text-right"
      dir="rtl"
    >
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1 rounded ${
            pathname === href
              ? "bg-emerald-600 text-white font-semibold"
              : "text-emerald-700 hover:underline"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
