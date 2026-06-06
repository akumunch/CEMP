export default function ClubCard({ club }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-2xl font-bold text-foreground">{club.name}</h3>
      <p className="mt-3 min-h-16 text-sm leading-6 text-muted">
        {club.description || "No description provided."}
      </p>
      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="text-muted">President</dt>
          <dd className="font-semibold text-foreground">{club.president_name}</dd>
        </div>
        <div>
          <dt className="text-muted">Contact</dt>
          <dd>
            <a
              href={`mailto:${club.contact_email}`}
              className="font-semibold text-accent hover:text-accent-strong"
            >
              {club.contact_email}
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
