import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
      } else {
        setError(data.message || t('incorrectPassword'));
      }
    } catch (err) {
      setError(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="w-full max-w-sm bg-black/30 backdrop-blur-xl border border-white/10 text-white rounded-2xl p-6 md:p-8 flex flex-col animate-fade-in shadow-2xl">
        <h1 className="text-2xl font-russo text-center text-pink-400 mb-2 uppercase">{t('adminAccess')}</h1>
        <p className="text-center text-white/70 mb-6 font-poppins">{t('enterPasswordToAccessTestPage')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 text-white placeholder-gray-300 font-poppins text-base rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg text-center text-sm bg-red-500/50 text-white border border-red-400/50 font-poppins">
                {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-transparent border-2 border-white/50 text-white font-poppins font-bold text-lg uppercase rounded-full transition-colors hover:bg-white/10"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="py-3 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-poppins font-bold text-lg uppercase rounded-full transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/30"
            >
              {isLoading ? t('verifying') : t('submit')}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default React.memo(AdminAuthModal);