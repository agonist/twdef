import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { auth_challenge, auth_verify } from "../../api/api";
import { log } from "../../helpers/logger";

export const LoginModal = () => {
  const { isConnected, address } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const [loggedIn, setLoggedIn] = useState(false);

  async function signAndLogin(addr: string) {
    try {
      const challenge = await auth_challenge(addr);
      const res = await signer?.signMessage(challenge.message);
      const token = await auth_verify(addr, res!);
      localStorage.setItem("JWT", token.accessToken);
      setLoggedIn(true);
    } catch (e) {
      log.error(e);
    }
  }

  return (
    <div>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Login</h3>
          <p className="py-4">Complete the step bellow to access the game</p>

          <ul className="steps steps-vertical">
            <li className={"step step-primary"}>Connect your wallet</li>
            <li className={"step " + (isConnected ? "step-primary" : "")}>
              Sign message
            </li>
            <li className={"step " + (loggedIn ? "step-primary" : "")}>
              Connected
            </li>
          </ul>
          <div className="flex justify-center ">
            {isConnected ? (
              <></>
            ) : (
              <ConnectButton
                chainStatus={"none"}
                showBalance={false}
                accountStatus={"avatar"}
              />
            )}
            {!loggedIn && isConnected ? (
              <button
                className={
                  "btn btn-sm mt-4 btn-secondary " +
                  (isLoading ? "loading" : "")
                }
                onClick={async () => {
                  await signAndLogin(address!);
                }}
              >
                Sign Message
              </button>
            ) : (
              <></>
            )}
            {loggedIn && isConnected ? (
              <div className="modal-action">
                <label htmlFor="my-modal-4" className="btn">
                  {"Let's go"}
                </label>
              </div>
            ) : (
              <></>
            )}
          </div>
        </label>
      </label>
    </div>
  );
};
