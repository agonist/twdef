import create from "zustand";
import { devtools } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

interface UserState {
  landsBalanceByIds: number[];

  setLandsBalance: (balance: number[]) => void;
  addInLandsBalance: (tokenId: number) => void;
}

export const userState = create<UserState>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      landsBalanceByIds: [],

      setLandsBalance(balance: number[]) {
        set({ landsBalanceByIds: balance });
      },

      addInLandsBalance(tokenId: number) {
        set({ landsBalanceByIds: [...get().landsBalanceByIds, tokenId] });
      },
    }))
  )
);
