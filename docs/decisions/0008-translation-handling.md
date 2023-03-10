# Handling of the Translation Process


---

- status: final
- date: 2023-03-10
- deciders: jbornhold

---


## Context

The Univention Portal does support translation into multiple languages. The
codebase itself is developed in English, and a PO file with translations into
German is included in the codebase. Further translations are available in
auxiliary packages.

The handling of translations is based on GNU `gettext` and involves the
following steps:

1. Extracting translatable strings from the source code and updating PO files.
2. Adding translations into the PO file itself.
3. Compiling the PO file into a MO file for backend applications or into a JSON
   file for frontend parts.

The file types have the following meaning:

- PO - Portable Object
- MO - Message Object
- JSON - A Message Object serialized into a JSON object

Tooling to handle the translations in Univention is provided in a package
`univention-l10n-dev`.


## Decisions

The handling of translations will be implemented for the containerized version
of the Univention Portal based on the same tooling from `univention-l10n-dev`.


## Rejected alternatives

Switching the frontend tooling to a special purpose toolchain, e.g. `i18next`.

For now the value of staying consistent with the common tooling in Univention
and also with the Debian package build of the Univention Portal are considered
valuable to avoid introducing accidental complexity into our build process.

"For now" is understood in the following way: Once the App Center integration of
the containerized portal is approached, this decision should be revisited,
because from that moment on there would be no Debian package of the portal left.


## Consequences

- No new tooling introduced, we keep consistency with the common approach in
  Univention.
- The build of the frontend container image has now a preparatory step to
  compile the message catalog.
- The handling of translations from auxiliary packages is not in scope of this
  decision and not yet solved.


## Pointers

- [GNU gettext](https://www.gnu.org/software/gettext/manual/html_node/Overview.html)
- [`univention-l10n` code](https://git.knut.univention.de/univention/ucs/-/tree/5.0-3/packaging/univention-l10n)
- [i18next](https://www.i18next.com/)
- [French translation of the portal](https://git.knut.univention.de/univention/ucs/-/tree/5.0-3/base/univention-l10n-fr/fr/management/univention-portal)
