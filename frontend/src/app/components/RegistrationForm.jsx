"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getEvents, registerForEvent } from "../lib/api";

const initialValues = {
  student_name: "",
  student_email: "",
  student_reg: "",
  event_id: "",
};

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegistrationForm({ eventId = "", eventTitle = "" }) {
  const [values, setValues] = useState(initialValues);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const selectedEventId = eventId || values.event_id;

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const data = await getEvents();
        if (active) setEvents(data);
      } catch (err) {
        if (active) {
          setStatus({ type: "error", message: err.message });
        }
      } finally {
        if (active) setLoadingEvents(false);
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const selectedEventName = useMemo(() => {
    if (eventTitle) return eventTitle;
    return events.find((event) => String(event.id) === String(selectedEventId))?.title || "";
  }, [eventTitle, events, selectedEventId]);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus({ type: "", message: "" });
  }

  function validate() {
    const nextErrors = {};

    if (!values.student_name.trim()) {
      nextErrors.student_name = "Student name is required.";
    }

    if (!values.student_email.trim()) {
      nextErrors.student_email = "Email is required.";
    } else if (!isEmail(values.student_email)) {
      nextErrors.student_email = "Enter a valid email address.";
    }

    if (!values.student_reg.trim()) {
      nextErrors.student_reg = "Registration number is required.";
    } else if (values.student_reg.trim().length < 4) {
      nextErrors.student_reg = "Registration number is too short.";
    }

    if (!selectedEventId) {
      nextErrors.event_id = "Select an event.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setSubmitting(true);
      await registerForEvent({
        ...values,
        student_name: values.student_name.trim(),
        student_email: values.student_email.trim(),
        student_reg: values.student_reg.trim(),
        event_id: Number(selectedEventId),
      });
      setStatus({
        type: "success",
        message: `Registration confirmed${selectedEventName ? ` for ${selectedEventName}` : ""}.`,
      });
      setValues(initialValues);
      setErrors({});
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.section
      id="register"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
      className="border-b border-border bg-background px-4 py-16 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Register
          </p>
          <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
            Save your seat
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Submit your student details and choose the event you want to attend.
            Duplicate registrations for the same event are blocked automatically.
          </p>
        </div>

        <div
          className="rounded-lg border border-border bg-surface p-5 sm:p-6"
          aria-label="Event registration"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Student name"
              id="student_name"
              value={values.student_name}
              error={errors.student_name}
              onChange={(value) => updateField("student_name", value)}
            />
            <Field
              label="Email"
              id="student_email"
              type="email"
              value={values.student_email}
              error={errors.student_email}
              onChange={(value) => updateField("student_email", value)}
            />
            <Field
              label="Registration number"
              id="student_reg"
              value={values.student_reg}
              error={errors.student_reg}
              onChange={(value) => updateField("student_reg", value)}
            />
            <div>
              <label htmlFor="event_id" className="text-sm font-semibold text-foreground">
                Event
              </label>
              <select
                id="event_id"
                value={selectedEventId}
                disabled={Boolean(eventId) || loadingEvents}
                onChange={(event) => updateField("event_id", event.target.value)}
                aria-invalid={Boolean(errors.event_id)}
                aria-describedby={errors.event_id ? "event_id-error" : undefined}
                className="mt-2 h-12 w-full rounded-md border border-border bg-background px-3 text-foreground disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">
                  {loadingEvents ? "Loading events..." : "Select an event"}
                </option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {errors.event_id && (
                <p id="event_id-error" className="mt-2 text-sm text-red-400">
                  {errors.event_id}
                </p>
              )}
            </div>
          </div>

          {status.message && (
            <p
              className={`mt-5 rounded-md border p-3 text-sm ${
                status.type === "success"
                  ? "border-accent text-accent"
                  : "border-red-400 text-red-300"
              }`}
              role="status"
            >
              {status.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 h-12 w-full rounded-md bg-accent px-5 font-bold text-[#171717] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Registering..." : "Submit registration"}
          </button>
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
        onChange={(event) => onChange(event.target.value)}
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
