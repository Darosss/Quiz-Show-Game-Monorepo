import { FC } from "react";
import { FetchingInfo } from "@/components/common";
import { useFetch } from "@/hooks/useFetch";
import { Category } from "@/shared/types";

type CategorySelectProps = {
  onSelect: (categoryId: string) => void;
  defaultValue?: string;
};

export const CategorySelect: FC<CategorySelectProps> = ({
  onSelect,
  defaultValue,
}) => {
  const {
    api: { isPending, error, responseData },
  } = useFetch<Category[]>({
    url: "categories",
    method: "GET",
  });
  if (!responseData.data || error || isPending)
    return <FetchingInfo isPending={isPending} error={error} />;

  return (
    <select
      onChange={(e) => onSelect(e.currentTarget.value)}
      defaultValue={defaultValue || ""}
    >
      {responseData.data.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}

      <option value={""}>None</option>
    </select>
  );
};
