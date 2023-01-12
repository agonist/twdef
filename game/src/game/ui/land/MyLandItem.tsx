import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { fetchLandInfo } from "../../api/api";
import { getBonusDamage, LandData, LandId } from "./LandContent";
import { LandTitle } from "./LandTitle";
import { LandBonusDamage } from "./LandBonusDamage";

export const MyLandItem = ({ landId }: LandId) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<LandData, Error>(
    ["land", landId],
    () => fetchLandInfo(landId!)
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
        <Image src={data?.image!} width={130} height={130} alt={"land img"} />
      </figure>

      <div className="flex flex-col pl-2">
        <LandTitle land={data} landId={landId} />
        <LandBonusDamage bonus={getBonusDamage(data!)} />
      </div>
    </div>
  );
};
