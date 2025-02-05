"use client"

import { Card, CardContent } from "@/components/ui/card";
import { taskSchema, TaskSchema } from "@/schema/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import Emoji from "./Emoji";
import TextareaAutosize from "react-textarea-autosize";
import TaskCalendar from "./TaskCalendar";
import TagSelector from "@/components/common/tag/TagSelector";
import { useAutosaveIndicator } from "@/context/AutosaveIndicator";
import { useTags } from "@/hooks/useTag";
import LinkTag from "../tag/LinkTag";
import EditorTasks from "../editor/EditorTasks";

interface Props {
  workspaceId: string;
  initialActiveTags: Tag[];
  taskId: string;
  title?: string;
  content?: JSON;
  emoji?: string;
  from?: Date;
  to?: Date;
}

function TaskContainer({
  workspaceId,
  initialActiveTags,
  taskId,
  title,
  content,
  emoji,
  from,
  to,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("TASK");
  const [taskDate] = useState({ from, to });

  const { status, onSetStatus } = useAutosaveIndicator();

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      icon: emoji,
      title: title ? title : "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { ref: titleRef, ...rest } = form.register("title");

  const onFormSelectHandler = (emoji: string) => {
    form.setValue("icon", emoji);
  };

  const onUpdateFormHandler = (date: DateRange | undefined) => {
    form.setValue("date", date);
  };

  const { mutate: updateTaskTitle } = useMutation({
    mutationFn: async (title: string) => {
      await axios.post("/api/task/update/title", {
        workspaceId,
        title,
        taskId,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
    },
    onError: () => {
      onSetStatus("unsaved");
    },
  });

  const { mutate: updateTaskActiveTags } = useMutation({
    mutationFn: async (tagIds: string[]) => {
      await axios.post("/api/task/update/active_tags", {
        workspaceId,
        tagsIds: tagIds,
        taskId,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
    },
    onError: () => {
      onSetStatus("unsaved");
    },
  });

  const debouncedTitle = useDebouncedCallback(
    useCallback(
      (value: string) => {
        onSetStatus("pending");
        updateTaskTitle(value);
      },
      [onSetStatus, updateTaskTitle]
    ),
    2000
  );

  const debouncedCurrentActiveTags = useDebouncedCallback(() => {
    onSetStatus("pending");
    const tagsIds = currentActiveTags.map((tag) => tag.id);
    updateTaskActiveTags(tagsIds);
  }, 2000);

  const {
    currentActiveTags,
    tags,
    isError,
    isLoadingTags,
    onDeleteActiveTagHandler,
    onSelectActiveTagHandler,
    onUpdateActiveTagHandler,
  } = useTags(
    workspaceId,
    isMounted,
    initialActiveTags,
    debouncedCurrentActiveTags
  );

  return (
    <Card>
      <form id="task-form">
        <CardContent className="py-4 sm:py-6 flex flex-col gap-10">
          <div className="w-full flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
            <Emoji
              onFormSelect={onFormSelectHandler}
              emoji={form.getValues("icon")}
              taskId={taskId}
              workspaceId={workspaceId}
            />
            <div className="w-full flex flex-col gap-2">
              <TextareaAutosize
                {...rest}
                ref={(e) => {
                  titleRef(e);
                  _titleRef.current = e;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                onChange={(e) => {
                  if (status !== "unsaved") onSetStatus("unsaved");
                  debouncedTitle(e.target.value);
                }}
                placeholder={t("HEADER.PLACEHOLDER")}
                className="w-full resize-none appearance-none overflow-hidden bg-transparent placeholder:text-muted-foreground text-2xl font-semibold focus:outline-none"
              />
              <div className="w-full gap-1 flex flex-wrap flex-row">
                <TaskCalendar
                  onUpdateForm={onUpdateFormHandler}
                  workspaceId={workspaceId}
                  taskId={taskId}
                  from={taskDate.from}
                  to={taskDate.to}
                />
                <TagSelector
                  isError={isError}
                  isLoading={isLoadingTags}
                  tags={tags}
                  currentActiveTags={currentActiveTags}
                  onSelectActiveTag={onSelectActiveTagHandler}
                  workspaceId={workspaceId}
                  onUpdateActiveTags={onUpdateActiveTagHandler}
                  onDeleteActiveTag={onDeleteActiveTagHandler}
                />
                {currentActiveTags.map((tag) => (
                  <LinkTag key={tag.id} tag={tag} disabled />
                ))}
              </div>
            </div>
          </div>
          <EditorTasks
            workspaceId={workspaceId}
            taskId={taskId}
            content={content}
          />
        </CardContent>
      </form>
    </Card>
  );
}

export default TaskContainer;
