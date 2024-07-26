import { JobStepperFooter } from "@/components/create-job/job-stepper-footer";
import { JobStepField } from "@/components/create-job/step-field";
import { Step, StepItem, Stepper } from "@/components/ui/stepper";
import { Steps } from "@/schema";

interface Props {
  steps: Steps;
}

export function JobStepper({ steps }: Readonly<Props>) {
  const stepperSteps = steps
    ? steps.map((step, index) => ({
        label: `Step ${index + 1}`,
        innerSteps: step,
        index,
      }))
    : ([] satisfies StepItem[]);

  return (
    <Stepper initialStep={0} steps={stepperSteps}>
      {stepperSteps.map((stepProps) => {
        return (
          <Step key={stepProps.label} {...stepProps}>
            <div className="mt-3 space-y-5">
              {stepProps.innerSteps?.map((step, index) => {
                return (
                  <JobStepField key={`${step.label}-${index}`} step={step} />
                );
              })}
            </div>
          </Step>
        );
      })}
      <JobStepperFooter steps={steps} />
    </Stepper>
  );
}
