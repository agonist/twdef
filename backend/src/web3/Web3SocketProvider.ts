import { Subject } from "rxjs";

export interface WebSocketProvider {
  listenAll: () => void;
  listenGamezEvents: () => void;
  listenLandzEvent: () => void;

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
}

export interface TowerUnstakingEvent extends UpdateEvent {
  readonly name: "TowerUnstakingEvent";
  towerId: number;
  landId: number;
}
