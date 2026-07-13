import { useEffect, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { useSiteLocation } from "../../hooks/useSiteLocation";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CA_SITE, US_SITE } from "../../pages/survey/surveyData";
import { useCreateStudyLogMutation } from "../../services/surveyApi";

interface CansListProps {
  type?: string;
  state?: string;
  cans: unknown[];
}

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

const siteDisplayName = getSiteDisplayName();

const DEFAULT_THEME_TITLE = "Platform Experience Study";
const DEFAULT_SCOPE_SUMMARY =
  "Explore key platform features, account controls, and responsible play settings.";

const BRAND_AGNOSTIC_INSTRUCTIONS = [
  "Click the \"Start\" button.",
  "You will be redirected to the platform. Create an account using the platform's signup flow.",
  "Locate account controls and complete the required platform interactions.",
  "Find responsible play settings within the platform.",
  `Once you have completed the required steps, provide a screenshot of your Welcome Email and BetSlip to your designated ${siteDisplayName} Customer Service Ambassador.`,
  `Ensure you have completed the ${siteDisplayName} feedback survey located at the top of this page.`,
  "Upon completion of the steps above you will be compensated in full for participation in this study.",
];

const POPUP_LOADING_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Verifying link…</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;color:#0f172a}
  .box{text-align:center;padding:24px}
  .spinner{width:44px;height:44px;border:4px solid #dbeafe;border-top-color:#2563eb;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 18px}
  @keyframes spin{to{transform:rotate(360deg)}}
  p{font-size:15px;color:#475569;margin:0}
</style></head>
<body><div class="box"><div class="spinner"></div><p>Verifying link, please wait…</p></div></body></html>`;

const POPUP_ERROR_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Link unavailable</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;color:#0f172a}
  .box{text-align:center;padding:24px;max-width:420px}
  .icon{font-size:46px;margin-bottom:12px}
  h1{font-size:20px;margin:0 0 10px;color:#b91c1c}
  p{font-size:15px;color:#475569;margin:0 0 22px;line-height:1.5}
  button{appearance:none;border:0;cursor:pointer;font-size:14px;font-weight:600;color:#fff;background:#2563eb;padding:10px 20px;border-radius:10px}
  button:hover{background:#1d4ed8}
</style></head>
<body><div class="box">
  <div class="icon">&#9888;&#65039;</div>
  <h1>This link is currently inactive</h1>
  <p>This study link is not available right now. Please close this tab and choose another study.</p>
  <button onclick="window.close()">Close this tab</button>
</div></body></html>`;

const POPUP_RETRY_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;color:#0f172a}
  .box{text-align:center;padding:24px;max-width:420px}
  .icon{font-size:46px;margin-bottom:12px}
  h1{font-size:20px;margin:0 0 10px;color:#d97706}
  p{font-size:15px;color:#475569;margin:0 0 22px;line-height:1.5}
  button{appearance:none;border:0;cursor:pointer;font-size:14px;font-weight:600;color:#fff;background:#2563eb;padding:10px 20px;border-radius:10px}
  button:hover{background:#1d4ed8}
</style></head>
<body><div class="box">
  <div class="icon">&#8635;</div>
  <h1>Something went wrong</h1>
  <p>We couldn't start this study right now. Please close this tab and try again in a moment.</p>
  <button onclick="window.close()">Close this tab</button>
</div></body></html>`;

interface CanItem {
  id: number;
  text?: string;
  description?: string;
  url: string;
  type?: string;
  state?: { slug?: string };
  status?: boolean;
  sortOrder?: number;
  redirectBy?: string;
  file?: {
    canId?: number;
    id?: number;
    filename?: string;
    brandMaskLevel?: string;
    betlabName?: string;
    betlabDescription?: string;
    themeTitle?: string | null;
    scopeSummary?: string | null;
  };
}

export function CansList({ state, type, cans }: CansListProps) {
  const [data, setData] = useState<CanItem[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { isUsLocation } = useSiteLocation();
  const { isAuthenticated } = useAuth();
  const [createStudyLog] = useCreateStudyLogMutation();
  const navigate = useNavigate();

  const sitename =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_SITE_NAME || CA_SITE
      : window.location.hostname;
  const country = sitename === US_SITE ? "USA" : "Canada";

  useEffect(() => {
    let finalList = (cans as CanItem[]).filter(Boolean);
    if (state) {
      finalList = finalList.filter(
        (item) =>
          item.state?.slug === state ||
          (item as { state?: string }).state === state ||
          (isUsLocation && state !== "usa" && (item.state?.slug === "usa" || (item.state as { slug?: string })?.slug === "usa"))
      );
    }
    if (type) {
      finalList = finalList.filter(
        (item) => (item.type ?? "").toUpperCase() === (type ?? "").toUpperCase()
      );
    }
    finalList = finalList.filter((item) => item.status !== false);
    finalList.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setData(finalList);
  }, [type, cans, state, isUsLocation]);

  const convertUrl = (url: string): string => btoa(url);

  const isUnmasked = (item: CanItem): boolean =>
    item.file?.brandMaskLevel === "visible";

  const getOperatorName = (item: CanItem): string =>
    item.file?.betlabName || item.text || "";

  const getDescription = (item: CanItem): string =>
    item.file?.betlabDescription || item.description || "";

  const getThemeTitle = (item: CanItem): string =>
    item.file?.themeTitle || DEFAULT_THEME_TITLE;

  const getScopeSummary = (item: CanItem): string =>
    item.file?.scopeSummary || DEFAULT_SCOPE_SUMMARY;

  const getInstructions = (): string[] => BRAND_AGNOSTIC_INSTRUCTIONS;

  const getUnmaskedInstructions = (item: CanItem): string[] => {
    const operatorName = getOperatorName(item);
    return [
      "Click \"Start\" Button",
      `You will be redirected to ${operatorName}. Follow the signup instructions on the ${operatorName} website and create an account on their website.`,
      "Deposit and Play on their website.",
      `Once your bets have been placed, provide a screenshot of your Welcome Email and BetSlip to your designated ${siteDisplayName} Customer Service Ambassador.`,
      `Ensure you have completed the ${siteDisplayName} feedback survey located at the top of this page.`,
      "Upon completion of the steps above you will be compensated in full for participation in this study.",
    ];
  };

  const staticServer = import.meta.env.VITE_STATIC_SERVER ?? "";

  const handleStartClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: CanItem,
    casinoLink: string
  ) => {

    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to start a study.");
      navigate("/studies");
      return;
    }
    if (loadingId !== null) {
      return;
    }
    const canId = item.file?.canId ?? item.id;
    // Open the tab synchronously inside the click gesture so popup blockers
    // allow it. We show a loading page in it, then either navigate it to the
    // casino link (active) or show an error page (inactive / server error).
    const popup = window.open("about:blank", "_blank");
    if (popup) {
      try {
        popup.opener = null;
        popup.document.write(POPUP_LOADING_HTML);
        popup.document.close();
      } catch {
        /* some browsers restrict writing to about:blank; ignore */
      }
    }

    const popupUsable = () => {
      try {
        return !!popup && !popup.closed;
      } catch {
        return false;
      }
    };

    setLoadingId(item.id);
    try {
      // Success here means the backend accepted the study log (active link).
      await createStudyLog({ canId, country }).unwrap();

      if (popupUsable()) {
        try {
          popup!.location.href = casinoLink;
        } catch {
          // iOS Safari / in-app webviews can block deferred popup navigation
          // after an await; fall back to navigating the current tab.
          window.location.href = casinoLink;
        }
      } else {
        // Popup was blocked (e.g. in-app browsers): redirect the current tab,
        // which is never blocked.
        window.location.href = casinoLink;
      }
    } catch (err) {
      // 400 => link inactive / not found. Anything else (e.g. 500 from a
      // Salesforce/server failure) is a transient error the user can retry,
      // and must NOT be shown as "inactive".
      const status = (err as { status?: number | string })?.status;
      const isInactive = status === 400;
      const errorHtml = isInactive ? POPUP_ERROR_HTML : POPUP_RETRY_HTML;
      const alertMessage = isInactive
        ? "This link is currently inactive. Please try another study."
        : "Something went wrong. Please try again in a moment.";

      if (popupUsable()) {
        try {
          popup!.document.open();
          popup!.document.write(errorHtml);
          popup!.document.close();
        } catch {
          try {
            popup!.close();
          } catch {
            /* noop */
          }
          alert(alertMessage);
        }
      } else {
        alert(alertMessage);
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center text-slate-600 py-8">
        No studies found for this location.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => {
        let casinoLink =
          item.file?.id === 61 || item.file?.id === 28 || item.file?.id === 26
            ? item.url
            : `https://playcan.ca/redirect?url=${convertUrl(item.url)}`;
        if (item.file?.id === 62 || item.file?.id === 81) {
          casinoLink = `https://nextlevelcasinos.com/redirect?url=${convertUrl(item.url)}`;
        }
        if (item.redirectBy) {
          casinoLink = `${item.redirectBy}?url=${convertUrl(item.url)}`;
        }
        const unmasked = isUnmasked(item);
        const instructions = unmasked
          ? getUnmaskedInstructions(item)
          : getInstructions();

        return (
          <div
            key={item.id}
            className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:border-blue-200 hover:shadow-xl transition-all"
          >
            {unmasked && item.file?.filename ? (
              <img
                loading="lazy"
                src={`${staticServer}${item.file.filename}`}
                alt=""
                className="w-full aspect-video object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full aspect-video rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <FlaskConical className="w-12 h-12 text-blue-600" aria-hidden />
              </div>
            )}
            <a
              href="#"
              role="button"
              className="block group"
              onClick={(e) => handleStartClick(e, item, casinoLink)}
              onAuxClick={(e) => e.preventDefault()}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {unmasked ? getOperatorName(item) : getThemeTitle(item)}
              </h3>
            </a>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {unmasked ? getDescription(item) : getScopeSummary(item)}
            </p>
            <a
              href="#"
              role="button"
              aria-disabled={loadingId === item.id}
              className={`inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg transition-all ${
                loadingId === item.id ? "opacity-70 cursor-wait" : ""
              }`}
              onClick={(e) => handleStartClick(e, item, casinoLink)}
              onAuxClick={(e) => e.preventDefault()}
            >
              {loadingId === item.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Checking...
                </>
              ) : (
                "Start"
              )}
            </a>
            <details className="mt-4">
              <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                View instructions
              </summary>
              <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm text-slate-600">
                {instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </details>
          </div>
        );
      })}
    </div>
  );
}
