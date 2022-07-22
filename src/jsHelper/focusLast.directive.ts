// place to store the refs
const refs = {};

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
  mounted(el, { value }) {
    if (value) {
      refs[value] = el;
    }
    focusLastInputField();
  },
  unmounted(el, { value }) {
    if (value) {
      refs[value] = undefined;
      delete refs[value];
    }
  },
};
