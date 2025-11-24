
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


// --- Sub-components moved outside and memoized for performance ---

const LimitReachedView = React.memo(({ handleDepositRedirect }: { handleDepositRedirect: () => void; }) => {
  const { t } = useLanguage();
  const imgUrl = "https://i.postimg.cc/VvHJS3Pd/Picsart-25-11-23-19-21-37-663.png";

  return (
     <div 
        className="w-full h-screen text-white flex flex-col font-poppins relative overflow-hidden items-center justify-center p-4"
        style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}
      >
        <style>{`
          .swoop-bg-new::before {
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 150vw;
              height: 50vh;
              background: linear-gradient(180deg, #4a0e67, #2a003f);
              border-radius: 0 0 100% 100% / 0 0 120px 120px;
              z-index: 0;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              pointer-events: none;
          }
        `}</style>
        <div className="absolute inset-0 swoop-bg-new z-0 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-pink-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <main className="flex flex-col items-center justify-center w-full max-w-sm text-center z-20">
          <div className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8">
              <div className="relative w-48 h-48 mx-auto -mt-24 mb-2">
                  <img 
                    src={imgUrl} 
                    alt="Rocket Queen" 
                    className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] select-none"
                    draggable="false" onContextMenu={(e) => e.preventDefault()}
                  />
                  <div 
                    className="shine-mask" 
                    style={{ maskImage: `url(${imgUrl})`, WebkitMaskImage: `url(${imgUrl})` }}
                  />
              </div>
              <h1 className="text-3xl font-russo uppercase text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  {t('reDepositMessageTitle')}
              </h1>
              <p className="mt-4 max-w-sm text-white/80 font-poppins text-sm">{t('limitReachedText')}</p>
              
              <div className="w-full mt-8">
                  <button 
                      onClick={handleDepositRedirect}
                      className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-[#d838c3] to-[#a63ee8] text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
                  >
                      {t('depositNow')}
                  </button>
              </div>
          </div>
        </main>
    </div>
  );
});


const PredictorView = React.memo((props: {
    onOpenSidebar: () => void;
    displayValue: string;
    isPredicting: boolean;
    isRoundComplete: boolean;
    onGetSignal: () => void;
    onNextRound: () => void;
}) => {
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState('');
    const imgUrl = "https://i.postimg.cc/VvHJS3Pd/Picsart-25-11-23-19-21-37-663.png";

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000 * 30); // Update every 30 seconds
        return () => clearInterval(timer);
    }, []);


    const buttonAction = props.isRoundComplete ? props.onNextRound : props.onGetSignal;
    const buttonText = props.isRoundComplete ? t('nextRound') : (props.isPredicting ? t('predicting') : t('getSignal'));
    const isButtonDisabled = props.isPredicting;

    return (
        <div className="w-full h-screen text-white flex flex-col font-poppins relative overflow-hidden"
             style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}
        >
            <style>{`
                .swoop-bg-new::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 150vw;
                    height: 50vh;
                    background: linear-gradient(180deg, #4a0e67, #2a003f);
                    border-radius: 0 0 100% 100% / 0 0 120px 120px;
                    z-index: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    pointer-events: none;
                }
                
                @keyframes jet-hover {
                    0% {
                        transform: translateY(0) scale(1);
                        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                    }
                    50% {
                        transform: translateY(-8px) scale(1.03);
                        filter: drop-shadow(0 15px 15px rgba(216, 56, 195, 0.4));
                    }
                    100% {
                        transform: translateY(0) scale(1);
                        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                    }
                }
                
                .jet-animation {
                    animation: jet-hover 3s ease-in-out infinite;
                }
            `}</style>
            
            {/* Background elements */}
            <div className="absolute inset-0 swoop-bg-new z-0 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-pink-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

            <div className="relative z-10 w-full h-full flex flex-col">
                <header className="w-full flex-shrink-0 pt-1 pl-1 flex justify-start">
                    <img 
                        src="https://i.postimg.cc/25pY2XXw/Picsart-25-11-23-17-12-51-748.png"
                        alt="Lucky Jet Predictor"
                        className="w-[130px] sm:w-[160px] h-auto object-contain jet-animation"
                    />
                </header>
                
                 <main className="flex-grow w-full flex flex-col items-center justify-end px-4 pb-10">
                    <div className="relative w-full flex-grow flex items-center justify-center">
                        <div className="absolute bottom-1/2 translate-y-[35%] w-full max-w-[320px] z-0">
                            <img 
                                src={imgUrl} 
                                alt="Rocket Queen" 
                                className="w-full h-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] select-none"
                                draggable="false" onContextMenu={(e) => e.preventDefault()}
                            />
                            <div 
                                className="shine-mask" 
                                style={{ 
                                    maskImage: `url(${imgUrl})`, 
                                    WebkitMaskImage: `url(${imgUrl})`,
                                    maskSize: '100% 100%',
                                    WebkitMaskSize: '100% 100%'
                                }}
                            />
                        </div>
                    </div>
                
                    <div className="w-full flex flex-col items-center justify-center flex-shrink-0">
                        <div className="relative w-52 h-52 flex-shrink-0 flex items-center justify-center">
                            {/* Glow Animation */}
                            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse"></div>
                            
                            {/* Base Background */}
                            <div className="absolute inset-0 rounded-full bg-[#3a112f] z-0 shadow-lg shadow-pink-900/40"></div>

                            {/* Outer Border */}
                            <div className="absolute inset-0 rounded-full border-4 border-[#1e0c18] z-20"></div>
                            
                            {/* Spinning Ring */}
                            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-400 border-b-pink-400 z-10 animate-[spin_3s_linear_infinite]"></div>
                            
                            {/* Inner Static Ring */}
                            <div className="absolute inset-2 rounded-full border-2 border-pink-400/20 z-10"></div>
                            
                            <p className="font-sans font-black text-white whitespace-nowrap text-5xl z-30" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                               {props.displayValue}
                            </p>
                        </div>

                        <div className="w-full max-w-xs mt-8">
                             <button 
                                onClick={buttonAction}
                                disabled={isButtonDisabled}
                                className="w-full py-4 min-h-[4rem] h-auto bg-gradient-to-r from-[#d838c3] to-[#a63ee8] rounded-xl text-white font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_2px_2px_rgba(255,255,255,0.2)] hover:shadow-xl hover:brightness-110 active:scale-95 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="w-full h-20 border-t border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
                    <p className="text-4xl font-extrabold text-white font-sans tracking-tighter">{currentTime}</p>
                    <button onClick={props.onOpenSidebar} className="p-2 text-white" aria-label={t('openMenu')}>
                        <MenuIcon className="w-8 h-8" />
                    </button>
                </footer>
            </div>
        </div>
    );
});


const PredictorScreen: React.FC<PredictorScreenProps> = ({ user, onLogout }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [displayValue, setDisplayValue] = useState("?.??x");
  const [predictionsLeft, setPredictionsLeft] = useState(user.predictionsLeft);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('predictor'); // 'predictor' or 'testPostback'
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    if (storedPic) {
      setProfilePic(storedPic);
    } else {
      setProfilePic(null);
    }
  }, [user.playerId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  const handleGetSignal = useCallback(async () => {
    if (isPredicting || predictionsLeft <= 0 || isRoundComplete) return;

    setIsPredicting(true);

    try {
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsPredicting(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);
      setPrediction(null);
      setIsRoundComplete(false);

      intervalRef.current = window.setInterval(() => {
        const randomValue = (Math.random() * 9 + 1).toFixed(2);
        setDisplayValue(`${randomValue}x`);
      }, 50);

      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const isRare = Math.random() < 2 / 25;
        let finalPrediction: string;

        if (isRare) {
          finalPrediction = (Math.random() * (3.10 - 2.20) + 2.20).toFixed(2);
        } else {
          finalPrediction = (Math.random() * (2.20 - 1.10) + 1.10).toFixed(2);
        }
        
        setPrediction(`${finalPrediction}x`);
        setDisplayValue(`${finalPrediction}x`);
        setIsPredicting(false);
        setIsRoundComplete(true);
      }, 3000);

    } catch (error) {
       console.error("Failed to get signal:", error);
       alert(t('unexpectedErrorSignal'));
       setIsPredicting(false);
    }
  }, [user.playerId, isPredicting, predictionsLeft, isRoundComplete, t]);
  
  const handleNextRound = useCallback(() => {
    if (isPredicting) return;
    setPrediction(null);
    setDisplayValue("?.??x");
    setIsRoundComplete(false);
  }, [isPredicting]);

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
    <div className="w-full min-h-screen">
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
        <PredictorView 
            displayValue={displayValue}
            isPredicting={isPredicting}
            isRoundComplete={isRoundComplete}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onGetSignal={handleGetSignal}
            onNextRound={handleNextRound}
        />
      )}
      {currentView === 'testPostback' && 
        <TestPostbackScreen onBack={handleBackToPredictor} />
      }
    </div>
  );
};

export default React.memo(PredictorScreen);