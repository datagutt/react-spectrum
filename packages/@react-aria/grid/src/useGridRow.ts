/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {GridCollection} from '@react-types/grid';
import {GridState} from '@react-stately/grid';
import {HTMLAttributes, RefObject} from 'react';
import {Node} from '@react-types/shared';
import {useSelectableItem} from '@react-aria/selection';

export interface GridRowProps<T> {
  /** An object representing the grid row. Contains all the relevant information that makes up the grid row. */
  node: Node<T>,
  /** Whether the grid row is contained in a virtual scroller. */
  isVirtualized?: boolean,
  /** Whether selection should occur on press up instead of press down. */
  shouldSelectOnPressUp?: boolean,
  /** Handler that is called when a user performs an action on the row. */
  onAction?: () => void
}

export interface GridRowAria {
  /** Props for the grid row element. */
  rowProps: HTMLAttributes<HTMLElement>,
  /** Whether the row is currently in a pressed state. */
  isPressed: boolean
}

/**
 * Provides the behavior and accessibility implementation for a row in a grid.
 * @param props - Props for the row.
 * @param state - State of the parent grid, as returned by `useGridState`.
 */
export function useGridRow<T, C extends GridCollection<T>, S extends GridState<T, C>>(props: GridRowProps<T>, state: S, ref: RefObject<HTMLElement>): GridRowAria {
  let {
    node,
    isVirtualized,
    shouldSelectOnPressUp,
    onAction
  } = props;

  let {itemProps, isPressed} = useSelectableItem({
    selectionManager: state.selectionManager,
    key: node.key,
    ref,
    isVirtualized,
    shouldSelectOnPressUp,
    onAction
  });

  let isSelected = state.selectionManager.isSelected(node.key);

  let rowProps: HTMLAttributes<HTMLElement> = {
    role: 'row',
    'aria-selected': state.selectionManager.selectionMode !== 'none' ? isSelected : undefined,
    ...itemProps
  };

  if (isVirtualized) {
    rowProps['aria-rowindex'] = node.index + 1; // aria-rowindex is 1 based
  }

  return {
    rowProps,
    isPressed
  };
}
