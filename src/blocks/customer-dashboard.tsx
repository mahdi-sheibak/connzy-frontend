"use client";
import { useMutation } from "@tanstack/react-query";
import { ChooseService } from "@/components/choose-service/choose-service";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { ResponseSchema, Service, ServiceSchema } from "@/schema";

export function CustomerDashboard() {
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
    <div className="ml-10 mt-10">
      <ChooseService
        title="Create Job"
        description="Choose your service"
        trigger={
          <Button type="button" variant="default">
            Create Job
          </Button>
        }
        length={1}
        onChange={(selectedServices) => {
          serviceDetailsMutation.mutate(selectedServices[0]);
        }}
        footer={<></>}
      />
    </div>
  );
}
