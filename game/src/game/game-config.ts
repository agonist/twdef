import { Types } from "phaser";
import { MainScene } from "./scenes/main-scene";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin.js";
import { LoaderScene } from "./scenes/loader-scene";

export const gameConfig: Types.Core.GameConfig = {
  width: "100%",
  height: "100%",
  type: Phaser.WEBGL,
  fps: {
    target: 30,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  backgroundColor: "#0c1380",
  render: {
    antialias: false,
  },

  scene: [LoaderScene, MainScene],
  plugins: {
    scene: [
      {
        key: "rexBoard",
        plugin: BoardPlugin,
        mapping: "rexBoard",
      },
    ],
  },
};
