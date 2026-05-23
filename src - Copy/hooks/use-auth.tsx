import { useEffect, useState } from "react";

export type Role = "admin" | "doctor" | "developer";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  hospital: string;
}

const KEY = "vitapredict.session";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("vitapredict:auth"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("vitapredict:auth"));
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(() => getSession());

  useEffect(() => {
    const sync = () => setUser(getSession());
    window.addEventListener("vitapredict:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vitapredict:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, isAuthenticated: !!user };
}

export const ROLE_HOME: Record<Role, string> = {
  admin: "/",
  doctor: "/doctor",
  developer: "/developer",
};
