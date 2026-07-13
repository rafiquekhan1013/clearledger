enum Storage {
  JWT_ACCESS = "accessToken",
  JWT_REFRESH = "refreshToken",
  BA_SLUG = "baSlug",
}

class StorageService {
  getAccessToken(): string | null {
    return localStorage.getItem(Storage.JWT_ACCESS);
  }

  getBaSlug(): string | null {
    return localStorage.getItem(Storage.BA_SLUG);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(Storage.JWT_REFRESH);
  }

  setAuthTokens(access: string, refresh: string) {
    localStorage.setItem(Storage.JWT_ACCESS, access);
    localStorage.setItem(Storage.JWT_REFRESH, refresh);
  }

  setAccessToken(access: string) {
    localStorage.setItem(Storage.JWT_ACCESS, access);
  }

  setBaSlug(slug: string) {
    localStorage.setItem(Storage.BA_SLUG, slug);
  }

  resetAuthData(): void {
    localStorage.removeItem(Storage.JWT_ACCESS);
    localStorage.removeItem(Storage.JWT_REFRESH);
    localStorage.removeItem(Storage.BA_SLUG);
  }
}

export const storageService = new StorageService();
