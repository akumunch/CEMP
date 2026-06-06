"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

const initialValues = { name: "", email: "", message: "" };

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ContactSection() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    else if (!isEmail(values.email)) nextErrors.email = "Enter a valid email.";
    if (!values.message.trim()) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitted(true);
    setValues(initialValues);
    setErrors({});
  }

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
          <address className="not-italic mt-6">
            <p className="text-accent">support@clubchef.example</p>
            <p className="mt-2 text-muted">Student Activity Center, Room 204</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map((social) => (
                <span
                  key={social.label}
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                >
                  {social.label}
                </span>
              ))}
            </div>
          </address>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="text-2xl font-black text-foreground">Message sent!</p>
              <p className="text-muted">We will get back to you shortly.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm font-semibold text-accent hover:text-accent-strong"
              >
                Send another
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              <Field
                label="Name"
                id="contact_name"
                value={values.name}
                error={errors.name}
                onChange={(value) => updateField("name", value)}
              />
              <Field
                label="Email"
                id="contact_email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={(value) => updateField("email", value)}
              />
              <div>
                <label
                  htmlFor="contact_message"
                  className="text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="contact_message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 text-foreground placeholder:text-muted"
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-sm text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-12 w-full rounded-md bg-accent px-5 font-bold text-[#171717] transition hover:bg-accent-strong"
              >
                Send message
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function Field({ label, id, type = "text", value, error, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 h-12 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder:text-muted"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}