"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { ProductCard } from "@/components/ProductCard";
import { matchesCategoryFilter } from "@/lib/catalog-utils";
import {
  HOMEPAGE_SHOWCASE_ROWS,
  type ShowcaseCardItem,
  type ShowcaseRow,
} from "@/data/homepage-showcase";
import type { AuraProduct, AuraStoreInfo } from "@/lib/vondera";
import type { Category } from "vondera-sdk";

interface CatalogClientProps {
  store: AuraStoreInfo | null;
  categories: Category[];
  products: AuraProduct[];
  initialCategoryId?: string;
}

const HERO_SLIDES = [
  {
    image: "/images/homepage/base44-1.png",
    alt: "Living room in warm neutral tones",
    eyebrow: "New season · Living",
    title: "Find the pieces that make it home.",
    subtitle:
      "Discover considered pieces from independent furniture makers and trusted sellers across Egypt.",
    cta: "Explore the collection",
    categoryId: "living-room",
  },
  {
    image: "/images/homepage/base44-2.png",
    alt: "Softly furnished bedroom",
    eyebrow: "The bedroom edit",
    title: "Sleep, quietly furnished.",
    subtitle:
      "Low platform beds, washed linen and soft morning light — our calmest collection yet.",
    cta: "Shop the bedroom edit",
    categoryId: "bedroom",
  },
  {
    image: "/images/homepage/base44-3.png",
    alt: "Dining room in oak and cane",
    eyebrow: "The dining room",
    title: "Gather around something solid.",
    subtitle:
      "Solid oak, woven cane and hand-thrown ceramics, made for long dinners that run late.",
    cta: "Shop the dining edit",
    categoryId: "dining-room",
  },
];

const SHOP_BY_CATEGORY_RAIL = [
  {
    label: "Sofa",
    image: "/images/homepage/home-asset-1.jpg",
    categoryId: "sofa",
  },
  {
    label: "Wardrobe",
    image: "/images/homepage/home-asset-2.jpg",
    categoryId: "wardrobe",
  },
  {
    label: "TV Table",
    image: "/images/homepage/home-asset-3.jpg",
    categoryId: "tv-table",
  },
  {
    label: "Shoe Rack",
    image: "/images/homepage/home-asset-4.jpg",
    categoryId: "shoe-rack",
  },
  {
    label: "Beds",
    image: "/images/homepage/home-asset-5.jpg",
    categoryId: "beds",
  },
  {
    label: "Center Table",
    image: "/images/homepage/home-asset-6.jpg",
    categoryId: "center-table",
  },
  {
    label: "Desks",
    image: "/images/homepage/home-asset-7.jpg",
    categoryId: "desk",
  },
  {
    label: "Commode and Drawer Units",
    image: "/images/homepage/home-asset-8.jpg",
    categoryId: "chest-of-drawers",
  },
];

const PROMO_TRIO_CARDS = [
  {
    title: "Livingroom",
    alt: "Bright modern living room with curved cream bouclé sofa, lounge chairs, and area rug",
    image: "/images/homepage/home-asset-9.jpg",
    categoryId: "living-room",
  },
  {
    title: "Bedroom",
    alt: "Minimalist sunlit bedroom with platform bed and neutral bedding",
    image: "/images/homepage/home-asset-10.jpg",
    categoryId: "bedroom",
  },
  {
    title: "Diningroom",
    alt: "Warm contemporary dining room with wooden table, upholstered chairs, and display cabinet",
    image: "/images/homepage/home-asset-11.jpg",
    categoryId: "dining-room",
  },
];

const LIVING_COMPLETE_CARDS = [
  {
    title: "Sofas",
    alt: "Warm minimalist living room with beige sofa",
    image: "/images/homepage/home-asset-17.jpg",
    categoryId: "sofa",
  },
  {
    title: "Chairs",
    alt: "Sculptural wooden lounge chair in sunlit corner",
    image: "/images/homepage/home-asset-18.jpg",
    categoryId: "chairs",
  },
  {
    title: "Tv units",
    alt: "Modern walnut and matte white TV media console",
    image: "/images/homepage/home-asset-19.jpg",
    categoryId: "tv-table",
  },
  {
    title: "Center Table",
    alt: "Round travertine and oak nesting coffee tables",
    image: "/images/homepage/home-asset-20.jpg",
    categoryId: "center-table",
  },
  {
    title: "Living room set",
    alt: "Complete cream bouclé living room sofa and armchair set",
    image: "/images/homepage/home-asset-21.jpg",
    categoryId: "living",
  },
  {
    title: "Recliner",
    alt: "Plush oatmeal linen recliner armchair",
    image: "/images/homepage/home-asset-22.jpg",
    categoryId: "recliner",
  },
  {
    title: "Side tables",
    alt: "Brushed brass C-shaped marble-top side table beside sofa",
    image: "/images/homepage/home-asset-23.jpg",
    categoryId: "side-table",
  },
  {
    title: "Pouf",
    alt: "Fluffy ivory upholstered bench pouf on geometric brushed gold frame",
    image: "/images/homepage/home-asset-24.jpg",
    categoryId: "pouf",
  },
];

const BEDROOM_ESSENTIALS_CARDS = [
  {
    title: "Beds",
    alt: "Upholstered beige double bed flanked by walnut nightstands and warm glowing lamps",
    image: "/images/homepage/home-asset-33.jpg",
    categoryId: "beds",
  },
  {
    title: "Wardrobes",
    alt: "Modern 3-door sliding bedroom wardrobe with matte white panels and center mirror",
    image: "/images/homepage/home-asset-34.jpg",
    categoryId: "wardrobe",
  },
  {
    title: "Makeup vanity",
    alt: "Warm walnut and cream makeup vanity desk with LED-backlit mirror and drawers",
    image: "/images/homepage/home-asset-35.jpg",
    categoryId: "dresser",
  },
  {
    title: "Commodes",
    alt: "Minimalist warm walnut 2-drawer commode chest in sunlit bedroom",
    image: "/images/homepage/home-asset-36.jpg",
    categoryId: "commode",
  },
];

function StarRating({ rating, idPrefix }: { rating: number; idPrefix: string }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.85;
  const roundedFull = rating - fullStars >= 0.85 ? fullStars + 1 : fullStars;

  return (
    <span className="mp-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((starIdx) => {
        if (starIdx <= roundedFull) {
          return (
            <svg
              key={starIdx}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              className="is-full"
            >
              <path
                fill="currentColor"
                d="M12 2.2l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.1l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.2z"
              />
            </svg>
          );
        }
        if (hasHalf && starIdx === fullStars + 1) {
          const gradId = `half-star-${idPrefix}-${starIdx}`;
          return (
            <svg
              key={starIdx}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              className="is-half"
            >
              <defs>
                <linearGradient id={gradId}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#d6d3cd" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${gradId})`}
                d="M12 2.2l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.1l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.2z"
              />
            </svg>
          );
        }
        return (
          <svg
            key={starIdx}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            className="is-empty"
          >
            <path
              fill="currentColor"
              d="M12 2.2l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.1l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.2z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function ShowcaseCard({ item }: { item: ShowcaseCardItem }) {
  const { toggleWishlist, isWished, addToCart } = useStore();
  const wished = isWished(item.id);
  const numPrice = Number(item.price) || 0;
  const numOld = item.oldPrice ? Number(item.oldPrice) : undefined;
  const isOut = Boolean(item.stockOut || item.stockTag?.toLowerCase().includes("out"));

  const asAuraProduct: AuraProduct = {
    id: item.id,
    name: item.title,
    price: numPrice,
    crossedPrice: numOld,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    mainImage: {
      originalSize: item.image,
      large: item.image,
      smallSize: item.image,
    },
    images: [item.image],
    isAvailable: !isOut,
  };

  return (
    <article className="mp-card">
      <div className="mp-card-media">
        <Link href={`/product/${item.id}`} className="block w-full h-full">
          <img
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            src={item.image}
          />
        </Link>
        {item.promoTag && (
          <span
            className={`mp-promo-tag ${
              item.promoType === "drop" ? "is-drop" : "is-code"
            }`}
          >
            {item.promoTag}
          </span>
        )}
        {item.stockTag && (
          <span className={`mp-stock-tag ${isOut ? "is-out" : ""}`}>
            {item.stockTag}
          </span>
        )}
        <button
          className="mp-save-btn"
          type="button"
          aria-pressed={wished ? "true" : "false"}
          aria-label={`Save ${item.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item.id);
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      <div className="mp-card-body">
        <Link href={`/product/${item.id}`}>
          <h3 className="mp-card-title">{item.title}</h3>
        </Link>
        {item.rating !== undefined && (
          <p className="mp-rating-row">
            <span className="mp-rating-num">{item.rating}</span>
            <StarRating rating={Number(item.rating)} idPrefix={item.id} />
            {item.ratingCount !== undefined && (
              <span className="mp-rating-count">({item.ratingCount})</span>
            )}
          </p>
        )}
        <div className="mp-pricing-block">
          {item.startingFrom && <p className="mp-starting">Starting From</p>}
          <p className="mp-price-row">
            <span className="mp-currency">EGP</span>
            <span className="mp-price-now">
              {numPrice.toLocaleString("en-US")}
            </span>
            {numOld && (
              <s className="mp-price-old">{numOld.toLocaleString("en-US")}</s>
            )}
            {item.discountText && (
              <span className="mp-discount">{item.discountText}</span>
            )}
          </p>
        </div>
        {item.variantText && (
          <div className="mp-variant-box">{item.variantText}</div>
        )}
        <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={isOut}
            onClick={() => addToCart(asAuraProduct, 1)}
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--fg)] hover:opacity-65 transition-opacity cursor-pointer disabled:opacity-40"
          >
            + Add to bag
          </button>
          <Link
            href={`/product/${item.id}`}
            className="text-[11px] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}

function ShowcaseCarouselBlock({
  row,
  searchQuery,
}: {
  row: ShowcaseRow;
  searchQuery: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return row.items;
    return row.items.filter((item) =>
      item.title.toLowerCase().includes(q)
    );
  }, [row.items, searchQuery]);

  const scrollRail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.max(280, Math.round(el.clientWidth * 0.78));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (filteredItems.length === 0) return null;

  return (
    <div className="mp-showcase-block">
      <div className="mp-row-head">
        <h2>{row.title}</h2>
        <button
          type="button"
          className="mp-view-all"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span>{expanded ? "Show Less" : "View All"}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="mp-carousel-wrap">
        {!expanded && (
          <button
            type="button"
            className="mp-nav-arrow is-prev"
            aria-label={`Previous ${row.title}`}
            onClick={() => scrollRail(-1)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <div
          ref={railRef}
          className={expanded ? "mp-expanded-grid" : "mp-rail no-scrollbar"}
        >
          {filteredItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
        {!expanded && (
          <button
            type="button"
            className="mp-nav-arrow is-next"
            aria-label={`Next ${row.title}`}
            onClick={() => scrollRail(1)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 24;

export function CatalogClient({
  store: _store,
  categories,
  products,
  initialCategoryId,
}: CatalogClientProps) {
  const {
    searchQuery,
    setSearchQuery,
    wishlist,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    onlyWishlist,
    setOnlyWishlist,
    selectCategoryAndScroll,
  } = useStore();

  // Hero Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const categoryRailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Sync initialCategoryId if passed via URL
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
      setCurrentPage(1);
    }
  }, [initialCategoryId, setSelectedCategory, setCurrentPage]);

  // Catalog sort state
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc"
  >("featured");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (onlyWishlist) {
      list = list.filter((p) => wishlist.includes(p.id));
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((p) => matchesCategoryFilter(p, selectedCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.nameAr?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, onlyWishlist, wishlist]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safePage]);

  const handlePageChange = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(target);
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollCategoryRail = (dir: -1 | 1) => {
    if (!categoryRailRef.current) return;
    categoryRailRef.current.scrollBy({
      left: dir * 280,
      behavior: "smooth",
    });
  };

  const row1 = HOMEPAGE_SHOWCASE_ROWS[0];
  const row2 = HOMEPAGE_SHOWCASE_ROWS[1];
  const row3 = HOMEPAGE_SHOWCASE_ROWS[2];
  const row4 = HOMEPAGE_SHOWCASE_ROWS[3];
  const row5 = HOMEPAGE_SHOWCASE_ROWS[4];
  const row6 = HOMEPAGE_SHOWCASE_ROWS[5];
  const row7 = HOMEPAGE_SHOWCASE_ROWS[6];
  const row8 = HOMEPAGE_SHOWCASE_ROWS[7];

  return (
    <main>
      {/* 1. HERO CAROUSEL */}
      <section
        className="hero"
        aria-roledescription="carousel"
        aria-label="Featured collections"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.title}
              className={`slide ${isActive ? "is-active" : ""}`}
              aria-hidden={isActive ? "false" : "true"}
            >
              <img
                alt={slide.alt}
                referrerPolicy="no-referrer"
                src={slide.image}
              />
              <div className="hero-copy">
                <div className="wrap">
                  <p className="hero-eyebrow">{slide.eyebrow}</p>
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <button
                    className="btn-ghost-light"
                    type="button"
                    onClick={() => selectCategoryAndScroll(slide.categoryId)}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="hero-controls">
          <div className="hero-dots">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
          <div className="hero-arrows">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() =>
                setActiveSlide(
                  (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                )
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() =>
                setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY CIRCULAR RAIL */}
      <section className="rail-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Browse</p>
              <h2 className="display-title mt-2">Shop by category</h2>
            </div>
            <div className="rail-buttons">
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollCategoryRail(-1)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Scroll categories right"
                onClick={() => scrollCategoryRail(1)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={categoryRailRef} className="rail-track no-scrollbar">
            {SHOP_BY_CATEGORY_RAIL.map((cat) => (
              <button
                key={cat.label}
                className="cat"
                type="button"
                onClick={() => selectCategoryAndScroll(cat.categoryId)}
              >
                <span className="cat-thumb">
                  <img
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    src={cat.image}
                  />
                </span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROMO TRIO ROOM CARDS */}
      <section className="promo-section" aria-label="Shop by room">
        <div className="wrap">
          <div className="promo-trio">
            {PROMO_TRIO_CARDS.map((card) => (
              <button
                key={card.title}
                type="button"
                className="promo-trio-card"
                onClick={() => selectCategoryAndScroll(card.categoryId)}
              >
                <img
                  alt={card.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src={card.image}
                />
                <span className="promo-trio-title">{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPECIAL PIECES & BEST SELLERS */}
      <section
        className="seller-section"
        id="sellers"
        aria-label="Special pieces and best sellers"
      >
        <div className="wrap">
          <div className="mp-rows">
            {row1 && (
              <ShowcaseCarouselBlock row={row1} searchQuery={searchQuery} />
            )}
            {row2 && (
              <ShowcaseCarouselBlock row={row2} searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </section>

      {/* 5. COMPLETE YOUR LIVING ROOM */}
      <section
        className="products-section"
        id="pieces"
        aria-labelledby="living-complete-heading"
      >
        <div className="wrap">
          <h2 id="living-complete-heading" className="living-complete-heading">
            Complete Your Living Room
          </h2>
          <div className="living-complete-grid">
            {LIVING_COMPLETE_CARDS.map((card) => (
              <button
                key={card.title}
                type="button"
                className="living-complete-card"
                onClick={() => selectCategoryAndScroll(card.categoryId)}
              >
                <img
                  alt={card.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src={card.image}
                />
                <span className="living-complete-title">{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS & BEDROOM/STORAGE PICKS */}
      <section className="collections" aria-label="Featured furniture picks">
        <div className="wrap">
          <div className="mp-rows">
            {row3 && (
              <ShowcaseCarouselBlock row={row3} searchQuery={searchQuery} />
            )}
            {row4 && (
              <ShowcaseCarouselBlock row={row4} searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </section>

      {/* 7. BEDROOM ESSENTIALS BANNER + 4 CARDS */}
      <section className="story" aria-labelledby="bedroom-essentials-heading">
        <div className="wrap">
          <h2
            id="bedroom-essentials-heading"
            className="living-complete-heading"
          >
            Bedroom Essentials
          </h2>
          <button
            type="button"
            className="bedroom-hero-banner"
            onClick={() => selectCategoryAndScroll("bedroom")}
          >
            <img
              alt="Warm modern oak bedroom with mirrored wardrobe, fluted slat wall, and twin platform beds"
              loading="lazy"
              referrerPolicy="no-referrer"
              src="/images/homepage/home-asset-32.jpg"
            />
            <span className="bedroom-hero-overlay">
              <span className="bedroom-hero-title">
                Create Your Perfect Bedroom
              </span>
              <span className="bedroom-hero-sub">
                Discover bedroom furniture
                <br />
                designed for restful moments.
              </span>
            </span>
          </button>
          <div className="bedroom-essentials-grid">
            {BEDROOM_ESSENTIALS_CARDS.map((card) => (
              <button
                key={card.title}
                type="button"
                className="living-complete-card"
                onClick={() => selectCategoryAndScroll(card.categoryId)}
              >
                <img
                  alt={card.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src={card.image}
                />
                <span className="living-complete-title">{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DRESSING UNITS & CREATE YOUR PERFECT BEDROOM */}
      <section
        className="bedroom-products-section"
        aria-label="Dressing units and bedroom sets"
      >
        <div className="wrap">
          <div className="mp-rows">
            {row5 && (
              <ShowcaseCarouselBlock row={row5} searchQuery={searchQuery} />
            )}
            {row6 && (
              <ShowcaseCarouselBlock row={row6} searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </section>

      {/* 9. DINING ROOM ESSENTIALS BANNER + 2 ROWS */}
      <section
        className="dining-section"
        aria-labelledby="dining-essentials-heading"
      >
        <div className="wrap">
          <h2
            id="dining-essentials-heading"
            className="living-complete-heading"
          >
            Dining Room Essentials
          </h2>
          <button
            type="button"
            className="bedroom-hero-banner dining-hero-banner"
            onClick={() => selectCategoryAndScroll("dining-room")}
          >
            <img
              alt="Sunlit contemporary dining room with dark walnut oval fluted pedestal table and six cream bouclé chairs"
              loading="lazy"
              referrerPolicy="no-referrer"
              src="/images/homepage/home-asset-50.jpg"
            />
            <span className="bedroom-hero-overlay dining-hero-overlay">
              <span className="bedroom-hero-title">
                Designed for Every Gathering
              </span>
              <span className="bedroom-hero-sub">
                Complete your dining area with
                <br />
                furniture that blends
                <br />
                comfort and style
              </span>
            </span>
          </button>
          <div className="mp-rows dining-products-rows">
            {row7 && (
              <ShowcaseCarouselBlock row={row7} searchQuery={searchQuery} />
            )}
            {row8 && (
              <ShowcaseCarouselBlock row={row8} searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </section>

      {/* 10. COMPLETE INTERACTIVE CATALOG (ALL 447 AURA PRODUCTS + PAGINATION & FILTERING) */}
      <section
        id="catalog"
        className="products-section scroll-mt-24"
        style={{ borderTop: "1px solid var(--border)" }}
        aria-label="Complete Aura Furniture Catalog"
      >
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Complete Collection</p>
              <h2 className="display-title mt-2">Explore All Pieces</h2>
              <p className="mt-2 text-sm text-[var(--muted-fg)]">
                Showing{" "}
                <strong className="text-[var(--fg)]">
                  {filteredProducts.length > 0
                    ? `${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                        safePage * ITEMS_PER_PAGE,
                        filteredProducts.length
                      )}`
                    : "0"}
                </strong>{" "}
                of{" "}
                <strong className="text-[var(--fg)]">
                  {filteredProducts.length}
                </strong>{" "}
                pieces across Egypt
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setOnlyWishlist((prev) => !prev);
                    setCurrentPage(1);
                  }}
                  className={`chip ${onlyWishlist ? "is-active" : ""}`}
                >
                  Saved ({wishlist.length})
                </button>
              )}

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setCurrentPage(1);
                }}
                aria-label="Sort products"
                className="chip"
                style={{ paddingRight: "1.5rem" }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Room Category Tree + Subcategory Tiles + Furniture Type Strip */}
          <CategoryExplorer
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setCurrentPage(1);
            }}
            showDedicatedPageLink={true}
          />

          {(selectedCategory !== "ALL" || searchQuery || onlyWishlist) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {selectedCategory !== "ALL" && (
                <span className="chip is-active">
                  Filter:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    selectedCategory}
                  <button
                    type="button"
                    className="ml-2 opacity-80 hover:opacity-100"
                    onClick={() => {
                      setSelectedCategory("ALL");
                      setCurrentPage(1);
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="chip is-active">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    className="ml-2 opacity-80 hover:opacity-100"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                className="chip"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                  setOnlyWishlist(false);
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Top Pagination Bar */}
          {totalPages > 1 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <span className="text-xs uppercase tracking-widest text-[var(--muted-fg)]">
                Page {safePage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="chip disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="chip disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="empty-state">
              <p>No pieces match your current filter or search.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                  setOnlyWishlist(false);
                  setCurrentPage(1);
                }}
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="mp-expanded-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Bottom Numbered Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-widest text-[var(--muted-fg)]">
                Page {safePage} of {totalPages} ({filteredProducts.length}{" "}
                products)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="chip disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safePage) <= 2
                  )
                  .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                      acc.push("ellipsis");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-xs text-[var(--muted-fg)]"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        className={`chip ${
                          safePage === item ? "is-active" : ""
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="chip disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 11. SERVICES BAR */}
      <section className="services" id="service">
        <div className="wrap">
          <div className="service-grid">
            <div className="service">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <h3>Delivery &amp; assembly</h3>
              <p>Two-person delivery across Egypt, assembled in your room.</p>
            </div>
            <div className="service">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <h3>14-day returns</h3>
              <p>Changed your mind? We collect it, no questions asked.</p>
            </div>
            <div className="service">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              <h3>Pay in instalments</h3>
              <p>Split any order over 6 interest-free payments.</p>
            </div>
            <div className="service">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
              <h3>Try before you buy</h3>
              <p>Fabrics and finishes at our Cairo showroom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. SHOWROOM SECTION */}
      <section className="showroom">
        <div className="wrap">
          <div className="showroom-grid">
            <div>
              <p className="eyebrow">The showroom</p>
              <h2>Sit in it before you live with it.</h2>
              <p className="lede">
                Our Cairo studio keeps every fabric, finish and joint on the
                floor. Book a quiet hour with a stylist and leave with a plan
                for the room, not just a receipt.
              </p>
              <button
                className="btn-outline-light"
                type="button"
                onClick={() => selectCategoryAndScroll("ALL")}
              >
                Browse the floor
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
            <dl className="showroom-facts">
              <div>
                <dt>Visits</dt>
                <dd>By appointment, daily 11–20</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>Cairo, Egypt</dd>
              </div>
              <div>
                <dt>Samples</dt>
                <dd>Fabric swatches posted on request</dd>
              </div>
              <div>
                <dt>Made to order</dt>
                <dd>Any size, any finish</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
