import React, { useState, useCallback, useEffect } from 'react';
import LoginContainer from './components/LoginContainer';
import PredictorScreen from './components/PredictorScreen';
import { User } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { verifyUser } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedPlayerId = localStorage.getItem('playerId');
      if (storedPlayerId) {
        try {
          // Verify the stored ID to ensure it's still valid and get fresh data
          const response = await verifyUser(storedPlayerId);
          if (response.success && response.status === 'LOGGED_IN' && typeof response.predictionsLeft !== 'undefined') {
            setUser({ playerId: storedPlayerId, predictionsLeft: response.predictionsLeft });
          } else {
             // If validation fails (e.g. data cleared), clear storage
             localStorage.removeItem('playerId');
          }
        } catch (error) {
          console.error("Session restoration failed", error);
          // On network error or other issues, we might want to force re-login
          localStorage.removeItem('playerId');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLoginSuccess = useCallback((playerId: string, initialPredictions: number) => {
    localStorage.setItem('playerId', playerId);
    setUser({ playerId, predictionsLeft: initialPredictions });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('playerId');
    setUser(null);
  }, []);

  if (isLoading) {
     return (
        <div className="min-h-screen flex items-center justify-center font-sans" style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}>
           <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
        </div>
     );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(to top, #4f0070, #2a003f)' }}>
        {user ? (
          <PredictorScreen 
            user={user} 
            onLogout={handleLogout} 
          />
        ) : (
          <LoginContainer 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
      </div>
    </LanguageProvider>
  );
};

export default App;