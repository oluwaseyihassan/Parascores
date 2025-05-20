import { useState, createContext, useContext, ReactNode } from "react";

const SearchToggleContext = createContext<{
  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;
  openSearch: () => void;
}>(
  {} as {
    isSearchOpen: boolean;
    toggleSearch: () => void;
    closeSearch: () => void;
    openSearch: () => void;
  }
);

export const SearchToggleProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
  };
  const openSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <SearchToggleContext.Provider
      value={{ isSearchOpen, toggleSearch, closeSearch, openSearch }}
    >
      {children}
    </SearchToggleContext.Provider>
  );
};

export const useSearchToggle = () => {
  const context = useContext(SearchToggleContext);
  if (!context) {
    throw new Error(
      "useSearchToggle must be used within a SearchToggleProvider"
    );
  }
  return context;
};
