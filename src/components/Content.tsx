import { useCanParams } from "../hooks/useCanParams";
import { useGetProviderSingleQuery } from "../services/provider.service";
import { useAuth } from "../hooks/useAuth";
import List from "../pages/list/List";
import States from "../pages/states/States";
import Types from "../pages/types/Types";
import PopupModal from "./PopupModal";
import { Link } from "react-router-dom";

interface SwitcherProps {
  provider: string;
  type?: string;
  state?: string;
  isAuthenticated?: boolean;
  baSlug?: string;
}

const Switcher = ({ provider, type, state, isAuthenticated, baSlug }: SwitcherProps) => {
  const { data, isSuccess } = useGetProviderSingleQuery({
    slug: provider,
    type,
    state,
  });

  if (!isSuccess || !data) {
    return (
      <section className="py-12 flex items-center justify-center min-h-[12rem]">
        <p className="text-slate-600">Loading...</p>
      </section>
    );
  }

  const canStates = data.CanStates ?? [];
  const hasStates = canStates.length > 0;
  const hasTypes = Boolean(data.hasTypes);

  if (isAuthenticated && baSlug && baSlug !== provider) {
    return (
      <div className="text-center text-slate-600 py-8">
      <p>You are not authorized to access this content.</p> 
      <Link className="text-blue-500" to={`/${baSlug}`}>Go to Active Studies</Link>
    </div>
     );
  }

  if (hasStates && !state) {
    return (
      <States
        provider={provider}
        states={canStates}
        hasTypes={hasTypes}
      />
    );
  }
  if (hasTypes && !type) {
    return <Types provider={provider} state={state} />;
  }
  return (
    <List
      provider={provider}
      state={state}
      type={type}
      cans={data.cans ?? []}
      hasRgSurvey={data.hasRgSurvey}
      canStates={canStates}
      hasTypes={hasTypes}
    />
  );
};

export const Content = () => {
  const { isAuthenticated,baSlug } = useAuth();
  const {
    provider,
    type,
    state,
    isSuccess,
    isLoading,
    isError,
    referralCode,
  } = useCanParams();

  if (isError) {
    return (
      <section className="py-12">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center max-w-xl mx-auto">
          <p className="text-amber-800">Unable to load content. Check your connection or try again later.</p>
        </div>
      </section>
    );
  }

  if (!isSuccess || isLoading) {
    return (
      <section className="py-12 flex items-center justify-center min-h-[12rem]">
        <p className="text-slate-600">Loading...</p>
      </section>
    );
  }

  return (
    <>
      {!isAuthenticated && isSuccess && provider !== "jackssuperbowl" && (
        <PopupModal code={referralCode} />
      )}
      <Switcher provider={provider} state={state} type={type} baSlug={baSlug}  isAuthenticated={isAuthenticated} />
    </>
  );
};
