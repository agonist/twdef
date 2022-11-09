import create from "zustand"
import {devtools} from "zustand/middleware";

interface UiState {
    currentTab: number
    setCurrentTab: (tab: number) => void
}

export const uiState = create<UiState>()(
  devtools(
      (set, get) => ({
        currentTab: 0,

        setCurrentTab(tab: number) {
            set({currentTab: tab})
        },

      })))