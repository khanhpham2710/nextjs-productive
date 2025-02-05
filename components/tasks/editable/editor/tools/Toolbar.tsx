import { Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import {
  Bold,
  Code,
  Eraser,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Undo2,
} from "lucide-react";
import { OptionBtn } from "./btn/OptionBtn";
import { Separator } from "@/components/ui/separator";
import AddLink from "./AddLink";
import { AddImage } from "./addImage/AddImage";

type Props = {
  editor: Editor;
};

function Toolbar({ editor }: Props) {
  const t = useTranslations("TASK.EDITOR.HOVER");

  return (
    <div className="flex items-center border rounded-md shadow-sm bg-popover p-1 text-popover-foreground gap-1 w-auto flex-wrap">
      <OptionBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("UL")}
      >
        {" "}
        <List />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("OL")}
      >
        {" "}
        <ListOrdered />
      </OptionBtn>

      <Separator className="h-6" orientation="vertical" />
      <OptionBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "bg-accent text-secondary-foreground" : ""
        }
        hoverText={t("BOLD")}
      >
        {" "}
        <Bold size={16} />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "bg-accent text-secondary-foreground" : ""
        }
        hoverText={t("ITALIC")}
      >
        <Italic size={16} />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "bg-accent text-secondary-foreground" : ""
        }
        hoverText={t("STRIKETHROUGH")}
      >
        <Strikethrough size={16} />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("UNDERLINE")}
      >
        <UnderlineIcon size={16} />
      </OptionBtn>

      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H1")}
      >
        {" "}
        <Heading1 />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H2")}
      >
        {" "}
        <Heading2 />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H3")}
      >
        {" "}
        <Heading3 />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={
          editor.isActive("heading", { level: 4 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H4")}
      >
        {" "}
        <Heading4 />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={
          editor.isActive("heading", { level: 5 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H5")}
      >
        {" "}
        <Heading5 />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={
          editor.isActive("heading", { level: 6 })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("H6")}
      >
        {" "}
        <Heading6 />
      </OptionBtn>
      <Separator className="h-6" orientation="vertical" />
      <OptionBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("UL")}
      >
        {" "}
        <List />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("OL")}
      >
        {" "}
        <ListOrdered />
      </OptionBtn>
      <Separator className="h-6" orientation="vertical" />
      <AddImage editor={editor} />
      <Separator className="h-6" orientation="vertical" />

      <OptionBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={
          editor.isActive("code") ? "bg-accent text-secondary-foreground" : ""
        }
        hoverText={t("CODE")}
      >
        <Code size={16} />
      </OptionBtn>

      <Separator className="h-6" orientation="vertical" />
      <AddLink editor={editor} />
      <Separator className="h-6" orientation="vertical" />

      <OptionBtn
        onClick={() => editor.chain().focus().setColor("#8b5cf6").run()}
        className={
          editor.isActive("textStyle", { color: "#8b5cf6" })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        data-testid="setPurple"
        hoverText={t("COLOR")}
      >
        <span className="w-4 h-4 rounded-full bg-violet-500"></span>
      </OptionBtn>

      <OptionBtn
        onClick={() => editor.chain().focus().setColor("#f59e0b").run()}
        className={
          editor.isActive("textStyle", { color: "#f59e0b" })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        data-testid="setOrange"
        hoverText={t("COLOR")}
      >
        <span className="w-4 h-4 rounded-full bg-amber-500"></span>
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().setColor("#10b981").run()}
        className={
          editor.isActive("textStyle", { color: "#10b981" })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("COLOR")}
        data-testid="setGreen"
      >
        <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().setColor("#38bdf8").run()}
        className={
          editor.isActive("textStyle", { color: "#38bdf8" })
            ? "bg-accent text-secondary-foreground"
            : ""
        }
        hoverText={t("COLOR")}
        data-testid="setBlue"
      >
        <span className="w-4 h-4 rounded-full bg-sky-500"></span>
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.chain().focus().unsetColor().run()}
        data-testid="unsetColor"
        hoverText={t("COLOR_DEFAULT")}
      >
        <span className="w-4 h-4 rounded-full bg-secondary-foreground"></span>
      </OptionBtn>
      <Separator className="h-6" orientation="vertical" />
      <OptionBtn onClick={() => editor.commands.undo()} hoverText={t("UNDO")}>
        <Undo2 size={16} />
      </OptionBtn>
      <OptionBtn onClick={() => editor.commands.redo()} hoverText={t("REDO")}>
        <Redo2 size={16} />
      </OptionBtn>
      <OptionBtn
        onClick={() => editor.commands.deleteSelection()}
        hoverText={t("DELETE")}
      >
        <Eraser size={16} />
      </OptionBtn>
    </div>
  );
}

export default Toolbar;
