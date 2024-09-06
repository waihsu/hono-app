import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  account_status: "string";
  user_role: "ADMIN" | "SUPERADMIN" | "USER";
}

interface MyState {
  token: string;
  user: User | null;
  addToken: (jwt: string) => void;
  setUser: (user: User | null) => void;
}

export const useTokenStore = create<MyState>()(
  persist(
    (set) => ({
      token: "",
      user: null,
      addToken: (jwt: string) => {
        set({ token: jwt });
      },
      setUser: (user: User | null) => {
        set({ user: user });
      },
    }),
    {
      name: "food-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
    }
  )
);
