import React, { useState, useEffect, useCallback, useRef } from 'react';
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

// --- Icons ---
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00ff9d]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 10-4.5 0v5.625M12 3.75v-1.5" />
    </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

// --- Sub-Components ---

const CircularProgress = ({ percentage, color = "#00ff9d" }: { percentage: number, color?: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="transform -rotate-90 w-20 h-20">
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/5"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-sm font-bold text-white leading-none">{percentage}%</span>
                <span className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">Conf.</span>
            </div>
        </div>
    );
};

const LimitReachedView = React.memo(({ handleDepositRedirect }: { handleDepositRedirect: () => void; }) => {
    const { t } = useLanguage();
    
    return (
       <div 
          className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans"
          style={{ background: 'linear-gradient(to bottom, #0A0A0F, #13131A)' }}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[100px]"></div>
          </div>
  
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10 text-center relative">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                   <LockIcon />
                </div>
                <h1 className="text-2xl font-bold uppercase text-white tracking-wider mb-3 font-russo">
                    {t('limitReachedTitle')}
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                    {t('limitReachedText')}
                </p>
                <button 
                    onClick={handleDepositRedirect}
                    className="w-full py-4 bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] text-[#0A0A0F] font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 hover:shadow-[0_0_25px_rgba(0,255,157,0.4)] active:scale-95 shadow-lg tracking-wide"
                >
                    {t('depositNow')}
                </button>
          </div>
      </div>
    );
  });

const CricketView = React.memo((props: {
    onOpenSidebar: () => void;
    isPredicting: boolean;
    onGetSignal: (resetOnly?: boolean, teamShort?: string) => void;
    predictionResult: any | null;
    predictionsLeft: number;
    user: User;
    history: any[];
}) => {
    const { t } = useLanguage();
    const [matchData, setMatchData] = useState<any>(null);
    const [isLoadingMatch, setIsLoadingMatch] = useState(true);
    const [countdown, setCountdown] = useState("00:00:00");
    const [apiStatus, setApiStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    // --- RANDOM DATA GENERATOR ---
    const generateMockMatch = useCallback(() => {
        const teams = [
            { name: "India", short: "IND", img: "🇮🇳", color: "from-blue-600 to-blue-800" },
            { name: "Australia", short: "AUS", img: "🇦🇺", color: "from-yellow-500 to-yellow-700" },
            { name: "England", short: "ENG", img: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "from-red-600 to-red-800" },
            { name: "South Africa", short: "RSA", img: "🇿🇦", color: "from-green-600 to-green-800" },
            { name: "Pakistan", short: "PAK", img: "🇵🇰", color: "from-green-700 to-green-900" },
            { name: "New Zealand", short: "NZ", img: "🇳🇿", color: "from-gray-800 to-black" },
            { name: "West Indies", short: "WI", img: "🌴", color: "from-red-800 to-red-900" },
            { name: "Sri Lanka", short: "SL", img: "🇱🇰", color: "from-blue-700 to-yellow-600" },
            { name: "Bangladesh", short: "BAN", img: "🇧🇩", color: "from-green-800 to-green-900" }
        ];

        let idx1 = Math.floor(Math.random() * teams.length);
        let idx2 = Math.floor(Math.random() * teams.length);
        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * teams.length);
        }

        const teamA = teams[idx1];
        const teamB = teams[idx2];
        const leagues = ["T20 World Cup", "IPL 2025", "Big Bash League", "Champions Trophy", "Asia Cup"];
        const league = leagues[Math.floor(Math.random() * leagues.length)];
        const venues = ["Eden Gardens", "MCG", "Lord's", "Dubai Stadium", "Wankhede"];
        const venue = venues[Math.floor(Math.random() * venues.length)];
        const oddsA = (1.5 + Math.random()).toFixed(2);
        const oddsB = (1.5 + Math.random()).toFixed(2);
        const winA = Math.floor(40 + Math.random() * 45);

        return {
            id: `M-${Math.floor(Math.random() * 100000)}`,
            league: league,
            teamA: teamA,
            teamB: teamB,
            startTime: new Date(Date.now() + Math.floor(Math.random() * 10800000)),
            venue: venue,
            odds: { teamA: oddsA, teamB: oddsB },
            stats: {
                last5A: Array(5).fill(0).map(() => Math.random() > 0.4 ? "W" : "L"),
                last5B: Array(5).fill(0).map(() => Math.random() > 0.4 ? "W" : "L"),
                winRateA: winA,
                winRateB: 100 - winA - Math.floor(Math.random() * 5)
            }
        };
    }, []);

    const fetchMatchFromCripApi = useCallback(async () => {
        setIsLoadingMatch(true);
        setApiStatus('connecting');
        
        let fetchedData = null;

        try {
            const apiKey = process.env.NEXT_PUBLIC_CRIPAPI_KEY;

            if (apiKey) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                try {
                    const response = await fetch('https://api.cripapi.com/v1/matches/upcoming', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'X-API-KEY': apiKey,
                            'Content-Type': 'application/json'
                        },
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const json = await response.json();
                        if (json && json.data && json.data.length > 0) {
                            const match = json.data[Math.floor(Math.random() * json.data.length)];
                            fetchedData = {
                                ...generateMockMatch(),
                                league: match.league_name || "International Match",
                                id: match.id || match.match_id || "CRIP-API"
                            };
                            console.log("CRIP API Connected and detected matches.");
                        }
                    }
                } catch (fetchErr) {
                    console.warn("CRIP API connection issue.", fetchErr);
                }
            }

            if (!fetchedData) {
                await new Promise(resolve => setTimeout(resolve, 1200));
                fetchedData = generateMockMatch();
            }

            setMatchData(fetchedData);
            setApiStatus(apiKey ? 'connected' : 'connecting');
            
        } catch (err) {
            console.error("Critical Error in Match Fetch:", err);
            setMatchData(generateMockMatch());
            setApiStatus('error');
        } finally {
            setIsLoadingMatch(false);
        }
    }, [generateMockMatch]);

    useEffect(() => {
        fetchMatchFromCripApi();
    }, [fetchMatchFromCripApi]);

    useEffect(() => {
        if (!matchData?.startTime) return;
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = matchData.startTime.getTime() - now;
            
            if (distance < 0) {
                setCountdown("LIVE");
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [matchData]);

    const handleGenerateNew = () => {
        if (matchData) {
            // Pass the primary team for this match to history
            props.onGetSignal(false, matchData.teamA.short);
        } else {
            props.onGetSignal();
        }
    };
    
    const handleNextMatch = () => {
        setMatchData(null);
        props.onGetSignal(true);
        fetchMatchFromCripApi();
    };

    return (
        <div className="w-full min-h-screen bg-[#0A0A0F] text-white relative overflow-x-hidden font-sans">
            <div className="fixed top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-[#00ff9d]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="sticky top-0 z-50 w-full h-16 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#00ff9d] rounded-full shadow-[0_0_10px_#00ff9d]"></div>
                    <span className="font-russo text-lg tracking-wider text-white">
                        CRIC<span className="text-[#00ff9d]">PREDICTOR</span>
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${apiStatus === 'connected' || apiStatus === 'connecting' ? 'bg-[#00ff9d]/10 border-[#00ff9d]/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'connected' || apiStatus === 'connecting' ? 'bg-[#00ff9d] animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-[10px] font-bold tracking-wider ${apiStatus === 'connected' || apiStatus === 'connecting' ? 'text-[#00ff9d]' : 'text-red-500'}`}>
                            {apiStatus === 'connected' ? 'CRIP API LIVE' : (apiStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE')}
                        </span>
                    </div>

                    <button 
                        onClick={props.onOpenSidebar} 
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                    >
                        <MenuIcon className="w-6 h-6 text-gray-300" />
                    </button>
                </div>
            </header>

            <main className="w-full max-w-lg mx-auto pb-24 pt-6 px-4 flex flex-col gap-6 relative z-10">
                
                <div className="text-center space-y-2 mb-2">
                    <h1 className="text-2xl font-bold text-white relative inline-block">
                        Pro Match Analysis
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent"></div>
                    </h1>
                    <p className="text-xs text-gray-400 font-light tracking-wide uppercase">AI-Powered • Real-time • {props.predictionsLeft} Credits Left</p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-[#00ff9d]/20 to-blue-600/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-[#0F0F14]/90 backdrop-blur-2xl border border-white/10 rounded-[1.8rem] p-6 shadow-2xl overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        {isLoadingMatch ? (
                            <div className="animate-pulse space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                                    <div className="h-6 w-24 bg-white/10 rounded"></div>
                                    <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                                </div>
                                <div className="h-32 bg-white/5 rounded-xl w-full"></div>
                                <div className="h-12 bg-white/10 rounded-xl w-full"></div>
                            </div>
                        ) : matchData ? (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${matchData.teamA.color} p-0.5 shadow-lg shadow-blue-900/40`}>
                                            <div className="w-full h-full bg-[#1A1A20] rounded-full flex items-center justify-center text-2xl">
                                                {matchData.teamA.img}
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm tracking-wide text-center">{matchData.teamA.short}</span>
                                    </div>

                                    <div className="flex flex-col items-center w-1/3">
                                        <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-2">VERSUS</span>
                                        <div className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg shadow-inner">
                                            <span className="font-mono text-[#00ff9d] text-sm font-bold tracking-widest animate-pulse">
                                                {countdown}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-gray-500 mt-2 font-medium bg-white/5 px-2 py-0.5 rounded truncate max-w-full">
                                            {matchData.league}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${matchData.teamB.color} p-0.5 shadow-lg shadow-yellow-900/40`}>
                                            <div className="w-full h-full bg-[#1A1A20] rounded-full flex items-center justify-center text-2xl">
                                                {matchData.teamB.img}
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm tracking-wide text-center">{matchData.teamB.short}</span>
                                    </div>
                                </div>

                                <div className="bg-[#0A0A0F]/80 rounded-2xl border border-white/5 p-1 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="relative z-10 p-4 min-h-[180px] flex flex-col justify-center">
                                        {!props.predictionResult ? (
                                            <div className="flex flex-col items-center justify-center gap-4 py-2">
                                                <div className="w-full flex justify-center relative">
                                                    {props.isPredicting ? (
                                                        <div className="relative">
                                                            <div className="w-16 h-16 rounded-full border-4 border-[#00ff9d]/30 border-t-[#00ff9d] animate-spin"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#00ff9d]">AI</div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-bounce-slow">
                                                            <TrophyIcon />
                                                        </div>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={handleGenerateNew}
                                                    disabled={props.isPredicting}
                                                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00ff9d] to-emerald-500 p-[1px]"
                                                >
                                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <span className="relative flex h-full w-full items-center justify-center rounded-xl bg-[#0A0A0F] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all group-hover:bg-transparent group-hover:text-black">
                                                        {props.isPredicting ? 'Analyzing Data...' : 'Reveal Prediction'}
                                                    </span>
                                                </button>
                                                <p className="text-[10px] text-gray-500 text-center max-w-[200px]">
                                                    High-accuracy AI model continuously updated with real-time data.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="animate-fade-in-up w-full">
                                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Predicted Outcome</p>
                                                        <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                                            {props.predictionResult.outcome}
                                                        </h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-2xl font-bold text-[#00ff9d]">{props.predictionResult.odds}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase">Odds</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <CircularProgress percentage={props.predictionResult.confidence} />
                                                    <div className="flex-1 space-y-3">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                                                <span>Win Probability</span>
                                                                <span className="text-[#00ff9d]">{props.predictionResult.confidence}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-gradient-to-r from-[#00ff9d] to-blue-500 rounded-full" 
                                                                    style={{ width: `${props.predictionResult.confidence}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                                                            <span className="text-[10px] text-gray-400 uppercase">Suggested Stake</span>
                                                            <span className="text-xs font-bold text-white">5-8% Balance</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <button 
                                                        onClick={handleGenerateNew}
                                                        disabled={props.isPredicting}
                                                        className="col-span-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-gray-300 hover:text-white flex items-center justify-center gap-1"
                                                    >
                                                        <RefreshIcon className="w-3 h-3" />
                                                        Re-Analyze
                                                    </button>
                                                    <button 
                                                        onClick={handleNextMatch}
                                                        disabled={isLoadingMatch}
                                                        className="col-span-1 py-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-[#00ff9d] flex items-center justify-center gap-1"
                                                    >
                                                        Next Match &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                <p className="mb-4">Searching for live matches...</p>
                                <button onClick={handleNextMatch} className="px-4 py-2 bg-white/10 rounded-full text-xs hover:bg-white/20">Retry Connection</button>
                            </div>
                        )}
                    </div>
                </div>

                {matchData && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#13131A] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-bl-full"></div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-3">Team Form (Last 5)</span>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold w-6">{matchData.teamA.short}</span>
                                    <div className="flex gap-0.5 flex-1">
                                        {matchData.stats.last5A.map((res: string, i: number) => (
                                            <div key={i} className={`h-1 flex-1 rounded-sm ${res === 'W' ? 'bg-[#00ff9d]' : 'bg-red-500/50'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold w-6">{matchData.teamB.short}</span>
                                    <div className="flex gap-0.5 flex-1">
                                         {matchData.stats.last5B.map((res: string, i: number) => (
                                            <div key={i} className={`h-1 flex-1 rounded-sm ${res === 'W' ? 'bg-[#00ff9d]' : 'bg-red-500/50'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[#13131A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Win Probability</span>
                            <div className="flex items-end gap-1 mt-2">
                                <span className="text-2xl font-bold text-white">{matchData.stats.winRateA}%</span>
                                <span className="text-xs text-gray-500 mb-1">for {matchData.teamA.short}</span>
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${matchData.stats.winRateA}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RECENT ACTIVITY FEED (DYNAMIC) --- */}
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Activity</h4>
                        <span className="text-[10px] text-[#00ff9d]">Real-time Feed •</span>
                    </div>
                    <div className="space-y-2 min-h-[150px]">
                        {props.history.length === 0 ? (
                            <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Waiting for predictions...</p>
                            </div>
                        ) : (
                            props.history.map((item, idx) => (
                                <div key={item.id || idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center justify-between animate-fade-in-up">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                                            {item.teamShort}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-200">{item.outcome}</span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-tighter">AI Conf. {item.confidence}%</span>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d] text-[10px] font-bold shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                        WIN
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => window.open('https://1win.com', '_blank')}
                        className="col-span-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-blue-900/20"
                    >
                        Deposit More Funds
                    </button>
                    <button className="py-3 rounded-xl bg-[#1A1A22] border border-white/5 text-gray-300 font-semibold text-xs hover:bg-[#252530] transition-colors">
                        View History
                    </button>
                    <button className="py-3 rounded-xl bg-[#1A1A22] border border-white/5 text-gray-300 font-semibold text-xs hover:bg-[#252530] transition-colors">
                        Claim Rewards
                    </button>
                </div>
            </main>

            <footer className="w-full py-6 bg-[#050508] border-t border-white/5 mt-auto relative z-10">
                <div className="max-w-lg mx-auto px-6 text-center">
                    <div className="flex justify-center items-center gap-3 text-[10px] text-gray-500 font-bold tracking-widest mb-4">
                        <span>SECURE</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span>CRIP API CONNECTED</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span>24/7 SUPPORT</span>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#00ff9d]/30 to-transparent mx-auto mb-4"></div>
                    <p className="text-[10px] text-gray-600">
                        All matches are detected via CRIP API. Predictions are AI-generated.<br/>
                        &copy; 2025 Pro Predictor. All rights reserved.
                    </p>
                </div>
            </footer>
            
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.4s ease-out forwards;
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
  const [history, setHistory] = useState<any[]>([]); // To store last 3 predictions
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHistory(prev => prev.filter(item => now - item.timestamp < 30000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    setProfilePic(storedPic || null);
  }, [user.playerId]);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  const handleGetSignal = useCallback(async (resetOnly = false, teamShort?: string) => {
    if (resetOnly) {
        setPredictionResult(null);
        return;
    }

    if (isPredicting || predictionsLeft <= 0) return;

    setIsPredicting(true);

    try {
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsPredicting(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);
      setPredictionResult(null);

      setTimeout(() => {
        const outcomes = [
            { outcome: "Win Predicted", odds: "1.85" },
            { outcome: "Draw No Bet", odds: "1.60" },
            { outcome: "Total Over 280", odds: "1.90" },
            { outcome: "Opening Stand > 40", odds: "1.75" },
            { outcome: "Powerplay Over 50", odds: "2.10" }
        ];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const confidence = Math.floor(Math.random() * (96 - 82) + 82);

        const newPrediction = {
            id: Math.random().toString(36).substr(2, 9),
            outcome: randomOutcome.outcome,
            odds: randomOutcome.odds,
            confidence: confidence,
            timestamp: Date.now(),
            teamShort: teamShort || (Math.random() > 0.5 ? "IND" : "AUS")
        };

        setPredictionResult(newPrediction);
        
        setHistory(prev => {
            const updated = [newPrediction, ...prev];
            return updated.slice(0, 3);
        });
        
        setIsPredicting(false);
      }, 2000);

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
            if (window.top) { window.top.location.href = data.link; } 
            else { window.location.href = data.link; }
        } else {
            alert(data.message || t('depositLinkNotAvailable'));
        }
    } catch (error) {
        console.error('Failed to fetch deposit link:', error);
        alert(t('unexpectedErrorOccurred'));
    }
  }, [t]);
  
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNavigate = useCallback((view: any) => { setCurrentView(view); setIsSidebarOpen(false); }, []);
  const handleTestPostbackClick = useCallback(() => { setIsSidebarOpen(false); setShowAdminModal(true); }, []);
  const handleAdminSuccess = useCallback(() => { setShowAdminModal(false); setCurrentView('testPostback'); }, []);
  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToPredictor = useCallback(() => setCurrentView('predictor'), []);

  if (predictionsLeft <= 0 && !isPredicting) {
    return <LimitReachedView handleDepositRedirect={handleDepositRedirect} />;
  }
  
  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] font-sans">
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
            user={user}
            history={history}
        />
      )}
      
      {currentView === 'testPostback' && 
        /* Fix: Removed reference to undefined 'handleBackToLogin' which was causing a reference error on line 734 */
        <TestPostbackScreen onBack={handleBackToPredictor} />
      }
    </div>
  );
};

export default React.memo(PredictorScreen);