import UploadFile from "@/components/onboarding/common/UploadFile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingState } from "@/components/ui/loadingState";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadThing";
import { imageLinkSchema, ImageLinkSchema } from "@/schema/linkSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

interface Props {
  onAddImage: (link: string) => void;
}

function AddImageByImport({ onAddImage }: Props) {
  const t = useTranslations("TASK.EDITOR.IMAGE.UPLOAD_TAB");
  const m = useTranslations("MESSAGES");

  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast({
        title: m("ERRORS.IMAGE_TO_EDITOR"),
        variant: "destructive",
      });
    },
    onClientUploadComplete: (data) => {
      if (!data)
        toast({
          title: m("ERRORS.IMAGE_PROFILE_UPDATE"),
          variant: "destructive",
        });
      else {
        onAddImage(data[0].url);
      }
    },
  });

  const form = useForm<ImageLinkSchema>({
    resolver: zodResolver(imageLinkSchema),
  });

  const addImageByImportHandler = async (data: ImageLinkSchema) => {
    const image: File = data.file;
    await startUpload([image]);
  };

  return (
    <Form {...form}>
      <form>
        <UploadFile
          ContainerClassName="w-full"
          LabelClassName="text-muted-foreground mb-1.5 self-start"
          typesDescription={t("TYPES")}
          form={form}
          schema={imageLinkSchema}
          inputAccept="image/*"
        />
        <div className="flex justify-end w-full items-center gap-2">
          <Button
            disabled={isUploading}
            className="text-white"
            onClick={() => {
              form.handleSubmit(addImageByImportHandler)();
            }}
          >
            {isUploading ? (
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

export default AddImageByImport;
