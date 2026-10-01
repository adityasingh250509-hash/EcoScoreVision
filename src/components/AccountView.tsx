import React, { useState } from "react";
import { 
  User, 
  Award, 
  LogOut, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AccountViewProps {
  isSignedIn: boolean;
  userEmail: string;
  userName: string;
  onSignIn: (name: string, email: string) => void;
  onSignOut: () => void;
  totalEmissions: number;
  totalTrees: number;
}

const AVATARS = [
  "🌿", "🌲", "⚡", "🌍", "🦊", "🦅", "🐬", "☀️"
];

export default function AccountView({
  isSignedIn,
  userEmail,
  userName,
  onSignIn,
  onSignOut,
  totalEmissions,
  totalTrees,
}: AccountViewProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [inputName, setInputName] = useState(userName || "Climate Champion");
  const [inputEmail, setInputEmail] = useState(userEmail || "addy250509@gmail.com");
  const [inputPassword, setInputPassword] = useState("••••••••");
  
  const [currentAvatar, setCurrentAvatar] = useState<string>(() => {
    return localStorage.getItem("ecopulse_avatar") || "🌿";
  });
  const [monthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem("ecopulse_budget");
    return saved ? parseInt(saved, 10) : 180;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ecopulse_user_name", inputName);
    localStorage.setItem("ecopulse_user_email", inputEmail);
    localStorage.setItem("ecopulse_avatar", currentAvatar);
    localStorage.setItem("ecopulse_budget", monthlyBudget.toString());
    onSignIn(inputName, inputEmail);
  };

  const handleQuickDemoSignIn = () => {
    setInputName("Addy (Climate Lead)");
    setInputEmail("addy250509@gmail.com");
    onSignIn("Addy (Climate Lead)", "addy250509@gmail.com");
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#38bdf8", "#f59e0b"],
    });
  };

  const BADGES = [
    {
      id: "b1",
      name: "Vision Pioneer",
      description: "Conducted first multimodal carbon scan",
      icon: "🔍",
      unlocked: true,
      date: "August 2026",
    },
    {
      id: "b2",
      name: "Forest Guardian",
      description: "Identified and offset over 5 trees",
      icon: "🌲",
      unlocked: totalTrees >= 5,
      date: "August 2026",
    },
    {
      id: "b3",
      name: "Clean Commuter",
      description: "Audited green transport & EV alternatives",
      icon: "🚲",
      unlocked: true,
      date: "August 2026",
    },
    {
      id: "b4",
      name: "SDG 13 Hero",
      description: "Signed the Global Climate Action Pledge",
      icon: "🏅",
      unlocked: true,
      date: "August 2026",
    },
    {
      id: "b5",
      name: "Net-Zero Champion",
      description: "Maintained monthly emissions below budget",
      icon: "⚡",
      unlocked: totalEmissions < monthlyBudget,
      date: "In Progress",
    },
  ];

  const budgetUsagePercent = Math.min(100, Math.round((totalEmissions / monthlyBudget) * 100));

  return (
    <div className="flex flex-col gap-10 pb-16 text-[#f1f5f9] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Identity & Carbon Budget Contract</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">UN SDG 13</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {isSignedIn ? "Climate Champion Profile" : "Sign In to EcoPulse Vision"}
        </h1>
        <p className="text-sm text-slate-400">
          Track personal carbon budgets, manage audited records, and unlock UN SDG 13 badges.
        </p>
      </div>

      {!isSignedIn ? (
        /* Sign In / Sign Up Form Card */
        <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-6">
            <div className="flex items-center gap-1.5 bg-[#070a11] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setAuthMode("signin")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  authMode === "signin"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  authMode === "signup"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            <button
              onClick={handleQuickDemoSignIn}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Access</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-md mx-auto">
            {authMode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Alex Green"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070a11] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
            >
              {authMode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Studio</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Free Account</span>
                </>
              )}
            </button>

            <div className="pt-3 text-center text-xs text-slate-500 font-mono">
              <span>By signing in, you support the UN SDG 13 Global Climate Network.</span>
            </div>
          </form>
        </div>
      ) : (
        /* Signed In User Profile Dashboard */
        <div className="flex flex-col gap-8">
          {/* Profile Overview Card */}
          <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Avatar & Title */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-5 bg-[#070a11] rounded-2xl border border-white/[0.06]">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner mb-3">
                {currentAvatar}
              </div>

              {/* Avatar Selector Row */}
              <div className="flex items-center gap-1.5 mb-3">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      setCurrentAvatar(av);
                      localStorage.setItem("ecopulse_avatar", av);
                    }}
                    className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${
                      currentAvatar === av ? "bg-emerald-500 scale-110" : "bg-white/[0.05] hover:bg-white/[0.1]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              <h2 className="text-base font-bold text-white">{userName}</h2>
              <span className="text-xs text-slate-400 font-mono truncate max-w-full">{userEmail}</span>
              <span className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Level 5 Decarbonizer
              </span>
            </div>

            {/* Right: Carbon Quota & Live Stats */}
            <div className="md:col-span-8 flex flex-col gap-5">
              {/* Monthly Budget Progress Bar */}
              <div className="p-4 bg-[#070a11] rounded-xl border border-white/[0.06] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                    <Target className="w-4 h-4 text-emerald-400" /> Monthly Carbon Budget:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {totalEmissions.toFixed(1)} / {monthlyBudget} kg CO2
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.05]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetUsagePercent > 80 ? "bg-rose-500" : budgetUsagePercent > 50 ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${budgetUsagePercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{100 - budgetUsagePercent}% remaining budget</span>
                  <span>Target: 1.5°C Paris Accord</span>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#070a11] rounded-xl border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Audited Carbon</span>
                  <div className="mt-1 text-xl font-bold font-mono text-amber-400">
                    {totalEmissions.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg CO2</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#070a11] rounded-xl border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Botanical Offsets</span>
                  <div className="mt-1 text-xl font-bold font-mono text-emerald-400">
                    {totalTrees} <span className="text-xs font-normal text-slate-500">Trees required</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onSignOut}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-mono font-medium flex items-center gap-1.5 border border-white/[0.06] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>UN SDG 13 Achievement Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? "bg-white/[0.02] border-white/[0.08] shadow-sm"
                      : "bg-[#070a11]/40 border-white/[0.04] opacity-50"
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-[#070a11] border border-white/[0.08]">
                    {badge.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{badge.name}</span>
                      {badge.unlocked && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{badge.description}</p>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">{badge.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
