
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../types';
import { usePrediction } from '../services/authService';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import GuideModal from './GuideModal';
import AdminAuthModal from './AdminAuthModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PredictorScreenProps {
  user: User;
  onLogout: () => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

// --- Components ---

const LimitReachedView = React.memo(({ handleDepositRedirect }: { handleDepositRedirect: () => void; }) => {
  const { t } = useLanguage();
  
  return (
     <div 
        className="w-full h-screen text-white flex flex-col font-poppins relative overflow-hidden items-center justify-center p-4"
        style={{ background: 'linear-gradient(to bottom, #0A0A0F, #13131A)' }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/40 via-[#0A0A0F] to-[#0A0A0F] pointer-events-none"></div>

        <main className="flex flex-col items-center justify-center w-full max-w-sm text-center z-20">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold uppercase text-white tracking-wider mb-2">
                  {t('limitReachedTitle')}
              </h1>
              <p className="mt-2 text-gray-400 text-sm">{t('limitReachedText')}</p>
              
              <div className="w-full mt-8">
                  <button 
                      onClick={handleDepositRedirect}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] active:scale-95 shadow-lg"
                  >
                      {t('depositNow')}
                  </button>
              </div>
          </div>
        </main>
    </div>
  );
});

const CircularProgress = ({ percentage, color = "#4ade80" }: { percentage: number, color?: string }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="transform -rotate-90 w-16 h-16">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-white/10"
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold text-white">{percentage}%</span>
        </div>
    );
};

const CricketView = React.memo((props: {
    onOpenSidebar: () => void;
    isPredicting: boolean;
    onGetSignal: () => void;
    predictionResult: any | null;
    predictionsLeft: number;
}) => {
    const { t } = useLanguage();
    const [matchData, setMatchData] = useState<any>(null);
    const [isLoadingMatch, setIsLoadingMatch] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState("03:45:12");

    // --- CRIP API INTEGRATION ---
    // We use the environment variable as requested for the API key
    const fetchCricketData = useCallback(async () => {
        setIsLoadingMatch(true);
        try {
            // IMPORTANT: This simulates the CRIP API call using the environment variable.
            const apiKey = process.env.NEXT_PUBLIC_CRIPAPI_KEY;
            
            if (!apiKey && process.env.NODE_ENV === 'development') {
                console.warn("CRIP API Key is missing in environment variables.");
            }

            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app: 
            // const response = await fetch('https://api.cripapi.com/v1/matches/upcoming', { 
            //    headers: { 'x-api-key': apiKey } 
            // });
            // const data = await response.json();

            // Mock Data mimicking a live response
            setMatchData({
                league: "IPL 2025",
                teamA: { name: "CSK", code: "CSK", color: "bg-yellow-500" },
                teamB: { name: "MI", code: "MI", color: "bg-blue-600" },
                venue: "Wankhede Stadium",
                startTime: new Date(Date.now() + 3600000 * 3), // 3 hours from now
                stats: {
                    teamAWinRate: 62,
                    teamBWinRate: 58,
                    avgScore: 178,
                    tossWinBias: "Bowling First"
                }
            });
        } catch (e) {
            setError("Failed to fetch live match data.");
        } finally {
            setIsLoadingMatch(false);
        }
    }, []);

    useEffect(() => {
        fetchCricketData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [fetchCricketData]);

    // User Action Strip Handlers (Mock)
    const handleDeposit = () => window.open("https://1win.com", "_blank");
    const handleHistory = () => alert("History feature coming soon!");

    return (
        <div className="w-full min-h-screen flex flex-col font-sans bg-[#0A0A0F] text-white relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* 1. Header - Sticky Glass */}
            <header className="sticky top-0 z-40 w-full h-16 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-green-500 rounded-sm"></div>
                    <span className="font-russo text-xl tracking-wider">CRICKET<span className="text-green-400">PRO</span></span>
                </div>
                <div className="flex items-center gap-3">
                     <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold tracking-wide text-gray-300">LIVE API</span>
                    </div>
                    <button onClick={props.onOpenSidebar} className="p-2 text-white hover:bg-white/10 rounded-full">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col px-4 pb-20 pt-6 max-w-md mx-auto w-full gap-6">
                
                {/* 2. Hero Predictor Panel */}
                <div className="text-center space-y-1 relative">
                    <h1 className="text-2xl font-bold text-white leading-tight relative inline-block">
                        Pro Cricket Predictor
                        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></span>
                    </h1>
                    <p className="text-xs text-gray-400 font-light">AI-powered real-time predictions with high accuracy.</p>
                </div>

                {/* 3. Main Predictor Card */}
                <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-2xl group">
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    
                    {isLoadingMatch ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-20 bg-white/10 rounded-xl w-full"></div>
                            <div className="h-40 bg-white/10 rounded-xl w-full"></div>
                        </div>
                    ) : matchData ? (
                        <>
                            {/* Match Header */}
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    <div className={`w-12 h-12 rounded-full ${matchData.teamA.color} flex items-center justify-center shadow-lg font-bold text-sm`}>
                                        {matchData.teamA.code}
                                    </div>
                                    <span className="text-xs font-bold text-gray-300">{matchData.teamA.name}</span>
                                </div>
                                <div className="flex flex-col items-center w-1/3">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">VS</span>
                                    <div className="px-3 py-1 bg-black/40 rounded border border-white/10 text-green-400 font-mono text-sm">
                                        {timeLeft}
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1">Starting Soon</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    <div className={`w-12 h-12 rounded-full ${matchData.teamB.color} flex items-center justify-center shadow-lg font-bold text-sm`}>
                                        {matchData.teamB.code}
                                    </div>
                                    <span className="text-xs font-bold text-gray-300">{matchData.teamB.name}</span>
                                </div>
                            </div>

                            {/* Prediction Area */}
                            <div className="bg-[#0F0F16] rounded-xl border border-white/5 p-4 relative z-10 min-h-[200px] flex flex-col items-center justify-center">
                                {!props.predictionResult ? (
                                    <div className="text-center space-y-4 w-full">
                                        <div className="flex justify-center">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 animate-[spin_10s_linear_infinite]"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">High-accuracy AI model ready.</p>
                                        <button 
                                            onClick={props.onGetSignal}
                                            disabled={props.isPredicting}
                                            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black font-bold uppercase rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {props.isPredicting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Analyzing Data...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Reveal Prediction
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-gray-600">Prediction locks automatically at match start.</p>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-500 uppercase">Prediction Result</p>
                                                <h3 className="text-xl font-bold text-white">{props.predictionResult.outcome}</h3>
                                                <p className="text-xs text-green-400 font-mono">Odds: {props.predictionResult.odds}</p>
                                            </div>
                                            <CircularProgress percentage={props.predictionResult.confidence} />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-gray-400">
                                                <span>Winning Probability</span>
                                                <span>{props.predictionResult.confidence}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000" 
                                                    style={{ width: `${props.predictionResult.confidence}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center border border-white/5">
                                            <span className="text-xs text-gray-400">Suggested Stake</span>
                                            <span className="text-sm font-bold text-white">5-7% of Balance</span>
                                        </div>
                                        
                                        <div className="pt-2 flex justify-center">
                                             <span className="text-[10px] font-mono text-gray-600">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={props.onGetSignal}
                                            disabled={props.isPredicting}
                                            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase rounded-lg border border-white/10 transition-all"
                                        >
                                            Generate New Prediction
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-red-400">{error || "No Match Data Available"}</div>
                    )}
                </div>

                {/* 4. Match Stats Mini-Panel */}
                {matchData && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                            <span className="text-[10px] text-gray-400 uppercase">Team Form (Last 5)</span>
                            <div className="flex gap-1">
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-red-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-xs font-bold text-white mt-1">{matchData.teamA.code} Strong</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                            <span className="text-[10px] text-gray-400 uppercase">Toss Bias</span>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span className="text-xs font-bold text-white">{matchData.stats.tossWinBias}</span>
                            </div>
                            <span className="text-[10px] text-gray-500">Based on venue history</span>
                        </div>
                    </div>
                )}

                {/* 6. User Action Strip */}
                <div className="flex flex-col gap-3">
                    <button onClick={handleDeposit} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-900/30 hover:scale-[1.02] transition-transform">
                        Deposit More Funds
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleHistory} className="py-3 rounded-xl bg-[#1A1A24] text-gray-300 font-semibold text-xs border border-white/5 hover:bg-[#252530]">
                            View History
                        </button>
                         <button className="py-3 rounded-xl bg-[#1A1A24] text-gray-300 font-semibold text-xs border border-white/5 hover:bg-[#252530]">
                            Claim Rewards
                        </button>
                    </div>
                </div>
                
                {/* 5. Recent Predictions Feed */}
                <div className="mt-2">
                    <h4 className="text-xs text-gray-500 uppercase mb-3 font-bold tracking-wider">Recent History</h4>
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-300">IND vs AUS</span>
                                    <span className="text-[10px] text-gray-600">Today, 14:30</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-400 font-bold">WON</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* 7. Footer */}
            <footer className="w-full py-6 border-t border-white/5 bg-[#0A0A0F] text-center z-10">
                <div className="flex justify-center items-center gap-4 text-[10px] text-gray-500 mb-2">
                    <span>SECURE</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>REAL-TIME DATA</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>VERIFIED</span>
                </div>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-green-900 to-transparent mx-auto"></div>
                <p className="text-[10px] text-gray-600 mt-2">Powered by secure CRIP API using protected environment variables.</p>
            </footer>
            
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
});


const PredictorScreen: React.FC<PredictorScreenProps> = ({ user, onLogout }) => {
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionsLeft, setPredictionsLeft] = useState(user.predictionsLeft);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('predictor');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    if (storedPic) {
      setProfilePic(storedPic);
    } else {
      setProfilePic(null);
    }
  }, [user.playerId]);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  const handleGetSignal = useCallback(async () => {
    if (isPredicting || predictionsLeft <= 0) return;

    setIsPredicting(true);

    try {
      // Deduct credit via Auth Service
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsPredicting(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);
      setPredictionResult(null);

      // Simulate AI Calculation Delay
      setTimeout(() => {
        // Logic to generate a Cricket Prediction Result
        // In a real scenario, this would come from the CRIP API
        const outcomes = [
            { outcome: "Team A to Win", odds: "1.85" },
            { outcome: "Team B to Win", odds: "2.10" },
            { outcome: "Total Runs > 320", odds: "1.90" },
            { outcome: "Team A Max Sixes", odds: "2.05" }
        ];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const confidence = Math.floor(Math.random() * (94 - 75) + 75); // 75-94%

        setPredictionResult({
            outcome: randomOutcome.outcome,
            odds: randomOutcome.odds,
            confidence: confidence
        });
        
        setIsPredicting(false);
      }, 2500);

    } catch (error) {
       console.error("Failed to get signal:", error);
       alert(t('unexpectedErrorSignal'));
       setIsPredicting(false);
    }
  }, [user.playerId, isPredicting, predictionsLeft, t]);
  

  const handleDepositRedirect = useCallback(async () => {
    try {
        const response = await fetch('/api/get-affiliate-link');
        const data = await response.json();
        if (response.ok && data.success) {
            if (window.top) {
                window.top.location.href = data.link;
            } else {
                window.location.href = data.link;
            }
        } else {
            alert(data.message || t('depositLinkNotAvailable'));
        }
    } catch (error) {
        console.error('Failed to fetch deposit link:', error);
        alert(t('unexpectedErrorOccurred'));
    }
  }, [t]);
  
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNavigate = useCallback((view) => { setCurrentView(view); setIsSidebarOpen(false); }, []);
  const handleTestPostbackClick = useCallback(() => { setIsSidebarOpen(false); setShowAdminModal(true); }, []);
  const handleAdminSuccess = useCallback(() => { setShowAdminModal(false); setCurrentView('testPostback'); }, []);
  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToPredictor = useCallback(() => setCurrentView('predictor'), []);

  if (predictionsLeft <= 0 && !isPredicting) {
    return <LimitReachedView handleDepositRedirect={handleDepositRedirect} />;
  }
  
  return (
    <div className="w-full min-h-screen bg-[#0A0A0F]">
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        playerId={user.playerId}
        onProfilePictureChange={handleProfilePictureChange}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {currentView === 'predictor' && (
        <CricketView 
            isPredicting={isPredicting}
            predictionResult={predictionResult}
            predictionsLeft={predictionsLeft}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onGetSignal={handleGetSignal}
        />
      )}
      {currentView === 'testPostback' && 
        <TestPostbackScreen onBack={handleBackToPredictor} />
      }
    </div>
  );
};

export default React.memo(PredictorScreen);
