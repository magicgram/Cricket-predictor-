
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HowToPlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
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
            <h1 className="text-3xl font-russo tracking-wide uppercase" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{t('welcomeGuide')}</h1>
        </header>

        <main className="flex-grow overflow-y-auto py-4">
            <div className="max-w-lg mx-auto bg-black/20 backdrop-blur-md rounded-2xl p-6 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><HowToPlayIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-white">{t('onboardingTitle1')}</h2>
                        <p className="mt-1 text-white/80" dangerouslySetInnerHTML={{ __html: t('onboardingDesc1') }} />
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><LinkIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-white">{t('onboardingTitle2')}</h2>
                        <p className="mt-1 text-white/80" dangerouslySetInnerHTML={{ __html: t('onboardingDesc2') }} />
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><ChartIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-white">{t('onboardingTitle3')}</h2>
                        <p className="mt-1 text-white/80" dangerouslySetInnerHTML={{ __html: t('onboardingDesc3') }} />
                    </div>
                </div>
                
                <div className="text-center p-3 bg-pink-500/20 border border-pink-400/30 rounded-lg mt-4">
                    <p className="font-bold text-pink-200">{t('disclaimer')}</p>
                    <p className="text-sm text-pink-300">{t('disclaimerText')}</p>
                </div>
            </div>
        </main>
        
        <footer className="w-full flex items-center justify-center mt-auto flex-shrink-0 pb-4">
            <button
                onClick={onClose}
                className="w-full max-w-xs py-3 min-h-[3.5rem] h-auto bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-black/30 whitespace-normal break-words leading-tight px-4 flex items-center justify-center"
                aria-label={t('closeWelcomeGuide')}
                >
                {t('iUnderstand')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default React.memo(OnboardingModal);