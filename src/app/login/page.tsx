'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'الرجاء إدخال البريد الإلكتروني';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (!password) {
      newErrors.password = 'الرجاء إدخال كلمة المرور';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setMessage('فشل تسجيل الدخول، تحقق من البريد أو كلمة المرور');
    } else {
      setMessage('تم تسجيل الدخول بنجاح');
      setTimeout(() => router.push('/'), 1500); // Redirect to home after success
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl mb-4 text-center">تسجيل الدخول</h1>
      <form noValidate onSubmit={handleSubmit} className="space-y-4 text-right">
        <div>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
              setMessage(null);
            }}
            className={`w-full p-2 mt-4 border rounded ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
              setMessage(null);
            }}
            className={`w-full p-2 mt-4 border rounded ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-between items-center space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-cyan-700 text-white py-2 mt-4 rounded hover:bg-cyan-800 disabled:opacity-50"
          >
            {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-700 py-2 px-4 mt-4 rounded hover:bg-gray-400"
          >
            إلغاء
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes('نجاح') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-center mt-4">
        ليس لديك حساب؟{' '}
        <Link href="/signup" className="text-cyan-700 underline">
          سجّل الآن
        </Link>
      </p>
    </div>
  );
}
