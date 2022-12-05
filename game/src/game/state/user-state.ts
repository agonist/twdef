import create from "zustand";
import { devtools } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

interface UserState {
  landsBalanceByIds: number[];
  landzToGamezApproved: boolean;
  towerzToGamezApproved: boolean;

  setLandsBalance: (balance: number[]) => void;
  addInLandsBalance: (tokenId: number) => void;
  setLandzApproved: (landz: boolean) => void;
  setTowerzApproved: (towerz: boolean) => void;
  setContractApproved: (landz: boolean, towerz: boolean) => void;
}

export const userState = create<UserState>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      landsBalanceByIds: [],
      landzToGamezApproved: false,
      towerzToGamezApproved: false,

      setLandsBalance(balance: number[]) {
        set({ landsBalanceByIds: balance });
      },

      addInLandsBalance(tokenId: number) {
        set({ landsBalanceByIds: [...get().landsBalanceByIds, tokenId] });
      },

      setLandzApproved(landz: boolean) {
        set({ landzToGamezApproved: landz });
      },

      setTowerzApproved(towerz: boolean) {
        set({ towerzToGamezApproved: towerz });
      },

      setContractApproved(landz: boolean, towerz: boolean) {
        set({ landzToGamezApproved: landz, towerzToGamezApproved: towerz });
      },
    }))
  )
);
