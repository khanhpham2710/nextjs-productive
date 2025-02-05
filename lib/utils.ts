import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { ExtendedMessage } from "@/types/extended";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pathsToSoundEffects = {
  ANALOG: "/music/analog.mp3",
  BELL: "/music/bell.mp3",
  BIRD: "/music/bird.mp3",
  CHURCH_BELL: "/music/churchBell.mp3",
  DIGITAL: "/music/digital.mp3",
  FANCY: "/music/fancy.mp3",
} as const;

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDay = dayjs(new Date(year, month, 1));

  const firstDayOfMonth = firstDay.day();
  let currentMonthCount = 1 - firstDayOfMonth;

  const daysMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  const lastWeek = daysMatrix[5];
  const temp = month % 12;

  if (lastWeek[0].get("month") != temp) {
    daysMatrix.pop();
  }

  if (firstDayOfMonth === 0) {
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    const lastDayOfPreviousMonth = dayjs(
      new Date(year, previousMonth + 1, 0)
    ).date();

    const newRow = [];
    for (let i = 0; i < 7; i++) {
      const day = lastDayOfPreviousMonth - i + 1;
      newRow.unshift(dayjs(new Date(previousYear, previousMonth, day)));
    }

    daysMatrix.unshift(newRow);
  }

  return daysMatrix;
};

export const scrollToHash = (elementId: string) => {
  const element = document.getElementById(elementId);
  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
};


export const showUserInformation = (
  messages: ExtendedMessage[],
  messageId: string
) => {
  const currentIndex = messages.findIndex(
    (message) => message.id === messageId
  );

  if (currentIndex !== -1 && currentIndex > 0) {
    const prevMessage = messages[currentIndex - 1];
    const currentMessage = messages[currentIndex];

    const sameSender = prevMessage.sender.id === currentMessage.sender.id;
    if (!sameSender) return true;

    if (prevMessage.additionalResources.length > 0) return true;

    const prevMessageCreationTime = dayjs(prevMessage.createdAt);
    const currentMessageCreationTime = dayjs(currentMessage.createdAt);
    const timeDifference = currentMessageCreationTime.diff(
      prevMessageCreationTime,
      "seconds"
    );
    return timeDifference > 60;
  } else {
    return true;
  }
};