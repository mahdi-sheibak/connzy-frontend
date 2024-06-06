"use client";
import { type ChangeEvent, useState, Suspense } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useMutation } from "@tanstack/react-query";
import { DevTool } from "@hookform/devtools";

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
import { ChooseServiceDialog } from "@/components/dialog/choose-service-dialog";
import { USER_TYPE } from "@/enum";

const formSchema = z.object({
  fullName: z.string().min(1),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

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

          <Suspense fallback={<div>Loading...</div>}>
            <ChooseServiceDialog userType={userType} />
          </Suspense>

          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>

      <DevTool control={form.control} />
    </section>
  );
}
