import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

interface LayoutProps {
  children: React.ReactNode;
}

export const ConnectWalletOr = ({ children }: LayoutProps) => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <div>{children}</div>;
  }

  return (
    <ConnectButton
      chainStatus={"none"}
      showBalance={false}
      accountStatus={"avatar"}
    />
  );
};
