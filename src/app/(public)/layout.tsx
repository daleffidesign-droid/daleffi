import { PublicFooter } from "@/src/shared/components/PublicFooter";
import PublicHeader from "@/src/shared/components/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body suppressHydrationWarning>
      <PublicHeader />
      <div className="mt-16">{children}</div>
      <PublicFooter />
    </body>
  );
}
