import React, { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Award, 
  TreePine, 
  Flame, 
  LogOut, 
  Save, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  Target,
  Globe
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile } from "../types";

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
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem("ecopulse_budget");
    return saved ? parseInt(saved, 10) : 180;
  });
  
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ecopulse_user_name", inputName);
    localStorage.setItem("ecopulse_user_email", inputEmail);
    localStorage.setItem("ecopulse_avatar", currentAvatar);
    localStorage.setItem("ecopulse_budget", monthlyBudget.toString());
    onSignIn(inputName, inputEmail);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleQuickDemoSignIn = () => {
    setInputName("Addy (Climate Lead)");
    setInputEmail("addy250509@gmail.com");
    onSignIn("Addy (Climate Lead)", "addy250509@gmail.com");
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#2ea44f", "#38bdf8", "#f59e0b"],
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
    <div className="flex flex-col gap-10 pb-16 text-[#f0f6fc] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ea44f]/15 border border-[#2ea44f]/35 text-[#2ea44f] text-xs font-bold uppercase tracking-wider w-fit">
          <User className="w-4 h-4" />
          <span>EcoPulse Identity & Carbon Goals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {isSignedIn ? "Your Climate Champion Profile" : "Sign In to EcoPulse Vision"}
        </h1>
        <p className="text-sm text-gray-300">
          Track personal carbon budgets, manage audited records, and unlock UN SDG 13 badges.
        </p>
      </div>

      {!isSignedIn ? (
        /* Sign In / Sign Up Form Card */
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-[#30363d] mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthMode("signin")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === "signin"
                    ? "bg-[#2ea44f] text-white shadow-md shadow-[#2ea44f]/20"
                    : "bg-[#0d1117] text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === "signup"
                    ? "bg-[#2ea44f] text-white shadow-md shadow-[#2ea44f]/20"
                    : "bg-[#0d1117] text-gray-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            <button
              onClick={handleQuickDemoSignIn}
              className="text-xs text-[#38bdf8] hover:text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Access</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-md mx-auto">
            {authMode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Alex Green"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-sm text-white focus:outline-none focus:border-[#2ea44f]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-sm text-white focus:outline-none focus:border-[#2ea44f]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-sm text-white focus:outline-none focus:border-[#2ea44f]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#2ea44f] to-[#238636] hover:from-[#34c759] hover:to-[#2ea44f] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2ea44f]/25 transition-all cursor-pointer"
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

            <div className="pt-3 text-center text-xs text-gray-400">
              <span>By signing in, you support the UN SDG 13 Global Climate Network.</span>
            </div>
          </form>
        </div>
      ) : (
        /* Signed In User Profile Dashboard */
        <div className="flex flex-col gap-8">
          {/* Profile Overview Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Avatar & Title */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-4 bg-[#0d1117] rounded-2xl border border-[#30363d]">
              <div className="w-20 h-20 rounded-2xl bg-[#2ea44f]/20 border-2 border-[#2ea44f] flex items-center justify-center text-4xl shadow-inner mb-3">
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
                      currentAvatar === av ? "bg-[#2ea44f] scale-110" : "bg-[#21262d] hover:bg-[#30363d]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-bold text-white">{userName}</h2>
              <span className="text-xs text-gray-400 truncate max-w-full">{userEmail}</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2ea44f]/20 text-[#2ea44f] border border-[#2ea44f]/40">
                Level 5 Decarbonizer
              </span>
            </div>

            {/* Right: Carbon Quota & Live Stats */}
            <div className="md:col-span-8 flex flex-col gap-5">
              {/* Monthly Budget Progress Bar */}
              <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#38bdf8]" /> Monthly Carbon Budget:
                  </span>
                  <span className="font-bold text-white">
                    {totalEmissions.toFixed(1)} / {monthlyBudget} kg CO2
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#21262d] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetUsagePercent > 80 ? "bg-red-500" : budgetUsagePercent > 50 ? "bg-amber-400" : "bg-[#2ea44f]"
                    }`}
                    style={{ width: `${budgetUsagePercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>{100 - budgetUsagePercent}% remaining budget</span>
                  <span>Target: 1.5°C Paris Accord</span>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]">
                  <span className="text-[11px] font-semibold text-gray-400">Audited Carbon</span>
                  <div className="mt-1 text-xl font-black text-amber-400">
                    {totalEmissions.toFixed(1)} <span className="text-xs font-normal text-gray-400">kg CO2</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d]">
                  <span className="text-[11px] font-semibold text-gray-400">Botanical Offsets</span>
                  <div className="mt-1 text-xl font-black text-[#2ea44f]">
                    {totalTrees} <span className="text-xs font-normal text-gray-400">Trees required</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onSignOut}
                  className="px-3.5 py-2 rounded-xl bg-[#21262d] hover:bg-red-500/20 text-gray-300 hover:text-red-400 text-xs font-bold flex items-center gap-1.5 border border-[#30363d] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2ea44f]" />
              <span>UN SDG 13 Achievement Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? "bg-[#0d1117] border-[#2ea44f]/40 shadow-sm"
                      : "bg-[#0d1117]/50 border-[#30363d] opacity-50"
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-[#21262d] border border-[#30363d]">
                    {badge.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{badge.name}</span>
                      {badge.unlocked && <CheckCircle className="w-3 h-3 text-[#2ea44f]" />}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">{badge.description}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-2">{badge.date}</span>
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
