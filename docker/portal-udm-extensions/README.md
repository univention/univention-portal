# Portal UDM Extensions

This does "package" the UDM extensions into an empty image, so that they can be
used from other Dockerfiles.

## Status - Workaround

This is a workaround since we do not yet have a clear path on Version and
Package handling.

Our current setup does include a well understood path for container image
handling, so that using an empty container image as a "poor man's packaging
solution" is a valid interim step.
