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
  features?: FeatureField[]; // Applies to this category AND its subcategories unless overridden
};


export type FeatureField = {
  key: string;
  label: string;
  type: "select" | "number" | "text";
  options?: string[];
  filterable?: boolean;
};

export type Province ={
  name: string;
}

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
    features: [
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"], filterable: true },
      { key: "material", label: "الخامة", type: "select", options: ["خشب", "معدن", "سيراميك"] }
    ],
    children: [{ name: "فرعي 1" }, { name: "فرعي 2" }]
  },
  {
    name: "الصوتيات والتلفزيونات والصور",
    features: [
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"], filterable: true },
      { key: "brand", label: "الماركة", type: "text" },
      { key: "screenSize", label: "حجم الشاشة (بوصة)", type: "number" }
    ],
    children: [{ name: "سماعات" }, { name: "تلفزيونات" }]
  },
  {
    name: "سيارات",
    features: [
      { key: "condition", label: "الحالة", type: "select", options: ["جديدة", "مستعملة"], filterable: true },
      { key: "make", label: "الماركة", type: "select", options: ["تويوتا", "هيونداي", "BMW"], filterable: true },
      { key: "mileage", label: "المسافة المقطوعة (كم)", type: "number", filterable: true }
    ],
    children: [{ name: "مستعملة" }, { name: "جديدة" }]
  },
  {
    name: "قطع غيار السيارات",
    features: [
      { key: "partType", label: "نوع القطعة", type: "text", filterable: true },
      { key: "condition", label: "الحالة", type: "select", options: ["جديدة", "مستعملة"] }
    ],
    children: [{ name: "المحرك" }, { name: "الفرامل" }]
  },
  {
    name: "ملحقات السيارات",
    features: [
      { key: "type", label: "نوع الملحق", type: "select", options: ["زينة", "أغطية", "أضواء"] },
      { key: "condition", label: "الحالة", type: "select", options: ["جديدة", "مستعملة"] }
    ],
    children: [{ name: "زينة" }, { name: "أغطية" }]
  },
  {
    name: "كتب",
    features: [
      { key: "level", label: "المستوى", type: "select", options: ["مبتدئ", "متوسط", "متقدم"] },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"], filterable: true }
    ],
    children: [
      { name: "أدب" }, { name: "تعليمي" }, { name: "ترفيهي" },
      { name: "رياضة" }, { name: "ديني" }, { name: "ثقافي" }
    ]
  },
  {
    name: "أقراص CD وDVD",
    features: [
      { key: "genre", label: "النوع", type: "select", options: ["أفلام", "موسيقى", "وثائقي"] },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "أفلام" }, { name: "موسيقى" }]
  },
  {
    name: "الكمبيوترات والبرامج",
    features: [
      { key: "deviceType", label: "نوع الجهاز", type: "select", options: ["لابتوب", "ديسكتوب"] },
      { key: "ram", label: "الرام", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "لابتوب" }, { name: "برامج" }]
  },
  {
    name: "الخدمات والمهنيين",
    features: [
      { key: "serviceType", label: "نوع الخدمة", type: "text" },
      { key: "experience", label: "عدد سنوات الخبرة", type: "number" }
    ],
    children: [{ name: "نقل" }, { name: "صيانة" }]
  },
  {
    name: "الحيوانات والإكسسوارات",
    features: [
      { key: "type", label: "النوع", type: "select", options: ["قطط", "كلاب", "طيور"] },
      { key: "age", label: "العمر (بالأشهر)", type: "number" }
    ],
    children: [{ name: "قطط" }, { name: "كلاب" }]
  },
  {
    name: "الترميم والأدوات",
    features: [
      { key: "toolType", label: "نوع الأداة", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "معدات" }, { name: "أدوات يدوية" }]
  },
  {
    name: "دراجات وهوائية ونارية",
    features: [
      { key: "bikeType", label: "النوع", type: "select", options: ["هوائية", "نارية"] },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "هوائية" }, { name: "نارية" }]
  },
  {
    name: "الهوايات والترفيه",
    features: [
      { key: "category", label: "نوع الهواية", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "ألعاب" }, { name: "هوايات فنية" }]
  },
  {
    name: "المنزل والمفروشات",
    features: [
      { key: "furnitureType", label: "نوع المفروشات", type: "text" },
      { key: "material", label: "الخامة", type: "select", options: ["خشب", "معدن", "بلاستيك"] }
    ],
    children: [{ name: "أثاث" }, { name: "ديكور" }]
  },
  {
    name: "منازل وغرف",
    features: [
      { key: "type", label: "نوع العقار", type: "select", options: ["منزل", "شقة", "غرفة"] },
      { key: "area", label: "المساحة (م²)", type: "number" },
      { key: "furnished", label: "مفروش", type: "select", options: ["نعم", "لا"] }
    ],
    children: [{ name: "غرف للإيجار" }, { name: "منازل للبيع" }]
  },
  {
    name: "الأطفال والرضع",
    features: [
      { key: "itemType", label: "نوع المنتج", type: "text" },
      { key: "ageGroup", label: "الفئة العمرية", type: "select", options: ["حديثي الولادة", "١-٣ سنوات", "٤-٦ سنوات"] }
    ],
    children: [{ name: "عربات" }, { name: "ألعاب أطفال" }]
  },
  {
    name: "ملابس | نساء",
    features: [
      { key: "size", label: "المقاس", type: "text" },
      { key: "brand", label: "الماركة", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "فساتين" }, { name: "أحذية" }]
  },
  {
    name: "ملابس | رجال",
    features: [
      { key: "size", label: "المقاس", type: "text" },
      { key: "brand", label: "الماركة", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "بناطيل" }, { name: "قمصان" }]
  },
  {
    name: "محركات",
    features: [
      { key: "engineType", label: "نوع المحرك", type: "text" },
      { key: "power", label: "القوة (حصان)", type: "number" }
    ],
    children: [{ name: "مولدات" }, { name: "مضخات" }]
  },
  {
    name: "الطوابع والعملات",
    features: [
      { key: "itemType", label: "النوع", type: "select", options: ["طوابع", "عملات"] },
      { key: "rarity", label: "الندرة", type: "select", options: ["نادر", "شائع"] }
    ],
    children: [{ name: "طوابع نادرة" }, { name: "عملات معدنية" }]
  },
  {
    name: "المجوهرات والحقائب والمظهر",
    features: [
      { key: "itemType", label: "نوع المنتج", type: "text" },
      { key: "material", label: "الخامة", type: "select", options: ["ذهب", "فضة", "جلد"] }
    ],
    children: [{ name: "ساعات" }, { name: "حقائب يد" }]
  },
  {
    name: "أجهزة الألعاب والألعاب الإلكترونية",
    features: [
      { key: "platform", label: "المنصة", type: "select", options: ["PS5", "Xbox", "Switch"] },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "بلايستيشن" }, { name: "إكس بوكس" }]
  },
  {
    name: "الرياضة واللياقة",
    features: [
      { key: "equipmentType", label: "نوع المعدات", type: "text" },
      { key: "brand", label: "الماركة", type: "text" }
    ],
    children: [{ name: "معدات رياضية" }, { name: "ملابس رياضية" }]
  },
  {
    name: "الاتصالات",
    features: [
      { key: "deviceType", label: "نوع الجهاز", type: "select", options: ["هاتف", "إكسسوار"] },
      { key: "brand", label: "الماركة", type: "text" }
    ],
    children: [{ name: "هواتف" }, { name: "إكسسوارات" }]
  },
  {
    name: "تذاكر وبطاقات",
    features: [
      { key: "eventType", label: "نوع الحدث", type: "select", options: ["حفلة", "مباراة", "عرض"] },
      { key: "date", label: "التاريخ", type: "text" }
    ],
    children: [{ name: "حفلات" }, { name: "مباريات" }]
  },
  {
    name: "الحدائق والتراسات",
    features: [
      { key: "itemType", label: "نوع المنتج", type: "text" },
      { key: "material", label: "الخامة", type: "text" }
    ],
    children: [{ name: "أثاث خارجي" }, { name: "معدات حدائق" }]
  },
  {
    name: "الوظائف الشاغرة",
    features: [
      { key: "jobType", label: "نوع الوظيفة", type: "select", options: ["دوام كامل", "جزئي"] },
      { key: "experience", label: "الخبرة المطلوبة", type: "number" }
    ],
    children: [{ name: "بدوام كامل" }, { name: "عمل جزئي" }]
  },
  {
    name: "العطل والإجازات",
    features: [
      { key: "location", label: "الموقع", type: "text" },
      { key: "days", label: "عدد الأيام", type: "number" }
    ],
    children: [{ name: "شاليهات" }, { name: "فنادق" }]
  },
  {
    name: "المقتنيات",
    features: [
      { key: "rarity", label: "الندرة", type: "select", options: ["نادر", "شائع"] },
      { key: "origin", label: "المنشأ", type: "text" }
    ],
    children: [{ name: "قطع نادرة" }, { name: "مقتنيات فنية" }]
  },
  {
    name: "الرياضات المائية والقوارب",
    features: [
      { key: "equipmentType", label: "نوع المعدة", type: "text" },
      { key: "condition", label: "الحالة", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "قوارب" }, { name: "معدات غوص" }]
  },
  {
    name: "الأجهزة الكهربائية المنزلية",
    features: [
      { key: "deviceType", label: "نوع الجهاز", type: "text" },
      { key: "power", label: "القدرة الكهربائية (واط)", type: "number" }
    ],
    children: [{ name: "ثلاجات" }, { name: "مكيفات" }]
  },
  {
    name: "بضائع للأعمال",
    features: [
      { key: "businessType", label: "نوع العمل", type: "text" },
      { key: "usage", label: "مستعمل / جديد", type: "select", options: ["جديد", "مستعمل"] }
    ],
    children: [{ name: "معدات مكتبية" }, { name: "معدات صناعية" }]
  },
  {
    name: "منوعات",
    features: [
      { key: "description", label: "الوصف", type: "text" }
    ],
    children: [{ name: "أخرى" }]
  }
];
export const allProvincies: Province[] = [
  { name: "دمشق" },
  { name: "ريف دمشق" },
  { name: "حلب" },
  { name: "حمص" },
  { name: "حماة" },
  { name: "اللاذقية" },
  { name: "طرطوس" },
  { name: "إدلب" },
  { name: "درعا" },
  { name: "السويداء" },
  { name: "القنيطرة" },
  { name: "دير الزور" },
  { name: "الحسكة" },
  { name: "الرقة" }
];



