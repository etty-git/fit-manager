import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../features/messages/messagesApi";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "member", label: "Member" },
];

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function MessageCenter({ title = "Messages", defaultRole = "admin" }) {
  const currentUser = useSelector((state) => state.auth.user);
  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [form, setForm] = useState({
    toRole: defaultRole,
    toEmail: "",
    subject: "",
    body: "",
  });
  const [notice, setNotice] = useState("");

  const currentUserId = currentUser?.id || currentUser?._id;

  const visibleMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        direction:
          (message.from?._id || message.from) === currentUserId ? "Sent" : "Inbox",
      })),
    [messages, currentUserId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await sendMessage({
        ...form,
        toEmail: form.toEmail.trim() || undefined,
      }).unwrap();

      setForm((current) => ({
        ...current,
        toEmail: "",
        subject: "",
        body: "",
      }));
      setNotice("Message sent successfully.");
      setTimeout(() => setNotice(""), 2500);
    } catch (err) {
      setNotice(err?.data?.error || "Message could not be sent.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
          Communication
        </p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Send to role
              <select
                name="toRole"
                value={form.toRole}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-300 p-3"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Specific email
              <input
                name="toEmail"
                type="email"
                value={form.toEmail}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-2 w-full rounded-md border border-slate-300 p-3"
              />
            </label>
          </div>

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full rounded-md border border-slate-300 p-3"
          />

          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Write your message"
            rows="6"
            required
            className="w-full rounded-md border border-slate-300 p-3"
          />

          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-md bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            {isSending ? "Sending..." : "Send message"}
          </button>

          {notice && <p className="text-sm font-semibold text-emerald-700">{notice}</p>}
        </form>

        <div className="space-y-3">
          {isLoading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
              Loading messages...
            </div>
          )}

          {!isLoading &&
            visibleMessages.map((message) => (
              <article
                key={message._id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                      {message.direction} to {message.to?.name || message.toRole}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">
                      {message.subject}
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  From: {message.from?.name || message.from?.email || "Unknown"}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-slate-700">
                  {message.body}
                </p>
              </article>
            ))}

          {!isLoading && !visibleMessages.length && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
              No messages yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
