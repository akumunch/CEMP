"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getClubs, getEvents } from "../lib/api";
import EventCard from "./EventCard";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [eventsData, clubsData] = await Promise.all([getEvents(), getClubs()]);
        if (!active) return;
        setEvents(eventsData);
        setClubs(clubsData);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const clubNames = useMemo(
    () => new Map(clubs.map((club) => [club.id, club.name])),
    [clubs]
  );

  return (
    <motion.section
      id="events"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
      className="border-b border-border bg-background px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Events
          </p>
          <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
            Upcoming campus events
          </h2>
        </div>

        {loading && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-lg border border-border bg-surface"
                aria-label="Loading event"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 rounded-md border border-border bg-surface p-4 text-muted">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="mt-8 rounded-md border border-border bg-surface p-4 text-muted">
            No events available yet.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                clubName={clubNames.get(event.club_id)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
