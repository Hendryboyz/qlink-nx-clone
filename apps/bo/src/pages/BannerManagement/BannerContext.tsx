import { Context, ReactNode, useEffect, useState } from 'react';
import { BannerDto } from '@org/types';
import { createContext } from 'react';
import API from '$/utils/fetch';

interface BannerContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  activeBanners: BannerDto[]
  setActiveBanners: (prevState) => void
  archivedBanners: BannerDto[]
  setArchivedBanners: (prevState) => void
}

const INITIAL_STATE: BannerContextType = {
  isLoading: false,
  setIsLoading: (isLoading: boolean): void => {},
  activeBanners: [],
  setActiveBanners: (prevState): void => {},
  archivedBanners: [],
  setArchivedBanners: (prevState): void => {}
}

export const BannerContext: Context<BannerContextType> = createContext<BannerContextType>(INITIAL_STATE);

export default function BannerContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeBanners, setActiveBanners] = useState([]);
  const [archivedBanners, setArchivedBanners] = useState([]);

  useEffect(() => {
    async function loadingBanners() {
      setIsLoading(true);
      const activeBanners = await API.listActiveBanners();
      setActiveBanners(activeBanners.data);
      const archivedBanners = await API.listArchivedBanners();
      setArchivedBanners(archivedBanners.data);
      setIsLoading(false);
    }
    loadingBanners();
  }, []);

  const ctxValue: BannerContextType = {
    isLoading,
    setIsLoading,
    activeBanners,
    setActiveBanners,
    archivedBanners,
    setArchivedBanners,
  }
  return (
    <BannerContext.Provider value={ctxValue}>
      {children}
    </BannerContext.Provider>
  );
}
