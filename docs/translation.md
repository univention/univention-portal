# Translation

Multiple components related to the portal have to handle translations and
localization:

- `portal-frontend`
- `portal-server`
- `portal-extension`

The tooling is based on `univention-l10n` and can be used via the `Makefile` in
the root folder of this repository.


## Example usage

We use the UCS tooling and rely on the configuration in the base debian package
at `/debian/univention-portal.univention-l10n`.

Working with the translations can be done trough the `Makefile`. Using `docker
compose` does automatically provide a well defined execution environment:

```
cd /docker

# Update PO files
docker compose run -it --rm deb-builder make l10n-extract

# Compile into MO files and JSON files
docker compose run -it --rm deb-builder make l10n-build
```

The Results of the translation build process can be found in the following
places:

Frontend:

- The Portable Object (PO) files are in [`/frontend/src/assets/`](../frontend/src/assets/).
- The generated JSON Message Objects will be located in `/frontend/public/i18n/`.

Portal extension:

- The UDM Handlers has a Portable Object (PO) file in `/udm/handlers/de.po`.


## See also

- Translation related [decision 0008](./decisions/0008-translation-handling.md).
