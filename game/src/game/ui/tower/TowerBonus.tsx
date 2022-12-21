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
      <p>lvl: {level()}</p>
      <p>dmg: {damage()}</p>
      <p>speed: {speed()}</p>
    </div>
  );
};
