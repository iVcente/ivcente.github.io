import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
    try {
        return format(parseISO(dateStr), "d MMMM yyyy");
    } catch {
        return dateStr;
    }
}
