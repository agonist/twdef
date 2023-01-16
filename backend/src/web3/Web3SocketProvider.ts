import { AlchemyWebSocketProvider } from "alchemy-sdk";
import { ethers } from "ethers";
import { Subject } from "rxjs";

export interface WebSocketProvider {
  listenAll: () => void;
  listenGamezEvents: (provider: ethers.providers.WebSocketProvider) => void;
  listenLandzEvent: (provider: ethers.providers.WebSocketProvider) => void;

  contractUpdatesSubject: () => Subject<UpdateEvent>;
}

export interface UpdateEvent {
  readonly name: string;
}

export interface LandMintedEvent extends UpdateEvent {
  readonly name: "LandMintedEvent";
  tokenId: number;
}

export interface TowerStakingEvent extends UpdateEvent {
  readonly name: "TowerStakingEvent";
  towerId: number;
  landId: number;
  mapId: number;
  from: string
}

export interface TowerUnstakingEvent extends UpdateEvent {
  readonly name: "TowerUnstakingEvent";
  towerId: number;
  landId: number;
  mapId: number;
}
