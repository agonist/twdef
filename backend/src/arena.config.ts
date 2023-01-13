import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import metadataController from "./api/metadata-controller";
import landService from "./db/LandService";
import towerService from "./db/TowerService";
import userService from "./db/UserService";

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}
/**
 * Import your Room files
 */
import { Map1 } from "./rooms/maps/Map_1";
import { GameCfg, GameConfigProvider } from "./rooms/utils/ConfigProvider";

import { log } from "./tools/logger";
import { contractUpdates } from "./web3/DefaultSocketProvider";

export default Arena({
  getId: () => "Your Colyseus App",

  initializeTransport: function () {
    return new uWebSocketsTransport({
      /* ...options */
    });
  },

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("map_1", Map1);
    // gameServer.define("map_2", Map2);
    // gameServer.define("map_3", Map3);
  },

  initializeExpress: async (app) => {
    /**
     * Bind your custom express routes here:
     */

    metadataController(app);
    
    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    app.use("/player/balance/:address", async (req, res) => {
      const address = req.params.address;
      const user = await userService.findUserByAddress(address);
      log.info(user);
      let balance = 0;
      if (user !== null) balance = user.balance;

      res.json({ balance: balance });
    });

    app.post("/godmode", async (req: TypedRequestBody<GameCfg>, res) => {
      GameConfigProvider.getInstance().setConfig(req.body);
      res.json(GameConfigProvider.getInstance().getCfonfig());
    });

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use("/colyseus", monitor());

    await contractUpdates.listenAll();
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
