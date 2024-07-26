import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Steps } from "@/schema";
import { Form } from "@/components/ui/form";
import { zodSchemaBuilder } from "@/lib/zod-schema-builder";
import { JobStepper } from "@/components/create-job/job-stepper";
import { DevTool } from "@hookform/devtools";
import { useMutation } from "@tanstack/react-query";
import { config } from "@/config";

const formSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);

interface Props {
  steps: Steps;
  serviceId?: string;
  reset: () => void;
}

export function JobForm({ steps, serviceId, reset }: Readonly<Props>) {
  const initialValues: Record<string, string | string[]> = {};
  const newFlatInstance = steps?.flat(1);
  newFlatInstance?.forEach((step) => {
    if (step.type === "checkbox") {
      initialValues[step._id] = [];
      return;
    }
    initialValues[step._id] = "";
  });

  const formZSchema = zodSchemaBuilder(steps);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialValues,
    resolver: zodResolver(formZSchema),
  });

  const createJobMutation = useMutation({
    mutationFn: async (values: {
      job: { serviceId: string; stepResponses: z.infer<typeof formSchema> };
    }) => {
      const response = await fetch(`${config.apiBaseUrl}/jobs`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmVkZWVhZjg2MmViMWIyZTNmMGU3OSIsInVzZXJUeXBlIjoiY2xpZW50IiwiaWF0IjoxNzIyMDAyNTYwLCJleHBBdCI6MTcyMjAwNjE2MCwiaXNzdWVyIjoiQ29ubnp5IFRlY2hub2xvZ2llcyIsInJvbGVzIjpbIldwcnNxdyJdLCJjdXN0b21lciI6IjY2NmVkZWVhZjg2MmViMWIyZTNmMGU3YiJ9.ZGIRSiabLGx6INK1wEDYzythgP-cTQfQ-ycq8ZNJ3_M`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log({ response });
      return response;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!serviceId) return;

    const jobPayload = {
      job: {
        serviceId: serviceId,
        description: "fake description",
        stepResponses: values,
      },
    };

    console.log({ jobPayload });

    await createJobMutation.mutateAsync(jobPayload);

    reset();
    form.reset();
  };

  return (
    <Form {...form}>
      <DevTool control={form.control} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <JobStepper steps={steps} />
      </form>
    </Form>
  );
}
