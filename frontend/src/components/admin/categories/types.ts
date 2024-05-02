import { PossibleLanguages } from "@/shared/enums";

export type CategoryCreateBody = {
  name: [PossibleLanguages, string][];
};

export type CategoryUpdateBody = Partial<CategoryCreateBody>;
