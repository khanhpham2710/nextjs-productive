// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEditor, BubbleMenu, EditorContent } from "@tiptap/react";
import { useAutosaveIndicator } from "@/context/AutosaveIndicator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
// import { FloatingContainer } from "./tools/FloatingContainer";
// import ToolsContainer from "./tools/ToolsContainer";
import Toolbar from "./tools/Toolbar";

const limit = 600;

interface Props {
  content?: JSON;
  taskId: string;
  workspaceId: string;
}

function EditorTasks({ content, taskId, workspaceId }: Props) {
    const t = useTranslations("TASK");
    const { onSetStatus, status } = useAutosaveIndicator();

    const editor = useEditor({
      editorProps: {
        handleDrop: () => {
          return false;
        },
        attributes: {
          class:
            "focus:outline-none prose prose-headings:text-secondary-foreground prose-p:text-secondary-foreground prose-strong:text-secondary-foreground prose-a:text-primary prose-a:no-underline prose-a:cursor-pointer   w-full focus-visible:outline-none rounded-md max-w-none  prose-code:text-secondary-foreground prose-code:bg-muted  prose-ol:text-secondary-foreground prose-ul:text-secondary-foreground prose-li:marker:text-secondary-foreground prose-li:marker:font-bold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl  prose-h5:text-xl prose-h6:text-lg prose-p:text-base prose-headings:line-clamp-1 prose-headings:mt-0 prose-p:my-2",
        },
      },
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      onUpdate: () => {
        if (status !== "unsaved") onSetStatus("unsaved");
        debouncedEditor();
      },
      extensions: [
        StarterKit.configure({
          dropcursor: {
            class: "text-primary",
          },
        }),
        Underline,
        Link,
        Color,
        TextStyle,
        Image,
        CharacterCount.configure({
          limit,
        }),
        Placeholder.configure({
          emptyNodeClass: "before:text-muted-foreground",
          placeholder: t("EDITOR.PLACEHOLDER"),
        }),
      ],
      content: content ? content : ``,
    });
  
    const { mutate: updateTaskContent } = useMutation({
      mutationFn: async (content: JSON) => {
        await axios.post(`/api/task/update/content`, {
          workspaceId,
          content,
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
  
    const debouncedEditor = useDebouncedCallback(() => {
      onSetStatus("pending");
      const json = editor?.state.doc.toJSON() as JSON;
      updateTaskContent(json);
    }, 3000);

    return (
      <div>
        {editor && <Toolbar editor={editor} />}
        {/* {editor && (
          <>
            <FloatingContainer editor={editor} />
            <BubbleMenu
              editor={editor}
              tippyOptions={{ zIndex: 20, maxWidth: 10000 }}
              className="bg-transparent"
            >
              <ToolsContainer editor={editor} />
            </BubbleMenu>
          </>
        )} */}
        <EditorContent spellCheck={false} editor={editor} />
        {editor && (
          <div className="flex flex-col items-end mt-10">
            <p>
              {t("EDITOR.WORDS")} {editor.storage.characterCount.words()}
            </p>
            <p>
              {editor.storage.characterCount.characters()}/{limit}{" "}
              {t("EDITOR.CHARS")}
            </p>
          </div>
        )}
      </div>
    );
}

export default EditorTasks
