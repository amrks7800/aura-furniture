"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import type { AuraStoreInfo } from "@/lib/vondera";
import type { Category } from "vondera-sdk";

export function Footer({
  store: _store,
  categories: _categories,
}: {
  store: AuraStoreInfo | null;
  categories: Category[];
}) {
  const { selectCategoryAndScroll } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    if (pathname !== "/") {
      router.push(`/?category=${encodeURIComponent(categoryId)}#catalog`);
      return;
    }
    selectCategoryAndScroll(categoryId);
  };

  return (
    <footer className="site-footer" id="footer-contacts">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-grid">
            <div className="footer-brand">
              <p>Aura furniture</p>
              <p>
                A considered marketplace for furniture, home pieces and
                independent makers across Egypt.
              </p>
            </div>

            <div className="footer-shop">
              <h3>Shop</h3>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("living-room")}
                  >
                    Living
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("bedroom")}
                  >
                    Bedroom
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("dining-room")}
                  >
                    Dining
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("tv-table")}
                  >
                    TV &amp; Media
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("storage-unit")}
                  >
                    Storage
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-explore">
              <h3>Discover</h3>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("ALL")}
                  >
                    Furniture
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("living-room")}
                  >
                    Living Room
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("bedroom")}
                  >
                    Bedroom
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("dining-room")}
                  >
                    Dining
                  </button>
                </li>
                <li>
                  <a href="#sellers">Our sellers</a>
                </li>
                <li>
                  <a href="#service">Delivery &amp; returns</a>
                </li>
              </ul>
            </div>

            <div className="footer-visit">
              <h3>Visit</h3>
              <p>
                Cairo studio
                <br />
                By appointment
                <br />
                11–20 daily
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Aura furniture — all rights reserved</p>
            <div className="flex flex-wrap items-center gap-4">
              <p>Deliveries across Egypt · Instalments available</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
