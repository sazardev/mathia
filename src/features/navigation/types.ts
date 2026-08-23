import type { IconName } from "@/components/ui/atoms/Icon";

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: IconName;
};
