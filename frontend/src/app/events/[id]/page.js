  "use client";

  import Link from "next/link";
  import { useParams } from "next/navigation";
  import { motion } from "framer-motion";
  import { useEffect, useMemo, useState } from "react";
  import Navbar from "../../components/Navbar";
  import RegistrationForm from "../../components/RegistrationForm";
  import { getClubs, getEventById } from "../../lib/api";

  function formatDate(value) {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(value));
  }

  export default function EventDetailsPage() {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      let active = true;

      async function loadEvent() {
        try {
          setLoading(true);
          const [eventData, clubsData] = await Promise.all([
            getEventById(params.id),
            getClubs(),
          ]);
          if (!active) return;
          setEvent(eventData);
          setClubs(clubsData);
        } catch (err) {
          if (active) setError(err.message);
        } finally {
          if (active) setLoading(false);
        }
      }

      if (params.id) loadEvent();

      return () => {
        active = false;
      };
    }, [params.id]);

    const clubName = useMemo(() => {
      if (!event) return "";
      return clubs.find((club) => club.id === event.club_id)?.name || "Club unavailable";
    }, [clubs, event]);

    return (
      <>
        <Navbar />
        <main>
          <section className="border-b border-border bg-background px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/#events"
                className="text-sm font-semibold text-accent hover:text-accent-strong"
              >
                Back to events
              </Link>

              {loading && (
                <div
                  className="mt-8 h-80 animate-pulse rounded-lg border border-border bg-surface"
                  aria-label="Loading event details"
                />
              )}

              {!loading && error && (
                <p className="mt-8 rounded-md border border-border bg-surface p-4 text-muted">
                  {error}
                </p>
              )}

              {!loading && !error && event && (
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                      Event details
                    </p>
                    <h1 className="mt-3 text-4xl font-black text-foreground sm:text-6xl">
                      {event.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  <aside className="rounded-lg border border-border bg-surface p-5">
                    <dl className="grid gap-5">
                      <div>
                        <dt className="text-sm text-muted">Date</dt>
                        <dd className="mt-1 font-semibold text-foreground">
                          {formatDate(event.date)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">Location</dt>
                        <dd className="mt-1 font-semibold text-foreground">
                          {event.location}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">Hosted by</dt>
                        <dd className="mt-1 font-semibold text-foreground">{clubName}</dd>
                      </div>
                    </dl>
                  </aside>
                </motion.article>
              )}
            </div>
          </section>

          {event && (
            <RegistrationForm eventId={String(event.id)} eventTitle={event.title} />
          )}
        </main>
      </>
    );
  }
