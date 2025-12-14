import { createContext, useContext, useState, ReactNode } from 'react';

interface PageVisibility {
  dashboard: boolean;
  observability: boolean;
  'insights-tower': boolean;
  evaluation: boolean;
  prompts: boolean;
  governance: boolean;
  azure: boolean;
  'multi-cloud': boolean;
  integrations: boolean;
}

interface PageVisibilityContextType {
  visibility: PageVisibility;
  toggleVisibility: (page: keyof PageVisibility) => void;
  setVisibility: (page: keyof PageVisibility, value: boolean) => void;
}

const defaultVisibility: PageVisibility = {
  dashboard: true,
  observability: true,
  'insights-tower': true,
  evaluation: true,
  prompts: true,
  governance: true,
  azure: true,
  'multi-cloud': true,
  integrations: true,
};

const PageVisibilityContext = createContext<PageVisibilityContextType | undefined>(undefined);

export function PageVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibilityState] = useState<PageVisibility>(defaultVisibility);

  const toggleVisibility = (page: keyof PageVisibility) => {
    setVisibilityState(prev => ({ ...prev, [page]: !prev[page] }));
  };

  const setVisibility = (page: keyof PageVisibility, value: boolean) => {
    setVisibilityState(prev => ({ ...prev, [page]: value }));
  };

  return (
    <PageVisibilityContext.Provider value={{ visibility, toggleVisibility, setVisibility }}>
      {children}
    </PageVisibilityContext.Provider>
  );
}

export function usePageVisibility() {
  const context = useContext(PageVisibilityContext);
  if (!context) {
    throw new Error('usePageVisibility must be used within a PageVisibilityProvider');
  }
  return context;
}
