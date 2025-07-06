'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Form = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState<Form>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
        setMessage(null); // clear general messages on input change
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Form, string>> = {};

        if (!form.name.trim()) {
            newErrors.name = 'الرجاء إدخال الاسم';
        }
        if (!form.email.trim()) {
            newErrors.email = 'الرجاء إدخال البريد الإلكتروني';
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ) {
            newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
        }
        if (!form.password) {
            newErrors.password = 'الرجاء إدخال كلمة المرور';
        } else if (
            form.password.length < 8 ||
            !/\d/.test(form.password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
        ) {
            newErrors.password =
                'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، رقم واحد، وحرف خاص واحد';
        }
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'الرجاء تأكيد كلمة المرور';
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!validate()) {
            return;
        }
        if (!passwordRegex.test(form.password)) {
            setMessage('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، رقم واحد، وحرف خاص واحد');
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('تم إنشاء الحساب بنجاح! سيتم توجيهك إلى تسجيل الدخول...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage(data.error ?? 'حدث خطأ أثناء التسجيل');
            }
        } catch {
            setMessage('فشل الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 border bg-white npm run dev p-6 rounded shadow">
            <h1 className="text-xl font-bold mt-2 mb-4 text-center">إنشاء حساب جديد</h1>

            <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="الاسم"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded text-right ${errors.name ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="البريد الإلكتروني"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full border p-2 mt-4 rounded text-right ${errors.email ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="كلمة المرور"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full border p-2 mt-4 rounded text-right ${errors.password ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs mt-1 text-gray-600">
                        الحد الأدنى 8 أحرف، رقم واحد على الأقل، وحرف خاص واحد
                    </p>
                </div>

                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="تأكيد كلمة المرور"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full border p-2 mt-4 rounded text-right ${errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <div className="flex justify-between items-center space-x-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-grow bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 disabled:opacity-50"
                    >
                        {loading ? 'جارٍ التسجيل...' : 'سجّل'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        إلغاء
                    </button>
                </div>
            </form>

            {message && (
                <p
                    className={`mt-4 text-center text-sm ${message.includes('نجاح') ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
