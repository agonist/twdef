import create from "zustand"
import {devtools} from "zustand/middleware";

interface GameState {
  color: number
  txt: string
  selectColor: (color: number) => void
  init: () => void
}

export const gameState = create<GameState>()(
  devtools(
      (set, get) => ({
        color: 0xFFF444,
        txt: "",

        async init(){
            let response = await fetch("/api/hello");
            let json = await response!!.json()
            

            set({txt: json.name})
        },
        selectColor(color: number) {
            set({color: color})
        },

      }),
  )
)