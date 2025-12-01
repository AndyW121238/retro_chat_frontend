import { defineStore } from "pinia";
import type { User } from "@/types/entities";

interface JWTPayload {
  sub?: string;
  userId?: string;
  username?: string;
  email?: string;
  userAvatar?: string | null;
  [key: string]: unknown;
}

const base64UrlDecode = (segment: string) => {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
};

const parseJWTPayload = (token: string): JWTPayload | null => {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }
  try {
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (err) {
    console.error("JWT 解析失败", err);
    return null;
  }
};

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userInfo: null as User | null,
  }),
  actions: {
    setFromJWT(token: string) {
      const payload = parseJWTPayload(token);
      if (!payload || !payload.sub) {
        this.userInfo = null;
        return;
      }
      this.userInfo = {
        id: String(payload.userId),
        username: String(payload.username),
        email: String(payload.email),
        userAvatar: String(payload.userAvatar) ?? null,
      };
    },
  },
  persist: true,
});
