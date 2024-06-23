"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import debounce from "lodash/debounce";
import { FancyMultiSelect, Option } from "@/components/fancy-multi-select";
import { ResponseSchema } from "@/schema";
import { config } from "@/config";

const ServiceSearchSchema = z.object({
  name: z.string(),
  subCategory: z.object({ name: z.string() }),
  _id: z.string(),
});
type ServiceSearch = z.infer<typeof ServiceSearchSchema>;

interface Props {
  onChange?: (options: Option[]) => void;
}

export function ServiceMultiAsyncSelect({ onChange }: Readonly<Props>) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const selectedOptionsIds = selectedOptions.map(
    (selectedOption) => selectedOption.value
  );

  const searchServiceURL = new URL(`${config.apiBaseUrl}/services/search`);
  searchServiceURL.searchParams.set("term", inputValue);

  const enabled = Boolean(inputValue.length >= 2 && inputValue.length < 20);

  const { data: options, isLoading } = useQuery<Option[]>({
    queryKey: ["service", "search", inputValue],
    queryFn: async () => {
      const response = await fetch(searchServiceURL);
      const serviceList = ResponseSchema<ServiceSearch[]>(
        z.array(ServiceSearchSchema)
      ).parse(await response.json());
      return serviceList.data.length
        ? serviceList.data
            .filter((serviceOption) => {
              return !selectedOptionsIds.includes(serviceOption._id);
            })
            .slice(0, 10)
            .map((serviceOption) => ({
              label: serviceOption.name,
              value: serviceOption._id,
            }))
        : [];
    },
    enabled: enabled,
    initialData: [],
  });

  return (
    <FancyMultiSelect
      options={options}
      selectedOptions={selectedOptions}
      placeholder="Select Service..."
      onChange={(newSelectedOptions) => {
        setSelectedOptions(newSelectedOptions);
        onChange && onChange(newSelectedOptions);
      }}
      onInputValueChange={debounce(setInputValue, 400)}
      isLoading={isLoading}
    />
  );
}
