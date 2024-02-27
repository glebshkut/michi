import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import WalletWrapper from "@/shared/WalletWrapper";
import { defaultChain } from "@/wagmi";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()
  const [tokens, setTokens] = useState([])

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiBackpackAddress,
    tokenId: wallet.tokenId,
  })

  const hasTokens = useMemo(() => {
    return tokens.length > 0;
  }, [tokens])

  useEffect(() => {
    const fetchTokenBalances = async () => {
      try {
        axios.post('http://localhost:3000/token-balances', {
          tokenboundAccount,
          chain: defaultChain.id
        }).then(({ data }: { data: unknown[] }) => {
          setTokens(data)
        });

      } catch (e) {
        console.error(e);
      }
    }

    if (tokenboundAccount) {
      fetchTokenBalances();
    }
  }, [tokenboundAccount])

  return (
    <WalletWrapper address={tokenboundAccount} name="MichiBackpack" index={index}>
      <>
        <div className="bg-placeholder-background flex flex-row justify-center text-secondary w-full rounded-lg p-3">
          {hasTokens ? (
            <>
              My tokens data is here
            </>
          ) : (
            <span className="text-center">No assets deposited.</span>
          )}
        </div>
        <div className="flex flex-row justify-center gap-5 mt-1">
          <button className="btn btn-md">Deposit</button>
          {hasTokens && (<button className="btn btn-md">Withdraw</button>)}
        </div>
      </>
    </WalletWrapper>
  )
}