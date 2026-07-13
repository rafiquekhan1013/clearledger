import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Activity,
  GitBranch,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  FileText,
  Lock,
  Shield,
  Zap,
  BarChart3,
  Database,
  Network,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { storageService } from '../services/storage.service';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'focus', label: 'Focus Areas' },
  { id: 'analysis', label: 'Flow Analysis' },
  // { id: 'active', label: 'Active Analyses' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'access', label: 'Access' },
  { id: 'about', label: 'About' },
  { id: 'activestudy', label: 'Active Studies', path: '/studies' },
  { id: 'survey', label: 'Survey', path: '/survey' }
];

function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated,baSlug } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'focus', 'analysis', 'active', 'methodology', 'access', 'about'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileNavOpen(false);
  };

  const handleLogout = () => {
    storageService.resetAuthData();
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
                <Activity className="w-7 h-7 text-blue-700 relative" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">ClearLedger</span>
            </div>
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 rounded-full px-2 py-2">
                {navItems.map((item) => {
                  const className = `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`;

                  return item.path ? (
                    item.id === 'activestudy' && baSlug ? (
                      <Link key={item.id} to={`/${baSlug}`} className={className}>
                        {item.label}
                      </Link>
                    ) : (
                      <Link key={item.id} to={item.path} className={className}>
                        {item.label}
                      </Link>
                    )
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={className}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((open) => !open)}
                className="md:hidden flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {isAuthenticated && (
                <div className="relative ml-1" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Profile menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg border-2 border-slate-200 z-50">
                      <Link
                        to="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <User className="w-4 h-4" />
                        Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {isMobileNavOpen ? (
            <div className="md:hidden mt-3">
              <nav className="flex flex-col items-start text-left gap-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-2 shadow-sm">
                {navItems.map((item) => {
                  const className = `px-3 py-2.5 text-sm font-medium rounded-xl ${
                    activeSection === item.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`;
                  return item.path ? item.id === 'activestudy' && baSlug ? (
                    <Link key={item.id} to={`/${baSlug}`} className={className}>
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      key={item.id}
                      to={`${item.path}`}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={`w-full text-left ${className}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left ${className}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <section id="home" className="pt-32 pb-24 px-6 relative overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl"></div>

          <div className="max-w-6xl mx-auto relative">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full mb-6 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-blue-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-blue-900">Operational Flow Analysis</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
                Understanding onboarding<br />and <span className="text-blue-700">financial flows</span> in<br />regulated platforms
              </h1>
              <p className="text-2xl text-slate-600 max-w-3xl leading-relaxed font-light">
                ClearLedger analyzes how users move through account creation and financial interactions,
                focusing on <span className="font-semibold text-slate-700">clarity, timing, and system behavior</span>.
              </p>
            </div>

            <div className="relative bg-gradient-to-br from-white via-blue-50/50 to-white border border-blue-200/50 rounded-2xl p-10 mb-12 shadow-xl shadow-blue-100/50">
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                    <Database className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-slate-800 leading-relaxed font-medium">
                      User experience within regulated platforms is defined by flows.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pl-16">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" strokeWidth={2} />
                    <p className="text-slate-700 leading-relaxed">
                      Examines how onboarding and financial interactions function in practice, including deposits, withdrawals, and error states
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" strokeWidth={2} />
                    <p className="text-slate-700 leading-relaxed">
                      Focuses on structure and execution, not outcomes or promotion
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                Core Focus
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: GitBranch, text: 'Account creation flows', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
                  { icon: TrendingUp, text: 'Deposits and withdrawals', color: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
                  { icon: Clock, text: 'Processing timelines', color: 'amber', gradient: 'from-amber-500 to-amber-600' },
                  { icon: AlertCircle, text: 'Error handling and recovery', color: 'rose', gradient: 'from-rose-500 to-rose-600' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`group relative flex items-start gap-5 p-7 bg-white border-2 border-${item.color}-100 rounded-2xl hover:shadow-2xl hover:shadow-${item.color}-100/50 hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                    <div className={`p-4 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6 text-white flex-shrink-0" strokeWidth={2} />
                    </div>
                    <span className="text-lg text-slate-800 font-medium group-hover:text-slate-900 transition-colors mt-3">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <button
                onClick={() => scrollToSection('focus')}
                className="group px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center gap-3 font-semibold"
              >
                Explore focus areas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('analysis')}
                className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-300 rounded-xl hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 font-semibold"
              >
                View flow analysis
              </button>
            </div>
          </div>
        </section>

        <section id="focus" className="py-24 px-6 bg-gradient-to-b from-white via-slate-50 to-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full mb-6">
                <Layers className="w-4 h-4 text-blue-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-blue-900">Scope Definition</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Focus Areas</h2>
              <p className="text-xl text-slate-600 font-light">Making scope explicit</p>
            </div>

            <div className="space-y-8">
              <div className="group relative bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-600 rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -left-2 top-8 w-4 h-4 bg-blue-600 rounded-full shadow-lg"></div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <GitBranch className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Account Creation</h3>
                    <p className="text-lg text-slate-700 mb-5 font-medium">
                      Analysis of registration and identity flows, including:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['Step sequencing', 'Information requests', 'Validation and failure points'].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-r from-emerald-50 to-white border-l-4 border-emerald-600 rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -left-2 top-8 w-4 h-4 bg-emerald-600 rounded-full shadow-lg"></div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Deposits</h3>
                    <p className="text-lg text-slate-700 mb-5 font-medium">
                      Observation of funding flows, including:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['Method selection', 'Processing states', 'User feedback during processing'].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-600 rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -left-2 top-8 w-4 h-4 bg-amber-600 rounded-full shadow-lg"></div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Withdrawals</h3>
                    <p className="text-lg text-slate-700 mb-5 font-medium">
                      Evaluation of withdrawal paths, including:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['Initiation clarity', 'Review and approval steps', 'Status visibility'].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-r from-rose-50 to-white border-l-4 border-rose-600 rounded-r-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -left-2 top-8 w-4 h-4 bg-rose-600 rounded-full shadow-lg"></div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Error Handling</h3>
                    <p className="text-lg text-slate-700 mb-5 font-medium">
                      Review of how systems communicate:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['Delays', 'Rejections', 'Interrupted flows'].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="analysis" className="py-24 px-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto relative">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full mb-6 backdrop-blur-sm">
                <Network className="w-4 h-4 text-blue-300" strokeWidth={2} />
                <span className="text-sm font-semibold text-blue-200">Analytical Framework</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">Flow Analysis</h2>
              <p className="text-xl text-slate-300 font-light">Demonstrating rigor and structure</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl mb-5 inline-block">
                    <Layers className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Flow Mapping</h3>
                  <p className="text-slate-300 mb-5 leading-relaxed">
                    ClearLedger documents each step within defined flows to identify:
                  </p>
                  <div className="space-y-3">
                    {['Breakpoints', 'Redundancies', 'Unclear transitions'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl mb-5 inline-block">
                    <Clock className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Timing Observation</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    Processing timelines are observed and documented as presented to users.
                  </p>
                  <p className="text-sm text-slate-400 italic">
                    ClearLedger does not verify or validate backend performance.
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl mb-5 inline-block">
                    <Eye className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">State Visibility</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Analysis of how systems communicate current status and next steps.
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 shadow-2xl">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <GitBranch className="w-6 h-6 text-blue-400" strokeWidth={2} />
                  </div>
                  Flow Visualization Example
                </h4>
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                  Each analysis maps the complete user journey through a specific flow,
                  documenting decision points, wait states, and system responses.
                </p>
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {[
                      { label: 'Start', color: 'from-blue-500 to-blue-600' },
                      { label: 'Step 1', color: 'from-emerald-500 to-emerald-600' },
                      { label: 'Step 2', color: 'from-amber-500 to-amber-600' },
                      { label: 'Complete', color: 'from-green-500 to-green-600' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{idx + 1}</span>
                          </div>
                          <span className="text-slate-300 font-mono text-sm font-medium">{step.label}</span>
                        </div>
                        {idx < 3 && (
                          <ArrowRight className="w-6 h-6 text-slate-600" strokeWidth={2} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* <section id="active" className="py-24 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 rounded-full mb-6">
                <Activity className="w-4 h-4 text-green-700 animate-pulse" strokeWidth={2} />
                <span className="text-sm font-semibold text-green-900">Live Status</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Active Analyses</h2>
              <p className="text-xl text-slate-600 font-light mb-4">Live operational status</p>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                Active analyses are conducted on defined flows with real-time tracking and documentation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="group relative bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full"></div>
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-1 bg-slate-100 rounded-lg border border-slate-200">
                        <span className="text-sm font-mono text-slate-600">Analysis ID:</span>
                        <span className="text-sm font-mono font-bold text-slate-900 ml-2">FS-021</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Account setup</h3>
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                      <Database className="w-4 h-4" strokeWidth={2} />
                      Platform Type: Regulated digital service
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      In progress
                    </span>
                    <span className="text-sm text-slate-500 font-mono">Updated: 2 min ago</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white border-2 border-amber-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-300">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full shadow-lg"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full"></div>
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-1 bg-slate-100 rounded-lg border border-slate-200">
                        <span className="text-sm font-mono text-slate-600">Analysis ID:</span>
                        <span className="text-sm font-mono font-bold text-slate-900 ml-2">FS-022</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Withdrawal initiation</h3>
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                      <Database className="w-4 h-4" strokeWidth={2} />
                      Platform Type: Financial interface
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold rounded-full shadow-lg">
                      Reviewing
                    </span>
                    <span className="text-sm text-slate-500 font-mono">Updated: 15 min ago</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-400 rounded-full shadow-lg"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 rounded-bl-full"></div>
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-1 bg-slate-100 rounded-lg border border-slate-200">
                        <span className="text-sm font-mono text-slate-600">Analysis ID:</span>
                        <span className="text-sm font-mono font-bold text-slate-900 ml-2">FS-023</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Deposit processing flows</h3>
                    <p className="text-slate-600 font-medium flex items-center gap-2">
                      <Database className="w-4 h-4" strokeWidth={2} />
                      Platform Type: Payment interface
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-full border-2 border-slate-300">
                      Queued
                    </span>
                    <span className="text-sm text-slate-500 font-mono">Pending start</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section id="methodology" className="py-24 px-6 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded-full mb-6">
                <FileText className="w-4 h-4 text-slate-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-800">Process Framework</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Methodology</h2>
              <p className="text-xl text-slate-600 font-light">Practical and structured approach</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl">
                      <FileText className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-transparent rounded-full mb-4"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Observation-Based</h3>
                  <p className="text-slate-700 mb-3 leading-relaxed font-medium">
                    ClearLedger uses structured observation and flow mapping.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    No surveys or subjective scoring are applied.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-slate-400 transition-all duration-300">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-xl">
                      <Shield className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="h-1 w-16 bg-gradient-to-r from-slate-600 to-transparent rounded-full mb-4"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Scope Control</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Each analysis is limited to defined flows and timeframes.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl">
                      <Layers className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="h-1 w-16 bg-gradient-to-r from-emerald-600 to-transparent rounded-full mb-4"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Output</h3>
                  <p className="text-slate-700 mb-5 font-medium">Outputs include:</p>
                  <ul className="space-y-3">
                    {['Flow diagrams', 'Step-by-step documentation', 'Observed communication patterns'].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="access" className="py-24 px-6 bg-gradient-to-b from-white via-amber-50/20 to-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 rounded-full mb-6">
                <Lock className="w-4 h-4 text-amber-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-amber-900">Access Framework</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Access</h2>
              <p className="text-xl text-slate-600 font-light">Understanding boundaries and availability</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl transform rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
                <div className="relative bg-white border-2 border-blue-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mb-6 inline-block">
                    <Lock className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-5">Availability</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-slate-700 leading-relaxed">
                        Some analyses may be restricted based on scope or category
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-slate-700 leading-relaxed">
                        Public summaries may be available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl transform -rotate-3 opacity-10 group-hover:-rotate-6 transition-transform"></div>
                <div className="relative bg-white border-2 border-rose-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg mb-6 inline-block">
                    <AlertCircle className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-5">Limitations</h3>
                  <p className="text-slate-700 mb-5 font-medium">ClearLedger does not:</p>
                  <ul className="space-y-3">
                    {['Offer financial advice', 'Assess compliance', 'Provide transaction guarantees'].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2"></div>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 px-6 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/80 rounded-full mb-6">
                <Shield className="w-4 h-4 text-slate-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-800">Core Identity</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">About</h2>
              <p className="text-xl text-slate-600 font-light">Anchoring credibility</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-slate-600 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-slate-700 rounded-xl shadow-lg">
                      <Activity className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full mt-6"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-5">Purpose</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    ClearLedger exists to provide clarity around how onboarding and financial flows
                    operate in practice.
                  </p>
                </div>
              </div>

              <div className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-lg">
                      <Shield className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-slate-600 to-transparent rounded-full mt-6"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-5">Independence</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    ClearLedger operates independently and does not process transactions or funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 py-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all"></div>
              <Activity className="w-8 h-8 text-blue-400 relative" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ClearLedger</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-3">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Analysis Focus
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Operational analysis of onboarding and financial flows in regulated platforms
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Core Areas
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>Account Creation</li>
                <li>Deposits & Withdrawals</li>
                <li>Processing Timelines</li>
                <li>Error Handling</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                Methodology
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Structured observation and flow mapping without surveys or subjective scoring
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                  ClearLedger provides informational analysis of onboarding and financial flows.
                  Content does not constitute financial, legal, or compliance advice.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                © 2026 ClearLedger. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <Link to="/terms" className="hover:text-blue-300 transition-colors">
                  Terms of Service
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
