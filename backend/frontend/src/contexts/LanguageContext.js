import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  language: 'en', // default language
  isLoading: false,
};

// Actions
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
        isLoading: false,
      };
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Initialize language on app load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('rihla-language');
    if (storedLanguage && ['en', 'fr'].includes(storedLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: storedLanguage });
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: defaultLang });
      localStorage.setItem('rihla-language', defaultLang);
    }
  }, []);

  // Change language function
  const changeLanguage = (newLanguage) => {
    if (['en', 'fr'].includes(newLanguage)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: newLanguage });
      localStorage.setItem('rihla-language', newLanguage);
    }
  };

  const value = {
    ...state,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};