import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

export function formatPace(secondsPerPage: number) {
  const minutes = Math.floor(secondsPerPage / 60);
  const seconds = Math.round(secondsPerPage % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")} / page`;
}

export function percent(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.min(100, Math.round((value / total) * 100));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}
