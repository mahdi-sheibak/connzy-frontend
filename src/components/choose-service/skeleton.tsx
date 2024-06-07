import uniqueId from "lodash/uniqueId";
import { Skeleton } from "@/components/ui/skeleton";

export function ChooseServiceSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={uniqueId()} className="w-full p-7 h-7 mb-4" />
  ));
}
