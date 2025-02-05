import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loadingState";
import { linkSchema, LinkSchema } from "@/schema/linkSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    onAddImage: (link: string) => void;
  }

function AddImageByLink({ onAddImage }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations("TASK.EDITOR.IMAGE.LINK_TAB");
  
    const form = useForm<LinkSchema>({
      resolver: zodResolver(linkSchema),
      defaultValues: {
        link: "",
      },
    });
  
    const isImage = async (url: string) => {
      try {
        const data = await fetch(url, { method: "HEAD" });
        if (!data.ok) return false;
        console.log(data);
        const res = data.headers.get("Content-Type")?.startsWith("image");
        if (res) return true;
        return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        return false;
      }
    };
  
    const addImageByLinkHandler = async (data: LinkSchema) => {
      setIsLoading(true);
      try {
        const { link } = data;
        const isValidLink = await isImage(link);
        if (!isValidLink) {
          form.setError("link", {
            message: "ERRORS.WRONG_IMAGE_LINK",
          });
          setIsLoading(false);
          return;
        }
        onAddImage(link);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {}
    };
  
    return (
      <Form {...form}>
        <form className="space-y-6 my-6">
          <div className="space-y-1.5">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-muted h-7 py-1.5 text-sm"
                      placeholder={t("PLACEHOLDER")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end w-full items-center gap-2">
            <Button
              disabled={isLoading}
              className="text-white"
              onClick={() => {
                form.handleSubmit(addImageByLinkHandler)();
              }}
            >
              {isLoading ? (
                <LoadingState loadingText={t("BTN_PENDING")} />
              ) : (
                t("BTN_ADD")
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
}

export default AddImageByLink
