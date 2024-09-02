import { Bet } from "@/types/types";
import { User } from "./use-bear-store";
import { create } from "zustand";

interface AdminState {
  users: User[];
  bets: Bet[];
  getAdminAppData: (token: string) => void;
  addBet: (bet: Bet) => void;
  updateBet: (bet: Bet) => void;
  removeBet: (bet: Bet) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  bets: [],
  getAdminAppData: async (token: string) => {
    const resp = await fetch("/api/admin/app", {
      method: "GET",
      headers: { Bearer: token },
    });
    if (!resp.ok) {
      return;
    }
    const { bets, users } = await resp.json();
    set({ bets, users });
  },
  addBet: (bet: Bet) => set((state) => ({ bets: [...state.bets, bet] })),
  updateBet: (bet: Bet) =>
    set((state) => ({
      bets: state.bets.map((item) => (item.id === bet.id ? bet : item)),
    })),
  removeBet: (bet: Bet) =>
    set((state) => ({ bets: state.bets.filter((item) => item.id !== bet.id) })),
}));
