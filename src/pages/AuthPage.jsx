// src/pages/AuthPage.jsx
import { useState, useRef } from "react";
import { signup, requestOtp, verifyOtp, saveToken } from "../api/auth.api";

const ArrowRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);
const ArrowLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
);
const TruckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
    />
  </svg>
);
const StoreIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  </svg>
);

const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-xs font-medium text-gray-500 uppercase tracking-widest"
      style={{ fontFamily: "var(--font-mono)" }}>
      {label}
    </label>
    <input
      className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900
      placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-300 focus:border-green-500
      ${error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const OtpInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");
  const handle = (e, i) => {
    const ch = e.target.value
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(-1)
      .toUpperCase();
    const next = [...digits];
    next[i] = ch;
    onChange(next.join("").trimEnd());
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[i]?.trim()) {
        next[i] = " ";
        onChange(next.join("").trimEnd());
      } else if (i > 0) refs.current[i - 1]?.focus();
    }
  };
  const onPaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData
      .getData("text")
      .replace(/\s/g, "")
      .toUpperCase()
      .slice(0, 6);
    onChange(p);
    refs.current[Math.min(p.length, 5)]?.focus();
  };
  return (
    <div className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d.trim()}
          onChange={(e) => handle(e, i)}
          onKeyDown={(e) => onKey(e, i)}
          onPaste={onPaste}
          maxLength={1}
          className="w-11 h-11 text-center text-lg font-bold rounded-xl border-2
            border-gray-200 bg-white text-green-500 outline-none
            focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      ))}
    </div>
  );
};

const BrandPanel = () => (
  <div
    className="hidden lg:flex flex-col justify-between p-14"
    style={{ background: "var(--sidebar)" }}>
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "var(--accent)" }}>
        <div className="w-3.5 h-3.5 rounded-sm bg-white" />
      </div>
      <span className="text-white font-bold text-lg">Route Pool</span>
    </div>
    <div>
      <h2
        className="font-extrabold text-white leading-tight mb-5"
        style={{ fontSize: "3.5rem" }}>
        Deliver
        <br />
        <span style={{ color: "var(--accent)" }}>smarter.</span>
        <br />
        Not harder.
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
        Route Pool automatically batches deliveries and assigns the best rider —
        zero manual work, maximum efficiency.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
      {[
        ["98%", "on-time"],
        ["3×", "faster routes"],
        ["0", "manual steps"],
      ].map(([v, l]) => (
        <div key={l}>
          <div
            className="font-extrabold text-2xl"
            style={{ color: "var(--accent)" }}>
            {v}
          </div>
          <div className="text-gray-500 text-xs mt-1">{l}</div>
        </div>
      ))}
    </div>
  </div>
);

const VEHICLES = ["motorcycle", "bicycle", "car"];

export default function AuthPage({ onAuth, onBack }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");
  const [userType, setUserType] = useState("retailer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [fields, setFields] = useState({
    email: "",
    name: "",
    phone: "",
    shop_name: "",
    shop_address: "",
    vehicle_type: "motorcycle",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k) => (e) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [k]: "" }));
    setError("");
  };
  const validate = () => {
    const errs = {};
    if (!fields.email.includes("@")) errs.email = "Enter a valid email";
    if (mode === "signup") {
      if (!fields.name.trim()) errs.name = "Required";
      if (!fields.phone.trim()) errs.phone = "Required";
      if (userType === "retailer" && !fields.shop_name.trim())
        errs.shop_name = "Required";
      if (userType === "retailer" && !fields.shop_address.trim())
        errs.shop_address = "Required";
    }
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await signup({
          email: fields.email,
          name: fields.name,
          phone: fields.phone,
          user_type: userType,
          ...(userType === "retailer"
            ? { shop_name: fields.shop_name, shop_address: fields.shop_address }
            : { vehicle_type: fields.vehicle_type }),
        });
      } else {
        await requestOtp(fields.email);
      }
      setPendingEmail(fields.email);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.trim().length < 6) {
      setError("Enter the full 6-character code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(pendingEmail, otp.trim());
      if (res.data?.token) saveToken(res.data.token);
      onAuth?.(res.data);
    } catch (err) {
      setError(err.message);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setStep("form");
    setError("");
    setOtp("");
    setFieldErrors({});
  };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "var(--bg)" }}>
      <BrandPanel />
      <div className="flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <div className="w-3 h-3 rounded-sm bg-white" />
            </div>
            <span className="font-bold text-lg">Route Pool</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          )}

          {step === "form" ? (
            <div>
              {/* Mode tabs */}
              <div
                className="flex gap-1 p-1 rounded-xl w-fit mb-8"
                style={{ background: "#EEEBE4" }}>
                {["login", "signup"].map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize
                      ${mode === m ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                    {m}
                  </button>
                ))}
              </div>

              <h1
                className="font-extrabold text-gray-900 mb-2"
                style={{ fontSize: "2rem" }}>
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                {mode === "login"
                  ? "Enter your email and we'll send a sign-in code."
                  : "Set up your account in seconds."}
              </p>

              <div className="flex flex-col gap-4">
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        val: "retailer",
                        label: "Retailer",
                        Icon: StoreIcon,
                        sub: "I send packages",
                      },
                      {
                        val: "rider",
                        label: "Rider",
                        Icon: TruckIcon,
                        sub: "I deliver packages",
                      },
                    ].map(({ val, label, Icon, sub }) => (
                      <button
                        key={val}
                        onClick={() => setUserType(val)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all
                          ${userType === val ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                        <div
                          className={`p-2 rounded-lg ${userType === val ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <Icon />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">
                            {label}
                          </div>
                          <div className="text-xs text-gray-500">{sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={set("email")}
                  error={fieldErrors.email}
                  autoComplete="email"
                />

                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Full name"
                        placeholder="Jane Doe"
                        value={fields.name}
                        onChange={set("name")}
                        error={fieldErrors.name}
                      />
                      <Input
                        label="Phone"
                        placeholder="+234 800 000 0000"
                        value={fields.phone}
                        onChange={set("phone")}
                        error={fieldErrors.phone}
                      />
                    </div>
                    {userType === "retailer" ? (
                      <>
                        <Input
                          label="Shop name"
                          placeholder="My Store Ltd."
                          value={fields.shop_name}
                          onChange={set("shop_name")}
                          error={fieldErrors.shop_name}
                        />
                        <Input
                          label="Shop address"
                          placeholder="12 Lagos Street, Abuja"
                          value={fields.shop_address}
                          onChange={set("shop_address")}
                          error={fieldErrors.shop_address}
                        />
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-xs font-medium text-gray-500 uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-mono)" }}>
                          Vehicle type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {VEHICLES.map((v) => (
                            <button
                              key={v}
                              onClick={() =>
                                setFields((f) => ({ ...f, vehicle_type: v }))
                              }
                              className={`py-2.5 rounded-xl text-sm font-medium capitalize border-2 transition-all
                                ${fields.vehicle_type === v ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2
                    hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
                  style={{ background: "var(--accent)" }}>
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      {mode === "login" ? "Send code" : "Create account"}{" "}
                      <ArrowRight />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                {mode === "login" ? "No account? " : "Already have one? "}
                <button
                  onClick={() =>
                    switchMode(mode === "login" ? "signup" : "login")
                  }
                  className="font-semibold hover:underline"
                  style={{ color: "var(--accent)" }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-10 transition-colors">
                <ArrowLeft /> Back
              </button>
              <div
                className="w-12 h-1.5 rounded-full mb-6"
                style={{ background: "var(--accent)" }}
              />
              <h2
                className="font-extrabold text-gray-900 mb-2"
                style={{ fontSize: "2rem" }}>
                Check your email
              </h2>
              <p className="text-gray-500 text-sm mb-1">
                We sent a 6-character code to
              </p>
              <p
                className="font-semibold mb-8"
                style={{ color: "var(--accent)" }}>
                {pendingEmail}
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-medium text-gray-500 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    Verification code
                  </label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.trim().length < 6}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2
                    hover:opacity-90 transition-all disabled:opacity-40"
                  style={{ background: "var(--accent)" }}>
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify &amp; continue <ArrowRight />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setOtp("");
                    handleSubmit();
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 text-center transition-colors">
                  Resend code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
