"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#events", label: "Events" },
  { href: "/#clubs", label: "Clubs" },
  { href: "/#register", label: "Register" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [lightMode, setLightMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("club-chef-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return stored ? stored === "light" : prefersLight;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
  }, [lightMode]);

  function toggleTheme() {
    const nextLight = !lightMode;
    setLightMode(nextLight);
    window.localStorage.setItem("club-chef-theme", nextLight ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-sm text-[#171717]">
            CC
          </span>
          <span>Club Chef</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground focus-visible:bg-surface"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            className="h-10 rounded-md border border-border px-3 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            {lightMode ? "Dark" : "Light"}
          </button>
          <button
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}