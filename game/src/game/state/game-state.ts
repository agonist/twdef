import create from "zustand";
import { devtools } from "zustand/middleware";
import { provider } from "../../pages/_app";
import { Cellz } from "../../schema/Cellz";
import { Constants } from "../Constants";
import { LoaderScene } from "../scenes/loader-scene";
import { MainScene } from "../scenes/main-scene";

export type Land = {
  x: number;
  y: number;
  id: number;
  minted: boolean;
  owner: string;
};

interface GameState {
  world: Cellz[][];
  currentLandId: number;
  currentMap: number;
  currentWave: number;
  currentMultiplier: number;

  selectLand: (x: number, y: number) => void;
  init: (game: Phaser.Game) => void;
  setWorld: (world: Cellz[][]) => void;
  nextMap: (game: Phaser.Game) => void;
  prevMap: (game: Phaser.Game) => void;
  setWave: (wave: number) => void;
  setMultiplier: (mult: number) => void;
}

export const gameState = create<GameState>()(
  devtools((set, get) => ({
    world: [],
    currentLandId: 0,
    currentMap: 1,
    currentWave: 0,
    currentMultiplier: 0,

    async init(game: Phaser.Game) {},

    setWorld(world: Cellz[][]) {
      set({ world: world });
    },

    selectLand(x: number, y: number) {
      set({ currentLandId: this.world[y][x].id });
    },

    nextMap(game: Phaser.Game) {
      const s = game.scene.getScene(Constants.SCENE_MAIN) as MainScene;
      s.launch("map_" + (get().currentMap + 1));
      set({ currentMap: get().currentMap + 1 });
    },

    prevMap(game: Phaser.Game) {
      const s = game.scene.getScene(Constants.SCENE_MAIN) as MainScene;
      s.launch("map_" + (get().currentMap - 1));
      set({ currentMap: get().currentMap - 1 });
    },

    setMultiplier(mult: number) {
      set({ currentMultiplier: mult });
    },

    setWave(wave: number) {
      set({ currentWave: wave });
    },
    
  }))
);
