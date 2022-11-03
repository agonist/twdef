import create from "zustand"
import {devtools} from "zustand/middleware";
import { Constants } from "../Constants";
import { LoaderScene } from "../scenes/loader-scene";

type Land = {x:number, y:number, id: number, minted: boolean}

interface GameState {
  pos : {x: number, y:number}
  lands : Land[]

  selectHoverLand: (x: number, y: number) => void
  selectLand: () => void
  init: (game: Phaser.Game) => void
}

export const gameState = create<GameState>()(
  devtools(
      (set, get) => ({
        pos: {x: 0, y: 0},
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
        selectLand() {

        },
        selectHoverLand(x: number, y: number) {
            set({ pos: {x: x, y: y}})
        },

      }),
  )
)