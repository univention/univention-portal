## The rule: this system is a closed vocabulary

Build **only** from the components below. This is not a style preference — it
is the contract for this design system.

**Never** write any of the following:

- Custom CSS, in any form — no stylesheets, no `<style>`, no CSS-in-JS.
- A `style` attribute or prop, on a design-system component or anything else.
  Not even with design tokens in it.
- A `className`, including Tailwind and DaisyUI utility classes. The shipped
  stylesheet only contains the classes these components use internally, so
  most utilities you would reach for do not exist in it and silently render
  nothing.
- Hand-rolled markup that stands in for a component — no `<div>` wrappers for
  layout, no `<button>`, `<input>`, `<select>`, `<textarea>`, `<a>`, `<table>`,
  `<form>`, no heading tags.
- Custom JavaScript that adds behaviour, layout, or animation.

**The only things you compose are:** the components listed below, plain text
inside their slots, and `{expressions}` that supply text or data.

One mechanical exception: a named slot needs an element to carry the `slot`
attribute, so `<span slot="title">Text</span>` is allowed. That element takes
`slot` and nothing else — no `style`, no `className`.

A design-system component may also carry a `slot` attribute when the slot is
meant to hold a control, e.g.
`<Button slot="action" variant="ghost" size="sm" circle />` inside a
`ListSelectItem`. That is composition, and its own props stay allowed — the rule
above only forbids adding `style` or `className`.

### When the vocabulary cannot express the design

Do not improvise, and do not reach for CSS "just this once". Instead:

1. Build the closest honest approximation from existing components, or leave
   the region empty.
2. **Record the gap in a `gaps.md` file in the project you are building.**
   Create it if it does not exist yet, and append one entry per gap:

   ```markdown
   ### <what was needed>

   - **Screen / context:** where it came up
   - **Closest existing component:** the nearest thing available, or "none"
   - **What was shipped instead:** the approximation, or "left empty"
   - **Why the vocabulary could not express it:** one or two sentences
   ```

   Be specific. "Needs a modal dialog for destructive confirmation" is
   actionable; "needs better layout" is not. That file is how missing
   components get reported back to the design system's maintainers, so it is a
   deliverable, not a scratch note.

3. Check the known gaps below first — those are already reported, and have a
   stated workaround. Do not re-report them.

A design that is visibly incomplete plus an accurate `gaps.md` is the correct
outcome. A design that looks finished because it contains custom CSS is not.

### Known gaps — already reported, do not re-report

- **No select control.** There is no `Select`. Use `Combobox` for a dropdown, or
  `ListSelect` when the options should stay visible as a filterable column —
  both are real form-associated single-selects, and are the supported answer.
- **No multi-line text control.** There is no `Textarea` and no supported
  substitute. Record it if a design needs one.
- **No component for:** dialog or modal, tabs, accordion, tooltip, dropdown
  menu, radio group, switch or toggle (other than `ThemeToggle`), inline alert
  or banner (`Toast` is transient notification only), icon, avatar, pagination,
  breadcrumbs, progress or skeleton indicator, or a heading/body-text component
  other than `PageHeader`.
- **No grid.** Layout is `Page`, `Container`, `VStack`, `HStack`, `Spacer`
  only, so multi-column arrangements must be nested stacks. Fixed-width and
  full-height columns are expressible — see "Full-height layouts that scroll
  internally" — but there is no row/column grid with alignment tracks.

## Setting up

This is a Lit web-components library. Importing the bundle registers the custom
elements as a side effect — there is no provider to mount and no init call.
Two things are required:

1. **`data-theme` on the root `<html>` element** — `univention-light` (default)
   or `univention-dark`. The themes are `[data-theme]` sets of CSS custom
   properties, and custom properties are the only thing that crosses a Shadow
   DOM boundary. Every component renders behind one, so `data-theme` on a
   nested element does nothing.
2. **`styles.css`**, which `@import`s the compiled component CSS.

`ThemeToggle` switches between the two themes.

## The components

Import from `window.UniventionDesignSystem`. Each is a typed React component
that renders the real custom element, so `<Button variant="primary">` and
`<u-button variant="primary">` produce identical DOM. Prefer the React
exports — they are what the `.d.ts` files describe.

- **Layout** — `Page` (`variant="scrollable|fixed"`), `Container`
  (`grow`, `scroll`), `VStack` and `HStack` (`gap`, `align`, `justify`,
  `basis`, `grow`, `scroll`; `HStack` also `wrap`), `Spacer`, `PageHeader`,
  `Card`.
- **Forms** — `Form` (`grow`), `FormField` (`label`, `required`, `hint`, `error`,
  `spacer`), `Input`, `Checkbox`, `Combobox`, `Multiselect`, `ListSelect`
  (`heading`, `count`, `filterable`, `size`, `grow`), `Button` (`pressed` for
  toggle/filter pills).
- **Data** — `Table`, `DescriptionList`, `Badge`.
- **Utility** — `Link`, `ThemeToggle`, `Toast`.

Several components require specific children, which are also exported:
`Table` → `Tbody`, `Tr`, `Th`, `Td`; `DescriptionList` → `DescriptionItem`;
`Combobox` → `ComboboxItem`; `Multiselect` → `MultiselectOption`;
`ListSelect` → `ListSelectItem` (optionally wrapped in `ListSelectGroup`);
`Toast` → `ToastItem`.

**All spacing and alignment comes from `VStack`/`HStack` `gap`, `align` and
`justify`, and from `Spacer`.** That is the entire layout vocabulary — there is
no grid component, so multi-column arrangements are nested stacks.

### Full-height layouts that scroll internally

Four props size a region instead of letting it track its content:

- `grow` — take the remaining space in the flex parent.
- `scroll` — scroll this region's own overflow. `VStack scroll` is vertical,
  `HStack scroll` horizontal.
- `basis="sm|md|lg"` — pin a column to 16 / 20 / 24rem. Ignored when `grow` is
  set.
- `Form grow` — make the form itself the full-height column, so `ListSelect grow`
  children can split that height.

**Every element in the chain has to pass the bounded height down — miss one link
and the scrolling region has no height to scroll within.** `align="stretch"` on
the row is one of those links: the default `center` sizes each column to its own
content instead.

The chain, link by link: `Page variant="fixed"` locks to the viewport height →
`Container grow` fills it and becomes a flex column → `VStack grow` stacks the
header above the two-column region → `HStack grow align="stretch"` fills the
height the header left and hands it to both columns → `VStack basis="sm"` is the
stable 16rem sidebar, `VStack grow scroll` takes the remaining width and scrolls.

```jsx
<Page variant="fixed">
  <Container grow>
    <VStack gap="md" grow>
      <PageHeader>Users</PageHeader>
      <HStack gap="lg" align="stretch" grow>
        <VStack basis="sm">
          <Form grow>
            <ListSelect grow heading="School" name="school" filterable>
              <ListSelectItem value="gym" selected>
                Gymnasium Mitte
              </ListSelectItem>
              <ListSelectItem value="gs1">Grundschule Nord</ListSelectItem>
            </ListSelect>
          </Form>
        </VStack>
        <VStack grow scroll>
          <Card>
            <span slot="title">Results</span>
          </Card>
        </VStack>
      </HStack>
    </VStack>
  </Container>
</Page>
```

Children become slotted content. The named slots are `title` (`Card`);
`header`, `footer`, `empty` (`Table`); `empty`, `header-action` (`ListSelect`);
and `sublabel`, `action` (`ListSelectItem`).

**Custom events do not bind as React props.** The library dispatches `change`,
`u-change`, `u-search` and `u-close`. Only `change` bubbles as a native event;
for the `u-`-prefixed ones use a ref and `addEventListener`.

### Variant values that actually have styles

Some documented variants have no compiled styles and render as unstyled text:

- `Link` — use `primary`, `neutral` or `error` only.
- `Badge` — use `ghost` or `success` only.
- `Button` — all four (`neutral`, `primary`, `error`, `ghost`) are fine.

## Where the truth lives

- `guidelines/docs/guidelines/` — colours, typography, spacing, theming. These
  document the tokens the components use; they are reference, not an invitation
  to author CSS.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage and
  accessibility notes. `<Name>.d.ts` is the prop contract.

Groups are `form`, `data`, `layout`, `utility`.

## An idiomatic screen

Note that it contains no `style`, no `className`, and no `<div>`.

```jsx
const {
  Page, Container, PageHeader, Card, VStack, HStack,
  FormField, Input, Combobox, ComboboxItem, Button,
} = window.UniventionDesignSystem

<Page variant="scrollable">
  <PageHeader>Users</PageHeader>
  <Container>
    <Card>
      <span slot="title">Invite a user</span>
      <VStack gap="md">
        <FormField label="Name" required>
          <Input name="name" required />
        </FormField>
        <FormField label="Email" hint="They will receive an invitation.">
          <Input name="email" type="email" />
        </FormField>
        <FormField label="Role" required>
          <Combobox name="role" placeholder="Choose a role…">
            <ComboboxItem value="admin">Admin</ComboboxItem>
            <ComboboxItem value="user">User</ComboboxItem>
          </Combobox>
        </FormField>
        <HStack gap="sm">
          <Button variant="primary" type="submit">Send invite</Button>
          <Button type="reset">Cancel</Button>
        </HStack>
      </VStack>
    </Card>
  </Container>
</Page>
```

# UniventionDesignSystem (univention-design-system@0.1.0)

This design system is the published univention-design-system React library, bundled as a single
browser global. All 21 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.UniventionDesignSystem`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).
- `guidelines/` — the design system's own usage guidance (4 doc(s), see `guidelines/index.md`). Read these before composing larger layouts.

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.UniventionDesignSystem.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { Badge } = window.UniventionDesignSystem;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Badge />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<ThemeRoot theme={"univention-light"}>{children}</ThemeRoot>
```

## Tokens

147 CSS custom properties from univention-design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (49): `--tw-border-style`, `--tw-shadow-color`, `--tw-inset-shadow-color`, …
- **spacing** (4): `--tw-inset-shadow`, `--tw-inset-shadow-alpha`, `--tw-inset-ring-shadow`, …
- **typography** (11): `--tw-font-weight`, `--tw-tracking`, `--font-sans`, …
- **radius** (11): `--radius-selector`, `--radius-field`, `--radius-box`, …
- **shadow** (8): `--tw-shadow`, `--tw-shadow-alpha`, `--tw-ring-shadow`, …
- **other** (64): `--tw-ring-offset-width`, `--tw-outline-style`, `--tw-blur`, …

## Components

### data
- `Badge`
- `DescriptionList`
- `Table`

### form
- `Button`
- `Checkbox`
- `Combobox`
- `Form`
- `FormField`
- `Input`
- `ListSelect`
- `Multiselect`

### layout
- `Card`
- `Container`
- `HStack`
- `Page`
- `PageHeader`
- `Spacer`
- `VStack`

### utility
- `Link`
- `ThemeToggle`
- `Toast`
