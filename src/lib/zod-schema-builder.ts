import { ZodArray, z } from "zod";
import { Service } from "@/schema";

// TODO: clean zod builder
export const zodSchemaBuilder = (steps: Service["steps"]) => {
  const flatSteps = steps?.flat(1);
  console.log({ flatSteps });

  let baseSchema = z.object({});

  flatSteps?.forEach((step) => {
    let s: z.ZodString | z.ZodNumber | ZodArray<z.ZodString, "many"> = z.string(
      step.validationRules.required ? { required_error: "Required" } : {}
    );

    if (step.type === "number") {
      s = z.coerce.number(
        step.validationRules.required
          ? {
              required_error: "Required",
              invalid_type_error: "this field should a valid number",
            }
          : {}
      );
    }

    if (s instanceof z.ZodString && step.validationRules.required) {
      if (step._id === "6697af5dfd5be4caeeee9bf3") {
        console.log("required on province applied");
      }
      s.trim().min(1, { message: "Required" });
    }

    if (s instanceof z.ZodNumber && step.validationRules.required) {
      s.min(1, { message: "Required" });
    }

    if (step.type === "checkbox") {
      s = z.array(z.string());
    }

    if (s instanceof z.ZodString && step.type === "email") {
      s = s.email();
    }

    if (step.validationRules.min) {
      s = s.min(step.validationRules.min);
    }

    if (step.validationRules.max) {
      s = s.max(step.validationRules.max);
    }

    if (step._id === "6697af5dfd5be4caeeee9bf3") {
      console.log("Province", { s, step });
    }

    baseSchema = baseSchema.extend({
      [step?._id]: s,
    });
  });

  return baseSchema;
};
