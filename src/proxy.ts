import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude api, Next internals, Sanity studio, and any path with a dot.
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
