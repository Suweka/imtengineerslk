import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllProducts } from "@/lib/products-db";
import { ProductCard } from "@/components/product/ProductCard";

export default async function AccountWishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/account/login");

  const wishlist = await prisma.wishlist.findMany({ where: { userId: session.user.id } });
  const productIds = new Set(wishlist.map((w) => w.productId));

  const allProducts = await getAllProducts();
  const items = allProducts.filter((p) => productIds.has(p.id));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nothing saved yet.{" "}
          <Link href="/shop" className="font-semibold text-imt-blue hover:underline">Browse air conditioners →</Link>
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
