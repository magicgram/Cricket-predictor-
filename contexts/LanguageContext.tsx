import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, currencyData, languages } from '../lib/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  useEffect(() => {
    const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
    if (rtlLanguages.includes(language)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);


  const setLanguage = (langCode: string) => {
    setLanguageState(langCode);
  };

  const t = useCallback((key: string, vars?: { [key: string]: string | number }): string => {
    const selectedLangInfo = languages.find(l => l.code === language) || languages.find(l => l.code === 'en')!;
    
    // If language is 'en' or 'hi', always use INR. Otherwise, use the currency defined for the language.
    const currencyToUse = (language === 'en' || language === 'hi') 
      ? 'INR' 
      : selectedLangInfo.currency;

    let translation = translations[language]?.[key] || translations['en']?.[key] || key;

    if (vars) {
      Object.keys(vars).forEach(varKey => {
        const regex = new RegExp(`{{${varKey}}}`, 'g');
        translation = translation.replace(regex, String(vars[varKey]));
      });
    }

    const formatCurrency = (amountInr: number): string => {
        const selectedCurrency = currencyData[currencyToUse];
        if (selectedCurrency) {
          const convertedAmount = amountInr * selectedCurrency.rate;
          const roundedAmount = Math.round(convertedAmount);
          // Special formatting for currencies that typically don't use decimals
          if (['IDR', 'VND', 'JPY', 'KRW', 'UZS', 'HUF'].map(c => c.toLowerCase()).includes(currencyToUse.toLowerCase())) {
            return `${selectedCurrency.symbol}${roundedAmount.toLocaleString('en-US')}`;
          }
          return `${selectedCurrency.symbol}${roundedAmount}`;
        }
        // Fallback to INR if something is wrong
        return `₹${amountInr}`;
    };
    
    // Base amount for first deposit is 1000 INR
    translation = translation.replace(/{{minDepositAmount}}/g, formatCurrency(1000));
    // Base amount for re-deposit is 500 INR (approx $5)
    translation = translation.replace(/{{minReDepositAmount}}/g, formatCurrency(500));

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};