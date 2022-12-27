import { useQuery, useQueryClient } from "react-query";
import { fetchPlayerBalance, Player } from "../../api/api";

export interface PlayerProps {
  address: string;
}

export const PlayerBalance = ({ address }: PlayerProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Player, Error>(
    ["address", address],
    () => fetchPlayerBalance(address)
  );

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <></>;
  }

  return (
    <button className="btn btn-sm gap-2 ml-4 text-pinkz">
      Balance
      <div className="badge badge-secondary">{data?.balance.toFixed(2)}</div>
    </button>
  );
};
