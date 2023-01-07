# Notes

## Config JSON Values

- admin_groups --> `portal/user.py::User`
- auth_mode --> `portals.json` --> `portal/extensions/authenticator.py::UMCAuthenticator`
- default_domain_dn --> never
- editable --> `portal/extensions/portal.py::Portal`
- fqdn --> never
- hostdn --> never
- ldap_base --> never
- ldap_uri --> never
- port --> never
- ucs_internal_url --> `portals.json` --> `portal/extensions/cache_http.py`
- umc_get_url --> `portal/extensions/portal.py::UMCPortal`
- umc_session_url --> `portal/user.py`
- udm_api_url --> `portal/user.py`
- udm_api_username --> `portal/user.py`
- udm_api_password_file --> `portal/user.py`
- assets_root --> `portal/user.py`