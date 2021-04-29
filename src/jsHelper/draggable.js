/*
 * Copyright 2021 Univention GmbH
 *
 * https://www.univention.de/
 *
 * All rights reserved.
 *
 * The source code of this program is made available
 * under the terms of the GNU Affero General Public License version 3
 * (GNU AGPL V3) as published by the Free Software Foundation.
 *
 * Binary versions of this program provided by Univention to you as
 * well as other copyrighted, protected or trademarked materials like
 * Logos, graphics, fonts, specific documentations and configurations,
 * cryptographic keys etc. are subject to a license agreement between
 * you and Univention and not subject to the GNU AGPL V3.
 *
 * In the case you use this program under the terms of the GNU AGPL V3,
 * the program is provided in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License with the Debian GNU/Linux or Univention distribution in file
 * /usr/share/common-licenses/AGPL-3; if not, see
 * <https://www.gnu.org/licenses/>.
 */
import { onMounted, onUpdated, ref, watch } from 'vue';

const changePosition = (itemToChange, items, position) => {
  const newItems = items.filter((item) => item.id !== itemToChange.id);
  newItems.splice(position, 0, { ...itemToChange });
  return newItems;
};

const draggingItem = ref({});
const currentDropZoneId = ref(null);
let transitioning = false;

const useDraggableContainer = ({ initialItems, dropZoneId, categoryDn }, context) => {
  const items = ref(initialItems.value);
  console.log('%c xg ITEMS first TIME', 'background: #222; color: #bada55', items);
  console.log('%c xg categoryDn', 'background: #222; color: #005500', categoryDn);

  // update model when dropped
  watch(draggingItem, () => {
    if (draggingItem.value.id) {
      return;
    }
    context.emit('update:modelValue', items.value);
  });

  console.log('xg ITEMS outSIDE', items);
  const onItemDragOver = ({ position }) => {
    if (transitioning || draggingItem.value === {}) {
      return;
    }
    console.group('onItemDragOver xg');
    console.log('xg draggingItem.value', draggingItem.value);
    console.log('xg ITEMS', items);
    console.log('xg items.value', items.value);
    console.log('xg categoryDn', categoryDn);
    console.log('xg position', position);
    console.groupEnd();

    items.value = changePosition(draggingItem.value, items.value, position);
  };

  const containerDragOver = () => {
    if (
      transitioning ||
      draggingItem.value === {} ||
      dropZoneId.value === currentDropZoneId.value
    ) {
      return;
    }

    if (items.value.length > 0) {
      return;
    }

    currentDropZoneId.value = dropZoneId.value;
    items.value = [draggingItem.value];
  };

  const style = '';

  return {
    style,
    defaultItems: items,
    onItemDragOver,
    containerDragOver,
  };
};

const useDraggableItem = ({ item, position, dropZoneId }, context) => {
  const draggable = ref(null);
  const isDragging = ref(
    item.value.id === draggingItem.value.id,
  );
  const middleY = ref(null);

  onMounted(async () => {
    let ret = true;
    setTimeout(() => {
      if (draggable.value !== null) {
        // console.log('onMounted - draggable.value: ', draggable.value);
        const box = draggable.value.getBoundingClientRect();
        middleY.value = box.top + box.height / 2;
      } else {
        ret = false;
      }
    }, 300);

    return ret;
  });

  onUpdated(() => {
    let ret = true;
    if (draggable.value !== null) {
      // console.log('onUpdated - draggable.value: ', draggable.value);
      const box = draggable.value.getBoundingClientRect();
      middleY.value = box.top + box.height / 2;
    } else {
      ret = false;
    }

    return ret;
  });

  const itemDragStart = () => {
    draggingItem.value = item.value;
    currentDropZoneId.value = dropZoneId.value;
    isDragging.value = true;
  };

  const itemDragEnd = () => {
    draggingItem.value = {};
  };

  const transitionStart = () => {
    transitioning = false;
  };

  const transitionEnd = () => {
    transitioning = false;
  };

  watch(draggingItem, () => {
    // console.log('DRAGGINGITEM', draggingItem);
    if (draggingItem.value.id) {
      return;
    }
    isDragging.value = false;
  });

  return {
    draggable,
    isDragging,
    itemDragStart,
    itemDragEnd,
    transitionStart,
    transitionEnd,
  };
};

export { useDraggableContainer, useDraggableItem };
