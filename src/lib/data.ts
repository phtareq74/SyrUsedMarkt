// lib/data.ts

export type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  photos?: string[];           // multiple images for product gallery
  categoryPath: string[];
  description?: string;
  views?: number;
  favorites?: number;
  postedAt?: string;           // ISO date/time string or formatted string
  condition?: string;

  sellerName?: string;
  sellerActiveYears?: number;
  sellerArea?: string;
  minimumOffer?: 100;
};

export type Category = {
  name: string;
  children?: Category[];
};

export const allProducts: Product[] = [
  {
    id: "ac-excellent-001",
    title: "مكيف بحالة ممتازة",
    price: "800,000 ل.س",
    image: "/images/sample1.jpg",
    categoryPath: ["الأجهزة الكهربائية المنزلية", "مكيفات وتبريد", "مكيفات"]
  },
  {
    id: "wooden-desk-001",
    title: "مكتب دراسي خشب طبيعي",
    price: "قدّم عرضاً",
    image: "/images/sample2.jpg",
    categoryPath: ["بضائع للأعمال", "الأثاث المكتبي والتجهيزات", "مكاتب دراسية"]
  },
  {
    id: "office-chair-001",
    title: "كرسي مكتب مريح",
    price: "قدّم عرضاً",
    image: "/images/sample2.jpg",
    categoryPath: ["بضائع للأعمال", "الأثاث المكتبي والتجهيزات", "كراسي مكتب"]
  },
  {
    id: "fridge-almost-new-001",
    title: "ثلاجة شبه جديدة",
    price: "1,200,000 ل.س",
    image: "/images/sample1.jpg",
    categoryPath: ["الأجهزة الكهربائية المنزلية", "ثلاجات وتجميد", "ثلاجات"]
  },
  {
    id: "iphone-used-001",
    title: "هاتف آيفون مستخدم",
    price: "2,500,000 ل.س",
    image: "/images/sample1.jpg",
    categoryPath: ["إلكترونيات", "هواتف نقالة", "هواتف ذكية"]
  },
  {
    id: "classic-sofa-001",
    title: "كنبة صالون كلاسيكية",
    price: "قدّم عرضاً",
    image: "/images/sample2.jpg",
    categoryPath: ["المنزل والمفروشات", "الأثاث", "كنب وصالونات"]
  },
  // Add other products here
];

export const fullCategories: Category[] = [
  {
    name: "التحف والفن",
    children: [{ name: "فرعي 1" }, { name: "فرعي 2" }]
  },
  {
    name: "الصوتيات والتلفزيونات والصور",
    children: [{ name: "سماعات" }, { name: "تلفزيونات" }]
  },
  {
    name: "سيارات",
    children: [{ name: "مستعملة" }, { name: "جديدة" }]
  },
  {
    name: "قطع غيار السيارات",
    children: [{ name: "المحرك" }, { name: "الفرامل" }]
  },
  {
    name: "ملحقات السيارات",
    children: [{ name: "زينة" }, { name: "أغطية" }]
  },
  {
    name: "كتب",
    children: [{ name: "أدب" }, { name: "تعليمي" }, { name: "ترفيهي" }, { name: "رياضة" }, { name: "ديني" }, { name: "ثقافي" }]
  },
  {
    name: "أقراص CD وDVD",
    children: [{ name: "أفلام" }, { name: "موسيقى" }]
  },
  {
    name: "الكمبيوترات والبرامج",
    children: [{ name: "لابتوب" }, { name: "برامج" }]
  },
  {
    name: "الخدمات والمهنيين",
    children: [{ name: "نقل" }, { name: "صيانة" }]
  },
  {
    name: "الحيوانات والإكسسوارات",
    children: [{ name: "قطط" }, { name: "كلاب" }]
  },
  {
    name: "الترميم والأدوات",
    children: [{ name: "معدات" }, { name: "أدوات يدوية" }]
  },
  {
    name: "دراجات وهوائية ونارية",
    children: [{ name: "هوائية" }, { name: "نارية" }]
  },
  {
    name: "الهوايات والترفيه",
    children: [{ name: "ألعاب" }, { name: "هوايات فنية" }]
  },
  {
    name: "المنزل والمفروشات",
    children: [{ name: "أثاث" }, { name: "ديكور" }]
  },
  {
    name: "منازل وغرف",
    children: [{ name: "غرف للإيجار" }, { name: "منازل للبيع" }]
  },
  {
    name: "الأطفال والرضع",
    children: [{ name: "عربات" }, { name: "ألعاب أطفال" }]
  },
  {
    name: "ملابس | نساء",
    children: [{ name: "فساتين" }, { name: "أحذية" }]
  },
  {
    name: "ملابس | رجال",
    children: [{ name: "بناطيل" }, { name: "قمصان" }]
  },
  {
    name: "محركات",
    children: [{ name: "مولدات" }, { name: "مضخات" }]
  },
  {
    name: "الطوابع والعملات",
    children: [{ name: "طوابع نادرة" }, { name: "عملات معدنية" }]
  },
  {
    name: "المجوهرات والحقائب والمظهر",
    children: [{ name: "ساعات" }, { name: "حقائب يد" }]
  },
  {
    name: "أجهزة الألعاب والألعاب الإلكترونية",
    children: [{ name: "بلايستيشن" }, { name: "إكس بوكس" }]
  },
  {
    name: "الرياضة واللياقة",
    children: [{ name: "معدات رياضية" }, { name: "ملابس رياضية" }]
  },
  {
    name: "الاتصالات",
    children: [{ name: "هواتف" }, { name: "إكسسوارات" }]
  },
  {
    name: "تذاكر وبطاقات",
    children: [{ name: "حفلات" }, { name: "مباريات" }]
  },
  {
    name: "الحدائق والتراسات",
    children: [{ name: "أثاث خارجي" }, { name: "معدات حدائق" }]
  },
  {
    name: "الوظائف الشاغرة",
    children: [{ name: "بدوام كامل" }, { name: "عمل جزئي" }]
  },
  {
    name: "العطل والإجازات",
    children: [{ name: "شاليهات" }, { name: "فنادق" }]
  },
  {
    name: "المقتنيات",
    children: [{ name: "قطع نادرة" }, { name: "مقتنيات فنية" }]
  },
  {
    name: "الرياضات المائية والقوارب",
    children: [{ name: "قوارب" }, { name: "معدات غوص" }]
  },
  {
    name: "الأجهزة الكهربائية المنزلية",
    children: [{ name: "ثلاجات" }, { name: "مكيفات" }]
  },
  {
    name: "بضائع للأعمال",
    children: [{ name: "معدات مكتبية" }, { name: "معدات صناعية" }]
  },
  {
    name: "منوعات",
    children: [{ name: "أخرى" }]
  }
];

