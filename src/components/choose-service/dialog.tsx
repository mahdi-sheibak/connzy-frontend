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
import { USER_TYPE } from "@/enum";
import { ChooseView } from "@/components/choose-service/choose-view";
import { Badge } from "@/components/ui/badge";
import { getServiceListByIdsAction } from "@/actions/service.action";

const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

interface ChooseServiceDialogProps {
  userType: USER_TYPE;
}

export function ChooseServiceDialog({ userType }: ChooseServiceDialogProps) {
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
      <AnimatePresence>
        {userType === USER_TYPE.EXPERT && (
          <DialogTrigger asChild onClick={() => setOpen(true)}>
            <MotionButton
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { type: "tween" } }}
              transition={{ type: "spring" }}
              type="button"
              variant="secondary"
            >
              Choose service
            </MotionButton>
          </DialogTrigger>
        )}
      </AnimatePresence>
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
          {Boolean(selectedServices.size) && (
            <div className="pt-2 flex flex-wrap">
              <AnimatePresence>
                {selectedServicesData?.data?.map((serviceData) => (
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
        <ChooseView
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
