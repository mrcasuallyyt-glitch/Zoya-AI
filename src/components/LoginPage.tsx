import React, { useState, useEffect } from "react";
import { LogIn, ExternalLink, Loader2, AlertCircle, Mail, Lock, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { zoyaLogo } from "../assets/logo";
import { signInWithGoogle, loginWithEmail, signUpWithEmail } from "../services/firebaseService";

export default function LoginPage() {
  const [isIframe, setIsIframe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  useEffect(() => {
    // Detect if running inside an iframe (like the AI Studio preview pane)
    setIsIframe(window.self !== window.top);
  }, []);

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);

    try {
      if (isRegisterMode) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error("Email authentication failed:", err);
      if (err?.code === "auth/email-already-in-use") {
        setError("Yeh email address pehle se registered hai. Kripya login karein.");
      } else if (err?.code === "auth/invalid-email" || err?.message?.includes("invalid-email")) {
        setError("Invalid email address format.");
      } else if (err?.code === "auth/weak-password") {
        setError("Password kam se kam 6 characters ka hona chahiye.");
      } else if (err?.code === "auth/invalid-credential" || err?.code === "auth/user-not-found" || err?.code === "auth/wrong-password") {
        setError("Sahi email ya password enter karein.");
      } else {
        setError(err?.message || "Authentication failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login failed:", err);
      // Construct user friendly error message
      if (err?.code === "auth/unauthorized-domain" || err?.message?.includes("unauthorized-domain")) {
        setUnauthorizedDomain(window.location.hostname);
        setError("Firebase Authorized Domains Configured nahi hai.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Browser ne login popup block kar diya hai. Kripya naye tab me open karke login karein.");
      } else if (err?.code === "auth/iframe-start-fail" || err?.message?.includes("iframe")) {
        setError("Iframe restriction ki wajah se login nahi ho pa raha. Kripya naye tab me open karein.");
      } else {
        setError(err?.message || "Login failed. Please try opening in a new tab.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  return (
    <div className="h-[100dvh] w-screen bg-[#050505] text-white flex items-center justify-center font-sans relative overflow-hidden m-0 p-0">
      {/* Cinematic Background Gradients */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/35 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-900/35 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[90%] max-w-md bg-[#0d0d12]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center relative z-10"
      >
        {/* Glow effect under logo */}
        <div className="absolute top-12 w-24 h-24 bg-violet-500/20 blur-xl rounded-full pointer-events-none" />

        {/* Logo */}
        <motion.img
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          src={zoyaLogo}
          alt="Zoya Logo"
          className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-2xl relative z-10 mb-6"
          referrerPolicy="no-referrer"
        />

        {/* Brand Name */}
        <h1 className="text-3xl font-serif font-bold tracking-wider bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-6">
          Zoya AI
        </h1>

        {/* Error Alert Box */}
        {error && (
          <div className="w-full space-y-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 text-left"
            >
              <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
              <div className="flex-1">
                <p className="font-semibold mb-1">Sign In Issue</p>
                <p className="text-xs text-red-300/90 leading-relaxed">{error}</p>
              </div>
            </motion.div>

            {unauthorizedDomain && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs text-left space-y-3"
              >
                <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                  🔧 Easy Solution Guide / Solution Kaise Karein:
                </p>
                <p className="leading-relaxed text-amber-300/80">
                  Yeh domain aapke Firebase project me authorized nahi hai. Isko authorized karne ke liye:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-amber-300/90 font-sans">
                  <li>
                    Aapne jis Firebase account par setup kiya hai, uske <strong>Firebase Console</strong> par jayein.
                  </li>
                  <li>
                    Sidebar me <strong>Authentication</strong> select karke <strong>Settings</strong> tab me jayein, phir <strong>Authorized Domains</strong> par click karein.
                  </li>
                  <li>
                    <strong>Add Domain</strong> button par click karein aur niche diye domain ko paste karke add karein:
                    <div className="mt-2 p-2 bg-black/40 rounded border border-white/10 font-mono text-[10px] break-all select-all text-white flex justify-between items-center">
                      <span>{unauthorizedDomain}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(unauthorizedDomain);
                          alert("Domain copied to clipboard!");
                        }}
                        className="text-[9px] px-2 py-1 bg-white/10 rounded hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer border border-white/5 font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </li>
                </ol>
              </motion.div>
            )}
          </div>
        )}

        {/* Info/Warning for Iframe */}
        {isIframe && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left w-full space-y-2 leading-relaxed">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              ⚠️ Browser Security Notice
            </p>
            <p className="text-amber-300/80">
              AI Studio preview panel (iframe) me Google Sign-In popups block ho jate hain. 
              Behtar hoga agar aap ise naye tab me khol kar login karein.
            </p>
          </div>
        )}

        {/* Auth Mode Toggle Tabs */}
        <div className="flex w-full bg-white/5 p-1 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              !isRegisterMode
                ? "bg-gradient-to-r from-violet-600/30 to-pink-600/30 text-white border border-violet-500/30 font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Login / Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              isRegisterMode
                ? "bg-gradient-to-r from-violet-600/30 to-pink-600/30 text-white border border-violet-500/30 font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAction} className="w-full space-y-4 mb-6">
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all text-white placeholder:text-white/30"
                minLength={6}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRegisterMode ? (
              <UserPlus size={16} />
            ) : (
              <LogIn size={16} />
            )}
            <span>{loading ? "Please wait..." : isRegisterMode ? "Register & Continue" : "Login with Email"}</span>
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="h-[1px] bg-white/10 flex-1"></div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">OR / YA PHIR</span>
          <div className="h-[1px] bg-white/10 flex-1"></div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {isIframe && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openInNewTab}
              className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-3 transition-all border border-white/15 cursor-pointer"
            >
              <ExternalLink size={18} />
              <span>Naye Tab Me Open Karein</span>
            </motion.button>
          )}

          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#13131a] hover:bg-[#1a1a24] text-white font-semibold flex items-center justify-center gap-3 transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-violet-400" />
            ) : (
              <LogIn size={18} className="text-violet-400" />
            )}
            <span>{loading ? "Signing In..." : "Sign In with Google"}</span>
          </motion.button>
        </div>

        {/* Subtle footer credit */}
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-8">
          Powered by Gemini & Firestore
        </p>
      </motion.div>
    </div>
  );
}
