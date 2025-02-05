import changeCodeToEmoji from "@/lib/changeCodeToEmoji";
import { cn } from "@/lib/utils";

interface Props {
  selectedEmoji?: string;
  className?: string;
}

export default function ReadOnlyEmoji({ selectedEmoji, className }: Props) {
  return (
    <div
      className={cn(
        `w-16 h-16 rounded-lg bg-secondary flex justify-center items-center text-3xl px-3`,
        className
      )}
    >
      {changeCodeToEmoji(selectedEmoji ? selectedEmoji : "1f9e0")}
    </div>
  );
};