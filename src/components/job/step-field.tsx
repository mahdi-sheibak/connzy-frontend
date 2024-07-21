import { SelectCity } from "@/components/select-city";
import { SelectDistrict } from "@/components/select-district";
import { SelectProvince } from "@/components/select-province";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ServiceStepSchema } from "@/schema";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

interface Props {
  step: z.infer<typeof ServiceStepSchema>;
}

export function StepField({ step }: Readonly<Props>) {
  const form = useFormContext();

  const renderField = () => {
    switch (step.type) {
      case "city":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <SelectCity
                      placeholder={step.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "province":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <SelectProvince
                      placeholder={step.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "district":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <SelectDistrict
                      placeholder={step.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "textarea":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={step.placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "checkbox":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      {step.options.map((option) => {
                        return (
                          <div
                            className="flex items-center space-x-2"
                            key={option?.value}
                          >
                            <Checkbox
                              id={option?.value}
                              checked={Boolean(
                                field.value.includes(option?.value)
                              )}
                              onCheckedChange={() => {
                                field.onChange([...field.value, option?.value]);
                              }}
                            />
                            <Label htmlFor={option?.value}>
                              {option?.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      case "radio":
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={() => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <RadioGroup>
                      {step.options?.map((option, index) => {
                        return (
                          <div
                            key={option?.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option?.value ?? index.toString()}
                              id={option?.value}
                            />
                            <Label htmlFor={option?.value}>
                              {option?.label}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      default:
        return (
          <FormField
            control={form.control}
            name={step._id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{step.label}</FormLabel>
                  <FormControl>
                    <Input
                      {...step.validationRules}
                      type={step.type}
                      placeholder={step.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
    }
  };

  return <main>{renderField()}</main>;
}
