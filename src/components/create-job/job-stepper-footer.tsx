import { useFormContext } from "react-hook-form";
import { useStepper } from "@/components/ui/stepper";
import { Steps } from "@/schema";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface Props {
  steps: Steps;
}

export function JobStepperFooter({ steps }: Readonly<Props>) {
  const { activeStep, currentStep, nextStep, prevStep, isLastStep } =
    useStepper();

  const {
    trigger,
    formState: { isSubmitting },
  } = useFormContext();

  const goNextStep = async () => {
    const stepIndexData = steps ? steps[currentStep.index] : null;
    const currentStepFields = stepIndexData?.map((step) => step._id);

    console.log({ currentStepFields, currentStep, stepIndexData });

    const output = await trigger(currentStepFields, {
      shouldFocus: true,
    });
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
