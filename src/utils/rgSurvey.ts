const RG_SURVEY_KEY = "clearledger_rg_survey_passed";

export const isRgSurveyPassed = (): boolean => {
  try {
    return localStorage.getItem(RG_SURVEY_KEY) === "true";
  } catch {
    return false;
  }
};

export const markRgSurveyPassed = (): void => {
  try {
    localStorage.setItem(RG_SURVEY_KEY, "true");
  } catch {
    /* ignore storage errors (e.g. private mode) */
  }
};
