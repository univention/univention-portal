// place to store the refs
const refs = {};
let focusNow;

function focusLastInputField(): void {
  // MultiInput can have multiple widgets per row.
  // Focus first widget in last row.
  const firstRowEntryRefs = Object.keys(refs)
    .filter((ref) => {
      // Filter out widgets that are not the first of their row.
      const column = ref.split('-')[2];
      try {
        return parseInt(column, 10) === 0;
      } catch (e) {
        return true;
      }
    })
    .sort();
  const lastItemRef = firstRowEntryRefs[firstRowEntryRefs.length - 1];
  if (refs[lastItemRef]) {
    refs[lastItemRef].firstChild.focus();
  }
}

export default {
  mounted(el, binding) {
    if (binding.value.name) {
      refs[binding.value.name] = el;
    }

    if (focusNow) {
      focusLastInputField();
    }
  },
  unmounted(el, { value }) {
    if (value.name) {
      console.log('Deleted', value.name);
      refs[value.name] = undefined;
      delete refs[value.name];
    }
  },
  updated(el, binding, vnode) {
    if (binding.value.focusNow !== binding.oldValue.focusNow) {
      focusNow = true;
    }
  },
};
