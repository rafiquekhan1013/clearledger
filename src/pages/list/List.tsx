import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CansList } from "../../components/cans/CansList";
import { StateDropdown, StateOption } from "../../components/StateDropdown";
import { useSiteLocation } from "../../hooks/useSiteLocation";
import { Types as typeOptions } from "../../types";
import type { CanStates } from "../../types";
import { isRgSurveyPassed, markRgSurveyPassed } from "../../utils/rgSurvey";

interface ListProps {
  provider?: string;
  state?: string;
  type?: string;
  hasRgSurvey?: boolean;
  cans: unknown[];
  canStates?: CanStates[];
  hasTypes?: boolean;
}

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

const questions = [
  "Have you ever bet more than you could afford to lose?",
  "Have you ever felt the need to gamble with larger amounts of money to get the same excitement?",
  "Have you ever tried to win back money you lost by gambling more?",
  "Have you ever lied to people important to you about how much or how often you gamble?",
  "Have you ever felt unable to cut back or stop gambling, even when you wanted to?",
  "Has gambling ever caused you stress, anxiety, or conflict with family or friends?",
  "Have you ever missed work, school, or other responsibilities because of gambling?",
];

const List = ({
  provider,
  state,
  type,
  cans,
  hasRgSurvey = false,
  canStates = [],
  hasTypes = false,
}: ListProps) => {
  const rgAlreadyPassed = isRgSurveyPassed();
  const showSurvey = hasRgSurvey && !rgAlreadyPassed;
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [content, setContent] = useState(!showSurvey);
  const [formContent, setFormContent] = useState(showSurvey);
  const navigate = useNavigate();

  const { isUsLocation, locationFilter } = useSiteLocation();
  const filteredCanStates = useMemo(
    () =>
      canStates.filter(
        (s: CanStates) => (s as CanStates & { type?: string }).type === locationFilter
      ),
    [canStates, locationFilter]
  );

  const handleStateSelect = (slug: string) => {
    if (!provider || !slug) return;
    const path = type ? `/${provider}/${slug}/${type}` : `/${provider}/${slug}`;
    navigate(path);
  };

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    if (!provider || !state || !newType) return;
    navigate(`/${provider}/${state}/${newType}`);
  };

  const handleNext = () => {
    if (activeStep < questions.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...answers];
    updated[activeStep] = e.target.value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const hasYes = answers.some((ans) => ans === "yes");
    if (hasYes) {
      navigate("/support");
    } else {
      markRgSurveyPassed();
      setContent(true);
      setFormContent(false);
    }
  };

  return (
    <>
      {formContent && (
        <section className="py-8">
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            {activeStep === 0 && (
              <>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">
                  <span className="text-blue-600">Before You</span> Continue…
                </h4>
                <p className="text-slate-600 mb-2">
                  At {getSiteDisplayName()}, we believe gambling should always be fun, safe, and positive.
                </p>
                <p className="text-slate-600 mb-2">
                  Before we recommend any casino or sportsbook offers, we invite you to complete a
                  quick 7-part questionnaire about your past experiences on betting sites.
                </p>
                <p className="text-slate-600 mb-2">
                  It takes less than 30 seconds, and helps us better understand gambling behaviours
                  so we can support safer play — and improve how responsible gambling is approached
                  across the industry.
                </p>
                <p className="text-slate-600">
                  Please answer each question honestly. Your responses help inform responsible
                  gambling insights in North America.
                </p>
              </>
            )}
            <h2 className="text-lg font-semibold text-slate-900 mt-6 mb-2">
              Step {activeStep + 1} of 7
            </h2>
            <p className="text-slate-700 mb-6">{questions[activeStep]}</p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value="yes"
                  checked={answers[activeStep] === "yes"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-slate-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value="no"
                  checked={answers[activeStep] === "no"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-slate-700">No</span>
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 0}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              {activeStep === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!answers[activeStep]}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit & Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!answers[activeStep]}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </section> 
      )}
      {content && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Join The {getSiteDisplayName()} Study!</h2>
              <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
              <p className="text-slate-600">Select a study below to get started.</p>
            </div>
            {isUsLocation && (filteredCanStates.length > 0 || hasTypes) && (
              <div className="flex flex-wrap justify-center items-end gap-4 mb-8">
                {filteredCanStates.length > 0 && (
                  <StateDropdown
                    noMargin
                    states={filteredCanStates as StateOption[]}
                    value={state ?? ""}
                    onSelect={handleStateSelect}
                    label="Your state"
                    placeholder="Select your state"
                    id="list-state-select"
                  />
                )}
                {hasTypes && (
                  <div className="min-w-[200px]">
                    <label
                      htmlFor="list-type-select"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Sportsbook or Casino
                    </label>
                    <select
                      id="list-type-select"
                      value={type ?? ""}
                      onChange={handleTypeSelect}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="">Select option</option>
                      {typeOptions
                        .map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            <CansList type={type} state={state} cans={cans} />
          </div>
        </section>
      )}
    </>
  );
};

export default List;
