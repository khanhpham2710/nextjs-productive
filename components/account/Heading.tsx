import { Card, CardDescription, CardHeader } from '../ui/card';
import { useTranslations } from 'next-intl';

function Heading() {
    const t = useTranslations("SETTINGS");

    return (
      <Card className="bg-background border-none shadow-none">
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("ACCOUNT.TITLE")}
          </h1>
          <CardDescription className="text-base">
            {t("ACCOUNT.DESC")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
}

export default Heading
