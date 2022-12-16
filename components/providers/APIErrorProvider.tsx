import { useState, useCallback, ReactNode, createContext } from "react";

type APIErrorContext = {
  error: { message?: string; status?: string };
  addError: (message?: string, status?: string) => void;
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
    status?: string;
  }>({ message: "", status: "" });

  console.log("error inside provider", error);
  const removeError = () => setError({ message: "", status: "" });

  const addError = (message?: string, status?: string) =>
    setError({ message, status });

  const contextValue = {
    error,
    addError: useCallback(
      (message?: string, status?: string) => addError(message, status),
      []
    ),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  );
}
