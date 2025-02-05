"use client";

import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

function NotFound() {
  const t = useTranslations("NOT_FOUND");

  return (
    <section className="bg-white dark:bg-gray-900 w-screen h-screen flex items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            {t("TITLE")}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {t("DESC")}
          </p>
          <p
            className={`${buttonVariants()} inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 gap-0.5`}
          >
            {t("BACK")} <Link href={"/dashboard"}> {t("HOME_PAGE")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
