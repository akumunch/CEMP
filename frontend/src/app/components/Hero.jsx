"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            Campus clubs, cooked clean
          </p>
          <h1 className="text-5xl font-black leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
            Manage clubs, events, and registrations in one sharp platform.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Club Chef keeps event discovery, club profiles, and student signups
            fast, organized, and ready for every campus community.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#events"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 font-semibold text-[#171717] transition hover:bg-accent-strong focus-visible:bg-accent-strong"
            >
              Explore events
            </Link>
            <Link
              href="/#register"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              Register now
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="grid content-center gap-4 rounded-lg border border-border bg-surface p-5"
          aria-label="Platform highlights"
        >
          {[
            ["Live events", "Discover upcoming coding contests and campus sessions."],
            ["Club profiles", "Track presidents, leads, and contact details."],
            ["Fast signups", "Register students with duplicate protection."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md bg-surface-strong p-5">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
