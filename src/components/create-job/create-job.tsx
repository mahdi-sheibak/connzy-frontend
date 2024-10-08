import { useMutation } from "@tanstack/react-query";
import { ChooseService } from "@/components/choose-service/choose-service";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { ResponseSchema, type Service, ServiceSchema } from "@/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JobForm } from "./job-form";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export function CreateJob() {
  const serviceDetailsMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await fetch(
        `${config.apiBaseUrl}/services/${serviceId}`
      );
      const serviceDetails = ResponseSchema<Service>(ServiceSchema).parse(
        await response.json()
      );
      return serviceDetails;
    },
  });

  return (
    <Suspense>
      <div>
        <ChooseService
          title="Create Job"
          description="Choose your service"
          trigger={
            <Button type="button" variant="default">
              {serviceDetailsMutation.isPending && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Job
            </Button>
          }
          length={1}
          onChange={(selectedServices) => {
            serviceDetailsMutation.mutate(selectedServices[0]);
          }}
          footer={null}
        />

        <Dialog
          open={serviceDetailsMutation.isSuccess}
          onOpenChange={() => {
            serviceDetailsMutation.reset();
          }}
        >
          <DialogContent className="w-3/4">
            <JobForm
              serviceId={serviceDetailsMutation.data?.data._id}
              steps={serviceDetailsMutation.data?.data.steps}
              reset={serviceDetailsMutation.reset}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
}
