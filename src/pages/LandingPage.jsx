// src/pages/LandingPage.jsx
const Icon = ({ d, className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const FEATURES = [
  {
    icon: "M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z",
    title: "Smart Batching",
    desc: "Deliveries near each other are automatically grouped into batches, saving time and fuel.",
  },
  {
    icon: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z",
    title: "Verified Delivery",
    desc: "One-time codes confirm every drop-off, giving retailers and customers peace of mind.",
  },
  {
    icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
    title: "Rider Ratings",
    desc: "Retailers rate riders after each delivery, building a trusted network over time.",
  },
  {
    icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
    title: "Live Route Map",
    desc: "Riders see all delivery stops on a map with optimised routing between each address.",
  },
];

const STEPS_RETAILER = [
  { n: "01", text: "Sign up with your shop name and address" },
  { n: "02", text: "Create deliveries with customer details" },
  { n: "03", text: "Nearby orders are auto-batched and assigned to a rider" },
  { n: "04", text: "Share a verification code when the rider arrives" },
  { n: "05", text: "Rate the rider once the delivery is complete" },
];

const STEPS_RIDER = [
  { n: "01", text: "Sign up with your vehicle type" },
  { n: "02", text: "Get assigned a batch of nearby deliveries" },
  { n: "03", text: "Pick up all orders from the retailer's shop" },
  { n: "04", text: "Follow the route map to each customer" },
  { n: "05", text: "Enter the verification code to confirm each drop-off" },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", fontFamily: "var(--font-display)" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md"
        style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--sidebar)" }}>
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "var(--accent)" }}
              />
            </div>
            <span className="font-bold text-gray-900">Route Pool</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "#16A34A",
              boxShadow: "0 4px 14px rgba(22,163,74,0.4)",
            }}>
            Create account
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{
            background: "#F0FDF4",
            borderColor: "#BBF7D0",
            color: "#15803D",
            fontFamily: "var(--font-mono)",
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Last-mile delivery · Nigeria
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Deliveries that{" "}
          <span style={{ color: "var(--accent)" }}>work together</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Route Pool connects local retailers with trusted riders. Orders are
          automatically batched by location so riders make fewer trips and
          customers get faster deliveries.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "#16A34A",
              boxShadow: "0 6px 20px rgba(22,163,74,0.45)",
            }}>
            Create account — it's free
          </button>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 rounded-xl font-semibold text-gray-700 text-sm border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--border)" }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <div
        className="border-y"
        style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div
          className="max-w-5xl mx-auto px-5 py-8 grid grid-cols-3 divide-x"
          style={{ "--tw-divide-opacity": 1 }}>
          {[
            ["Auto-batching", "Save up to 40% on trips"],
            ["Verified drops", "Every delivery confirmed"],
            ["Rated riders", "Quality you can trust"],
          ].map(([title, sub]) => (
            <div key={title} className="px-4 sm:px-8 text-center">
              <p className="font-extrabold text-gray-900 text-sm sm:text-base">
                {title}
              </p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <p
          className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center"
          style={{ fontFamily: "var(--font-mono)" }}>
          Features
        </p>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border p-6 flex gap-4"
              style={{ borderColor: "var(--border)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F0FDF4" }}>
                <Icon
                  d={f.icon}
                  className="w-5 h-5"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t py-20"
        style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center"
            style={{ fontFamily: "var(--font-mono)" }}>
            How it works
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Simple for everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Retailer */}
            <div
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--sidebar)" }}>
                  <Icon
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.015 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <p className="font-bold text-gray-900">For Retailers</p>
              </div>
              <div className="flex flex-col gap-4">
                {STEPS_RETAILER.map((s) => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold flex-shrink-0 mt-0.5 w-6"
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                      }}>
                      {s.n}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Rider */}
            <div
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--sidebar)" }}>
                  <Icon
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <p className="font-bold text-gray-900">For Riders</p>
              </div>
              <div className="flex flex-col gap-4">
                {STEPS_RIDER.map((s) => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold flex-shrink-0 mt-0.5 w-6"
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                      }}>
                      {s.n}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div
            className="rounded-3xl px-8 py-14 text-center"
            style={{ background: "var(--sidebar)" }}>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join Route Pool today — free for retailers and riders alike.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--accent)" }}>
              Create your account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--sidebar)" }}>
              <div
                className="w-2 h-2 rounded-sm"
                style={{ background: "var(--accent)" }}
              />
            </div>
            <span className="font-bold text-gray-700 text-sm">Route Pool</span>
          </div>
          <p className="text-xs text-gray-400">
            Last-mile delivery logistics · Nigeria
          </p>
        </div>
      </footer>
    </div>
  );
}
