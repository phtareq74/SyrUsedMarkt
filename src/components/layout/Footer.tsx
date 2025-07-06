/* === src/components/layout/Footer.tsx === */
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white mt-12 py-6 border-t text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
        <div>
          <Link href="/terms" className="text-cyan-600 hover:underline font-medium">قم بتنزيل تطبيقنا (قريبًا)</Link>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <Link href="/terms" className="hover:underline">من نحن</Link>
          <Link href="/terms" className="hover:underline">اتصل بنا</Link>
          <Link href="/terms" className="hover:underline">الشروط والأحكام</Link>
          <Link href="/terms" className="hover:underline">سياسة الخصوصية</Link>
          <Link href="/terms" className="hover:underline">ملفات تعريف الارتباط</Link>
        </div>
      </div>
    </footer>
  );
}