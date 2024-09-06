import { Bet, Payment, Transation } from "@/types/types";
import { User } from "./use-bear-store";
import { create } from "zustand";
import { toast } from "@/components/ui/use-toast";

interface AdminState {
  users: User[];
  bets: Bet[];
  onlineUserids: string[];

  setOnlineUserIds: (value: string[]) => void;

  getAdminAppData: ({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) => void;
  addBet: (bet: Bet) => void;
  updateBet: (bet: Bet) => void;
  removeBet: (bet: Bet) => void;

  //Users
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (user: User) => void;

  //onlineUserIds

  //Payments
  payments: Payment[];
  // setCountry: (country: Country[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  removePayment: (payment: Payment) => void;

  //Transations
  transations: Transation[];
  // setCountry: (country: Country[]) => void;
  addTransation: (Transation: Transation) => void;
  updateTransation: (Transation: Transation) => void;
  removeTransation: (Transation: Transation) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  bets: [],
  onlineUserids: [],

  setOnlineUserIds: (value: string[]) => {
    set({ onlineUserids: value });
  },

  getAdminAppData: async ({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) => {
    const resp = await fetch(`/api/admin/app/${userId}`, {
      method: "GET",
      headers: { Bearer: token },
    });
    if (!resp.ok) {
      const { messg } = await resp.json();

      return toast({ title: messg });
    } else {
      const { bets, users, payments, transations } = await resp.json();
      set({ bets, users, payments, transations });
    }
  },
  addBet: (bet: Bet) => set((state) => ({ bets: [...state.bets, bet] })),
  updateBet: (bet: Bet) =>
    set((state) => ({
      bets: state.bets.map((item) => (item.id === bet.id ? bet : item)),
    })),
  removeBet: (bet: Bet) =>
    set((state) => ({ bets: state.bets.filter((item) => item.id !== bet.id) })),

  //Users
  addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user: User) =>
    set((state) => ({
      users: state.users.map((item) => (item.id === user.id ? user : item)),
    })),
  removeUser: (user: User) =>
    set((state) => ({
      users: state.users.filter((item) => item.id !== user.id),
    })),

  // Payments
  payments: [],
  addPayment: (payment: Payment) =>
    set((state) => ({
      payments: [...(state.payments || []), payment],
    })),
  updatePayment: (payment: Payment) =>
    set((state) => ({
      payments: state.payments.map((item) =>
        item.id === payment.id ? payment : item
      ),
    })),
  removePayment: (payment: Payment) =>
    set((state) => ({
      payments: state.payments.filter((item) => item.id !== payment.id),
    })),

  // Transations
  transations: [],
  addTransation: (Transation: Transation) =>
    set((state) => ({
      transations: [...(state.transations || []), Transation],
    })),
  updateTransation: (Transation: Transation) =>
    set((state) => ({
      transations: state.transations.map((item) =>
        item.id === Transation.id ? Transation : item
      ),
    })),
  removeTransation: (Transation: Transation) =>
    set((state) => ({
      transations: state.transations.filter(
        (item) => item.id !== Transation.id
      ),
    })),
}));
