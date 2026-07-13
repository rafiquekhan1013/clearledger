import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProvidersListQuery } from "../services/provider.service";

export const useCanParams = () => {
  let { first, second, third } = useParams<{
    first?: string;
    second?: string;
    third?: string;
  }>();
  const [provider, setProvider] = useState<string>("");
  const [state, setState] = useState<string | undefined>("");
  const [type, setType] = useState<string | undefined>("");
  const [referralCode, setReferralCode] = useState<string | undefined>("");
  first = first ? first.toLowerCase() : undefined;
  second = second ? second.toLowerCase() : undefined;
  third = third ? third.toLowerCase() : undefined;
  const { data: providers, isSuccess, isLoading, isError } = useGetProvidersListQuery(
    { slug: first ?? "" },
    { skip: !first }
  );
  useEffect(() => {
    if (isSuccess) {
      const providerMatch = (providers?.data as { slug?: string; baReferralCode?: string }[] | undefined)?.find(
        (p) => p.slug === first
      );
      if (providerMatch) {
        setProvider(providerMatch.slug ?? "");
        setReferralCode(providerMatch.baReferralCode);
        setState(second ?? undefined);
        setType(third ?? undefined);
      } else {
        setProvider("playcan");
        //setReferralCode("playcan01");
        setState(first ?? undefined);
        setType(second ?? undefined);
      }
    }
  }, [isSuccess, providers, first, second, third]);

  return {
    provider,
    state,
    type,
    isSuccess,
    isLoading,
    isError,
    first,
    second,
    third,
    referralCode,
  };
};
