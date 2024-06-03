"use client";
import { type ChangeEvent, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DevTool } from "@hookform/devtools";
import { animated } from "@react-spring/web";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { uploadImageAction } from "@/actions/upload-image";

const MotionButton = motion(Button);

const formSchema = z.object({
  fullName: z.string().min(1),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

enum USER_TYPE {
  CUSTOMER = "CUSTOMER",
  EXPERT = "EXPERT",
}

export default function ChooseProfilePage() {
  const [userType, setUserType] = useState<USER_TYPE>(USER_TYPE.CUSTOMER);

  const selectCustomerType = () => setUserType(USER_TYPE.CUSTOMER);
  const selectExpertType = () => setUserType(USER_TYPE.EXPERT);

  useHotkeys("c", selectCustomerType);
  useHotkeys("e", selectExpertType);

  const uploadImageMutation = useMutation({
    mutationFn: uploadImageAction,
    onMutate: (data) => {
      console.log("call with", data);
    },
    onSuccess: (response) => {
      console.log("success file upload", response);
    },
    onError: (error) => {
      console.log("error file upload", error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    uploadImageMutation.mutate(formData);
  };

  return (
    <section className="flex flex-col gap-5 px-3">
      <main className="flex flex-wrap justify-center items-start mt-5">
        <Card
          onClick={selectCustomerType}
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
            <CardDescription>
              Continue and create a Customer user
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          onClick={selectExpertType}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*  */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone-number">Phone Number</Label>
            <PhoneInput
              id="phone-number"
              placeholder="Phone Number"
              defaultCountry="TR"
              onChange={(phoneNumber) => {
                console.log("phoneNumber", phoneNumber);
              }}
            />
          </div>
          {/*  */}

          {/* <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="text-left">Phone Number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput placeholder="Enter a phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/*  */}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <div className="flex relative">
              <Input id="picture" type="file" onChange={onFileChange} />
              {uploadImageMutation.isPending && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Bio" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>

          <AnimatePresence>
            {userType === USER_TYPE.EXPERT && (
              <motion.div
                initial={{
                  margin: 0,
                  display: "grid",
                  gridTemplateRows: "0fr",
                  transitionProperty: "margin grid-template-rows",
                  transitionTimingFunction: "ease-out",
                  transitionDuration: "0.5s",
                }}
                animate={{
                  margin: "revert-layer",
                  gridTemplateRows: "1fr",
                }}
                exit={{
                  gridTemplateRows: "0fr",
                  margin: 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ overflow: "hidden" }}>
                  <MotionButton
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Choose service
                  </MotionButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>

      <DevTool control={form.control} />
    </section>
  );
}
