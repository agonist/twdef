import { add } from "lodash";
import { useQuery } from "react-query";
import { useAccount, useSigner } from "wagmi";
import { AuthChallenge, auth_challenge, auth_verify } from "../../api/api";
import { LoginModal } from "./LoginModal";

export const Signin = (props: {
  address: string;
  children: React.ReactNode;
}) => {
  const { data: signer, isError, isLoading } = useSigner();

  const { data, isLoading: loading } = useQuery<AuthChallenge, Error>(
    ["auth"],
    () => auth_challenge(props.address)
  );

  async function callAuth(message: string) {
    const res = await signer?.signMessage(message);
    const token = await auth_verify(props.address, res!);
    localStorage.setItem("JWT", token.accessToken);
  }

  if (isLoading || loading) {
    return <></>;
  }

  return (
    <div>
     
    </div>

    // <button
    //   className={
    //     "btn btn-sm mt-4 btn-secondary " + (isLoading ? "loading" : "")
    //   }
    //   onClick={async () => {
    //     await callAuth(data?.message!);
    //   }}
    // >
    //   LOOGIN
    // </button>
  );
};
