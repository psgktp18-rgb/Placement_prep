import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Upload, FileText, CheckCircle2, User, Target, GraduationCap, Code2, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';

const roleOptions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Product Manager',
  'Business Analyst',
  'Data Scientist',
  'Financial Analyst',
  'Design Engineer',
  'Operations Analyst'
];

export default function ProfileSetupPage({ onNextStep }) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [leetcodeUsername, setLeetcodeUsername] = useState(user?.leetcode_username || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeSummary, setResumeSummary] = useState(user?.resume_summary || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const isTech = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'AI & ML'].includes(branch) || branch.toLowerCase().includes('computer') || branch.toLowerCase().includes('it');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('branch', branch);
      formData.append('target_role', targetRole);
      formData.append('leetcode_username', leetcodeUsername);
      if (resumeFile) {
        formData.append('resume_file', resumeFile);
      }

      const res = await api.updateProfile(formData);
      if (res.profile) {
        updateUserProfile(res.profile);
        setResumeSummary(res.profile.resume_summary || '');
        setSuccessMsg('Profile and resume successfully saved & parsed with AI!');
      }
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            Step 1: Role & Resume Setup
          </span>
          <h1 className="text-2xl font-extrabold mt-2">Login → Select Role → Upload Resume → AI Analysis</h1>
          <p className="text-brand-100 text-sm mt-1 max-w-xl">
            Tell us the role you want, upload your resume, and let the AI detect your strengths before the interview and personalized plan begin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {['Role', 'Resume', 'AI Review', 'Interview', 'Plan'].map((step, index) => (
          <div key={step} className={`rounded-xl border px-3 py-2 text-center text-xs font-bold ${index === 0 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            {index + 1}. {step}
          </div>
        ))}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm gap-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          {onNextStep && (
            <button
              onClick={onNextStep}
              className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow hover:bg-brand-700 transition flex items-center gap-2"
            >
              Start AI Skill Interview <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Form Column */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Personal & Career Targets</h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Branch (Domain Adaptability)</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="Computer Science">Computer Science / IT</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical & Electronics</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Commerce & Finance">Commerce & Finance</option>
                <option value="MBA / Management">MBA / Management</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Choose Target Role</label>
            <div className="relative mb-2">
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Or type a custom role"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`px-3 py-2 rounded-xl border text-left text-[11px] font-semibold transition ${
                    targetRole === role
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional LeetCode Field for Tech Branches */}
          {isTech ? (
            <div className="p-3.5 bg-brand-50/60 border border-brand-200/80 rounded-xl space-y-1">
              <label className="block text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-brand-600" /> LeetCode Public Username (Server Proxy Sync)
              </label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g., alexchen_dev"
                className="w-full bg-white border border-brand-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-600"
              />
              <p className="text-[10px] text-brand-700">Used by server-side GraphQL endpoint to auto-sync recent AC submissions.</p>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-700">Non-Tech Domain Arena Active</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Your practice arena will present finance frameworks, core engineering problems, and case studies instead of LeetCode.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving Profile & Extracting PDF...' : 'Save Profile & Parse Resume'}
          </button>
        </div>

        {/* Right Upload Column */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> PDF Resume Upload
            </h3>

            <div className="mt-4 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-brand-50/30">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <Upload className="w-10 h-10 text-brand-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">
                  {resumeFile ? resumeFile.name : 'Click or Drag PDF Resume here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports standard placement resume formats (PDF up to 10MB)</p>
              </label>
            </div>

            {resumeSummary && (
              <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-400">
                  <Sparkles className="w-4 h-4" /> AI Resume Summary Extracted:
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{resumeSummary}</p>
              </div>
            )}
          </div>

          {onNextStep && (
            <button
              type="button"
              onClick={onNextStep}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              Continue to AI Interview <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
