import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserSignupMutation } from "../services/auth.service";
import { storageService } from "../services/storage.service";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { generateFingerprint } from "../utils/fingerprint";
import "react-day-picker/dist/style.css";

interface SignupComponentProps {
  code?: string;
}

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

/** Parse `YYYY-MM-DD` as a local calendar date (no UTC shift). */
const parseLocalYmd = (raw: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
};

const formatYmd = (date: Date): string => {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const da = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
};

const formatDdMmYyyy = (date: Date): string => {
  const da = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${da}-${mo}-${y}`;
};

const normalizeBirthdayForApi = (rawValue: string): string | null => {
  if (!rawValue) return null;
  const parsed = parseLocalYmd(rawValue);
  return parsed ? formatYmd(parsed) : null;
};

function getSignupErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    if ("status" in o) {
      const data = o.data;
      if (
        data &&
        typeof data === "object" &&
        typeof (data as { message?: unknown }).message === "string"
      ) {
        const m = (data as { message: string }).message;
        if (m) return m;
      }
      if(data && typeof data === "object" && "message" in data) {
       return (data as { message: string }).message;
      }
      if (typeof o.error === "string" && o.error) return o.error;
    }
    if (typeof o.message === "string" && o.message) {
      return o.message;
    }
  }
  return "Something went wrong. Please try again.";
}

const SignupComponent = ({ code }: SignupComponentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userSignup] = useUserSignupMutation();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [baSlug, setBaSlug] = useState("studies");
  const [data, setData] = useState({ password: "", cpassword: "" });
  const [birthday, setBirthday] = useState("");
  const [isBirthdayPickerOpen, setIsBirthdayPickerOpen] = useState(false);
  const birthdayPickerRef = useRef<HTMLDivElement | null>(null);
  const [step1, setStep1] = useState<"block" | "none">("block");
  const siteDisplayName = getSiteDisplayName();

  useEffect(() => {
    setReferralCode(code ?? "");
  }, [code]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        birthdayPickerRef.current &&
        !birthdayPickerRef.current.contains(event.target as Node)
      ) {
        setIsBirthdayPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isAtLeastAge = (dob: string | null, minAge: number): boolean => {
    if (!dob) return false;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return false;
    const now = new Date();
    if (birth.getTime() > now.getTime()) return false;
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age >= minAge;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsError(false);
    setError("");
    event.preventDefault();
    if (!birthday) {
      setIsError(true);
      setError("Please select your date of birth.");
      return;
    }
    if (!isAtLeastAge(birthday, 19)) {
      setIsError(true);
      setError("You must be at least 19 years old to sign up.");
      return;
    }
    if (data.password !== data.cpassword) {
      setIsError(true);
      setError("Passwords do not match.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const birthdayRaw = (formData.get("birthday") as string) || birthday;
    const normalizedBirthday = normalizeBirthdayForApi(birthdayRaw);
    if (!normalizedBirthday) {
      setSubmitting(false);
      setIsError(true);
      setError("Please select a valid date of birth.");
      return;
    }
    try {
      const first_name = formData.get("first_name") as string;
      const last_name = formData.get("last_name") as string;
      const email = formData.get("email") as string;
      const address = formData.get("address") as string;
      const password = formData.get("password") as string;
      const contactNumber = formData.get("contactNumber") as string;
      const refferByCode = formData.get("refferByCode") as string;
      const refferBy = formData.get("refferBy") as string | undefined;

      const siteName = import.meta.env.VITE_SITE_NAME;
      if (!siteName) {
        throw new Error(
          "Missing VITE_SITE_NAME in environment. Add it to .env and restart the dev server."
        );
      }
      const fingerprint = await generateFingerprint().catch(() => undefined);
      const resp = await userSignup({
        first_name,
        last_name,
        email,
        password,
        contactNumber,
        refferByCode,
        ...(refferBy ? { refferBy } : {}),
        siteName,
        birthday: normalizedBirthday,
        address,
        ...(fingerprint && { fingerprint }),
      }).unwrap();

      const accessToken = resp.Authorization;
      const BASlug = resp.data?.baSlug ?? "studies";
      if (accessToken) storageService.setAccessToken(accessToken);
      if (BASlug !== "studies") storageService.setBaSlug(BASlug);
      setBaSlug(BASlug);
      setStep1("none");
    } catch (e: unknown) {
      setSubmitting(false);
      setIsError(true);
      setError(getSignupErrorMessage(e));
    }
  };

  const handleFinalStep = () => {
    setIsSuccess(true);
    if (location.pathname === "/sign-up") {
      setTimeout(
        () => navigate(`/${baSlug}`),
        3000
      );
    } else {
      if (location.pathname === "/studies") {
        window.location.href = `${window.location.origin}/${baSlug}`;
      } else {
        if(location.pathname === "/survey") {
          window.location.reload();
        }else{
          window.location.href = `${window.location.origin}/${baSlug}`;
        }
        
      }
    }
  };

  const inputClass =
    "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all";
  const btnClass =
    "w-full px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer";

  const maxBirthday = new Date();
  const displayBirthday = (() => {
    if (!birthday) return "";
    const d = parseLocalYmd(birthday);
    return d ? formatDdMmYyyy(d) : "";
  })();

  return (
    <div>
      <div className={step1 === "block" ? "block" : "hidden"}>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Step 1: Create Your Profile
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          You&apos;re almost in. Just a few quick details to create your{" "}
          {siteDisplayName} Insights Member profile.
        </p>
      </div>
      <div className={step1 === "block" ? "hidden" : "block"}>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Step 2: RealUser Informed Participation Consent
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Before participating in any RealUser Market Research studies, we need
          to confirm that you understand what {siteDisplayName} is — and what
          your role is as a research participant.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={step1 === "block" ? "block space-y-4" : "hidden"}>
          <input
            className={inputClass}
            type="text"
            name="first_name"
            placeholder="First Name"
            required
          />
          <input
            className={inputClass}
            type="text"
            name="last_name"
            placeholder="Last Name"
            required
          />
          <input
            className={inputClass}
            type="email"
            name="email"
            placeholder="Email (used to receive E-Transfers)"
            required
          />
          <div>
            <div className="relative" ref={birthdayPickerRef}>
              <input
                type="text"
                readOnly
                value={displayBirthday}
                placeholder="Date of Birth"
                className={`${inputClass} cursor-pointer`}
                onClick={() => setIsBirthdayPickerOpen((prev) => !prev)}
                onFocus={() => setIsBirthdayPickerOpen(true)}
                aria-label="Select date of birth"
                autoComplete="bday"
              />
              <input type="hidden" name="birthday" value={birthday} />
              {isBirthdayPickerOpen && (
                <div className="absolute z-50 mt-2 rounded-xl border-2 border-slate-200 bg-white p-2 shadow-lg">
                  <DayPicker
                    mode="single"
                    selected={
                      birthday
                        ? (parseLocalYmd(birthday) ?? undefined)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setBirthday(formatYmd(date));
                      setIsBirthdayPickerOpen(false);
                    }}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={maxBirthday.getFullYear()}
                    disabled={{ after: maxBirthday }}
                  />
                </div>
              )}
            </div>
          </div>

          <input
            className={inputClass}
            type="text"
            name="address"
            placeholder="Address"
            maxLength={500}
            required
          />
          <input
            className={inputClass}
            type="tel"
            name="contactNumber"
            placeholder="Phone Number"
            maxLength={10}
            minLength={10}
            required
          />
          <input
            className={inputClass}
            type="password"
            name="password"
            placeholder="Password"
            minLength={6}
            onChange={handleInputChange}
            required
          />
          <input
            className={inputClass}
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            minLength={6}
            onChange={handleInputChange}
            required
          />
          {error && (
            <p
              role="alert"
              className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800"
            >
              {error}
            </p>
          )}
          <input
            className={inputClass}
            type="text"
            name="refferByCode"
            placeholder="Brand Ambassador Referral Code"
            defaultValue={referralCode}
            required
          />
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            I confirm that I am 19 years of age or older and reside in a
            permitted region.
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Terms of Service
            </Link>
          </label>
          <button type="submit" disabled={submitting} className={btnClass}>
            {submitting ? "Please wait" : "Continue"}
          </button>
        </div>

        <div className={step1 === "block" ? "hidden" : "block space-y-4"}>
          <ul className="list-disc ml-5 space-y-2 text-sm text-slate-600">
            <li>
              You&apos;re participating in market research, not a gambling
              promotion.
            </li>
            <li>Betting participation is always optional.</li>
            <li>All studies involve platforms licensed by iGaming Ontario.</li>
            <li>
              Your insights help improve clarity and responsible gambling tools.
            </li>
            <li>
              Your personal information is never shared with operators or third
              parties.
            </li>
            <li>
              Every study includes a review of responsible gambling tools.
            </li>
          </ul>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              defaultChecked
              readOnly
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            I confirm I have read and understand the RealUser Informed
            Participation Consent, and agree to participate as a{" "}
            {siteDisplayName} Insights Member.
          </label>
          <button type="button" onClick={handleFinalStep} className={btnClass}>
            Continue to Studies
          </button>
        </div>
      </form>

      {isSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            Thank you! Your submission has been successful. Redirecting...
          </p>
        </div>
      )}
      {isError && (
        <p
          role="alert"
          className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default SignupComponent;
