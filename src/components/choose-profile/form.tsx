import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { Loader2Icon } from "lucide-react";
import omit from "lodash/omit";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
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
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ChooseServiceDialog } from "@/components/choose-service/dialog";
import { uploadImageAction } from "@/actions/upload-image.action";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/settings";
import { USER_TYPE } from "@/enum";
import {
  createCustomerProfile,
  createExpertProfile,
} from "@/actions/user.action";

const formSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  image: z
    .instanceof(File, { message: "Please choose a file" })
    .refine((file) => Number(file?.size) <= MAX_FILE_SIZE, {
      message: "Max image size is 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(String(file?.type)), {
      message: `Only ${ACCEPTED_IMAGE_TYPES.join(" .")} formats are supported.`,
    }),
  bio: z.string().min(1),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: "Please read and accept the terms and conditions",
  }),
});

interface ChooseProfileFormProps {
  userType: USER_TYPE;
}

export function ChooseProfileForm({ userType }: ChooseProfileFormProps) {
  const uploadImageMutation = useMutation({
    mutationFn: uploadImageAction,
  });

  const createCustomerProfileMutation = useMutation({
    mutationFn: createCustomerProfile,
  });

  const createExpertProfileMutation = useMutation({
    mutationFn: createExpertProfile,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      image: undefined,
      bio: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const phone = parsePhoneNumber(values.phoneNumber);

    const imageFormData = new FormData();
    imageFormData.append("image", values.image);
    const uploadedImageInfo = await uploadImageMutation.mutateAsync(
      imageFormData
    );

    console.log({
      ...values,
      uploadedImageInfo: uploadedImageInfo,
      phone,
    });

    const userFormData = new FormData();
    userFormData.append("fullName", values.fullName);
    userFormData.append("image", uploadedImageInfo.data._id);
    userFormData.append("bio", values.bio);
    userFormData.append("acceptTerms", String(values.acceptTerms));
    phone &&
      userFormData.append(
        "phone",
        JSON.stringify({
          code: phone.countryCallingCode,
          number: phone.nationalNumber,
        })
      );

    if (userType === USER_TYPE.CUSTOMER) {
      const customer = await createCustomerProfileMutation.mutateAsync(
        userFormData
      );
      console.log({ customer });
    } else {
      const expert = await createExpertProfileMutation.mutateAsync(
        userFormData
      );
      console.log({ expert });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 desktop:w-[40%] tablet:w-[70%] mobile:w-[100%]"
      >
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

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput placeholder="Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <ImageDropzone
                  {...omit(field, "value", "ref")}
                  onChange={(files) => {
                    field.onChange(files?.item(0));
                  }}
                  {...(Boolean(field.value?.name) && {
                    fileInfo: `Uploaded file: ${
                      field.value?.name
                    } (${Math.round(Number(field?.value?.size) / 1024)} KB)`,
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Bio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                </FormControl>
                <FormLabel>
                  Accept{" "}
                  <a
                    href="https://google.com"
                    target="_blank"
                    className="font-bold hover:underline transition-[underline]"
                  >
                    terms and conditions
                  </a>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Suspense fallback={null}>
          <ChooseServiceDialog userType={userType} />
        </Suspense>

        <div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
