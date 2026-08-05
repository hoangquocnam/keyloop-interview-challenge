const ACCESS_TOKEN_COOKIE_KEY = "leadstream.accessToken";
const ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS = 8 * 60 * 60;

const isBrowser = typeof document !== "undefined";

export const getAccessTokenCookie = () => {
  if (!isBrowser) {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${ACCESS_TOKEN_COOKIE_KEY}=`));

  if (!cookie) {
    return null;
  }

  const value = cookie.slice(`${ACCESS_TOKEN_COOKIE_KEY}=`.length);

  return value ? decodeURIComponent(value) : null;
};

export const setAccessTokenCookie = (accessToken: string) => {
  if (!isBrowser) {
    return;
  }

  const secureAttribute =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = [
    `${ACCESS_TOKEN_COOKIE_KEY}=${encodeURIComponent(accessToken)}`,
    "Path=/",
    `Max-Age=${ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    secureAttribute,
  ]
    .filter(Boolean)
    .join("; ");
};

export const clearAccessTokenCookie = () => {
  if (!isBrowser) {
    return;
  }

  document.cookie = [
    `${ACCESS_TOKEN_COOKIE_KEY}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
  ].join("; ");
};
