import React, { useState, createContext, useContext } from 'react';

// Route Context for navigation
const RouteContext = createContext<{
  currentRoute: string;
  params: Record<string, string>;
  navigate: (path: string, params?: Record<string, string>) => void;
}>({
  currentRoute: '/',
  params: {},
  navigate: () => {},
});

export const useRouter = () => useContext(RouteContext);

interface RouterProps {
  children: React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (path: string, newParams: Record<string, string> = {}) => {
    setCurrentRoute(path);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouteContext.Provider value={{ currentRoute, params, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}

interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

export function Route({ path, component: Component, exact = false }: RouteProps) {
  const { currentRoute } = useRouter();
  
  const isMatch = exact 
    ? currentRoute === path 
    : currentRoute.startsWith(path);

  if (!isMatch) return null;

  return <Component />;
}

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  role?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, children, className, params, onMouseEnter, onMouseLeave, onClick, role }, ref) => {
    const { navigate } = useRouter();

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(to, params);
      onClick?.();
    };

    return (
      <a 
        ref={ref}
        href={to} 
        onClick={handleClick} 
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={role}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';