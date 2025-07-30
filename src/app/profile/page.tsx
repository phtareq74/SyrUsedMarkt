// src/app/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import AccountNav from "@/components/account/AccountNav";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>جارٍ التحميل...</p>;
  if (!session) return <p>يرجى تسجيل الدخول لعرض ملفك الشخصي.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 mt-4 text-right">
      <AccountNav />

      <h1 className="text-xl font-bold mb-4">ملفي الشخصي</h1>
      <p>بيانات ملفك الشخصي ستظهر هنا.</p>
    </div>
  );
}