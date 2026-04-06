/** Cookie options for JWT: localhost works over HTTP; production uses Secure + SameSite=None for cross-site. */
export const authCookieOptions = (maxAgeMs) => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    maxAge: maxAgeMs,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };
};
