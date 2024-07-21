import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Step, StepItem, Stepper, useStepper } from "@/components/ui/stepper";
import { ZodArray, z } from "zod";
import { Service, StepsSchema } from "@/schema";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StepField } from "@/components/job/step-field";
import { Form } from "@/components/ui/form";
import { DevTool } from "@hookform/devtools";
// import { useMutation } from "@tanstack/react-query";

const formSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);

const getZodSchema = (steps: Service["steps"]) => {
  const flatSteps = steps?.flat(1);
  console.log({ flatSteps });

  let baseSchema = z.object({});

  flatSteps?.forEach((step) => {
    let s: z.ZodString | z.ZodNumber | ZodArray<z.ZodString, "many"> = z.string(
      step.validationRules.required ? { required_error: "string required" } : {}
    );

    if (step.type === "checkbox") {
      s = z.array(z.string());
    }

    if (step.type === "number") {
      s = z.coerce.number(
        step.validationRules.required
          ? { required_error: "string required" }
          : {}
      );
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

    baseSchema = baseSchema.extend({
      [step?._id]: s,
    });

    //
    // baseSchema = baseSchema.extend({
    //   [step?._id]: z.string().min(3).max(30),
    // });
  });

  return baseSchema;
};

interface Props {
  steps: z.infer<typeof StepsSchema>;
  serviceId?: string;
  reset: () => void;
}

export function CreateJobForm({ steps, serviceId, reset }: Readonly<Props>) {
  const initialValues: Record<string, string | string[]> = {};

  const newFlatInstance = steps?.flat(1);

  newFlatInstance?.forEach((step) => {
    if (step.type === "checkbox") {
      initialValues[step._id] = [];
      return;
    }

    initialValues[step._id] = "";
  });

  const stepperSteps = steps
    ? steps.map((step, index) => ({
        label: `Step ${index + 1}`,
        innerSteps: step,
        index,
      }))
    : ([] satisfies StepItem[]);

  const formZSchema = getZodSchema(steps);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialValues,
    resolver: zodResolver(formZSchema),
  });

  // const createJobMutation = useMutation({
  //   mutationKey: ["create-job"],
  //   mutationFn: (data: any) => {
  //     return fetch(,{})
  //   }
  // })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const jobPayload = {
      job: {
        serviceId: serviceId,
        stepResponses: values,
        description: "Looking for a piano teacher for my beginner child",
      },
    };
    console.log({ jobPayload });

    reset();
    form.reset();
    form.clearErrors();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stepper initialStep={0} steps={stepperSteps}>
          {stepperSteps.map((stepProps) => {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <div className="mt-3 space-y-5">
                  {stepProps.innerSteps?.map((step, index) => {
                    return (
                      <StepField key={`${step.label}-${index}`} step={step} />
                    );
                  })}
                </div>
              </Step>
            );
          })}
          <DevTool control={form.control} />
          <StepperFooter
            isSubmitting={form.formState.isSubmitting}
            steps={steps}
          />
        </Stepper>
      </form>
    </Form>
  );
}

function StepperFooter({
  isSubmitting,
  steps,
}: Readonly<{ isSubmitting: boolean; steps: z.infer<typeof StepsSchema> }>) {
  const { activeStep, currentStep, nextStep, prevStep, isLastStep } =
    useStepper();

  const { trigger } = useFormContext();

  const goNextStep = async () => {
    const stepIndexData = steps ? steps[currentStep.index] : null;
    const currentStepFields = stepIndexData?.map((step) => step._id);

    console.log({ currentStepFields });

    const output = await trigger(currentStepFields, { shouldFocus: true });
    if (!output) return;

    nextStep();
  };

  return (
    <DialogFooter className="mt-5">
      <>
        {activeStep !== 0 && (
          <Button type="button" variant="secondary" onClick={prevStep}>
            Prev
          </Button>
        )}
        {!isLastStep && (
          <Button type="button" variant="default" onClick={goNextStep}>
            Next
          </Button>
        )}
      </>

      {isLastStep && (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      )}
    </DialogFooter>
  );
}
