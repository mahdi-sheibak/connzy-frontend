import { config } from "@/config";
import { ResponseSchema } from "@/schema";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Option = Record<"value" | "label", string>;

const CitySearchSchema = z.object({
  name: z.string(),
  _id: z.string(),
});
type CitySearch = z.infer<typeof CitySearchSchema>;

interface Props {
  placeholder: string;
  onChange?: (value: string) => void;
  value: string;
}

const searchCityURL = new URL(`${config.apiBaseUrl}/districts`);

export function SelectDistrict({
  onChange,
  placeholder,
  value,
}: Readonly<Props>) {
  const { data: options } = useQuery<Option[]>({
    queryKey: ["district"],
    queryFn: async () => {
      const response = await fetch(searchCityURL);
      const serviceList = ResponseSchema<CitySearch[]>(
        z.array(CitySearchSchema)
      ).parse(await response.json());
      return serviceList.data.length
        ? serviceList.data.map((serviceOption) => ({
            label: serviceOption.name,
            value: serviceOption._id,
          }))
        : [];
    },
    initialData: [],
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
