export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  category: Category;
}

export interface Service {
  name: string;
  subCategory: SubCategory;
  steps: [];
  _id: string;
}
