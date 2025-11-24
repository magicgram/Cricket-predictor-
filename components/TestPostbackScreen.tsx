
import React, { useState } from 'react';
import * as authService from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import PostbackGuide from './PostbackGuide';

interface TestPostbackScreenProps {
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const TestPostbackScreen: React.FC<TestPostbackScreenProps> = ({ onBack }) => {
  const [userId, setUserId] = useState('testuser123');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // State for the new promo code form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { t } = useLanguage();

  const handleAction = async (action: (id: string, amount?: any) => Promise<string>, amount?: number) => {
    if (!userId) {
        setError(t('pleaseEnterUserId'));
        return;
    }
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
        const result = await action(userId, amount);
        if (result.startsWith('SUCCESS:')) {
            setMessage(result);
        } else { // It's an error from the service layer
            setError(result);
        }
    } catch(err) { // This handles network errors etc.
        setError(t('unexpectedErrorOccurred'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdatePromoCode = async () => {
    if (!newPromoCode || !adminPassword) {
      setUpdateError(t('fillBothFields'));
      return;
    }
    setIsUpdating(true);
    setUpdateMessage(null);
    setUpdateError(null);

    try {
      const response = await fetch('/api/promo-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: newPromoCode, password: adminPassword }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setUpdateMessage(result.message);
        setNewPromoCode('');
        setAdminPassword('');
      } else {
        setUpdateError(result.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setUpdateError(t('unexpectedErrorOccurred'));
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (showGuide) {
      return (
        <div className="w-full h-screen text-white flex flex-col p-4 relative overflow-hidden" style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}>
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
            <div className="relative z-10 w-full h-full flex flex-col">
                <PostbackGuide onBack={() => setShowGuide(false)} />
            </div>
        </div>
      );
  }

  return (
    <div className="w-full h-screen text-white flex flex-col font-poppins p-4 relative overflow-hidden" style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}>
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

        <header className="flex items-center flex-shrink-0 text-white z-10 relative">
            <div className="w-10">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/20" aria-label={t('goBack')}>
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            </div>
            <h1 className="text-xl md:text-2xl font-russo tracking-wide text-center flex-grow uppercase">{t('postbackTestingTool')}</h1>
            <div className="w-10"></div>
        </header>

        <main className="flex-grow overflow-y-auto py-4 z-10 relative">
          <div className="max-w-md mx-auto bg-black/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <p className="text-center text-white/80 text-sm mb-4 font-poppins">
              {t('postbackToolDescription')}
            </p>
            
            <div className="text-center mb-6">
                <button
                    onClick={() => setShowGuide(true)}
                    className="px-4 py-2 min-h-[2.5rem] h-auto text-sm bg-pink-500/30 text-pink-200 font-semibold rounded-lg hover:bg-pink-500/50 transition-colors whitespace-normal break-words"
                >
                    {t('viewSetupGuide')}
                </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="userIdTest" className="text-sm font-semibold text-white/90 font-poppins">
                  {t('userIdToTest')}
                </label>
                <input
                  id="userIdTest"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="testuser123"
                  className="mt-2 w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-gray-300 font-poppins text-base rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              
              {error && (
                  <div className="p-3 rounded-lg text-center text-sm bg-red-500/50 text-white border border-red-400/50 font-poppins">
                      {error}
                  </div>
              )}
              {message && (
                  <div className="p-3 rounded-lg text-center text-sm bg-green-500/50 text-white border border-green-400/50 font-poppins">
                      {message}
                  </div>
              )}

              <button
                onClick={() => handleAction(authService.testRegistration)}
                disabled={isLoading}
                className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {t('testRegistration')}
              </button>
              <button
                onClick={() => handleAction(authService.testFirstDeposit, 10)}
                disabled={isLoading}
                className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {t('testFirstDeposit')}
              </button>
              <button
                onClick={() => handleAction(authService.testReDeposit, 5)}
                disabled={isLoading}
                className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {t('testReDeposit')}
              </button>

              <div className="w-1/4 h-px bg-white/20 my-3 mx-auto"></div>

              <button
                onClick={() => handleAction(authService.clearUserData)}
                disabled={isLoading}
                className="w-full py-3 min-h-[3.5rem] h-auto bg-transparent border-2 border-white text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {t('clearUserData')}
              </button>
            </div>
            
            {/* --- NEW PROMO CODE SECTION --- */}
            <div className="w-1/2 h-px bg-white/20 my-6 mx-auto"></div>
            <div className="space-y-4 pb-4">
              <h2 className="text-center font-bold text-lg text-white">{t('updatePromoCode')}</h2>
              <div>
                <label htmlFor="newPromoCode" className="text-sm font-semibold text-white/90 font-poppins">
                  {t('newPromoCode')}
                </label>
                <input
                  id="newPromoCode"
                  type="text"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="NEWPROMO25"
                  className="mt-2 w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-gray-300 font-poppins text-base rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div>
                <label htmlFor="adminPassword" className="text-sm font-semibold text-white/90 font-poppins">
                  {t('adminPassword')}
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-gray-300 font-poppins text-base rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>

              {updateError && (
                <div className="p-3 rounded-lg text-center text-sm bg-red-500/50 text-white border border-red-400/50 font-poppins">
                  {updateError}
                </div>
              )}
              {updateMessage && (
                <div className="p-3 rounded-lg text-center text-sm bg-green-500/50 text-white border border-green-400/50 font-poppins">
                  {updateMessage}
                </div>
              )}

              <button
                onClick={handleUpdatePromoCode}
                disabled={isUpdating}
                className="w-full py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-700 to-fuchsia-700 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
              >
                {isUpdating ? t('updating') : t('updatePromocodeButton')}
              </button>
            </div>
          </div>
        </main>
    </div>
  );
};

export default React.memo(TestPostbackScreen);