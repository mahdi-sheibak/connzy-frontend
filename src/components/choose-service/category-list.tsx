import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChooseServiceSkeleton } from "@/components/choose-service/skeleton";
import { getCategoryListAction } from "@/actions/category.action";

export function CategoryList() {
  const [, setCategory] = useQueryState("category");

  const { data: categoryList, isLoading } = useQuery({
    queryKey: ["category", "list"],
    queryFn: () => getCategoryListAction(),
  });

  return (
    <div className="grid gap-4 h-full">
      <h2>Choose your Category</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ChooseServiceSkeleton />}
        {categoryList?.data.map((category) => (
          <Button
            key={category._id}
            variant="secondary"
            className="w-full p-7 group mb-4"
            onClick={() => setCategory(category._id)}
          >
            <h3>{category.name}</h3>
            <ChevronRightIcon className="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all" />
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
