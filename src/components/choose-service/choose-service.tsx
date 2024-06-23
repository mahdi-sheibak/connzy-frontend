"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryState } from "nuqs";
import { ChevronLeftIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { SelectableServiceList } from "@/components/choose-service/components/selectable-service-list";
import { getServiceListByIdsAction } from "@/actions/service.action";

interface Props {
  title: string;
  description: string;
  trigger: React.ReactNode;
  footer: React.ReactNode;
  length: number;
  onChange: (selectedServices: string[]) => void;
}

export function ChooseService({
  title,
  description,
  trigger,
  onChange,
  footer,
  length,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );

  const selectedServicesQueryKey = [
    "selected-services",
    ...[...selectedServices],
  ];
  const selectedServicesQuery = useQuery({
    queryKey: selectedServicesQueryKey,
    queryFn: () => getServiceListByIdsAction([...selectedServices]),
    placeholderData: (prev) => prev,
  });
  const selectedServicesData = selectedServicesQuery.data;

  const [category, setCategory] = useQueryState("category");
  const [subCategory, setSubCategory] = useQueryState("sub-category");

  const handleBack = () => {
    if (subCategory) return setSubCategory(null);
    if (category) return setCategory(null);
    setOpen(false);
  };

  const closeDialog = async () => {
    setOpen(false);
    await setCategory(null);
    await setSubCategory(null);
  };

  const handleSubmit = async () => {
    await closeDialog();
  };

  const onChooseService = async (serviceId: string) => {
    selectedServices.has(serviceId)
      ? selectedServices.delete(serviceId)
      : selectedServices.add(serviceId);
    setSelectedServices(new Set(selectedServices));
    const selectedServicesList = [...selectedServices];
    onChange(selectedServicesList);
    selectedServicesList.length === length && (await closeDialog());
  };

  return (
    <Dialog
      open={open}
      onOpenChange={async (newOpenState) => {
        if (!newOpenState) {
          await closeDialog();
        }
        setSelectedServices(new Set());
      }}
    >
      <DialogTrigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div>
            <Button
              className={"flex items-center group mt-1"}
              onClick={handleBack}
            >
              <ChevronLeftIcon className="w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:mr-1 transition-all" />
              <span>Back</span>
            </Button>
          </div>
          {Boolean(selectedServices.size) && (
            <div className="pt-2 flex flex-wrap">
              <AnimatePresence>
                {selectedServicesData?.data.map((serviceData) => (
                  <motion.span
                    className="mx-1"
                    key={serviceData._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Badge>{serviceData.name}</Badge>
                  </motion.span>
                ))}
              </AnimatePresence>
              {selectedServicesQuery.isFetching && (
                <span>
                  <Loader2Icon className="mt-2 ml-2 h-4 w-4 animate-spin" />
                </span>
              )}
            </div>
          )}
        </DialogHeader>
        <SelectableServiceList
          subCategory={subCategory}
          category={category}
          onChooseService={onChooseService}
          selectedServices={selectedServices}
        />
        <DialogFooter>
          {footer ?? (
            <Button type="submit" onClick={handleSubmit}>
              Choose
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
