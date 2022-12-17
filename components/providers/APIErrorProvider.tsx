import { useState, useCallback, ReactNode, createContext } from "react";

type APIErrorContext = {
  error: { message?: string };
  addError: (message?: string) => void;
  removeError: () => void;
};

export const APIErrorContext = createContext<APIErrorContext>({
  error: {},
  addError: () => {},
  removeError: () => {},
});

interface APIErrorProviderProps {
  children: ReactNode[];
}

export default function APIErrorProvider({ children }: APIErrorProviderProps) {
  const [error, setError] = useState<{
    message?: string;
  }>({ message: "" });

  const removeError = () => setError({ message: undefined });

  const addError = (message?: string) => setError({ message });

  const contextValue = {
    error,
    addError: useCallback((message?: string) => addError(message), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  );
}
