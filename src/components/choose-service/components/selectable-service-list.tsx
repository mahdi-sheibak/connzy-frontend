import { CategoryList } from "./category-list";
import { SubCategoryList } from "./sub-category-list";
import { ServiceList } from "./service-list";

interface Props {
  subCategory: string | null;
  category: string | null;
  onChooseService: (serviceId: string) => void;
  selectedServices: Set<string>;
}

export function SelectableServiceList({
  subCategory,
  category,
  onChooseService,
  selectedServices,
}: Readonly<Props>) {
  if (subCategory)
    return (
      <ServiceList
        subCategory={subCategory}
        selectedServices={selectedServices}
        onChooseService={onChooseService}
      />
    );

  if (category) return <SubCategoryList category={category} />;

  return <CategoryList />;
}
