import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  account_status: "SUSPENDED" | "ACTIVE" | "BAN";
  user_role: "ADMIN" | "SUPERADMIN" | "USER";
}

interface MyState {
  init: boolean;
  token: string;
  user: User | null;
  addToken: (jwt: string) => void;
  setUser: (user: User | null) => void;
  setInit: (value: boolean) => void;
}

export const useTokenStore = create<MyState>()(
  persist(
    (set) => ({
      init: false,
      token: localStorage.getItem("token") || "",
      user: null,
      addToken: (jwt: string) => {
        set({ token: jwt });
      },
      setUser: (user: User | null) => {
        set({ user: user });
      },
      setInit: (value: boolean) => {
        set({ init: value });
      },
    }),
    {
      name: "food-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      // partialize: (state) => ({ token: state.token }),
    }
  )
);
