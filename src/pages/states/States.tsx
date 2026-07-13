import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CanStates } from "../../types";
import { StateDropdown, StateOption } from "../../components/StateDropdown";
import { useSiteLocation } from "../../hooks/useSiteLocation";
import { useGetProviderSingleQuery } from "../../services/provider.service";
import { CansList } from "../../components/cans/CansList";
import { Types as typeOptions } from "../../types";
import { isRgSurveyPassed, markRgSurveyPassed } from "../../utils/rgSurvey";

interface StatesProps {
  states: CanStates[];
  provider: string;
  hasTypes?: boolean;
}

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

const RG_QUESTIONS = [
  "Have you ever bet more than you could afford to lose?",
  "Have you ever felt the need to gamble with larger amounts of money to get the same excitement?",
  "Have you ever tried to win back money you lost by gambling more?",
  "Have you ever lied to people important to you about how much or how often you gamble?",
  "Have you ever felt unable to cut back or stop gambling, even when you wanted to?",
  "Has gambling ever caused you stress, anxiety, or conflict with family or friends?",
  "Have you ever missed work, school, or other responsibilities because of gambling?",
];

const States = ({ states, provider, hasTypes = false }: StatesProps) => {
  const { isUsLocation, locationFilter } = useSiteLocation();
  const filteredStates = useMemo(
    () =>{
      const filtered = states.filter((item: { type?: string }) => item.type === locationFilter)

      return filtered.map((state => state.slug == 'ca' ? { ...state, label: 'Rest Of Canada' } : state));
    } ,
    [states, locationFilter]
  );

  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("sports");
  const [rgActiveStep, setRgActiveStep] = useState(0);
  const [rgAnswers, setRgAnswers] = useState<string[]>(Array(7).fill(""));
  const [rgCompleted, setRgCompleted] = useState(isRgSurveyPassed());
  const navigate = useNavigate();

  const { data: providerData, isSuccess: providerDataSuccess } = useGetProviderSingleQuery(
    {
      slug: provider,
      state: selectedState || undefined,
      type: selectedType || undefined,
    },
    { skip: !selectedState }
  );

  const cans = providerData?.cans ?? [];
  const hasRgSurvey = providerData?.hasRgSurvey ?? false;
  const showRgForm =
    selectedState && providerDataSuccess && hasRgSurvey && !rgCompleted;
  const showStudies =
    selectedState && providerDataSuccess && (!hasRgSurvey || rgCompleted);

  const handleStateSelect = (slug: string) => {
    if (isUsLocation) {
      setSelectedState(slug || "");
      setRgCompleted(isRgSurveyPassed());
    } else if (slug) {
      navigate(`/${provider}/${slug}`);
    }
  };

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    if (newType) setSelectedType(newType);
  };

  const handleRgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...rgAnswers];
    updated[rgActiveStep] = (e.target as HTMLInputElement).value;
    setRgAnswers(updated);
  };

  const handleRgSubmit = () => {
    const hasYes = rgAnswers.some((ans) => ans === "yes");
    if (hasYes) {
      navigate("/support");
    } else {
      markRgSurveyPassed();
      setRgCompleted(true);
    }
  };

  const typeOptionsFiltered = typeOptions;

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Where are you located?
          </h1>
          <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
          <p className="text-xl text-slate-600">
            {isUsLocation
              ? "Select your state to see applicable studies."
              : "Choose your location."}
          </p>
        </div>
        <div className="text-center">
          {isUsLocation ? (
            <>
              <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
                <StateDropdown focusOnMount noMargin states={filteredStates as StateOption[]} value={selectedState} onSelect={handleStateSelect} label="Select your state" placeholder="Select your state" id="states-state-select" />
                {selectedState && hasTypes && (
                  <div className="w-full min-w-[200px] max-w-[280px]">
                    <label htmlFor="states-type-select" className="block text-sm font-medium text-slate-700 mb-1">Sportsbook or Casino</label>
                    <select id="states-type-select" value={selectedType} onChange={handleTypeSelect} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
                      {typeOptionsFiltered.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {showRgForm && (
                <div className="mb-8 text-left max-w-[900px] mx-auto mt-8">
                <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-lg p-8">
                    {rgActiveStep === 0 && (
                      <>
                        <h4 className="text-2xl font-bold text-slate-900 mb-4">
                          <span className="text-blue-600">Before You</span> Continue…
                        </h4>
                        <p className="text-slate-600 mb-2">
                          At {getSiteDisplayName()}, we believe gambling should always be fun, safe, and positive.
                        </p>
                        <p className="text-slate-600 mb-2">
                          Before we recommend any casino or sportsbook offers, we invite you to
                          complete a quick 7-part questionnaire about your past experiences on
                          betting sites.
                        </p>
                        <p className="text-slate-600 mb-2">
                          It takes less than 30 seconds, and helps us better understand gambling
                          behaviours so we can support safer play.
                        </p>
                        <p className="text-slate-600">Please answer each question honestly.</p>
                      </>
                    )}
                    <p className="text-lg font-semibold text-slate-900 mt-6 mb-2">
                      Step {rgActiveStep + 1} of 7
                    </p>
                    <p className="text-slate-700 font-semibold mb-4">
                      {RG_QUESTIONS[rgActiveStep]}
                    </p>
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rg"
                          value="yes"
                          checked={rgAnswers[rgActiveStep] === "yes"}
                          onChange={handleRgChange}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rg"
                          value="no"
                          checked={rgAnswers[rgActiveStep] === "no"}
                          onChange={handleRgChange}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <div className="flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setRgActiveStep((p) => Math.max(0, p - 1))}
                        disabled={rgActiveStep === 0}
                        className="px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      {rgActiveStep === RG_QUESTIONS.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleRgSubmit}
                          disabled={!rgAnswers[rgActiveStep]}
                          className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit & Continue
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRgActiveStep((p) => p + 1)}
                          disabled={!rgAnswers[rgActiveStep]}
                          className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {showStudies && (
                <section className="py-10 md:py-12 border-b-2 border-blue-200 bg-gradient-to-b from-white to-blue-50/30 -mx-4 md:-mx-8 px-4 md:px-8 mt-8 w-full">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Join The {getSiteDisplayName()} Study!
                      </h2>
                      <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
                      <p className="text-slate-600 max-w-2xl mx-auto">
                        Select a study below to get started
                      </p>
                    </div>
                    <CansList
                      type={selectedType === "sports" ? "SPORTS" : "CASINO"}
                      state={selectedState}
                      cans={cans}
                    />
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {filteredStates.map((state) => (
                <Link
                  key={state.slug ?? state.label}
                  to={`/${provider}/${state.slug}`}
                  className="block px-6 py-4 text-center text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {state.label ?? state.slug}
                </Link>
              ))}
            </div>
          )}
          <p className="text-center text-slate-500 text-sm mt-6">
            {filteredStates.length === 0
              ? "Here is not any location available for this Brand Ambassador"
              : ""}
          </p>
        </div>
      </div>
    </section>
  );
};

export default States;
