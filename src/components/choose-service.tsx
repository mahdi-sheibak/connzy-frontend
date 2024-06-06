import { motion, AnimatePresence } from "framer-motion";

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
import { getCategoryListAction } from "@/actions/exprt-service";
import { config } from "@/config";

const MotionButton = motion(Button);

interface ChooseServiceProps {
  userType: USER_TYPE;
}

export function ChooseService({ userType }: ChooseServiceProps) {
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoryListAction,
  });

  // async function getDD() {
  //   const res = await fetch(
  //     `${config.apiBaseUrl}/categories?s={"name":-1}`
  //   ).then((r) => r.json());
  //   console.log({ res });
  // }
  // getDD();

  console.log({ data });

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      <DialogContent
      // className="sm:max-w-[425px]"
      // className="sm:max-w-[700px]"
      // style={{ height: "300px" }}
      >
        <DialogHeader>
          <DialogTitle>Choose Service</DialogTitle>
          <DialogDescription>Choose your services</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">content</div>
        <DialogFooter>
          <Button type="submit">Choose</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
