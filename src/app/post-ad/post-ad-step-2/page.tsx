"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { fullCategories, FeatureField } from "@/lib/data";
import { allProvincies } from "@/lib/data";
import { useSession } from "next-auth/react";

export default function PostAdDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryPath, setCategoryPath] = useState<string>("غير محدد");
  const [title, setTitle] = useState("");
  const [charCount, setCharCount] = useState(60);
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [mustGo, setMustGo] = useState(false);
  const [highlightAd, setHighlightAd] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [featureValues, setFeatureValues] = useState<Record<string, string>>(
    {}
  );
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [features, setFeatures] = useState<FeatureField[]>([]);

  const [priceType, setPriceType] = useState("Requested price");
  const [askingPrice, setAskingPrice] = useState("");
  const [allowBidding, setAllowBidding] = useState(false);

  const [showPhone, setShowPhone] = useState(true);
  const [province, setProvince] = useState("");
  const [place, setPlace] = useState("");
  const [addressDetails, setAddressDetails] = useState("");

  const { data: session, status } = useSession();

  const userName = session?.user?.name || "اسم المستخدم";
  const userEmail = session?.user?.email || "user@example.com";
  const [selectedFormat, setSelectedFormat] = useState<
    "free" | "plus" | "premium"
  >("free");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("postAdStep1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.category && parsed?.subcategory) {
          setCategoryPath(`${parsed.category} > ${parsed.subcategory}`);
        } else if (parsed?.category) {
          setCategoryPath(parsed.category);
        }
        if (parsed?.title) {
          setTitle(parsed.title);
          setCharCount(60 - parsed.title.length);
        }
      } catch {
        console.error("Invalid step1Data in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("postAdStep1");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const category = parsed?.category;
      const subcategory = parsed?.subcategory;
      const currentCategory = fullCategories.find(
        (cat) => cat.name === category
      );
      const featuresList: FeatureField[] = currentCategory?.features || [];
      setFeatures(featuresList);
      if (category && subcategory) {
        setCategoryPath(`${category} > ${subcategory}`);
      } else if (category) {
        setCategoryPath(category);
      }

      if (parsed?.title) {
        setTitle(parsed.title);
        setCharCount(60 - parsed.title.length);
      }
    } catch (err) {
      console.error("Invalid localStorage data:", err);
    }
  }, []);

  // === Image handling ===
  useEffect(() => {
    const savedFiles = localStorage.getItem("step2Images");
    if (savedFiles) {
      try {
        const blobs = JSON.parse(savedFiles) as string[];
        const files = blobs.map((base64: string, i) => {
          const byteString = atob(base64.split(",")[1]);
          const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
          }
          return new File([ab], `image-${i}.jpg`, { type: mimeString });
        });
        // const saved = localStorage.getItem("postAdStep1");

        setImages(files);
      } catch (e) {
        console.error("Failed to load step2Images", e);
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
      localStorage.setItem("step2Images", JSON.stringify(base64s));
    };

    if (images.length > 0) storeImages();
    else localStorage.removeItem("step2Images");
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 60);
    setTitle(val);
    setCharCount(60 - val.length);
  };

  function formatCommand(command: string) {
    descriptionRef.current?.focus();
    document.execCommand(command, false, undefined);
  }
  useEffect(() => {
    const handleSelectionChange = () => {
      const formats = [];

      if (document.queryCommandState("bold")) formats.push("bold");
      if (document.queryCommandState("italic")) formats.push("italic");
      if (document.queryCommandState("underline")) formats.push("underline");
      if (document.queryCommandState("insertUnorderedList"))
        formats.push("insertUnorderedList");
      setActiveFormats(formats);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "العنوان مطلوب";
    }
    if (categoryPath === "غير محدد") {
      newErrors.categoryPath = "الرجاء اختيار القسم";
    }
    if (!priceType) {
      newErrors.priceType = "الرجاء اختيار نوع السعر";
    } else if (priceType === "Requested price" && !askingPrice) {
      newErrors.price = "الرجاء إدخال السعر";
    }
    if (!province) {
      newErrors.province = "الرجاء اختيار المحافظة";
    }
    if (!place.trim()) {
      newErrors.city = "الرجاء إدخال اسم المدينة أو القرية";
    }
    if (images.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    localStorage.setItem(
      "postAdStep2",
      JSON.stringify({ title, description, website, mustGo, highlightAd })
    );

    router.push("/post-ad/post-ad-step-3");
  };

  if (status === "loading") {
    return <p>جارٍ التحميل...</p>; // or return skeleton/spinner
  }

  return (
    <div
      key={pathname}
      className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8 text-right space-y-8"
    >
      <h1 className="text-2xl font-semibold">تفاصيل الإعلان</h1>

      {/* 1. Selected Category */}
      <section>
        <h2 className="text-base font-semibold mb-1">القسم المختار</h2>
        <div className="flex justify-between items-center border rounded p-3 bg-gray-50 text-sm">
          <div className="text-gray-700">{categoryPath}</div>
          <button
            className="text-cyan-700 font-semibold hover:underline text-sm"
            onClick={() => router.push("/post-ad")}
          >
            تغيير
          </button>
        </div>
      </section>

      <hr />

      {/* 2. Upload Photos */}
      <section>
        <h2 className="text-base font-semibold mb-2">صور المنتج</h2>
        <p className="text-sm text-gray-600 mb-3">
          يمكنك رفع حتى 16 صورة. الصورة الأولى ستكون الرئيسية.
        </p>

        <div className="flex flex-wrap gap-3 items-start">
          {/* Main Photo */}
          {images[0] && (
            <div
              className="relative w-48 h-48 border rounded overflow-hidden group"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("photoIndex", "0")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const from = parseInt(e.dataTransfer.getData("photoIndex"));
                if (!isNaN(from)) movePhoto(from, 0);
              }}
            >
              <Image
                src={URL.createObjectURL(images[0])}
                alt="main-photo"
                fill
                className="object-cover"
              />
              <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                الصورة الرئيسية
              </span>

              {/* Remove Main Photo */}
              <button
                onClick={() => handleRemovePhoto(0)}
                className="absolute top-2 left-2 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Thumbnails */}
          {images.slice(1).map((img, index) => {
            const realIndex = index + 1;
            return (
              <div
                key={realIndex}
                className="relative w-24 h-24 border rounded overflow-hidden group"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("photoIndex", realIndex.toString())
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = parseInt(e.dataTransfer.getData("photoIndex"));
                  if (!isNaN(from)) movePhoto(from, realIndex);
                }}
              >
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`photo-${realIndex}`}
                  fill
                  className="object-cover"
                />

                {/* Remove */}
                <button
                  onClick={() => handleRemovePhoto(realIndex)}
                  className="absolute top-1 left-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>

                {/* Move Left */}
                {realIndex > 1 && (
                  <button
                    className="absolute bottom-1 right-1 text-xs bg-white bg-opacity-80 px-1 rounded"
                    onClick={() => movePhoto(realIndex, realIndex - 1)}
                  >
                    ←
                  </button>
                )}

                {/* Move Right */}
                {realIndex < images.length - 1 && (
                  <button
                    className="absolute bottom-1 left-1 text-xs bg-white bg-opacity-80 px-1 rounded"
                    onClick={() => movePhoto(realIndex, realIndex + 1)}
                  >
                    →
                  </button>
                )}

                {/* Set as Main */}
                <button
                  onClick={() => movePhoto(realIndex, 0)}
                  className="absolute bottom-1 inset-x-1 text-[10px] bg-cyan-700 text-white rounded px-1 py-[1px] opacity-0 group-hover:opacity-100"
                >
                  تعيين كصورة رئيسية
                </button>
              </div>
            );
          })}

          {/* Upload Button */}
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
        {errors.images && (
          <p className="mt-1 text-sm text-red-500">{errors.images}</p>
        )}
      </section>

      <hr />

      {/* 4. Promotion */}
      <section>
        <h2 className="text-base font-semibold mb-2">
          إعلان في الصفحة الرئيسية
        </h2>
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
          <span className="text-sm text-gray-600">
            (التكلفة: 100,000 ليرة سورية)
          </span>
        </label>
      </section>

      <hr />
      {/* 3. Ad Details */}
      <section>
        <h2 className="text-base font-semibold mb-2">التفاصيل</h2>

        {/* Title */}
        <label htmlFor="title" className="block font-semibold mb-1">
          العنوان <span className="text-red-600">*</span>
        </label>
        <div className="relative mb-2">
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full border p-2 pr-16 rounded"
            maxLength={60}
            placeholder="أدخل عنوان الإعلان"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
          <span className="absolute top-1/2 -translate-y-1/2 left-4 text-sm text-gray-400">
            {charCount} حرف متبقي
          </span>
        </div>

        {/* Description */}
        <label htmlFor="description" className="block font-semibold mb-1 mt-4">
          الوصف <span className="text-red-600">*</span>
        </label>

        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => formatCommand("bold")}
            className={`p-1 border rounded text-sm font-bold ${
              activeFormats.includes("bold") ? "bg-gray-300" : ""
            }`}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => formatCommand("italic")}
            className={`p-1 border rounded text-sm italic ${
              activeFormats.includes("italic") ? "bg-gray-300" : ""
            }`}
          >
            I
          </button>

          <button
            type="button"
            onClick={() => formatCommand("underline")}
            className={`p-1 border rounded text-sm underline ${
              activeFormats.includes("underline") ? "bg-gray-300" : ""
            }`}
          >
            U
          </button>

          <button
            type="button"
            onClick={() => formatCommand("insertUnorderedList")}
            className={`p-1 border rounded text-sm ${
              activeFormats.includes("insertUnorderedList") ? "bg-gray-300" : ""
            }`}
          >
            •
          </button>
        </div>

        <div
          id="description"
          ref={descriptionRef}
          contentEditable
          onInput={(e) => setDescription(e.currentTarget.innerHTML)}
          className="w-full border p-2 rounded h-32 overflow-y-auto list-disc pl-4 [&_ul]:list-disc [&_ul]:pl-5"
          style={{ whiteSpace: "pre-wrap" }}
        ></div>

        {/* Website */}
        <label htmlFor="website" className="block font-semibold mb-1 mt-4">
          أضف موقع ويب (اختياري)
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="https://example.com"
        />

        {/* Must Go Checkbox */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mustGo}
              onChange={(e) => setMustGo(e.target.checked)}
              className="accent-cyan-600"
            />
            <span className="font-semibold">إضافة ملصق يجب البيع الآن</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            ملصق يجب البيع الآن يظهر لمدة 7 أيام للإعلانات التي ترغب ببيعها
            بسرعة
          </p>
        </div>
      </section>

      <hr />

      {/* 4. Feature Section */}
      <section>
        <h2 className="text-base font-semibold mb-6">الميزات</h2>

        <div className="grid md:grid-cols-[minmax(0,500px)_auto] gap-6 items-start">
          {/* Features on the right */}
          <div className="w-3/4 flex flex-col gap-4">
            {features.map((feature) => (
              <div key={feature.key} className="flex flex-col text-right">
                <label className="mb-1 font-medium text-sm text-gray-700">
                  {feature.label}
                </label>
                <select
                  value={featureValues[feature.key] || ""}
                  onChange={(e) =>
                    setFeatureValues((prev) => ({
                      ...prev,
                      [feature.key]: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">اختر...</option>
                  {feature.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Progress bar pinned to the left */}
          <div className="w-full md:w-auto text-left">
            <p className="text-sm text-gray-600 mb-4">
              اذكر الميزات لتتمكن من بيع أسرع
            </p>

            <div className="flex items-center justify-end mb-4 w-full gap-2">
              <div className="flex-grow h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-2 bg-cyan-600"
                  style={{
                    width: `${
                      (Object.values(featureValues).filter((v) => v !== "")
                        .length /
                        features.length) *
                      100
                    }%`,
                    transition: "width 0.3s",
                  }}
                ></div>
              </div>
              <div className="text-sm text-gray-700 whitespace-nowrap p-1">
                {Object.values(featureValues).filter((v) => v !== "").length}/
                {features.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* Price section */}
      <section className="mt-8">
        <h2 className="text-base font-semibold mb-4">السعر</h2>

        <div className="flex flex-col gap-4 w-full md:max-w-md text-right">
          {/* Price Type Dropdown */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              نوع السعر
            </label>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Requested price">سعر محدد</option>
              <option value="Offer">قابل للتفاوض</option>
              <option value="Free">مجاني</option>
            </select>
          </div>

          {/* If Requested price is selected */}
          {priceType === "Requested price" && (
            <>
              {/* Asking Price Input */}
              <div>
                <label className="mb-1 font-medium text-sm text-gray-700 block">
                  السعر المطلوب
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Allow Bidding Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  السماح بالمزايدة
                </label>
                <button
                  type="button"
                  onClick={() => setAllowBidding((prev) => !prev)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    allowBidding ? "bg-cyan-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      allowBidding ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                السماح بالمزايدة يعزز فرص البيع!
              </p>
            </>
          )}
        </div>
      </section>

      <hr />

      {/* Contact section */}
      <section className="mt-10">
        <h2 className="text-base font-semibold mb-4">
          تفاصيل التواصل والتفضيلات
        </h2>

        <div className="flex flex-col gap-4 w-full md:max-w-2xl text-right">
          {/* Name */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              الاسم الظاهر في الإعلان
            </label>
            <input value={userName} disabled />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              البريد الإلكتروني
            </label>
            <input value={userEmail} disabled />
          </div>

          {/* Phone toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              عرض رقم الهاتف مع الإعلان؟
            </label>
            <button
              type="button"
              onClick={() => setShowPhone((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                showPhone ? "bg-cyan-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  showPhone ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Province dropdown */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              المحافظة
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">اختر المحافظة</option>
              {allProvincies.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-500">{errors.province}</p>
            )}
          </div>

          {/* City/Village */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              المدينة أو القرية
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="مثال: جرمانا، سلمية، عامودا..."
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          {/* Address details */}
          <div>
            <label className="mb-1 font-medium text-sm text-gray-700 block">
              تفاصيل إضافية للعنوان (اختياري)
            </label>
            <input
              type="text"
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="مثال: خلف السوبرماركت الكبير"
            />
          </div>
        </div>
      </section>

      <hr />

      <section className="mt-10">
        <h2 className="text-base font-semibold mb-2">كيف تريد الإعلان؟</h2>
        <p className="text-sm text-gray-600 mb-6">
          اختر تنسيق الإعلان الذي يناسب أهدافك في البيع.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
          {/* Free Plan */}
          <div
            onClick={() => setSelectedFormat("free")}
            className={`flex flex-col justify-between border rounded-lg p-4 cursor-pointer transition duration-200 ${
              selectedFormat === "free"
                ? "border-green-600 bg-green-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-green-700">مجاني</h3>
                {selectedFormat === "free" && (
                  <span className="text-green-600 text-xs">✔ مختار</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-4">رؤية افتراضية</p>
              <ul className="text-xs text-gray-700 space-y-1 mb-4">
                <li>🕒 يظهر لمدة 4 أسابيع</li>
              </ul>
              <p className="text-sm font-semibold mb-2">€0.00</p>
            </div>
            <div
              className={`text-center text-sm font-medium py-1 rounded ${
                selectedFormat === "free"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {selectedFormat === "free" ? "مختار" : "اختر"}
            </div>
          </div>

          {/* Plus Plan */}
          <div
            onClick={() => setSelectedFormat("plus")}
            className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
              selectedFormat === "plus"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-blue-700">بلس</h3>
              {selectedFormat === "plus" && (
                <span className="text-blue-600 text-xs">✔ مختار</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-4">رؤية أعلى</p>
            <ul className="text-xs text-gray-700 space-y-1 mb-4">
              <li>🕒 يظهر لمدة 4 أسابيع</li>
              <li>👁 يُشاهد أكثر بـ 6 مرات</li>
              <li>📌 يظهر لمدة 24 ساعة فوق الإعلانات العادية</li>
            </ul>
            <p className="text-sm font-semibold mb-2">€0.99</p>
            <div
              className={`text-center text-sm font-medium py-1 rounded ${
                selectedFormat === "plus"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {selectedFormat === "plus" ? "مختار" : "اختر"}
            </div>
          </div>

          {/* Premium Plan */}
          <div
            onClick={() => setSelectedFormat("premium")}
            className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
              selectedFormat === "premium"
                ? "border-blue-800 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-blue-900">بريميوم</h3>
              {selectedFormat === "premium" && (
                <span className="text-blue-800 text-xs">✔ مختار</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-4">أعلى رؤية</p>
            <ul className="text-xs text-gray-700 space-y-1 mb-4">
              <li>🕒 يظهر لمدة 4 أسابيع</li>
              <li>👁 يُشاهد أكثر بـ 15 مرة</li>
              <li>📌 يظهر لمدة 7 أيام فوق الإعلانات العادية</li>
            </ul>
            <p className="text-sm font-semibold mb-2">€4.19</p>
            <div
              className={`text-center text-sm font-medium py-1 rounded ${
                selectedFormat === "premium"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {selectedFormat === "premium" ? "مختار" : "اختر"}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          السعر صالح لأول 4 أسابيع. يمكن تمديد الإعلان 3 مرات مجاناً باستخدام
          الرؤية الافتراضية.
        </p>
      </section>

      <hr />

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
