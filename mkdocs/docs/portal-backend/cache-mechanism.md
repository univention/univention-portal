# Cache mechanism and listener updates

Backend needs to cache computationally expensive results.

!!! note

    Only cache mechanism available at this point is filesystem.

    - /var/cache/univention/portal.json
    - /var/cache/univention/groups.json


## Loading portal entries

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant C as Portal Cache
    participant U as UMC API
    Note over F: App mounted
    F ->> B: GET /portal.json
    Note over B: portal.get_user(request)
    Note over B: authenticator.get_user(request)
    B ->> U: GET /UMC_SESSION_URL
    U ->> B: [user]
    B ->> C: group_cache.get(username)
    Note over C: from mem / else load cache_file
    C ->> B: [groups]
    Note over B: get folders/entries/links/...
    loop folders/entries/links/...
        B ->> C: get_...
        Note over C: from mem / else load cache_file
        C ->> B: folders/entries/links/...
    end
    B ->> F: JSON [portal]
```

## Reloader process

```mermaid
flowchart
    direction LR
    subgraph &nbsp PortalReloaderUDM &nbsp
    direction TB
    pRefresh([refresh])-->pFetch[/"UDM GET /portals/portal"/]
    pFetch-->pProcess[[result processing]]
    pProcess-->pDump[JSON dump to tempfile]
    pDump-->pUpdate["tempfile -> cache_file"]
    end
    subgraph &nbsp GroupsReloaderLDAP &nbsp
    direction TB
    gRefresh([refresh])-->gFetch[/"univention.ldap_cache.frontend.users_groups()"/]
    gFetch-->gDump[JSON dump to tempfile]
    gDump-->gUpdate["tempfile -> cache_file"]
    end
```

## Reloader class hierarchy

```mermaid
classDiagram
    Plugin ..|> Reloader
    Reloader <|-- MtimeBasedLazyFileReloader
    MtimeBasedLazyFileReloader <|-- PortalReloaderUDM
    MtimeBasedLazyFileReloader <|-- GroupsReloaderLDAP
    class MtimeBasedLazyFileReloader{
        _cache_file
        _mtime
    }
    class PortalReloaderUDM{
        _portal_dn
        refresh()
        _extract_portal()
        _extract_categories()
        _extract_folders()
        _extract_entries()
        _extract_user_links()
        _extract_menu_links()
    }
    class GroupsReloaderLDAP{
        refresh()
    }
```
