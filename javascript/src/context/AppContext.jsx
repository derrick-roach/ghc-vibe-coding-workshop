import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);

  return (
    <AppContext.Provider value={{ username, setUsername, apiAvailable, setApiAvailable }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
