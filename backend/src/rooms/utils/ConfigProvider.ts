export interface GameCfg {
  waveInterval: number;
  enemiesPerWave: number;
  enemiesStats: EnemyCfg[];
}

export interface EnemyCfg {
  type: number;
  probability: number;
  multiplierEffect: number;
  life: number;
  cash: number;
  speed: number;
}

export class GameConfigProvider {
  gameCg: GameCfg;
  constructor() {
    this.gameCg = {
      waveInterval: 30000, //ms
      enemiesPerWave: 5,
      enemiesStats: [
        {
          type: 0, // simple
          probability: 0.5,
          multiplierEffect: 1,
          life: 100,
          cash: 10,
          speed: 2.5,
        },
        {
          type: 1, // fast
          probability: 0.3,
          multiplierEffect: 1.5,
          life: 100,
          cash: 10,
          speed: 3,
        },
        {
          type: 2, // armored
          probability: 0.3,
          multiplierEffect: 2,
          life: 250,
          cash: 10,
          speed: 2.5,
        },
        {
          type: 3, // healer
          probability: 0.2,
          multiplierEffect: 1.2,
          life: 150,
          cash: 10,
          speed: 2.5,
        },
        {
          type: 4, //boss
          probability: 0.01,
          multiplierEffect: 10,
          life: 1000,
          cash: 10,
          speed: 2.5,
        },
      ],
    };
  }

  getCfonfig() {
    return this.gameCg;
  }

  setConfig(cfg: GameCfg) {
    this.gameCg = cfg;
  }
  private static _instance: GameConfigProvider;

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new GameConfigProvider();
    return this._instance;
  }
}
