import { storageService } from "../services/storage.service";

export const useAuth = () => {
  const accessToken = storageService.getAccessToken();
  const baSlug = storageService.getBaSlug() ?? undefined;
  return {
    isAuthenticated: Boolean(accessToken),
    baSlug,
    accessToken: storageService.getAccessToken(),
  };
};
