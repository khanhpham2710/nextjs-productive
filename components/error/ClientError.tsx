import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  message: string;
  hrefToGoOnReset?: string;
  className?: string;
  onRefetch?: () => void;
}

function ClientError({
  message,
  hrefToGoOnReset,
  className,
  onRefetch,
}: Props) {
  const t = useTranslations("CLIENT_ERROR");
  const router = useRouter();
  
  return (
    <Card
      className={cn(
        `bg-background border-none shadow-none flex flex-col items-center mt-12 sm:mt-16 md:mt-32 text-center overflow-hidden`,
        className
      )}
    >
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("TITLE")}
          </h1>
          <CardDescription className="text-base mt-4">
            {message}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-4 sm:mt-0">
        <Button
          size={"lg"}
          className="text-white"
          onClick={() => {
            if (hrefToGoOnReset) router.push(hrefToGoOnReset);
            else {
              router.refresh();
              if (onRefetch) {
                onRefetch();
              }
            }
          }}
        >
          {t("BTN")}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ClientError;
