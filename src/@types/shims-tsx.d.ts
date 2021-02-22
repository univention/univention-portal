declare global {
  // allow the use of .tsx files while enabling jsx syntaxsupport in your IDE to write JSX-style typescript code
  import Vue, { VNode } from 'vue';

  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
