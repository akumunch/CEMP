import Link from "next/link";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function EventCard({ event, clubName }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent">
      <div className="flex-1">
        <p className="text-sm font-semibold text-accent">{formatDate(event.date)}</p>
        <h3 className="mt-3 text-2xl font-bold text-foreground">{event.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
          {event.description || "No description provided."}
        </p>
      </div>
      <dl className="mt-5 grid gap-2 text-sm">
        <div>
          <dt className="text-muted">Location</dt>
          <dd className="font-semibold text-foreground">{event.location}</dd>
        </div>
        <div>
          <dt className="text-muted">Club</dt>
          <dd className="font-semibold text-foreground">{clubName || "Club unavailable"}</dd>
        </div>
      </dl>
      <Link
        href={`/events/${event.id}`}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-md border border-border font-semibold text-foreground transition hover:border-accent hover:text-accent"
      >
        View details
      </Link>
    </article>
  );
}
