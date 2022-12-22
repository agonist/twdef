import { TowerProps } from "./MyTowerItem";

export const TowerBonus = ({ tower }: TowerProps) => {
  function damage() {
    const l = tower.attributes.find((a) => a.trait_type === "Damage");
    return l?.value;
  }

  function speed() {
    const l = tower.attributes.find((a) => a.trait_type === "Speed");
    return l?.value;
  }

  function level() {
    const l = tower.attributes.find((a) => a.trait_type === "Level");
    return l?.value;
  }

  return (
    <div className="flex flex-col">
      <p className="text-sm text-yellow-300">lvl: {level()}</p>
      <p className="text-sm text-yellow-300">dmg: {damage()}</p>
      <p className="text-sm text-yellow-300">speed: {speed()}</p>
    </div>
  );
};
