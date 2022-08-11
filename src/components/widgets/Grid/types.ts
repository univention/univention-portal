// mixed is when some items are selected but not all
// so the checkbox will show a minus sign (-) instead of a checkmark (✓)
// when the checkbox with the minus sign is clicked, all items will be deselected
export type HeaderCheckboxState = boolean | 'mixed';

export interface GridItemProps {
  $dn$: string;
  $childs$: boolean;
  $flags$: string[];
  $operations$: string[];
  objectType: string;
  labelObjectType: string;
  name: string;
  path: string;
}

export interface GridItem extends GridItemProps {
  selected: boolean;
}
