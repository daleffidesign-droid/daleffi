import { PublicFooter } from "@/src/shared/components/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body suppressHydrationWarning>
      {children}
      <PublicFooter />
    </body>
  );
}
