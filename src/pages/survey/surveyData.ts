/**
 * Survey casino options and questions.
 * CA/US site detection via VITE_SITE_NAME (e.g. clearledger.tech / us.clearledger.tech).
 */

const optionsConst = [
  { value: "Extremely Difficult", label: "Extremely Difficult", rate: "1" },
  { value: "Somewhat Difficult", label: "Somewhat Difficult", rate: "2" },
  { value: "Neither Difficult Nor Easy", label: "Neither Difficult Nor Easy", rate: "3" },
  { value: "Somewhat Easy", label: "Somewhat Easy", rate: "4" },
  { value: "Extremely Easy", label: "Extremely Easy", rate: "5" },
];

const baseDomain = import.meta.env.VITE_SITE_NAME || "clearledger.tech";
export const CA_SITE = baseDomain;
export const US_SITE = "us." + baseDomain;

const CA_SITE_REF = CA_SITE;
const US_SITE_REF = US_SITE;
const NONE_OF_ABOVE_OPTION = {
  text: "None of the above",
  value: "N/A",
  siteType: [CA_SITE_REF, US_SITE_REF],
};

const casinosConstCaOptions = [
  { text: "DraftKings", value: "DraftKings", siteType: [CA_SITE_REF] },
  { text: "BetMGM", value: "BetMGM", siteType: [CA_SITE_REF] },
  { text: "Caesars", value: "Caesars", siteType: [CA_SITE_REF] },
  { text: "PointsBet", value: "PointsBet", siteType: [CA_SITE_REF] },
  { text: "Golden Nugget", value: "Golden Nugget", siteType: [CA_SITE_REF] },
  { text: "Betano", value: "Betano", siteType: [CA_SITE_REF] },
  { text: "Mr Vegas", value: "Mr Vegas", siteType: [CA_SITE_REF] },
  { text: "VideoSlots", value: "VideoSlots", siteType: [CA_SITE_REF] },
  { text: "CasinoDays", value: "CasinoDays", siteType: [CA_SITE_REF] },
  { text: "Jackpot City", value: "Jackpot City", siteType: [CA_SITE_REF] },
  { text: "PlayOJO", value: "PlayOJO", siteType: [CA_SITE_REF] },
  { text: "BetRivers", value: "BetRivers", siteType: [CA_SITE_REF] },
  { text: "Bet365", value: "Bet365", siteType: [CA_SITE_REF] },
  { text: "Stardust", value: "Stardust", siteType: [CA_SITE_REF] },
  { text: "LeoVegas", value: "LeoVegas", siteType: [CA_SITE_REF] },
  { text: "OLG", value: "OLG", siteType: [CA_SITE_REF] },
  { text: "CrownGreen", value: "CrownGreen", siteType: [CA_SITE_REF] },
  { text: "FanDuel", value: "FanDuel", siteType: [CA_SITE_REF, US_SITE_REF] },
  { text: "Hello Millions", value: "Hello Millions", siteType: [CA_SITE_REF, US_SITE_REF] },
  { text: "Jackpota", value: "Jackpota", siteType: [CA_SITE_REF, US_SITE_REF] },
  { text: "McLuck", value: "McLuck", siteType: [CA_SITE_REF, US_SITE_REF] },
  { text: "Pulsz", value: "Pulsz", siteType: [CA_SITE_REF, US_SITE_REF] },
  NONE_OF_ABOVE_OPTION,
];

const casinosConstUsaOptions = [
  { text: "FanDuel", value: "FanDuel", siteType: [US_SITE_REF] },
  { text: "Hello Millions", value: "Hello Millions", siteType: [US_SITE_REF] },
  { text: "Jackpota", value: "Jackpota", siteType: [US_SITE_REF] },
  { text: "McLuck", value: "McLuck", siteType: [US_SITE_REF] },
  { text: "Pulsz", value: "Pulsz", siteType: [US_SITE_REF] },
  { text: "Realprize", value: "Realprize", siteType: [US_SITE_REF] },
  { text: "Casino Click", value: "Casino Click", siteType: [US_SITE_REF] },
  { text: "Hardrock", value: "Hardrock", siteType: [US_SITE_REF] },
  { text: "WowVegas", value: "WowVegas", siteType: [US_SITE_REF] },
  { text: "Mega Bonanza", value: "Mega Bonanza", siteType: [US_SITE_REF] },
  { text: "NoLimitCoins", value: "NoLimitCoins", siteType: [US_SITE_REF] },
  { text: "Funrize", value: "Funrize", siteType: [US_SITE_REF] },
  { text: "Sports Millions", value: "Sports Millions", siteType: [US_SITE_REF] },
  { text: "Funzcity", value: "Funzcity", siteType: [US_SITE_REF] },
  { text: "FortuneWheelz", value: "FortuneWheelz", siteType: [US_SITE_REF] },
  { text: "TaoFortune", value: "TaoFortune", siteType: [US_SITE_REF] },
  { text: "Spree Casino", value: "Spree Casino", siteType: [US_SITE_REF] },
  { text: "Sixty6", value: "Sixty6", siteType: [US_SITE_REF] },
  { text: "Play Fame", value: "Play Fame", siteType: [US_SITE_REF] },
  { text: "Baba Casino", value: "Baba Casino", siteType: [US_SITE_REF] },
  NONE_OF_ABOVE_OPTION,
];

const toQuestion = (c: { text: string; value: string; siteType: string[] }) => ({
  id: c.value.replace(/\s+/g, ""),
  text: c.text,
  options: optionsConst,
  siteType: c.siteType,
});

const questionsConstCa = casinosConstCaOptions.map(toQuestion);
const questionsConstUsa = casinosConstUsaOptions.map(toQuestion);

export const sportsBettors = [
  { id: 1, text: "I am primarily a sports bettor.", value: "sports bettor" },
  { id: 2, text: "I am primarily a casino player.", value: "casino player" },
  { id: 3, text: "I consider myself both a casino player and sports bettor.", value: "casino player and sports bettor" },
  { id: 4, text: "This was the first time I have used an online gambling platform.", value: "first time used" },
];

export {
  optionsConst,
  NONE_OF_ABOVE_OPTION,
  casinosConstCaOptions,
  casinosConstUsaOptions,
  questionsConstCa,
  questionsConstUsa,
};
