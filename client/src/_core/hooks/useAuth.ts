import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        // Ya está desautorizado
      }
    } finally {
      try {
        sessionStorage.removeItem("manus-cookie");
      } catch { }
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      
      // 🔒 Redirección limpia para borrar cualquier estado residual en memoria
      window.location.href = "/admin";
    }
  }, [logoutMutation, utils]);

  // 🔑 ESTADO REAL: Vinculado a lo que responde meQuery.data desde el Backend
  const state = useMemo(() => {
    const user = meQuery.data ?? null;
    return {
      user,
      loading: meQuery.isLoading,
      error: meQuery.error,
      isAuthenticated: !!user,
    };
  }, [meQuery.data, meQuery.isLoading, meQuery.error]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      startLogin();
    }
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}