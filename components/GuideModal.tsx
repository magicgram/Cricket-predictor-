
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
    const [copied, setCopied] = useState(false);
    const [promoCode, setPromoCode] = useState<string>('...');
    const { t } = useLanguage();

    useEffect(() => {
        const fetchPromoCode = async () => {
            try {
                const response = await fetch('/api/promo-code');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.promoCode) {
                    setPromoCode(data.promoCode);
                } else {
                    setPromoCode('OGGY'); // Fallback
                }
            } catch (error) {
                console.error('Failed to fetch promo code:', error);
                setPromoCode('OGGY'); // Fallback on error
            }
        };
        fetchPromoCode();
    }, []);

    const handleCopy = () => {
        if (promoCode === '...') return;
        navigator.clipboard.writeText(promoCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in font-poppins text-white p-4 overflow-hidden" 
      style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}
      aria-modal="true" role="dialog">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
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
      
      <div className="relative z-10 flex-grow w-full h-full flex flex-col">
          <header className="w-full text-center pt-8 flex-shrink-0">
              <h1 className="text-3xl font-russo tracking-wide uppercase" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{t('howToGetAccess')}</h1>
              <p className="text-white/80 mt-1">{t('followStepsToUnlock')}</p>
          </header>

          <main className="flex-grow overflow-y-auto py-4">
              <div className="max-w-lg mx-auto bg-black/20 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-6">
                <div className="space-y-3 text-white/90">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">1.</div>
                        <p className="pt-1">{t('guideStep1')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">2.</div>
                        <p className="pt-1">{t('guideStep2')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">3.</div>
                        <p className="pt-1">{t('guideStep3')}</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">4.</div>
                        <div className="flex-grow">
                          <p>{t('guideStep4')}</p>
                          <div className="mt-2 flex items-center justify-between bg-black/30 p-2 rounded-md border border-white/20">
                              <span className="font-mono text-lg text-pink-300 font-bold">{promoCode}</span>
                              <button onClick={handleCopy} className="p-1 text-gray-300 hover:text-white transition-colors" aria-label={t('copyPromocode')}>
                                  {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                              </button>
                          </div>
                        </div>
                    </div>
                </div>
            
                <div className="w-full h-px bg-white/20 my-6"></div>

                <div>
                    <h2 className="text-xl font-bold text-center text-white mb-4 uppercase">{t('howToFindPlayerId')}</h2>
                    <div className="space-y-3 text-white/90">
                        <div className="flex items-start gap-4"><div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">1.</div><p className="pt-1">{t('playerIdStep1')}</p></div>
                        <div className="flex items-start gap-4"><div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">2.</div><p className="pt-1">{t('playerIdStep2')}</p></div>
                        <div className="flex items-start gap-4"><div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">3.</div><p className="pt-1">{t('playerIdStep3')}</p></div>
                        <div className="flex items-start gap-4"><div className="flex-shrink-0 pt-1 font-bold text-pink-400 text-2xl">4.</div><p className="pt-1">{t('playerIdStep4')}</p></div>
                    </div>
                </div>
              </div>
          </main>
        
          <footer className="w-full flex items-center justify-center mt-auto flex-shrink-0 pb-4">
            <button
            onClick={onClose}
            className="w-full max-w-xs py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
            aria-label={t('closeGuide')}
            >
            {t('gotIt')}
            </button>
          </footer>
      </div>
    </div>
  );
};

export default React.memo(GuideModal);