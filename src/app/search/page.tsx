export default function SearchPage({
  searchParams,
}: {
  readonly searchParams: { readonly category?: string; readonly q?: string };
}) {
  const category = searchParams.category;
  const query = searchParams.q;

  return (
    <div>
      <h1>نتائج البحث</h1>
      <p>الفئة: {category}</p>
      <p>الكلمة: {query}</p>
    </div>
  );
}
