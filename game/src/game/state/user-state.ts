import { Provider } from "@wagmi/core";
import { Address } from "wagmi";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

interface UserState {
  landsBalanceByIds: number[]; // unstaked lands
  towersBalanceByIds: number[]; // unstaked towers
  stakedLandTowerByIds: Map<number, number>; // staked lands and associated towers
  landzToGamezApproved: boolean;
  towerzToGamezApproved: boolean;

  setLandsBalance: (balance: number[]) => void;
  setTowersBalance: (balance: number[]) => void;
  setStakedLandsTowersBalance: (lands: number[], tower: number[]) => void;
  addInLandsBalance: (tokenId: number) => void;
  stake: (landId: number, towerId: number) => void;
  unstake: (landId: number, towerId: number) => void;
  setLandzApproved: (landz: boolean) => void;
  setTowerzApproved: (towerz: boolean) => void;
  setContractApproved: (landz: boolean, towerz: boolean) => void;
  getAllLandsBalance: () => number[];
  signin: (address: string, provider: Provider) => void;
}

export const userState = create<UserState>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      landsBalanceByIds: [],
      towersBalanceByIds: [],
      stakedLandTowerByIds: new Map(),
      landzToGamezApproved: false,
      towerzToGamezApproved: false,

      signin(address: string, provider: Provider) {
          
      },

      setLandsBalance(balance: number[]) {
        set({ landsBalanceByIds: balance });
      },

      setTowersBalance(balance: number[]) {
        set({ towersBalanceByIds: balance });
      },

      setStakedLandsTowersBalance(lands: number[], towers: number[]) {
        const map = new Map<number, number>();
        for (let i = 0; i < lands.length; i++) {
          map.set(lands[i], towers[i]);
        }
        set({ stakedLandTowerByIds: map });
      },

      stake(landId, towerId) {
        const staked = get().stakedLandTowerByIds;
        staked.set(landId, towerId);

        const landsBalance: number[] = get().landsBalanceByIds.filter(
          (n) => n != landId
        );
        const towerBalance: number[] = get().towersBalanceByIds.filter(
          (n) => n != towerId
        );

        set({
          stakedLandTowerByIds: staked,
          landsBalanceByIds: landsBalance,
          towersBalanceByIds: towerBalance,
        });
      },

      unstake(landId, towerId) {
        const staked = get().stakedLandTowerByIds;
        staked.delete(landId);
        set({
          stakedLandTowerByIds: staked,
          landsBalanceByIds: [...get().landsBalanceByIds, landId],
          towersBalanceByIds: [...get().towersBalanceByIds, towerId],
        });
      },

      
      addInLandsBalance(tokenId: number) {
        set({ landsBalanceByIds: [...get().landsBalanceByIds, tokenId] });
      },

      getAllLandsBalance(): number[] {
        const r = [
          ...get().landsBalanceByIds,
          ...Array.from(get().stakedLandTowerByIds.keys()),
        ];
        // console.log(r);
        return r;
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
