"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getClubs } from "../lib/api";
import ClubCard from "./ClubCard";

export default function ClubsSection() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadClubs() {
      try {
        setLoading(true);
        const data = await getClubs();
        if (active) setClubs(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadClubs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.section
      id="clubs"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
      className="border-b border-border bg-surface-strong px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Clubs
          </p>
          <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
            Meet the communities
          </h2>
        </div>

        {loading && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-lg border border-border bg-surface"
                aria-label="Loading club"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 rounded-md border border-border bg-surface p-4 text-muted">
            {error}
          </p>
        )}

        {!loading && !error && clubs.length === 0 && (
          <p className="mt-8 rounded-md border border-border bg-surface p-4 text-muted">
            No clubs available yet.
          </p>
        )}

        {!loading && !error && clubs.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
