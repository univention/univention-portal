const clickOutside = {
  priority: 700,
  beforeMount() {
    const self = this;
    this.event = (event) => {
      // console.log('emitting event');
      self.vm.$emit(self.expression, event);
    };
    this.el.addEventListener('click', this.stopProp);
    document.body.addEventListener('click', this.event);
  },

  unmounted() {
    // console.log('unbind');
    this.el.removeEventListener('click', this.stopProp);
    document.body.removeEventListener('click', this.event);
  },
  stopProp(event) { event.stopPropagation(); },
};
