export interface BonusDamageProps {
  bonus: number;
}

export const LandBonusDamage = ({ bonus }: BonusDamageProps) => {
  return <p className="text-yellow-200 text-sm">+{bonus} dmg</p>;
};
