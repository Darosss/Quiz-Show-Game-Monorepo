import { PossibleLanguages } from 'src/shared';

export class CreateCategoryDto {
  name: [PossibleLanguages, string][];
}

export class CreateCategoryServiceDto {
  name: Map<PossibleLanguages, string>;
}
