import Image from "next/image";
import { getSiteSettings } from "@/src/features/site-settings/actions/get-site-settings";

interface FloatingWhatsAppButtonProps {
  message?: string;
}

export async function FloatingWhatsAppButton({
  message = "Olá! Vi o site da Daleffi e gostaria de mais informações.",
}: FloatingWhatsAppButtonProps) {
  const settings = await getSiteSettings();

  const href = `https://wa.me/55${settings.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
      className="group fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/30 transition-transform hover:scale-105 sm:right-8 sm:bottom-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/50 [animation-duration:2.5s] group-hover:animate-none" />
      <Image
        src="/logos/whatsapp-logo.png"
        alt=""
        width={30}
        height={30}
        className="relative"
      />
    </a>
  );
}