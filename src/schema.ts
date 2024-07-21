import { type ZodSchema, z } from "zod";

export const ResponseSchema = <T>(schema: ZodSchema<T>) =>
  z.object({
    data: schema,
  });

export const CategorySchema = z.object({
  name: z.string(),
  _id: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const SubCategorySchema = z.object({
  name: z.string(),
  _id: z.string(),
  category: CategorySchema,
});
export type SubCategory = z.infer<typeof SubCategorySchema>;

export const ServiceStepSchema = z.object({
  label: z.string(),
  options: z.array(
    z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional()
  ),
  placeholder: z.string(),
  type: z.enum([
    "text",
    "email",
    "city",
    "province",
    "district",
    "checkbox",
    "number",
    "textarea",
    "radio",
  ]),
  validationRules: z.object({
    required: z.boolean().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  _id: z.string(),
});

export const StepsSchema = z.array(z.array(ServiceStepSchema)).optional();

export const ServiceSchema = z.object({
  name: z.string(),
  _id: z.string(),
  subCategory: SubCategorySchema,
  steps: StepsSchema,
});
export type Service = z.infer<typeof ServiceSchema>;

export const GoogleLoginSchema = z.object({
  data: z.string(),
});

export const PostResponse = <T>(schema: ZodSchema<T>) =>
  z.object({
    status: z.string(),
    statusCode: z.string(),
    message: z.object({
      text: z.string(),
      type: z.string(),
    }),
    errors: z.array(
      z.object({
        message: z.string(),
        field: z.string(),
      })
    ),
    data: schema,
  });
