import uniqueId from "lodash/uniqueId";
import { Skeleton as UISkeleton } from "@/components/ui/skeleton";

export function Skeleton() {
  return Array.from({ length: 5 }).map(() => (
    <UISkeleton key={uniqueId()} className="w-full p-7 h-7 mb-4" />
  ));
}
