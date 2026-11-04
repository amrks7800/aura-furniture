"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { ShowcaseCard } from "@/components/ShowcaseCarousel";
import { HOMEPAGE_SHOWCASE_ROWS } from "@/data/homepage-showcase";
import type { AuraProduct } from "@/lib/vondera";

export function WishlistClient({ products }: { products: AuraProduct[] }) {
  const { wishlist, toggleWishlist } = useStore();

  const savedCatalogProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  );

  const savedShowcaseItems = useMemo(() => {
    const allShowcase = HOMEPAGE_SHOWCASE_ROWS.flatMap((r) => r.items);
    const seen = new Set<string>();
    return allShowcase.filter((item) => {
      if (!wishlist.includes(item.id) || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [wishlist]);

  const totalSaved = savedCatalogProducts.length + savedShowcaseItems.length;

  const clearAll = () => {
    wishlist.forEach((id) => toggleWishlist(id));
  };

  return (
    <main>
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "#faf8f4",
        }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            paddingTop: "0.85rem",
            paddingBottom: "0.85rem",
            flexWrap: "wrap",
          }}
        >
          <div className="flex items-center gap-2 text-xs text-[var(--muted-fg)]">
            <Link href="/" className="hover:text-[var(--fg)]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[var(--fg)] font-medium">Saved Pieces</span>
          </div>
          <Link href="/products" className="chip">
            Browse All 447 Products →
          </Link>
        </div>
      </div>

      <section className="products-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Your Wishlist</p>
              <h1 className="display-title mt-1">Saved Pieces</h1>
              <p className="mt-1.5 text-sm text-[var(--muted-fg)]">
                {totalSaved === 0
                  ? "You haven't saved any furniture pieces yet."
                  : `You have ${totalSaved} saved ${
                      totalSaved === 1 ? "piece" : "pieces"
                    } ready to compare or add to your bag.`}
              </p>
            </div>
            {totalSaved > 0 && (
              <button type="button" className="chip" onClick={clearAll}>
                Clear Saved List
              </button>
            )}
          </div>

          {totalSaved === 0 ? (
            <div className="empty-state">
              <p>
                Tap the heart icon on any piece across our rooms or catalog to
                save it here.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Link href="/products" className="chip is-active">
                  Explore Full Catalog
                </Link>
                <Link href="/rooms/living-room" className="chip">
                  Living Room Edit
                </Link>
                <Link href="/rooms/bedroom" className="chip">
                  Bedroom Edit
                </Link>
              </div>
            </div>
          ) : (
            <div className="mp-expanded-grid">
              {savedShowcaseItems.map((item) => (
                <ShowcaseCard key={item.id} item={item} />
              ))}
              {savedCatalogProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
