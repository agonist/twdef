import { gameState } from "../../state/game-state";

export const Land = () => {
  const _gameState = gameState();

  return (
    <div className="flex flex-col w-full border items-center">
      <div className="flex border-b w-full justify-center bg-blue-400">
        <p className="text-white">
          Land #1 ( {_gameState.pos.x}, {_gameState.pos.y} )
        </p>
      </div>
      <p className="text-white"> FOOOO </p>
    </div>
  );
};
