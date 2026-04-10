import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export const LoaderContext = createContext({
  loading: false,
  showLoading: (_show: boolean) => {},
});

type Props = {
  children: ReactNode;
};

export const LoaderProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);

  const showLoading = useCallback((show: boolean) => {
    setLoading((prev) => (prev === show ? prev : show));
  }, []);

  const state = useMemo(
    () => ({
      loading,
      showLoading,
    }),
    [loading, showLoading],
  );

  return (
    <LoaderContext.Provider value={state}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {children}
    </LoaderContext.Provider>
  );
};
