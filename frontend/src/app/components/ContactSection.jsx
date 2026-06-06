"use client";

import { motion } from "framer-motion";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function ContactSection() {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
      className="bg-surface-strong px-4 py-16 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
            Keep the campus loop open
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Reach out for club onboarding, event support, or registration
            assistance.
          </p>
        </div>

        <address className="not-italic">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="font-bold text-foreground">Club Chef Helpdesk</p>
            <a
              href="mailto:support@clubchef.example"
              className="mt-3 block text-accent hover:text-accent-strong"
            >
              support@clubchef.example
            </a>
            <p className="mt-2 text-muted">Student Activity Center, Room 204</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </address>
      </div>
    </motion.section>
  );
}
