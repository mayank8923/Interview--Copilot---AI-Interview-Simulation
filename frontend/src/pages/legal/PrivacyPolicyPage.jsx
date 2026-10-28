import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  EyeOff, 
  FileText, 
  Cpu, 
  Database, 
  UserCheck, 
  Mail, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="flex-1 bg-[#fbf9f6] dark:bg-[#0c0d0f] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation / Back link */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#1a1b20] px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
            Last Updated: October 2026
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="bg-white dark:bg-[#131418] p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Security & Privacy First</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
            At <strong>InterviewCopilot</strong>, we respect your privacy and are committed to protecting your personal information, code submissions, resume details, and interview transcripts.
          </p>
        </div>

        {/* Core Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-1">
              Never Sold
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              We never sell or broker your personal information, code, or interview performance scorecards to third-party recruiters or advertisers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-1">
              Encrypted & Isolated
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Your data is encrypted in transit via TLS 1.3 and at rest with role-based access control and secure JWT authentication tokens.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-1">
              You Own Your Code
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              You retain full intellectual property ownership of all answers, solutions, and notes you draft in our workspace.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-stone-800 dark:text-stone-200 leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white dark:bg-[#131418] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              1. Information We Collect
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              To provide interactive AI interview preparation and personalized scoring, we collect the following categories of information:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Account Information:</strong> Your name, email address, password hash, education level, and target job role when you register.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Coding Workspace Submissions:</strong> Code implementations, programming language choice, testcase run outputs, and execution metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Mock Interview Data:</strong> Audio inputs processed via browser speech recognition, interview transcripts, and AI-generated scoring feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Resume Documents:</strong> Uploaded PDF resumes processed for role-keyword matching and gap analysis.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-[#131418] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              2. How We Use Your Data & AI Processing
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              We process your submissions strictly to provide immediate evaluative utility:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1a1b20] border border-stone-200 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">Real-Time Evaluation</h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Code and answers are evaluated with LLM inference to simulate edge cases, calculate runtime percentiles, and diagnose Big-O time/space complexity.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1a1b20] border border-stone-200 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">Dynamic Readiness Analytics</h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Scores from practice runs aggregate into your dashboard readiness gauge to highlight strong topics and areas requiring review.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">AI Model Non-Training Guarantee:</span>
              Your proprietary code solutions and private interview recordings are processed securely via enterprise API connections and are <strong>not</strong> used to train public commercial foundational models.
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-[#131418] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              3. Data Storage & Security Controls
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              We employ industry-standard administrative, technical, and physical security measures:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Encryption:</strong> Data in transit is protected using modern TLS encryption. Sensitive credentials utilize industry-standard bcrypt hashing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Token-Based Authentication:</strong> Sessions are secured through stateless JWT authentication tokens stored in client browsers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Infrastructure Isolation:</strong> User databases are hosted on enterprise cloud databases with IP whitelisting and regular backup replication.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-[#131418] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              4. Your Rights & Data Erasure
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              You maintain complete authority over your personal data:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Access & Correction:</strong> You can review and update your target role, name, and profile details anytime from your Profile page.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Deletion:</strong> You can request full erasure of your account, past interview transcripts, and code submissions by contacting our privacy team.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-[#131418] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              5. Contact Us
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              If you have any questions, feedback, or privacy requests regarding this policy or our data practices, please reach out to:
            </p>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1a1b20] border border-stone-200 dark:border-stone-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block">Privacy & Security Officer</span>
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400">privacy@interviewcopilot.ai</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

