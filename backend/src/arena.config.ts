import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";

/**
 * Import your Room files
 */
import { Map1 } from "./rooms/maps/Map_1";
import { Map2 } from "./rooms/maps/Map_2";
import { Map3 } from "./rooms/maps/Map_3";
import { contractUpdates } from "./web3/DefaultSocketProvider";

export default Arena({
  getId: () => "Your Colyseus App",

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("map_1", Map1);
    gameServer.define("map_2", Map2);
    gameServer.define("map_3", Map3);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     */
    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use("/colyseus", monitor());

    contractUpdates.listenAll();
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
