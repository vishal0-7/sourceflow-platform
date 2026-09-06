import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import {
  FileText,
  Brain,
  Sparkles,
  ShieldCheck,
  Send,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Layers,
  ArrowDown
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAppStore();
  const [email, setEmail] = useState('operator@sourceflow.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password, rememberMe);
    setIsLoading(false);
  };

  const processSteps = [
    { label: 'SOURCE', desc: 'Organizational reports & data', icon: FileText },
    { label: 'UNDERSTAND', desc: 'Grounded intelligence extraction', icon: Brain },
    { label: 'TRANSFORM', desc: 'Audience-tailored synthesis', icon: Sparkles },
    { label: 'VERIFY', desc: 'Provable citation fact-checking', icon: ShieldCheck },
    { label: 'DELIVER', desc: 'Attested stakeholder dispatch', icon: Send }
  ];

  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] flex flex-col justify-between select-none">
      
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT SIDE: SourceFlow Branding & Process Flow (Desktop) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span>Trusted Content Transformation Platform</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-base tracking-wider shadow-subtle">
                  SF
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-sans">
                  SourceFlow
                </h1>
              </div>

              <p className="text-xl text-teal-900 font-semibold tracking-tight font-sans">
                "One source. Many trusted outputs."
              </p>

              <p className="text-sm text-stone-600 leading-relaxed max-w-md font-normal">
                Transform complex information into clear, verified communication. Purpose-built for institutional and enterprise teams where accuracy and provenance matter.
              </p>
            </div>

            {/* Minimal Visual Process Flowchart */}
            <div className="pt-2 space-y-2 max-w-md">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-3 font-mono">
                Transformation Pipeline
              </span>

              <div className="space-y-2">
                {processSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.label}>
                      <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-subtle">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-900 font-mono tracking-wide block">
                              {step.label}
                            </span>
                            <span className="text-[11px] text-stone-500 truncate block">
                              {step.desc}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-300">
                            0{idx + 1}
                          </span>
                        </div>
                      </div>

                      {idx < processSteps.length - 1 && (
                        <div className="flex justify-center -my-1">
                          <div className="w-0.5 h-3 bg-stone-200" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Login Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-card w-full max-w-md space-y-6">
              
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-sans">
                  Welcome back
                </h2>
                <p className="text-xs text-stone-500">
                  Sign in to continue to your workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Work Email Field */}
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 font-sans">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="operator@sourceflow.demo"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-teal-700 transition-colors shadow-subtle"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5 font-sans">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-teal-700 transition-colors shadow-subtle"
                    />
                  </div>
                </div>

                {/* Options: Remember me & Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-700 border-stone-300 focus:ring-teal-700"
                    />
                    <span>Remember me</span>
                  </label>

                  <a href="#/login" className="text-teal-700 hover:text-teal-900 font-medium">
                    Forgot password?
                  </a>
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition-all shadow-subtle hover:shadow-card cursor-pointer disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>

              {/* Below Sign in link */}
              <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
                <span>New to SourceFlow? </span>
                <a href="#/login" className="text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2">
                  Create an account
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-xs text-stone-400 font-mono border-t border-stone-200/60 bg-white/60">
        SourceFlow • Trusted Content Transformation Platform • Single Source of Truth
      </footer>

    </div>
  );
};
