import { CategoryList } from "./category-list";
import { SubCategoryList } from "./sub-category-list";
import { ServiceList } from "./service-list";

interface ChooseViewProps {
  subCategory: string | null;
  category: string | null;
  onChooseService: (serviceId: string) => void;
  selectedServices: Set<string>;
}

export function ChooseView({
  subCategory,
  category,
  onChooseService,
  selectedServices,
}: ChooseViewProps) {
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
