import { useRouter } from "next/router";
import { createContext, ReactNode, useContext } from "react";

const RefreshContext = createContext();

export function RefreshWrapper({ children }) {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  return (
    <RefreshContext.Provider value={refreshData}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefreshContext() {
  return useContext(RefreshContext);
}
