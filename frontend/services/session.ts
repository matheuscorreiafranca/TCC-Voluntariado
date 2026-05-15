"use client";

import { LoginResponse, Voluntario } from "./api";

const SESSION_KEY = "ivg_volunteer_session";

export function saveSession(data: LoginResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function getSession(): LoginResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as LoginResponse : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentVoluntario(): Voluntario | null {
  return getSession()?.voluntario ?? null;
}

export function isAdminSession() {
  const tipo = getSession()?.usuario?.tipo;
  return tipo === "Superadmin" || tipo === "Admin" || tipo === "Instituicao";
}

export function isVolunteerSession() {
  return getSession()?.usuario?.tipo === "Voluntario" && Boolean(getSession()?.voluntario);
}
