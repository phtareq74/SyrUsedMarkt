'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';

export default function PostAdDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryPath, setCategoryPath] = useState<string>('غير محدد');;
  
useEffect(() => {
  const saved = localStorage.getItem('postAdStep1');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.category && parsed?.subcategory) {
        setCategoryPath(`${parsed.category} > ${parsed.subcategory}`);
      } else if (parsed?.category) {
        setCategoryPath(parsed.category);
      }

    } catch {
      console.error('Invalid step1Data in localStorage');
    }
  }
}, []);


  // === Photos upload ===
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const savedFiles = localStorage.getItem('step2Images');
    if (savedFiles) {
      try {
        const blobs = JSON.parse(savedFiles) as string[];
        const files = blobs.map((base64: string, i) => {
          const byteString = atob(base64.split(',')[1]);
          const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
          }
          return new File([ab], `image-${i}.jpg`, { type: mimeString });
        });
        setImages(files);
      } catch (e) {
        console.error('Failed to load step2Images', e);
      }
    }
  }, []);

  useEffect(() => {
    const toBase64 = async (file: File) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

    const storeImages = async () => {
      const base64s = await Promise.all(images.map(toBase64));
      localStorage.setItem('step2Images', JSON.stringify(base64s));
    };

    if (images.length > 0) storeImages();
    else localStorage.removeItem('step2Images');
  }, [images]);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 16 - images.length);
    setImages([...images, ...newFiles]);
  };

  const handleRemovePhoto = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const movePhoto = (from: number, to: number) => {
    const updated = [...images];
    const movedItem = updated.splice(from, 1)[0];
    updated.splice(to, 0, movedItem);
    setImages(updated);
  };

  // === Promotion ===
  const [highlightAd, setHighlightAd] = useState(false);

  return (
    <div key={pathname} className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8 text-right space-y-8">

      <h1 className="text-2xl font-semibold">تفاصيل الإعلان</h1>

      {/* 1. Selected Category */}
      <section>
        <h2 className="text-base font-semibold mb-1">القسم المختار</h2>
        <div className="flex justify-between items-center border rounded p-3 bg-gray-50 text-sm">
          <div className="text-gray-700">{categoryPath}</div>

          <button
            className="text-cyan-700 font-semibold hover:underline text-sm"
            onClick={() => router.push('/post-ad')}
          >
            تغيير
          </button>
        </div>
      </section>

      <hr />

      {/* 2. Upload Photos */}
      <section>
        <h2 className="text-base font-semibold mb-2">صور المنتج</h2>
        <p className="text-sm text-gray-600 mb-3">يمكنك رفع حتى 16 صورة.</p>

        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, index) => (
            <div key={index} className="relative w-24 h-24 border rounded overflow-hidden group">
              <Image
                src={URL.createObjectURL(img)}
                alt={`photo-${index}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-1 left-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
              {index > 0 && (
                <button
                  className="absolute bottom-1 right-1 text-xs bg-white bg-opacity-80 px-1 rounded"
                  onClick={() => movePhoto(index, index - 1)}
                >
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  className="absolute bottom-1 left-1 text-xs bg-white bg-opacity-80 px-1 rounded"
                  onClick={() => movePhoto(index, index + 1)}
                >
                  →
                </button>
              )}
            </div>
          ))}

          {images.length < 16 && (
            <button
              className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={24} className="text-gray-400" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleAddPhoto}
          className="hidden"
        />
      </section>

      <hr />

      {/* 3. Promotion Option */}
      <section>
        <h2 className="text-base font-semibold mb-2">إعلان في الصفحة الرئيسية</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={highlightAd}
            onChange={() => setHighlightAd(!highlightAd)}
            className="accent-cyan-600"
          />
          <span className="text-sm font-semibold text-cyan-700">
            نعم، أرغب بالحصول على اهتمام إضافي
          </span>
          <span className="text-sm text-gray-600">(التكلفة: 100,000 ليرة سورية)</span>
        </label>
      </section>

      <hr />

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert('تم الانتقال للخطوة التالية')}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
