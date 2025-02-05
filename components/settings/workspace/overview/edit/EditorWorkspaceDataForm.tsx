"use client";

import { Props } from "./EditWorkspaceCard";
import { useForm } from "react-hook-form";
import { workspaceEditData, WorkspaceEditData } from "@/schema/workspaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomColors } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Warning from "@/components/ui/warning";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loadingState";
import { colors } from "@/lib/getRandomWorkspaceColor";

function EditorWorkspaceDataForm({ workspace: { id, color, name } }: Props) {
  const t = useTranslations("EDIT_WORKSPACE.DATA");

  const form = useForm<WorkspaceEditData>({
    resolver: zodResolver(workspaceEditData),
    defaultValues: {
      workspaceName: name,
      color,
    },
  });

  const workspaceColor = (providedColor: CustomColors) => {
    switch (providedColor) {
      case CustomColors.BLUE:
        return "bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500";
      case CustomColors.EMERALD:
        return "bg-emerald-600 hover:bg-emerald-500 border-emerald-600 hover:border-emerald-500";
      case CustomColors.LIME:
        return "bg-lime-600 hover:bg-lime-500 border-lime-600 hover:border-lime-500";
      case CustomColors.ORANGE:
        return "bg-orange-600 hover:bg-orange-500 border-orange-600 hover:border-orange-500";
      case CustomColors.PINK:
        return "bg-pink-600 hover:bg-pink-500 border-pink-600 hover:border-pink-500";
      case CustomColors.YELLOW:
        return "bg-yellow-600 hover:bg-yellow-500 border-yellow-600 hover:border-yellow-500";
      case CustomColors.RED:
        return "bg-red-600 hover:bg-red-500 border-red-600 hover:border-red-500";
      case CustomColors.PURPLE:
        return "bg-purple-600 hover:bg-purple-500 border-purple-600 hover:border-purple-500";
      case CustomColors.GREEN:
        return "bg-green-600 hover:bg-green-500 border-green-600 hover:border-green-500";
      case CustomColors.CYAN:
        return "bg-cyan-600 hover:bg-cyan-500 border-cyan-600 hover:border-cyan-500";
      case CustomColors.INDIGO:
        return "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 hover:border-indigo-500";
      case CustomColors.FUCHSIA:
        return "bg-fuchsia-600 hover:bg-fuchsia-500 border-fuchsia-600 hover:border-fuchsia-500";
      default:
        return "bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500";
    }
  };

  const { toast } = useToast();
  const m = useTranslations("MESSAGES");
  const router = useRouter();

  const { mutate: editWorkspaceData, isPending } = useMutation({
    mutationFn: async (data: WorkspaceEditData) => {
      const { data : newData } = await axios.post(`/api/workspace/edit/data`, {
        ...data,
        id,
      }) as AxiosResponse<WorkspaceEditData>;

      return newData
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";
      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: async (data) => {
      toast({
        title: m("SUCCESS.UPDATED_WORKSPACE"),
      });

      router.refresh();
      form.reset({
        workspaceName: data.workspaceName,
        color: data.color
      });
    },
    mutationKey: ["editWorkspaceData"],
  });

  const onSubmit = async (data: WorkspaceEditData) => {
    editWorkspaceData(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md mt-0 sm:mt-0 space-y-8"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    {t("INPUTS.NAME")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-muted"
                      placeholder={t("PLACEHOLDERS.NAME")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-muted-foreground">
                    {t("INPUTS.COLOR")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2 md:gap-3"
                    >
                      {colors.map((color) => (
                        <FormItem
                          key={color}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={color}
                              useCheckIcon
                              className={`transition-colors duration-200 ${workspaceColor(
                                color
                              )}`}
                            ></RadioGroupItem>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Warning blue>
          <p>{t("INFO")}</p>
        </Warning>
        <Button
          disabled={isPending}
          type="submit"
          className="mt-10 w-full dark:text-black font-semibold"
        >
          {isPending ? (
            <LoadingState loadingText={t("BTN_PENDING")} />
          ) : (
            t("BTN")
          )}
        </Button>
      </form>
    </Form>
  );
}

export default EditorWorkspaceDataForm;
