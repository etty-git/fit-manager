import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    title: "Train like Serena Williams",
    text: "Build explosive strength with short focused sessions, recovery blocks, and footwork drills.",
    image:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cristiano Ronaldo's consistency rule",
    text: "Small daily wins compound. Track attendance, nutrition, and sleep as seriously as your workout.",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Simone Biles and recovery",
    text: "Mobility, mental focus, and smart rest keep performance high across a long training season.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
  },
];

const Homepage = () => {
  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="relative min-h-[72vh] overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80"
          alt="Athletes training in a modern gym"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-300">
            FitManager
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black text-white md:text-7xl">
            Train smarter. Book faster. Perform better.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            A clean fitness platform for members, instructors, and managers who want classes, payments, messages, and progress in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/classes"
              className="rounded-md bg-emerald-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Explore classes
            </Link>
            <Link
              to="/plans"
              className="rounded-md border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              View plans
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Fast booking", "Reserve your spot only after secure payment confirmation."],
            ["Smart coaching", "Instructors see schedules, prices, and class capacity in real time."],
            ["Live analytics", "Admins track revenue, popular classes, and instructor income."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
              Performance Tools
            </p>
            <h2 className="mt-2 text-3xl font-black">Everything your club needs to move faster</h2>
            <p className="mt-3 text-slate-600">
              Built-in class payments, member messaging, instructor dashboards, and admin analytics keep every role aligned.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Paid-only bookings", "Role-based messages", "Instructor revenue", "Popular class insights"].map((feature) => (
              <div key={feature} className="rounded-md bg-slate-50 p-4 font-bold text-slate-800">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
            Training Blog
          </p>
          <h2 className="mt-2 text-3xl font-black">Short reads for stronger athletes</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
