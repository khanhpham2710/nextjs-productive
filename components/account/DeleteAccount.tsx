"use client"

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Warning from "../ui/warning";
import { LoadingState } from "../ui/loadingState";
import { signOut } from "@/lib/auth";
import {
  deleteAccountSchema,
  DeleteAccountSchema,
} from "@/schema/deleteAccountSchema";
import { useMutation } from "@tanstack/react-query";

interface Props {
  userEmail: string;
}

function DeleteAccount({ userEmail }: Props) {
  const t = useTranslations("SETTINGS.ACCOUNT");
  const { toast } = useToast();
  const m = useTranslations("MESSAGES");
  const lang = useLocale();

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: deleteProfile, isPending } = useMutation({
    mutationFn: async (formData: DeleteAccountSchema) => {
      const { data } = (await axios.post(
        "/api/profile/delete",
        formData
      )) as AxiosResponse<DeleteAccountSchema>;

      return data;
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      toast({
        title: m("SUCCESS.DELETED_INFO"),
      });

      signOut({
        redirectTo: `${window.location.origin}/${lang}`,
      });
    },
    mutationKey: ["deleteProfile"],
  });

  const onSubmit = (data: DeleteAccountSchema) => {
    if (data.email == userEmail) {
      deleteProfile(data);
    } else {
      toast({
        title: t("WRONG_CONFIRM_EMAIL"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-background border-none shadow-none max-w-2xl">
      <CardHeader>
        <CardTitle>{t("DELETE_TITLE")}</CardTitle>
        <CardDescription>{t("DELETE_DESC")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 sm:pt-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-sm"
          >
            <div className="space-y-2 sm:space-y-4 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-muted-foreground uppercase text-xs">
                      {t("DELETE_LABEL")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("DELETE_PLACEHOLDER")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={!form.formState.isValid}
                  type="button"
                  variant={"destructive"}
                  className=""
                >
                  {t("DELETE_BTN")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">
                    {t("DIALOG.TITLE")}
                  </DialogTitle>
                  <DialogDescription>{t("DIALOG.DESC")}</DialogDescription>
                </DialogHeader>
                <Warning>
                  <p>{t("DIALOG.WARNING")}</p>
                </Warning>
                <Button
                  disabled={isPending}
                  onClick={form.handleSubmit(onSubmit)}
                  size={"lg"}
                  variant={"destructive"}
                >
                  {isPending ? (
                    <LoadingState loadingText={t("DIALOG.PENDING_BTN")} />
                  ) : (
                    t("DIALOG.BUTTON")
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default DeleteAccount;
