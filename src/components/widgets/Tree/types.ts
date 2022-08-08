export type Operation = 'add' | 'edit' | 'remove' | 'search' | 'move' | 'subtree_move' | 'reload' | null;

export interface NodeProps {
  id: string;
  label: string;
  icon: string;
  path: string;
  objectType: string;
  $operations$: Operation[];
  $flags$: string[];
  $childs$: boolean;
  $isSuperordinate$: boolean;
}

export interface Data {
  nodes: Node[];
  contextMenuOptions: {icon: string, label: string}[];
  isContextMenuOpen: boolean;
  contextMenuSelectedNode: Node | null;
}

export interface OperationProps {
  [operation: string]: (node: NodeProps) => void;
}

export interface ContextMenuOption {
  label: string;
  icon: string;
  operation: Operation;
}
