import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { USER_TYPE } from "@/enum";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoryListAction,
  getServiceListAction,
  getSubCategoryListAction,
} from "@/actions/exprt-service";
import { Category, Service, SubCategory } from "@/types";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MotionButton = motion(Button);

interface ChooseServiceProps {
  userType: USER_TYPE;
}

export function ChooseServiceDialog({ userType }: ChooseServiceProps) {
  const [open, setOpen] = useState(false);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );

  const [category, setCategory] = useQueryState("category");
  const [subCategory, setSubCategory] = useQueryState("sub-category");

  const onChooseService = (serviceId: string) => {
    selectedServices.has(serviceId)
      ? selectedServices.delete(serviceId)
      : selectedServices.add(serviceId);
    setSelectedServices(new Set(selectedServices));
  };

  const handleBack = () => {
    if (subCategory) return setSubCategory(null);
    if (category) return setCategory(null);
    return setOpen(false);
  };

  const handleSubmit = () => {
    console.log({ selectedServices });
    setOpen(false);
    setCategory(null);
    setSubCategory(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        if (newOpenState === false) {
          setOpen(false);
          setCategory(null);
          setSubCategory(null);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <div>
          <AnimatePresence>
            {userType === USER_TYPE.EXPERT && (
              <MotionButton
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, transition: { type: "tween" } }}
                transition={{ type: "spring" }}
                type="button"
              >
                Choose service
              </MotionButton>
            )}
          </AnimatePresence>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Service</DialogTitle>
          <DialogDescription>Choose your services</DialogDescription>
          <div>
            <Button className={"flex items-center group"} onClick={handleBack}>
              <ChevronLeftIcon className="w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:mr-1 transition-all" />
              <span>Back</span>
            </Button>
          </div>
        </DialogHeader>
        <ChooseServiceView
          subCategory={subCategory}
          category={category}
          onChooseService={onChooseService}
          selectedServices={selectedServices}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChooseServiceView({
  subCategory,
  category,
  onChooseService,
  selectedServices,
}: {
  subCategory: string | null;
  category: string | null;
  onChooseService: (serviceId: string) => void;
  selectedServices: Set<string>;
}) {
  if (subCategory)
    return (
      <ServiceList
        subCategory={subCategory}
        selectedServices={selectedServices}
        onChooseService={onChooseService}
      />
    );

  if (category) return <SubCategoryList category={category} />;

  return <CategoryList />;
}

function ListSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="w-full p-7 h-7 mb-4" />
  ));
}

function CategoryList() {
  const [_, setCategory] = useQueryState("category");

  const { data: categoryList, isLoading } = useQuery<{ data: Category[] }>({
    queryKey: ["category", "list"],
    queryFn: () => getCategoryListAction(),
  });

  return (
    <div className="grid gap-4 py-4 h-full">
      <h2>Choose your Category</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ListSkeleton />}
        {categoryList?.data?.map((category) => (
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

function SubCategoryList({ category }: { category: string }) {
  const [_, setSubCategory] = useQueryState("sub-category");

  const { data: subCategoryList, isLoading } = useQuery<{
    data: SubCategory[];
  }>({
    queryKey: ["sub-category", "list", category],
    queryFn: () => getSubCategoryListAction(category),
  });

  return (
    <div className="grid gap-4 py-4 h-full">
      <h2>Choose your Sub Category</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ListSkeleton />}
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

function ServiceList({
  subCategory,
  selectedServices,
  onChooseService,
}: {
  subCategory: string;
  selectedServices: Set<string>;
  onChooseService: (serviceId: string) => void;
}) {
  const { data: serviceList, isLoading } = useQuery<{ data: Service[] }>({
    queryKey: ["service", "list", subCategory],
    queryFn: () => getServiceListAction(subCategory),
  });

  return (
    <div className="grid gap-4 py-4 h-full">
      <h2>Choose your Service</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ListSkeleton />}
        {Boolean(!isLoading && !serviceList?.data?.length) && (
          <h1 className="text-center">without any service</h1>
        )}
        {serviceList?.data?.map((service) => (
          <Button
            key={service._id}
            variant="secondary"
            className={cn("flex justify-around w-full p-7 mb-4", {
              "bg-slate-900": selectedServices.has(service._id),
            })}
            onClick={() => onChooseService(service._id)}
          >
            {selectedServices.has(service._id) && <CheckIcon />}
            <h3 className="grow">{service.name}</h3>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
