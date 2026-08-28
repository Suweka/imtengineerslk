import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products-db";

// GET /api/products?ids=id1,id2,id3 - public lookup, used by client components
// like "Recently viewed" that only know product IDs (from localStorage).
export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  const all = await getAllProducts();

  if (!idsParam) return NextResponse.json(all);

  const ids = idsParam.split(",").filter(Boolean);
  const byId = new Map(all.map((p) => [p.id, p]));
  const ordered = ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return NextResponse.json(ordered);
}
