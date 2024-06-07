import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChooseServiceSkeleton } from "@/components/choose-service/skeleton";
import { getSubCategoryListAction } from "@/actions/sub-category.action";
import { SubCategory } from "@/types";

export function SubCategoryList({ category }: { category: string }) {
  const [_, setSubCategory] = useQueryState("sub-category");

  const { data: subCategoryList, isLoading } = useQuery<{
    data: SubCategory[];
  }>({
    queryKey: ["sub-category", "list", category],
    queryFn: () => getSubCategoryListAction(category),
  });

  return (
    <div className="grid gap-4 h-full">
      <h2>Choose your Sub Category</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ChooseServiceSkeleton />}
        {Boolean(!isLoading && !subCategoryList?.data?.length) && (
          <h1 className="text-center">without any sub category</h1>
        )}
        {subCategoryList?.data?.map((subCategory) => (
          <Button
            key={subCategory._id}
            variant="secondary"
            className="w-full p-7 group mb-4"
            onClick={() => setSubCategory(subCategory._id)}
          >
            <h3>{subCategory.name}</h3>
            <ChevronRightIcon className="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all" />
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
