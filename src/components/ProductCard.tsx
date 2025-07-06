import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/data";

type ProductCardProps = Readonly<{
  product: Product;
}>;
export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow p-3 hover:shadow-md transition"
    >
      <Image
        src={product.image}
        alt={product.title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="font-bold text-sm mt-2">{product.title}</h3>
      <p className="text-amber-600 font-semibold">{product.price}</p>
    </Link>
  );
}
