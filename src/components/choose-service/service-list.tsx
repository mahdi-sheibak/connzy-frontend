import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChooseServiceSkeleton } from "@/components/choose-service/skeleton";
import { getServiceListAction } from "@/actions/service.action";
import { cn } from "@/lib/utils";

interface ServiceListProps {
  subCategory: string;
  selectedServices: Set<string>;
  onChooseService: (serviceId: string) => void;
}

export function ServiceList({
  subCategory,
  selectedServices,
  onChooseService,
}: ServiceListProps) {
  const { data: serviceList, isLoading } = useQuery({
    queryKey: ["service", "list", subCategory],
    queryFn: () => getServiceListAction(subCategory),
  });

  return (
    <div className="grid gap-4 h-full">
      <h2>Choose your Service</h2>
      <ScrollArea className="h-[45vh]">
        {isLoading && <ChooseServiceSkeleton />}
        {Boolean(!isLoading && !serviceList?.data.length) && (
          <h1 className="text-center">without any service</h1>
        )}
        {serviceList?.data.map((service) => (
          <Button
            key={service._id}
            variant="secondary"
            className={cn("flex justify-around w-full p-7 mb-4", {
              "bg-slate-900": selectedServices.has(service._id),
            })}
            onClick={() => {
              onChooseService(service._id);
            }}
          >
            {selectedServices.has(service._id) && <CheckIcon />}
            <h3 className="grow">{service.name}</h3>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
