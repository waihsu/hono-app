import { toast } from "@/components/ui/use-toast";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BetItem {
  id: string;
  userId: string;
  adminId: string;
  bettingMarketId: string;
  oddId: string;
  amount: number;
}

interface BetCartState {
  betsItems: BetItem[];
  addItem: (value: BetItem) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useBetCartStore = create(
  persist<BetCartState>(
    (set, get) => ({
      betsItems: [],
      addItem: (value: BetItem) => {
        const currentbets = get().betsItems;
        const existingItem = currentbets.find((item) => item.id === value.id);
        if (existingItem) {
          return toast({ title: "Already have", variant: "destructive" });
        }
        set({ betsItems: [...get().betsItems, value] });
        toast({ title: "Added to Cart" });
      },
      removeItem: (id: string) => {
        set({
          betsItems: [...get().betsItems.filter((item) => item.id !== id)],
        });
        toast({ title: "Removed from cart" });
      },
      removeAll: () => set({ betsItems: [] }),
    }),
    { name: "cart", storage: createJSONStorage(() => localStorage) }
  )
);
