import { useHotkeys } from "react-hotkeys-hook";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { USER_TYPE } from "@/enum";

interface ChooseProfileTypeProps {
  userType: USER_TYPE;
  onChange: (userType: USER_TYPE) => void;
}

export function ChooseProfileType({
  userType,
  onChange,
}: ChooseProfileTypeProps) {
  const onSelectCustomerType = () => onChange(USER_TYPE.CUSTOMER);
  const onSelectExpertType = () => onChange(USER_TYPE.EXPERT);

  useHotkeys("c", onSelectCustomerType);
  useHotkeys("e", onSelectExpertType);

  return (
    <main className="flex flex-wrap justify-center items-start mt-5">
      <Card
        onClick={onSelectCustomerType}
        className={cn(
          "sm:w-[350px] w-[90%] cursor-pointer hover:bg-slate-900 mt-2 mx-2",
          {
            "bg-slate-900": userType === USER_TYPE.CUSTOMER,
          }
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer</CardTitle>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              C
            </kbd>
          </div>
          <CardDescription>Continue and create a Customer user</CardDescription>
        </CardHeader>
      </Card>

      <Card
        onClick={onSelectExpertType}
        className={cn(
          "sm:w-[350px] w-[90%] cursor-pointer hover:bg-slate-900 mt-2 mx-2",
          {
            "bg-slate-900": userType === USER_TYPE.EXPERT,
          }
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Expert</CardTitle>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              E
            </kbd>
          </div>
          <CardDescription>Continue and create a Expert user</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
