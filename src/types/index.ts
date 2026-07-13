export interface ServerResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CanFile {
  canId?: number;
  encoding?: string;
  filename?: string;
  id?: number;
  originalname?: string;
  path?: string;
  themeTitle?: string | null;
  scopeSummary?: string | null;
  instructionsPublic?: string | null;
}

export type Can = {
  id: number;
  text: string;
  description?: string;
  image_url?: string;
  url: string;
  rating: number;
  type: string;
  state: string;
  file?: CanFile;
};

export type CanStates = {
  id?: number;
  name?: string;
  label?: string;
  slug?: string;
  type?: string;
  cans?: Can[];
  provider?: Provider;
};

export type Provider = {
  id?: number;
  name?: string;
  status?: boolean;
  slug: string;
  hasRgSurvey: boolean;
  hasTypes: boolean;
  cans: Can[] | [];
  CanStates: CanStates[] | [];
  data?: unknown[];
};

export const Types = [
  { slug: "casino", label: "CASINO" },
  { slug: "sports", label: "SPORTSBOOK" },
];
