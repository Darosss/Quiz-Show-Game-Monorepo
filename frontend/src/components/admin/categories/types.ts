export type CategoryCreateBody = {
  name: string;
};

export type CategoryUpdateBody = Partial<CategoryCreateBody>;
