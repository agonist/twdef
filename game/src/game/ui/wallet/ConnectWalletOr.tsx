import { useAccount, useSigner } from "wagmi";
import { isLoggedInJWT } from "../../helpers/uils";
import { LoginModal } from "./LoginModal";

export interface LayoutProps {
  children: React.ReactNode;
}

export const ConnectWalletOr = ({ children }: LayoutProps) => {
  const { isConnected, address } = useAccount();

  if (isConnected && isLoggedInJWT()) {
    return <div>{children}</div>;
  }

  return (
    <div>
      <label htmlFor="my-modal-4" className="btn btn-secondary btn-sm">
        LOGIN
      </label>
      <LoginModal />
    </div>
  );
};
