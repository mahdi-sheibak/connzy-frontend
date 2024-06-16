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
import { useToast } from "@/components/ui/use-toast";
import { Dropzone } from "@/components/ui/dropzone";
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
import { formatBytes } from "@/utils/format-bytes";
import { safeBoolean } from "@/utils/safe-boolean";
import { useRouter } from "next/navigation";
// import { FancyMultiSelect } from "@/components/fancy-multi-select";

const formSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  image: z
    .instanceof(File, { message: "Please choose a file" })
    .refine((file) => Number(file.size) <= MAX_FILE_SIZE, {
      message: "Max image size is 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(String(file.type)), {
      message: `Only ${ACCEPTED_IMAGE_TYPES.join(" .")} formats are supported.`,
    }),
  bio: z.string().min(1),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Please read and accept the terms and conditions",
  }),
  // services: z.array(z.string()).min(1),
});

interface ChooseProfileFormProps {
  userType: USER_TYPE;
}

// const FRAMEWORKS = [
//   {
//     value: "5f72d4a912007e8a468f2d3d",
//     label: "2D Animation",
//   },
//   {
//     value: "5f72d4a912007e8a468f2d3e",
//     label: "3D Animation",
//   },
//   {
//     value: "5f72d4a912007e8a468f2d04",
//     label: "Acrylic Painting Classes",
//   },
//   {
//     value: "5f72d4a912007e8a468f2d10",
//     label: "Acting Classes",
//   },
//   {
//     value: "5f72d4a912007e8a468f2b32",
//     label: "Adult Literacy Programs",
//   },
//   {
//     value: "5f72d4a912007e8a468f2de8",
//     label: "Advertising Services",
//   },
//   {
//     value: "5f72d4a912007e8a468f2dc0",
//     label: "Alarm System Installation",
//   },
//   {
//     value: "5f72d4a912007e8a468f2e15",
//     label: "Android App Development",
//   },
// ];

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
      // services: [],
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const phone = parsePhoneNumber(values.phoneNumber);

    const imageFormData = new FormData();
    imageFormData.append("image", values.image);
    const uploadedImageInfo =
      await uploadImageMutation.mutateAsync(imageFormData);

    // console.log({
    //   ...values,
    //   // f: values.services,
    //   uploadedImageInfo: uploadedImageInfo,
    //   phone,
    // });

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

    const userPromise =
      userType === USER_TYPE.CUSTOMER
        ? createCustomerProfileMutation.mutateAsync(userFormData)
        : createExpertProfileMutation.mutateAsync(userFormData);

    const user = await userPromise;

    if (user.errors.length) {
      toast({
        title: user.errors[0].message,
      });
    }
    if (userType === USER_TYPE.CUSTOMER) {
      router.push("/~/customer");
    }
    console.log({ user });
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
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <Dropzone
                  accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                  onChange={(files) => {
                    field.onChange(files?.item(0));
                  }}
                  message={
                    safeBoolean(field.value)
                      ? `Uploaded file: ${field.value.name} (${formatBytes(
                          field.value.size
                        )})`
                      : ""
                  }
                  className={fieldState.error ? "border-destructive" : ""}
                  {...omit(field, "value", "onChange")}
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

        {/* {userType === USER_TYPE.EXPERT && (
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Service</FormLabel>
                <FormControl>
                  <FancyMultiSelect
                    options={FRAMEWORKS}
                    onChange={(options) => {
                      field.onChange(options.map((option) => option.value));
                      console.log("im changed", options);
                    }}
                    selectedOptions={FRAMEWORKS.filter((option) =>
                      field.value.includes(option.value)
                    )}
                    placeholder="Select Service..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

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
