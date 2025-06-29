import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PayloadContextType {
  email: string | null;
  setEmail: (phone: string | null) => void;
  token: string | null;
  setToken: (token: string) => void;
}

const PayloadContext = createContext<PayloadContextType | undefined>(undefined);

export const PayloadProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  return (
    <PayloadContext.Provider value={{ email, setEmail, token, setToken }}>
      {children}
    </PayloadContext.Provider>
  );
};

export const usePayload = () => {
  const context = useContext(PayloadContext);
  if (context === undefined) {
    throw new Error('usePayload must be used within a PayloadProvider');
  }
  return context;
};
