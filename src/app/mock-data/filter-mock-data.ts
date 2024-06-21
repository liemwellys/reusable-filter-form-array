import { Filter } from "../models/reusable-filter.model";

export const memberTimeStampFilters = ["createdAt"];

export const memberFilters: Filter[] = [
  {
    type: "autoComplete",
    name: "district",
    label: "member.district",
    isSet: false,
  },
];
