import React, { useState, useEffect } from "react";
import { LogIn, ExternalLink, Loader2, AlertCircle, Mail, Lock, User, UserPlus, Sparkles, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { zoyaLogo } from "../assets/logo";
import { 
  signInWithGoogle, 
  signInAsGuest, 
  signInWithEmail, 
  signUpWithEmail 
} from "../services/firebaseService";

type LoginTab = "google" | "email" | "guest";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<LoginTab>("google");
  const [isIframe, setIsIframe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  // Email form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Detect if running inside an iframe (like the AI Studio preview pane)
    setIsIframe(window.self !== window.top);
    
    // Default to 'guest' or 'email' if we detect we are likely in an APK (or let user choose)
    // Capacitor/webview hostname is typically localhost or has some offline traits, 
    // but giving the user clear options is always best.
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setUnauthorizedDomain(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google login failed:", err);
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

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAsGuest();
    } catch (err: any) {
      console.error("Guest login failed:", err);
      setError("Guest Sign In failed: " + (err?.message || "Please try again later. Ensure Anonymous Sign-in is enabled in Firebase Console."));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email aur Password dono bharein!");
      return;
    }
    if (password.length < 6) {
      setError("Password kam se kam 6 character ka hona chahiye!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error("Email auth failed:", err);
      let errMsg = err?.message || "Authentication failed.";
      if (err?.code === "auth/user-not-found") {
        errMsg = "Aapka account nahi mila. Sign Up par click karke naya account banayein!";
      } else if (err?.code === "auth/wrong-password") {
        errMsg = "Galat password! Kripya sahi password enter karein.";
      } else if (err?.code === "auth/email-already-in-use") {
        errMsg = "Yeh email pehle se register hai. Login tab select karke login karein.";
      } else if (err?.code === "auth/invalid-email") {
        errMsg = "Sahi email id darj karein.";
      } else if (err?.code === "auth/operation-not-allowed") {
        errMsg = "Firebase Console me Email/Password provider enabled nahi hai. Kripya Guest login select karein.";
      }
      setError(errMsg);
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
        className="w-[92%] max-w-md bg-[#0d0d12]/80 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center relative z-10"
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
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/20 shadow-2xl relative z-10 mb-4"
          referrerPolicy="no-referrer"
        />

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-5 text-center">
          Zoya AI
        </h1>

        {/* Dynamic APK Notice */}
        <div className="w-full mb-5 py-2 px-3 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center gap-2 text-[11px] text-violet-300">
          <Smartphone size={13} className="shrink-0 animate-bounce" />
          <span className="text-center">APK me redirect problem se bachne ke liye <strong>Guest</strong> ya <strong>Email</strong> tab use karein!</span>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl w-full mb-6 relative z-20">
          <button
            onClick={() => { setActiveTab("google"); setError(null); }}
            className={`py-2 px-1 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              activeTab === "google" 
                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => { setActiveTab("email"); setError(null); }}
            className={`py-2 px-1 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              activeTab === "email" 
                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => { setActiveTab("guest"); setError(null); }}
            className={`py-2 px-1 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              activeTab === "guest" 
                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Guest
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="w-full space-y-4 mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-200 text-xs flex items-start gap-2.5 text-left"
            >
              <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={16} />
              <div className="flex-1">
                <p className="font-semibold mb-0.5">Sign In Issue</p>
                <p className="text-red-300/90 leading-relaxed">{error}</p>
              </div>
            </motion.div>

            {unauthorizedDomain && activeTab === "google" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-200 text-[11px] text-left space-y-2"
              >
                <p className="font-semibold text-amber-300 flex items-center gap-1">
                  🔧 authorized domain setup:
                </p>
                <p className="leading-relaxed text-amber-300/80">
                  Firebase Console me login karke <strong>Authorized Domains</strong> settings me niche diya domain add karein:
                </p>
                <div className="p-1.5 bg-black/40 rounded border border-white/10 font-mono text-[10px] break-all select-all text-white flex justify-between items-center gap-2">
                  <span className="truncate">{unauthorizedDomain}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(unauthorizedDomain);
                      alert("Domain copied!");
                    }}
                    className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 transition-all text-white cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Google Tab Form */}
        {activeTab === "google" && (
          <div className="w-full space-y-4">
            {isIframe && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left leading-relaxed">
                <p className="font-semibold text-amber-300 flex items-center gap-1 mb-1">
                  ⚠️ Browser Security Notice
                </p>
                <p className="text-amber-300/80">
                  AI Studio iframe me Google sign-in block ho sakta hai. Kripya naye tab me open karke use karein ya fir <strong>Guest / Email</strong> tab select karein.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {isIframe && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openInNewTab}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-3 transition-all border border-white/15 cursor-pointer text-sm"
                >
                  <ExternalLink size={16} />
                  <span>Naye Tab Me Open Karein</span>
                </motion.button>
              )}

              <motion.button
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-violet-500/25 border border-white/10 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                <span>{loading ? "Signing In..." : "Sign In with Google"}</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Email Tab Form */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailAuth} className="w-full space-y-4">
            <div className="space-y-3">
              {/* Email field */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider pl-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-4 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-violet-500/50 rounded-xl text-white placeholder-white/30 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider pl-1">Password</label>
                <div className="relative flex items-center">
                  <Lock size={14} className="absolute left-4 text-white/40" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-violet-500/50 rounded-xl text-white placeholder-white/30 text-xs outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-violet-500/25 border border-white/10 cursor-pointer disabled:opacity-50 text-sm mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isSignUp ? (
                <UserPlus size={16} />
              ) : (
                <LogIn size={16} />
              )}
              <span>{loading ? "Please wait..." : isSignUp ? "Naya Account Banayein" : "Email se Login Karein"}</span>
            </motion.button>

            {/* Signup/Login Toggle */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className="text-xs text-white/60 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/60 cursor-pointer font-sans"
              >
                {isSignUp 
                  ? "Pehle se account hai? Login karein" 
                  : "Naya account banana hai? Sign Up karein"}
              </button>
            </div>
          </form>
        )}

        {/* Guest Tab Form */}
        {activeTab === "guest" && (
          <div className="w-full space-y-4">
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-200 text-xs text-left leading-relaxed space-y-2">
              <p className="font-semibold text-pink-300 flex items-center gap-1.5">
                ✨ Guest Mode (Instant Access)
              </p>
              <p className="text-pink-300/80">
                Aapko Google login ya email ki jarurat nahi hai! APK me testing karne ka yeh sabse tez aur asan tarika hai. Aapki chat history aur notes is app me pure tarike se save rahenge.
              </p>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-pink-500/25 border border-white/10 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} className="text-amber-300 animate-pulse" />
              )}
              <span>{loading ? "Setting up Guest..." : "Guest ki Tarah Continue Karein"}</span>
            </motion.button>
          </div>
        )}

        {/* Subtle footer credit */}
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-6">
          Zoya AI v2.0 • Powered by Gemini & Firebase
        </p>
      </motion.div>
    </div>
  );
}
