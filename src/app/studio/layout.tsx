/** Studio root layout — bypass the locale layout. */
export const metadata = {
  title: "Sanity Studio · Chalet Aletsch",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
