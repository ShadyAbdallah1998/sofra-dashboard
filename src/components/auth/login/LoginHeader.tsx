import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LoginHeader() {
  const t = useTranslations('Auth.Login');

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          {/* Changed from w-40 h-40 */}
          <Image
            src="/logo.svg"
            alt="Sofratech Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="fz-25 font-bold text-foreground">{t("title")}</h1>
        <p className="fz-14 text-muted-foreground">{t("subtitle")}</p>
      </div>
    </div>
  );
}
