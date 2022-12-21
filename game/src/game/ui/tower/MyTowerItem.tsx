import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { fetchTowerInfo } from "../../api/api";
import { TowerBonus } from "./TowerBonus";
import { TowerTitle } from "./TowerTitle";

export interface TowerData {
  id: number;
  name: string;
  image: string;
  attributes: [{ trait_type: string; value: any }];
}

export interface TowerProps {
  tower: TowerData;
}

interface TowerIdProps {
  towerId: number;
}

export const MyTowerItem = ({ towerId }: TowerIdProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<TowerData, Error>(
    ["tower", towerId],
    () => fetchTowerInfo(towerId!)
  );

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <></>;
  }

  return (
    <div className="card card-compact card-side bg-base-100 shadow-md shadow-pinkz">
      <figure>
        <Image src={data?.image!} width={130} height={130} alt={"tower img"} />
      </figure>

      <div className="flex flex-col pl-2">
        <TowerTitle tower={data!} />
        <TowerBonus tower={data!}/>
      </div>
    </div>
  );
};
