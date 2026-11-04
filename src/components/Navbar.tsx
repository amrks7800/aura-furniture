"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import type { AuraStoreInfo } from "@/lib/vondera";
import type { Category } from "vondera-sdk";

interface NavbarProps {
  store: AuraStoreInfo | null;
  categories: Category[];
}

const ROOM_NAV_ITEMS: { label: string; categoryId: string }[] = [
  { label: "Living Room", categoryId: "living-room" },
  { label: "Dining Room", categoryId: "dining-room" },
  { label: "Bedroom", categoryId: "bedroom" },
  { label: "Storage unit", categoryId: "storage-unit" },
  { label: "Kitchen Room", categoryId: "kitchen-room" },
  { label: "All Catalog", categoryId: "ALL" },
];

export function Navbar({ store: _store, categories }: NavbarProps) {
  const {
    locale,
    setLocale,
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectCategoryAndScroll,
    onlyWishlist,
    setOnlyWishlist,
    setCurrentPage,
  } = useStore();

  const pathname = usePathname();
  const router = useRouter();
  const [showTopbar, setShowTopbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoomClick = (categoryId: string) => {
    setMobileMenuOpen(false);
    if (pathname === "/products") {
      selectCategoryAndScroll(categoryId);
      router.replace(
        categoryId && categoryId !== "ALL"
          ? `/products?category=${encodeURIComponent(categoryId)}`
          : "/products",
        { scroll: false }
      );
      return;
    }
    if (pathname !== "/") {
      router.push(
        categoryId && categoryId !== "ALL"
          ? `/products?category=${encodeURIComponent(categoryId)}`
          : "/products"
      );
      return;
    }
    selectCategoryAndScroll(categoryId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/#catalog");
      return;
    }
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWishlistClick = () => {
    setOnlyWishlist((prev) => !prev);
    setCurrentPage(1);
    if (pathname !== "/") {
      router.push("/#catalog");
      return;
    }
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="top">
      {showTopbar && (
        <div className="topbar">
          <div className="marquee-track">
            <div className="marquee-group">
              <span>Complimentary delivery on orders above EGP 10,000</span>
              <span>
                New season arrivals — discover pieces from independent makers
              </span>
              <span>Pay in 6 interest-free instalments</span>
              <span>Discover furniture from sellers across Egypt</span>
            </div>
            <div className="marquee-group" aria-hidden="true">
              <span>Complimentary delivery on orders above EGP 10,000</span>
              <span>
                New season arrivals — discover pieces from independent makers
              </span>
              <span>Pay in 6 interest-free instalments</span>
              <span>Discover furniture from sellers across Egypt</span>
            </div>
          </div>
          <button
            className="topbar-close"
            type="button"
            aria-label="Hide announcements"
            onClick={() => setShowTopbar(false)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <header className="site-header">
        <div className="wrap">
          <div className="header-row">
            <button
              className="mobile-trigger"
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link className="logo" href="/">
              Aura furniture
            </Link>

            <form
              className="search-desktop"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <div className="search-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  placeholder="Search furniture, sellers and categories…"
                  aria-label="Search products"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            <div className="header-tools">
              <button
                type="button"
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className="icon-btn"
                title="Switch Language"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  width: "auto",
                  padding: "0 0.5rem",
                }}
              >
                {locale === "ar" ? "EN" : "AR"}
              </button>

              <button
                className="icon-btn"
                type="button"
                aria-label="Wishlist"
                onClick={handleWishlistClick}
                title="Saved pieces"
                style={
                  onlyWishlist
                    ? { color: "#e11d48" }
                    : undefined
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={onlyWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="wish-badge">{wishlist.length}</span>
                )}
              </button>

              <button
                className="icon-btn"
                type="button"
                aria-label="Open cart"
                onClick={() => setIsCartOpen(true)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartTotalCount > 0 && (
                  <span className="wish-badge">{cartTotalCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className="search-mobile">
            <form role="search" onSubmit={handleSearchSubmit}>
              <div className="search-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  placeholder="Search furniture, sellers and categories…"
                  aria-label="Search products"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <nav className="cat-nav" aria-label="Shop by room">
            <ul className="no-scrollbar">
              {ROOM_NAV_ITEMS.map((item) => (
                <li key={item.categoryId}>
                  <button
                    type="button"
                    className={
                      selectedCategory === item.categoryId ? "is-active" : ""
                    }
                    onClick={() => handleRoomClick(item.categoryId)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className={`text-xs uppercase tracking-[0.18em] py-1.5 inline-block transition-colors ${
                    pathname === "/products"
                      ? "text-[var(--primary)] font-medium"
                      : "text-[var(--muted-fg)] hover:text-[var(--fg)]"
                  }`}
                >
                  Products Page
                </Link>
              </li>
              <li className="ml-auto flex items-center gap-4">
                <span className="deliver">Deliver to Egypt</span>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <span className="logo">Aura furniture</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <p className="eyebrow">Shop by room</p>
              <ul>
                {ROOM_NAV_ITEMS.map((item) => (
                  <li key={item.categoryId}>
                    <button
                      type="button"
                      onClick={() => handleRoomClick(item.categoryId)}
                    >
                      <span>{item.label}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              {categories.length > 0 && (
                <>
                  <p className="eyebrow mt-6">Categories</p>
                  <ul>
                    {categories.slice(0, 14).map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => handleRoomClick(cat.id)}
                        >
                          <span>{cat.name}</span>
                          {cat.productsCount ? (
                            <span className="text-xs opacity-60">
                              ({cat.productsCount})
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
