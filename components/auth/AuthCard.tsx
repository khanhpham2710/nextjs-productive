import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import SignUpCardContent from "./SignUpCardContent";
import SignInCardContent from "./SignInCardContent";

interface Props {
  signInCard?: boolean;
}

export const AuthCard = ({ signInCard }: Props) => {
  const t = useTranslations("AUTH");

  return (
    <>
      <Card className="w-full sm:min-w-[28rem] sm:w-auto">
      <CardHeader>
          <Image
            alt=""
            className="rounded-full object-cover self-center"
            width={50}
            height={50}
            src={"https://github.com/shadcn.png"}
          />
          <CardTitle className="pt-2 text-center uppercase">
            {signInCard ? t("SIGN_IN.TITLE") : t("SIGN_UP.TITLE")}
          </CardTitle>
          <CardDescription className="text-center">
            {signInCard ? t("SIGN_IN.DESC") : t("SIGN_UP.DESC")}
          </CardDescription>
        </CardHeader>
        {signInCard ? <SignInCardContent /> : <SignUpCardContent />}
      </Card>
      <p className="text-sm">
        {signInCard
          ? t("SIGN_IN.DONT_HAVE_ACCOUNT.FIRST")
          : t("SIGN_UP.HAVE_ACCOUNT.FIRST")}{" "}
        <Link
          className="text-primary underline underline-offset-2"
          href={signInCard ? "/sign-up" : "/sign-in"}
        >
          {signInCard
            ? t("SIGN_IN.DONT_HAVE_ACCOUNT.SECOND")
            : t("SIGN_UP.HAVE_ACCOUNT.SECOND")}{" "}
        </Link>
      </p>
    </>
  );
};
