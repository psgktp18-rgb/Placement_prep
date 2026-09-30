import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import InitialAssessmentPage from './pages/InitialAssessmentPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import PracticeArenaPage from './pages/PracticeArenaPage';
import InterviewPracticePage from './pages/InterviewPracticePage';
import GdSimulationPage from './pages/GdSimulationPage';
import ProgressCenterPage from './pages/ProgressCenterPage';
import SkillGapPage from './pages/SkillGapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StudyTimerPage from './pages/StudyTimerPage';
import PlacementNewsPage from './pages/PlacementNewsPage';
import DailyChallengesPage from './pages/DailyChallengesPage';

function AppContent() {
  const { user, token } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('profile');

  if (!token || !user) {
    if (authView === 'signup') {
      return <SignupPage onNavigateLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateSignup={() => setAuthView('signup')} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigateTab={setActiveTab} />;
      case 'profile':
        return <ProfileSetupPage onNextStep={() => setActiveTab('assessment')} />;
      case 'assessment':
        return <InitialAssessmentPage onAssessmentComplete={() => setActiveTab('roadmap')} />;
      case 'roadmap':
        return <RoadmapPage onNavigateTab={setActiveTab} />;
      case 'practice':
        return <PracticeArenaPage />;
      case 'interview':
        return <InterviewPracticePage />;
      case 'gd_simulation':
        return <GdSimulationPage />;
      case 'progress':
        return <ProgressCenterPage />;
      case 'skill_gap':
        return <SkillGapPage onNavigateTab={setActiveTab} />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'study_timer':
        return <StudyTimerPage />;
      case 'news':
        return <PlacementNewsPage />;
      case 'daily_challenge':
        return <DailyChallengesPage />;
      default:
        return <DashboardPage onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
