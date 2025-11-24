
import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const GuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);


const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-russo font-bold mb-4">{t('depositMessageTitle')}</h2>
      <div className="mb-6 font-poppins space-y-3 text-gray-200 text-sm">
          <p>{t('depositMessageSync')}</p>
          <p>{t('depositMessageDeposit')}</p>
          <p>{t('depositMessageAccess')}</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-[#d838c3] to-[#a63ee8] text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
             <span>{t('depositAndGetAccess').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 min-h-[3.5rem] h-auto bg-white/5 border-2 border-white/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-colors hover:bg-white/10 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

const ReDepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-russo font-bold mb-4">{t('reDepositMessageTitle')}</h2>
      <p className="mb-6 font-poppins text-gray-200 text-sm">{t('reDepositMessageContinue')}</p>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-[#d838c3] to-[#a63ee8] text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
            <span>{t('depositAgain').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 min-h-[3.5rem] h-auto bg-white/5 border-2 border-white/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-colors hover:bg-white/10 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
    </div>
  );
});

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  onOpenGuide: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ 
    onLoginSuccess,
    onOpenSidebar,
    onOpenGuide 
}) => {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDeposit, setNeedsDeposit] = useState(false);
  const [needsReDeposit, setNeedsReDeposit] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  const { t } = useLanguage();

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsDeposit(false);
    setNeedsReDeposit(false);
    
    const idToVerify = playerId;

    try {
        const response: VerificationResponse = await verifyUser(idToVerify);
        if (response.success && typeof response.predictionsLeft !== 'undefined') {
            onLoginSuccess(idToVerify, response.predictionsLeft);
        } else {
            setPlayerId(''); // Clear input on failure
            if (response.status === 'NEEDS_DEPOSIT') {
                setNeedsDeposit(true);
            } else if (response.status === 'NEEDS_REDEPOSIT') {
                setNeedsReDeposit(true);
            } else if (response.status === 'NOT_REGISTERED') {
                const currentAttempts = loginAttempts[idToVerify] || 0;
                const newAttemptsCount = currentAttempts + 1;
                setLoginAttempts(prev => ({ ...prev, [idToVerify]: newAttemptsCount }));

                if (newAttemptsCount >= 3) {
                    setError(t('noRegistrationFoundAfterAttempts'));
                } else {
                    setError(response.message || t('youAreNotRegistered'));
                }
            } else {
                 if (response.success) {
                    setError(t('loginFailedNoCount'));
                } else {
                    setError(response.message || t('unknownErrorOccurred'));
                }
            }
        }
    } catch (err) {
        setPlayerId('');
        setError(t('unexpectedErrorOccurred'));
        console.error("Login attempt failed:", err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegister = useCallback(async () => {
    setIsRegistering(true);
    setError(null); // Clear previous errors
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
        setError(data.message || t('registrationLinkNotAvailable'));
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Failed to fetch registration link:', error);
      setError(t('unexpectedErrorOccurred'));
      setIsRegistering(false);
    }
  }, [t]);

  const handleBackFromDeposit = useCallback(() => setNeedsDeposit(false), []);
  const handleBackFromReDeposit = useCallback(() => setNeedsReDeposit(false), []);

  // Image URL for the login screen
  const loginImgSrc = "https://i.postimg.cc/ZKXvYW3v/Picsart-25-11-22-15-45-21-035.png";

  return (
    <div 
        className="w-full min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden font-poppins" 
        style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}
    >
      {/* Background Elements */}
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

      <div className="absolute top-6 right-4 flex items-center space-x-2 z-30">
        <button onClick={onOpenGuide} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Guide">
            <GuideIcon className="w-6 h-6" />
        </button>
        <button onClick={onOpenSidebar} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Menu">
            <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-sm text-center z-20">
        {needsDeposit ? (
            <div className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white">
              <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
            </div>
        ) : needsReDeposit ? (
            <div className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white">
              <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
            </div>
        ) : (
          <>
            <div className="relative w-48 h-48 mb-4 mx-auto">
              <img 
                src={loginImgSrc} 
                alt={t('unlockPredictions')} 
                className="w-full h-full object-contain relative z-10" 
                style={{filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.4))'}} 
                draggable="false" 
                onContextMenu={(e) => e.preventDefault()}
              />
              <div 
                className="shine-mask z-20" 
                style={{
                  maskImage: `url(${loginImgSrc})`,
                  WebkitMaskImage: `url(${loginImgSrc})`
                }}
              />
            </div>
            
            <h1 className="text-4xl font-russo uppercase text-white tracking-wider mx-auto max-w-[260px] leading-none" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>{t('unlockPredictions')}</h1>
            <p className="text-sm font-poppins font-light text-white/80 mt-2 mb-8 uppercase tracking-wide">{t('enterPlayerIdToSync')}</p>
            
            <div className="w-full space-y-5">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                        id="playerId"
                        type="text"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder={t('playerIdLabel')}
                        className="w-full pl-12 pr-5 py-3 bg-[#3c104c]/70 border border-white/10 text-white placeholder-gray-300 font-poppins text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                    />
                </div>

                <button
                    onClick={handleContinue}
                    disabled={isLoading || !playerId}
                    className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-[#d838c3] to-[#a63ee8] text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[28px]">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                       t('continue').toUpperCase()
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-white/80 font-poppins pt-8">{t('dontHaveAccount')}</p>
            
            <div className="w-full mt-2">
              <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-3 min-h-[3.5rem] h-auto bg-white/5 border-2 border-white/50 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:bg-white/10 disabled:opacity-50 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {isRegistering ? (
                    <div className="flex justify-center items-center h-[28px]">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                   t('registerHere').toUpperCase()
                )}
              </button>
            </div>

            {error && (
                <div className="w-full mt-4 p-3 text-center text-sm bg-red-500/50 text-white border border-red-400/50 font-poppins rounded-lg">
                    {error}
                </div>
            )}
          </>
        )}
      </main>

      <p className="text-white/50 text-sm font-poppins z-20 pb-2">v29.9.0</p>
    </div>
  );
};

export default LoginScreen;
