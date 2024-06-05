#!/bin/bash

echo "Copying the plugins into the target"
cp -av /udm/api/portal.py /target/udm-modules/portal.py
cp -av /udm/syntax/univention-portal.py /target/admin-syntax.d/univention-portal.py
cp -av /udm/handlers /target/admin-handlers/portals
