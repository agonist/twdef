import create from "zustand"
import {devtools} from "zustand/middleware";
import { Constants } from "../Constants";
import { LoaderScene } from "../scenes/loader-scene";

export type Land = {x:number, y:number, id: number, minted: boolean}

interface GameState {
  currentLand : Land | undefined
  lands : Land[]

  selectHoverLand: (x: number, y: number) => void
  selectLand: (x: number, y: number) => void
  init: (game: Phaser.Game) => void
}

export const gameState = create<GameState>()(
  devtools(
      (set, get) => ({
        currentLand: undefined,
        lands: [],

        async init(game: Phaser.Game){
            let response = await fetch("/api/hello");
            let json = await response!!.json()

              // quick test land init
              const lands: Land[] =  []
              for (let i = 0; i < 10; i++) {
                lands.push({x: i, y: 0, id: lands.length + 1, minted: false})
              }
              for (let i = 0; i < 10; i++) {
                lands.push({x: i, y: 2, id: lands.length + 1, minted: false})
              }
              set({lands : lands})
              console.log("FROM INIT")
              const s = game.scene.getScene(Constants.SCENE_LOADER) as LoaderScene
              s.launchMainScene()
        },
        selectLand(x: number, y: number) {
            const curr = get().lands.find((l) => l.x === x && l.y === y);
            set({currentLand: curr} )
        },
        selectHoverLand(x: number, y: number) {
           const curr = get().lands.find((l) => l.x === x && l.y === y);
            //set({currentLand: curr} )
        },

      }),
  )
)