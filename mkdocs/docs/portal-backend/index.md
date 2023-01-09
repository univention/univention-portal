# Portal backend

## Portal class composition

The specific class composition for the main Portal class running in the portal-server process is defined via a textfile that is loaded when the server starts up.

The file is located at `/usr/share/univention-portal/portals.json`.

The following diagram shows the composition in the default case.

```mermaid
classDiagram
    GroupFileCache *-- GroupsReloaderLDAP
    UMCAuthenticator *-- GroupFileCache
    PortalFileCache *-- PortalReloaderUDM
    Portal *-- UMCAuthenticator
    Portal *-- PortalFileCache
    Portal *-- Scorer
    class Portal{
        refresh(reason=None) bool
    }
    class UMCAuthenticator{
        umc_session_url = UMC_SESSION_URL
        auth_mode = AUTH_MODE
        refresh(reason=None) bool
    }
    class PortalFileCache{
        _cache_file = "portal.json"
        _cache = &#123 &#125
        refresh(reason=None) bool
    }
    class GroupFileCache{
        _cache_file = "groups.json"
        _cache = &#123 &#125
        refresh(reason=None) bool
    }
    class PortalReloaderUDM{
        _portal_dn = DEFAUT_DOMAIN_DN
        _cache_file = "portal.json"
        refresh(reason=None) bool
        _refresh() file_descriptor
    }
    class GroupsReloaderLDAP{
        _cache_file = "groups.json"
        refresh(reason=None) bool
        _refresh() file_descriptor
    }
    class Scorer{
        +score(request) int
    }
```
