# Configuration Portal backend

## config.json values

The following table lists where a specific key in `config.json` is used in the application.



| Value                 | used in source file                                    | Webserver | Reloader | portals.json |
|-----------------------|--------------------------------------------------------|:---------:|:--------:|:------------:|
| admin_groups          | `portal/user.py::User`                                 |     x     |          |              |
| auth_mode             | `portal/extensions/authenticator.py::UMCAuthenticator` |     x     |          |      x       |
| default_domain_dn     | `portal/extensions/cache.py::PortalFileCache`          |           |          |      x       |
| editable              | `portal/extensions/portal.py::Portal`                  |     x     |          |              |
| fqdn                  |                                                        |           |          |              |
| hostdn                | `portal/extensions/reloader.py::GroupsReloaderLDAP`    |           |    x     |      x       |
| ldap_base             | `portal/extensions/reloader.py::GroupsReloaderLDAP`    |           |    x     |      x       |
| ldap_uri              | `portal/extensions/reloader.py::GroupsReloaderLDAP`    |           |    x     |      x       |
| port                  | `univention-portal-server`                             |     x     |          |              |
| ucs_internal_url      | `portal/extensions/cache_http.py`                      |     x     |          |              |
| umc_get_url           | `portal/extensions/portal.py::UMCPortal`               |     x     |          |              |
| umc_session_url       | `portal/extensions/authenticator.py::UMCAuthenticator` |     x     |          |      x       |
| umc_api_url           | `portal/extensions/reloader.py::PortalReloaderUDM`     |           |    x     |              |
| umc_api_username      | `portal/extensions/reloader.py::PortalReloaderUDM`     |           |    x     |              |
| umc_api_password_file | `portal/extensions/reloader.py::PortalReloaderUDM`     |           |    x     |              |
| assets_root           | `portal/extensions/reloader.py::PortalReloaderUDM`     |           |    x     |              |


## Configuration for HTTP-backed cache implementation

Based on above observations the HTTP-backed cache implementation needs only the following configuration values:

- admin_groups
- auth_mode
- editable
- port
- ucs_internal_url
- umc_get_url
- umc_session_url