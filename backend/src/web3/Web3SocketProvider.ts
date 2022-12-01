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
