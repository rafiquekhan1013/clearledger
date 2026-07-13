import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleSurveyQuery,
  useGetUserQuery,
  useGetUserSurveyQuery,
  useSaveSurveyMutation,
  useUpdateSurveyMutation,
} from "../../services/surveyApi";
import { useAuth } from "../../hooks/useAuth";
import PopupModal from "../../components/PopupModal";
import {
  casinosConstCaOptions,
  casinosConstUsaOptions,
  questionsConstCa,
  questionsConstUsa,
  optionsConst,
  sportsBettors,
  CA_SITE,
  NONE_OF_ABOVE_OPTION,
  US_SITE,
} from "./surveyData";

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

export default function Survey() {
  const sitename =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_SITE_NAME || CA_SITE
      : window.location.hostname;
  const isUsSite = sitename === US_SITE;
  const casinoOptions = isUsSite ? casinosConstUsaOptions : casinosConstCaOptions;
  const questionsConstList = isUsSite ? questionsConstUsa : questionsConstCa;

  const { id } = useParams<{ id: string }>();
  const surveyId = id && !isNaN(Number(id)) ? Number(id) : 0;
  const { data: surveyData, isSuccess: isSuccessData } = useGetSingleSurveyQuery(surveyId, {
    skip: surveyId <= 0,
  });
  const { data: userSurvey, refetch: userSurveyRefetch } = useGetUserSurveyQuery();
  const { isSuccess, data: userData, refetch } = useGetUserQuery();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const [SaveSurvey] = useSaveSurveyMutation();
  const [UpdateSurvey] = useUpdateSurveyMutation();
  const { isAuthenticated,baSlug } = useAuth();

  const [isNext, setIsNext] = useState(true);
  const [questions, setQuestions] = useState(questionsConstList);
  const [casinos, setCasinos] = useState<string[]>([]);
  const [signedUpCasinos, setSignedUpCasinos] = useState<string[]>([]);
  const [answersSignupProcess, setAnswersSignupProcess] = useState<Record<string, string>>({});
  const [answersDepositProcess, setAnswersDepositProcess] = useState<Record<string, string>>({});
  const [answersExperience, setAnswersExperience] = useState<Record<string, string>>({});
  const [answersSportsGambling, setAnswersSportsGambling] = useState<Record<string, string>>({});
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [favouriteBook, setFavouriteBook] = useState("");
  const [comments, setComments] = useState("");
  const [location, setLocation] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sportsBettor, setSportsBettor] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [respData, setRespData] = useState<{ firstName?: string; lastName?: string; responseId?: string }>({});
  const [isPageLoaded, setIsPageLoaded] = useState(surveyId === 0);

  const siteDisplayName = getSiteDisplayName();

  useEffect(() => {
    if (isSuccess && userData) {
      const ud = userData as { isSurveyDone?: boolean; first_name?: string; last_name?: string; email?: string };
      if (ud.isSurveyDone && surveyId === 0) setOpenUpdate(true);
      setFname(ud.first_name || "");
      setLname(ud.last_name || "");
      setEmail(ud.email || "");
    }
  }, [userData, isSuccess, surveyId]);

  useEffect(() => {
    if (isSuccessData && surveyData) {
      const sd = surveyData as {
        answersSignupProcess?: Record<string, string>;
        answersDepositProcess?: Record<string, string>;
        answersExperience?: Record<string, string>;
        answersSportsGambling?: Record<string, string>;
        firstName?: string;
        lastName?: string;
        email?: string;
        comments?: string;
        favouriteBook?: string;
        sportsBettor?: string;
        location?: string;
        casinos?: string;
        birthDate?: string;
        signupCasinos?: string;
      };
      setIsNext(false);
      setAnswersSignupProcess(sd.answersSignupProcess || {});
      setAnswersDepositProcess(sd.answersDepositProcess || {});
      setAnswersExperience(sd.answersExperience || {});
      setAnswersSportsGambling(sd.answersSportsGambling || {});
      setFname(sd.firstName || "");
      setLname(sd.lastName || "");
      setEmail(sd.email || "");
      setComments(sd.comments || "");
      setFavouriteBook(sd.favouriteBook || "");
      setSportsBettor(sd.sportsBettor || "");
      if (sd.location) setLocation(sd.location);
      setCasinos((sd.casinos || "").split(",").filter(Boolean));
      if (sd.birthDate) {
        setBirthDate(sd.birthDate.split("T")[0]);
      }
      if (sd.signupCasinos) {
        const newCasinos = sd.signupCasinos.split(",").filter(Boolean);
        setSignedUpCasinos(newCasinos);
        setQuestions(questionsConstList.filter((q) => newCasinos.includes(q.text)));
      }
      setTimeout(() => setIsPageLoaded(true), 500);
    }
  }, [isSuccessData, surveyData, questionsConstList]);

  const handleCasinos = (e: { target: { value: string; checked: boolean } }) => {
    const { value, checked } = e.target;
    if (value === NONE_OF_ABOVE_OPTION.value) {
      if (checked) setCasinos([NONE_OF_ABOVE_OPTION.value]);
      else setCasinos([]);
      return;
    }

    if (checked) setCasinos((prev) => [...prev.filter((c) => c !== NONE_OF_ABOVE_OPTION.value), value]);
    else setCasinos((prev) => prev.filter((c) => c !== value));
  };

  const handleSignedUpCasinos = (e: { target: { value: string; checked: boolean } }) => {
    const { value, checked } = e.target;
    if (checked) {
      const newCasinos = [...signedUpCasinos, value];
      setSignedUpCasinos(newCasinos);
      setQuestions(questionsConstList.filter((q) => newCasinos.includes(q.text)));
    } else {
      const newCasinos = signedUpCasinos.filter((c) => c !== value);
      setSignedUpCasinos(newCasinos);
      setQuestions(questionsConstList.filter((q) => newCasinos.includes(q.text)));
    }
  };

  const handleSignupProcessChange = (_e: { target: { value: string } }, questionId: string, value: string) => {
    setAnswersSignupProcess((prev) => ({ ...prev, [questionId]: value }));
  };
  const handleDepositProcessChange = (_e: { target: { value: string } }, questionId: string, value: string) => {
    setAnswersDepositProcess((prev) => ({ ...prev, [questionId]: value }));
  };
  const handleExperienceChange = (_e: { target: { value: string } }, questionId: string, value: string) => {
    setAnswersExperience((prev) => ({ ...prev, [questionId]: value }));
  };
  const handleSportsGamblingChange = (_e: { target: { value: string } }, questionId: string, value: string) => {
    setAnswersSportsGambling((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleClose = () => {
    setOpen(false);
    navigate(`/${baSlug}`);
    refetch();
    userSurveyRefetch();
  };

  const handleUpdateSurvey = () => {
    setOpenUpdate(false);
    const us = userSurvey as { id?: number } | undefined;
    if (us?.id) {
      window.location.href = `${window.location.origin}/survey/${us.id}`;
    }
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    navigate(`/${baSlug}`);
  };

  const handleNext = () => {
    if (signedUpCasinos.length === 0) {
      setError("You must answer all questions to proceed.");
      setIsError(true);
      return;
    }
    setError("");
    setIsError(false);
    setIsNext(false);
    ref.current && (ref.current.style.display = "block");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formcheck = event.currentTarget;
    // If form is invalid, let browser show errors (Safari included)
    if (!formcheck.checkValidity()) {
      formcheck.reportValidity();   // 🔥 This forces Safari to show errors
      return;
    }
    event.preventDefault();
    setIsError(false);
    setError("");

    if (!location) {
      setError("Please select your location");
      setIsError(true);
      return;
    }
    if (!sportsBettor) {
      setError("Please select at least one option for question 6");
      setIsError(true);
      return;
    }
    if (casinos.length <= 0) {
      setError("Select at least a casino/sport book member option");
      setIsError(true);
      return;
    }
    if (signedUpCasinos.length <= 0) {
      setError(`Select at least a casino/sport book signup for ${siteDisplayName}`);
      setIsError(true);
      return;
    }
    if (!birthDate) {
      setError("Please select your birthdate");
      setIsError(true);
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("location", location);
    formData.append("birthDate", birthDate);
    formData.append("sportsBettor", sportsBettor);
    formData.append("casinos", casinos.join(","));
    formData.append("signedUpCasinos", signedUpCasinos.join(","));
    formData.append("answersSignupProcess", JSON.stringify(answersSignupProcess));
    formData.append("answersDepositProcess", JSON.stringify(answersDepositProcess));
    formData.append("answersExperience", JSON.stringify(answersExperience));
    formData.append("answersSportsGambling", JSON.stringify(answersSportsGambling));
    if (!formData.get("comments")) formData.set("comments", "NA");

    const formValues: Record<string, string> = {};
    formData.forEach((v, k) => {
      formValues[k] = v as string;
    });

    try {
      if (surveyId > 0) {
        const updateResp = await UpdateSurvey(formValues).unwrap();
        const data = (updateResp as { data?: typeof respData })?.data ?? updateResp;
        setRespData(data as typeof respData);
      } else {
        const saveResp = await SaveSurvey(formValues).unwrap();
        const data = (saveResp as { data?: typeof respData })?.data ?? saveResp;
        setRespData(data as typeof respData);
      }
      setOpen(true);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setError(e?.data?.message || "Failed to submit survey");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const signupOptions = questionsConstList.filter((item) =>
    item.text !== NONE_OF_ABOVE_OPTION.text &&
    casinoOptions.some((opt) => opt.text === item.text)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {!isAuthenticated && surveyId <= 0 && <PopupModal />}

      <header className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          {siteDisplayName} Market Research
        </h1>
        <p className="text-stone-600">
          Please answer the below questions honestly and accurately:
        </p>
      </header>

      <div
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        id={isPageLoaded ? "myDiv" : "loadingId"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Survey</h2>
            <p className="text-stone-600">
              Please answer the below questions honestly and accurately
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">1. First Name</label>
            <input
              type="text"
              name="firstName"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">2. Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">3. Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">4. Where are you located?</label>
            <select
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select one...</option>
              <option value="Ontario">Ontario</option>
              <option value="Rest of Canada">Rest of Canada</option>
              <option value="USA">USA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">5. Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              6. Do you consider yourself a sports bettor, casino player, or both?
            </label>
            <div className="space-y-2 mt-2">
              {sportsBettors.map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sportsBettor"
                    value={item.value}
                    checked={sportsBettor === item.value}
                    onChange={(e) => setSportsBettor(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-stone-700">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-stone-200 my-8" />

          <h3 className="text-lg font-semibold text-blue-600">Platform Membership</h3>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              7. Prior to the completion of this research activity, of which sports books or online casinos were you already a member?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {casinoOptions.map((item) => (
                <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={item.value}
                    checked={casinos.includes(item.value)}
                    onChange={handleCasinos}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-stone-700">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              8. What sportsbooks/casinos did you sign-up for through {siteDisplayName}?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {signupOptions.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={item.text}
                    checked={signedUpCasinos.includes(item.text)}
                    onChange={handleSignedUpCasinos}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-stone-700">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div ref={ref} style={{ display: isNext ? "none" : "block" }}>
            <hr className="border-stone-200 my-8" />
            <h3 className="text-lg font-semibold text-blue-600 mb-6">Rating Questions</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  9. On a scale of 1–5, rate the ease of the signup process for each book.<br />
                  <span className="text-stone-500">1 = very difficult, 5 = very easy.</span>
                </label>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 font-medium text-stone-600"></th>
                        {optionsConst.map((o) => (
                          <th key={o.rate} className="px-2 py-2 text-center font-medium text-stone-600">{o.rate}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 font-medium text-stone-700">{row.text}</td>
                          {row.options.map((opt: { value: string; rate: string }) => (
                            <td key={opt.value} className="px-2 py-2 text-center">
                              <input
                                type="radio"
                                name={`question-${row.id}-signup`}
                                value={opt.value}
                                checked={answersSignupProcess[row.id] === opt.value}
                                onChange={(e) => handleSignupProcessChange(e, row.id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                                required
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  10. On a scale of 1–5, rate the ease of making a deposit.<br />
                  <span className="text-stone-500">1 = very difficult, 5 = very easy.</span>
                </label>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 font-medium text-stone-600"></th>
                        {optionsConst.map((o) => (
                          <th key={o.rate} className="px-2 py-2 text-center font-medium text-stone-600">{o.rate}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 font-medium text-stone-700">{row.text}</td>
                          {row.options.map((opt: { value: string; rate: string }) => (
                            <td key={opt.value} className="px-2 py-2 text-center">
                              <input
                                type="radio"
                                name={`question-${row.id}-deposit`}
                                value={opt.rate}
                                checked={answersDepositProcess[row.id] === opt.rate}
                                onChange={(e) => handleDepositProcessChange(e, row.id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                                required
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  11. On a scale of 1–5, rate your overall experience with each book.<br />
                  <span className="text-stone-500">1 = worst, 5 = best.</span>
                </label>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 font-medium text-stone-600"></th>
                        {optionsConst.map((o) => (
                          <th key={o.rate} className="px-2 py-2 text-center font-medium text-stone-600">{o.rate}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 font-medium text-stone-700">{row.text}</td>
                          {row.options.map((opt: { value: string; rate: string }) => (
                            <td key={opt.value} className="px-2 py-2 text-center">
                              <input
                                type="radio"
                                name={`question-${row.id}-experience`}
                                value={opt.rate}
                                checked={answersExperience[row.id] === opt.rate}
                                onChange={(e) => handleExperienceChange(e, row.id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                                required
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  12. On a scale of 1–5, how likely are you to continue using each book?<br />
                  <span className="text-stone-500">1 = not likely, 5 = very likely.</span>
                </label>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 font-medium text-stone-600"></th>
                        {optionsConst.map((o) => (
                          <th key={o.rate} className="px-2 py-2 text-center font-medium text-stone-600">{o.rate}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 font-medium text-stone-700">{row.text}</td>
                          {row.options.map((opt: { value: string; rate: string }) => (
                            <td key={opt.value} className="px-2 py-2 text-center">
                              <input
                                type="radio"
                                name={`question-${row.id}-sportgambling`}
                                value={opt.rate}
                                checked={answersSportsGambling[row.id] === opt.rate}
                                onChange={(e) => handleSportsGamblingChange(e, row.id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                                required
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <hr className="border-stone-200 my-8" />
            <h3 className="text-lg font-semibold text-blue-600 mb-6">Final Questions</h3>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">13. What is your favorite platform?</label>
              <select
                name="favouriteBook"
                value={favouriteBook}
                onChange={(e) => setFavouriteBook(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select one...</option>
                {signupOptions.map((item) => (
                  <option key={item.id} value={item.text}>{item.text}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">14. Any other comments?</label>
              <textarea
                name="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                maxLength={5000}
                rows={4}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-8 p-4 bg-stone-50 rounded-xl">
              <p className="text-sm font-medium text-stone-700 mb-2">Consents and Contact Info</p>
              <p className="text-sm text-stone-600 mb-4">
                Please complete the consent below, indicating you accept the terms and conditions from {sitename}
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="Terms-and-Conditions"
                  required
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-stone-700">
                  I accept the {siteDisplayName} <NavLink to="/terms" target="_blank" className="text-blue-600 hover:underline">terms and conditions</NavLink>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
            >
              {submitting ? "Please wait..." : surveyId > 0 ? "Update" : "Submit"}
            </button>
          </div>

          {isNext && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Next
            </button>
          )}
        </form>

        {isError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
      </div>

      {openUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-blue-600 text-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-2">You have already submitted survey</h2>
            <p className="mb-6">Would you like to update the survey response?</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={handleUpdateSurvey} className="px-4 py-2 bg-white text-black rounded-lg font-medium">Yes, proceed</button>
              <button type="button" onClick={handleCloseUpdate} className="px-4 py-2 bg-white text-black rounded-lg font-medium">Not yet</button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-blue-600 text-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-2">
              Thank you for submitting your survey {respData.firstName} {respData.lastName}
            </h2>
            <p className="mb-2">Please take a screenshot of this submission confirmation.</p>
            <p className="font-bold mt-2">Survey ID: {respData.responseId}</p>
            <div className="flex justify-end mt-6">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-white text-black rounded-lg font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
