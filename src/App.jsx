import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Target,
    Sparkles,
    BrainCircuit,
    ArrowRight,
    ShieldCheck,
    Zap,
    FileText
} from 'lucide-react';

// --- Supabase Configuration (REST API) ---
const SUPABASE_URL = 'https://webdghklosmzwqxfzhtr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYmRnaGtsb3NtendxeGZ6aHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDk0ODAsImV4cCI6MjA4MDQyNTQ4MH0.9cdGSu9cc69BXafcyfmNx0CCEBY9e1XJw-8ispuKEH8';

export default function App() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [count, setCount] = useState(0);

    // 1. Fetch Waitlist Count on Load
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=*`, {
                    method: 'HEAD',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'count=exact'
                    }
                });

                if (response.ok) {
                    const contentRange = response.headers.get('content-range');
                    if (contentRange) {
                        const total = parseInt(contentRange.split('/')[1], 10);
                        setCount(total || 0); // Real count, no fake numbers
                    }
                }
            } catch (error) {
                console.error("Error fetching count:", error);
            }
        };

        fetchCount();
    }, []);

    // 2. Handle Form Submission -> Insert into Postgres via REST
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    email: email,
                    source: 'landing_page',
                    created_at: new Date().toISOString()
                })
            });

            if (response.ok || response.status === 409) {
                // 409 = duplicate email, but we still show success for UX
                setStatus('success');
                setEmail('');
                setCount(prev => prev + 1);
            } else {
                throw new Error('Failed to save email');
            }

        } catch (error) {
            console.error("Error saving email:", error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="h-8 w-8 text-indigo-500" />
                            <span className="font-bold text-xl tracking-tight text-white">
                                AnalyzeJD<span className="text-indigo-500">.ai</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</a>
                            <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                                Launch: 3 Days
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Launching in 3 Days • Join the Priority List
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Stop Guessing. <br className="hidden md:block" />
                        Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dominating the ATS.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
                        AnalyzeJD.ai uses advanced AI to scan Job Descriptions, extract hidden requirements,
                        and generate optimized resume bullet points that beat the bots.
                    </p>

                    <div className="max-w-md mx-auto mb-12">
                        {status === 'success' ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white mb-1">You're on the list! 🎉</h3>
                                <p className="text-slate-300">We'll email you the moment we launch. Get ready to land that dream job!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex bg-slate-900 rounded-lg p-1">
                                        <input
                                            type="email"
                                            placeholder="Enter your email address..."
                                            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3 outline-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === 'loading'}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                                            {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
                                <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    {count > 0 ? `${count} people have already joined` : 'Be the first to join!'}
                                </p>
                            </form>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-12">
                        <Stat number="98%" label="ATS Accuracy" />
                        <Stat number="< 20s" label="Analysis Time" />
                        <Stat number="3 Days" label="Launch Countdown" />
                        <Stat number="AI" label="Powered" />
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section id="features" className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why AnalyzeJD.ai?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            90% of resumes are rejected by ATS before humans see them. We bridge the gap between your skills and what the bots are looking for.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Target className="h-8 w-8 text-indigo-400" />}
                            title="ATS Keyword Targeting"
                            description="Identify the exact keywords and 'must-have' skills hidden in the JD that ATS systems scan for."
                        />
                        <FeatureCard
                            icon={<Sparkles className="h-8 w-8 text-purple-400" />}
                            title="Bullet Point Optimization"
                            description="Get AI-suggested rewrites for your resume bullet points to maximize impact and relevance."
                        />
                        <FeatureCard
                            icon={<FileText className="h-8 w-8 text-pink-400" />}
                            title="Gap Analysis"
                            description="Instantly see what your resume is missing compared to the job description requirements."
                        />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl font-bold text-white">How it works</h2>

                            <Step
                                number="01"
                                title="Paste Job Description"
                                desc="Copy the JD from LinkedIn, Indeed, or any job board."
                            />
                            <Step
                                number="02"
                                title="AI Analysis"
                                desc="Our AI breaks down requirements, tech stack, and soft skills."
                            />
                            <Step
                                number="03"
                                title="Get Optimized"
                                desc="Receive keywords to add and bullet points to tweak."
                            />
                        </div>

                        <div className="flex-1 w-full relative">
                            {/* Mockup UI */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative z-10">
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="ml-auto text-xs text-slate-500">Analysis Result</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                                        <div className="text-xs text-indigo-400 uppercase font-semibold mb-1">Match Score</div>
                                        <div className="text-3xl font-bold text-white">87% <span className="text-sm font-normal text-slate-400">Excellent</span></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-slate-300">Missing Keywords:</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Kubernetes</span>
                                            <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">System Design</span>
                                            <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">GraphQL</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-800 rounded text-xs text-slate-400 font-mono">
                                        {`> Generating optimized bullet points...`}
                                        <br />
                                        {`> "Led backend API development..."`}
                                        <span className="animate-pulse">_</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-xl -z-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="bg-slate-950 border-t border-slate-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Zap className="h-10 w-10 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to land your dream job?</h2>
                    <p className="text-slate-400 mb-8">Be first to access when we launch in 3 days.</p>

                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                    >
                        Back to top & join waitlist
                    </a>

                    <div className="mt-12 text-slate-600 text-sm">
                        © {new Date().getFullYear()} AnalyzeJD.ai • Built by @srikarboddupally
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- Subcomponents ---

function Stat({ number, label }) {
    return (
        <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{number}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">{label}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-slate-800/50 hover:bg-slate-800 transition-colors p-8 rounded-2xl border border-slate-700/50">
            <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-6 border border-slate-700">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}

function Step({ number, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-500 bg-slate-900">
                {number}
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-slate-400">{desc}</p>
            </div>
        </div>
    );
}