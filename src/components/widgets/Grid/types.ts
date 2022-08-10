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
