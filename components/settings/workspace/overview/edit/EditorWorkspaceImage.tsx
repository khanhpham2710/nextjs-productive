"use client";

import React, { useMemo, useRef, useState } from "react";
import { Props } from "./EditWorkspaceCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { workspacePicture, WorkspacePicture } from "@/schema/workspaceSchema";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadThing";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { LoadingState } from "@/components/ui/loadingState";
import { Check, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { imageSchema } from "@/schema/imageSchema";
import { CustomColors } from "@prisma/client";

function EditorWorkspaceImage({
  workspace: { id, color, image, name },
}: Props) {
  const t = useTranslations("EDIT_WORKSPACE.PICTURE");
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const form = useForm<WorkspacePicture>({
    resolver: zodResolver(workspacePicture),
  });

  const workspaceColor = useMemo(() => {
    switch (color) {
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
  }, [color]);

  const imageOptions = useMemo(() => {
    if (!imagePreview && image) {
      return {
        canDelete: true,
        canSave: false,
      };
    } else if (imagePreview && image) {
      return {
        canDelete: false,
        canSave: true,
      };
    } else if (imagePreview && !image) {
      return {
        canDelete: false,
        canSave: true,
      };
    } else {
      return {
        canDelete: false,
        canSave: false,
      };
    }
  }, [imagePreview, image]);

  const { toast } = useToast();
  const m = useTranslations("MESSAGES");
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast({
        title: m("ERRORS.WORKSPACE_ICON_ADDED"),
        variant: "destructive",
      });
    },
    onClientUploadComplete: (data) => {
      if (data) updateWorkspacePicture(data[0].url);
      else {
        toast({
          title: m("ERRORS.WORKSPACE_ICON_ADDED"),
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: updateWorkspacePicture, isPending } = useMutation({
    mutationFn: async (picture: string) => {
      const { data: result } = await axios.post(`/api/workspace/edit/picture`, {
        id,
        picture,
      });
      return result;
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
        title: m("SUCCESS.WORKSPACE_PICTURE_UPDATED"),
      });
      router.refresh();
    },
    mutationKey: ["changeWorkspacePicture"],
  });

  const { mutate: deleteWorkspacePicture, isPending: isDeleting } = useMutation(
    {
      mutationFn: async () => {
        await axios.post(`/api/workspace/delete/picture`, { id });
      },
      onError: (err: AxiosError) => {
        const error = err?.response?.data
          ? err.response.data
          : "ERRORS.DEFAULT";
        toast({
          title: m(error),
          variant: "destructive",
        });
      },
      onSuccess: async () => {
        toast({
          title: m("SUCCESS.WORKSPACE_PICTURE_DELETED"),
        });
        router.refresh();
      },
      mutationKey: ["deleteWorkspacePicture"],
    }
  );

  const onSubmit = async (data: WorkspacePicture) => {
    const image: File = data.file;
    await startUpload([image]);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const result = imageSchema.safeParse({ image: selectedFile });
      if (result.success) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        form.clearErrors("file");
        form.setValue("file", selectedFile);
      } else {
        const errors = result.error.flatten().fieldErrors.image;
        errors?.forEach((error) => form.setError("file", { message: error }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col space-y-1.5 justify-start">
        <Label className="text-muted-foreground">{t("LABEL")}</Label>
        <DialogTrigger asChild>
          <Button
            className={cn(
              `w-16 h-16 text-white font-bold ${!image && workspaceColor}`
            )}
            variant={image ? "ghost" : "default"}
            size={"icon"}
            onClick={() => {
              form.clearErrors("file");
              setImagePreview("");
            }}
          >
            {image ? (
              <Image
                src={image}
                width={450}
                height={450}
                alt="workspace image"
                className="w-16 h-16 rounded-md object-cover"
              />
            ) : (
              name[0].toUpperCase()
            )}
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[28rem] flex flex-col justify-center items-center p-8">
        <DialogHeader className="items-center justify-center">
          <DialogTitle>{t("TITLE")}</DialogTitle>
        </DialogHeader>
        <div
          className={`w-32 h-32 sm:w-40 sm:h-40 text-4xl text-white font-bold rounded-lg flex justify-center items-center my-5 ${
            !imagePreview && !image && workspaceColor
          } pointer-events-none`}
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              width={450}
              height={450}
              alt="workspace image"
              className="sm:w-40 sm:h-40 w-32 h-32 rounded-md object-cover"
            />
          ) : image ? (
            <Image
              src={image}
              width={450}
              height={450}
              alt="workspace image"
              className="sm:w-40 sm:h-40 w-32 h-32 rounded-md object-cover"
            />
          ) : (
            <p>{name[0].toUpperCase()}</p>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                        type="button"
                        className="dark:text-white mb-1"
                      >
                        Choose a file
                      </Button>
                      <Input
                        {...field}
                        ref={inputRef}
                        value={undefined}
                        onChange={onImageChange}
                        type="file"
                        id="image"
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <div className="mt-5 w-full flex justify-center items-center gap-4">
              <Button
                className={`rounded-full w-12 h-12 p-2 ${
                  imageOptions.canDelete
                    ? "text-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => {
                  deleteWorkspacePicture();
                }}
                type="button"
                disabled={!imageOptions.canDelete || isDeleting}
                variant={imageOptions.canDelete ? "default" : "secondary"}
              >
                {isDeleting ? <LoadingState /> : <Trash size={18} />}
              </Button>
              <Button
                type="submit"
                className={`rounded-full w-12 h-12 p-2 ${
                  imageOptions.canSave ? "text-white" : "text-muted-foreground"
                }`}
                disabled={!imageOptions.canSave || isUploading || isPending}
                variant={imageOptions.canSave ? "default" : "secondary"}
              >
                {isUploading || isPending ? (
                  <LoadingState />
                ) : (
                  <Check size={18} />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditorWorkspaceImage;
