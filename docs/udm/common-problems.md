# Common problem resolutions

## ucs_registerLDAPExtension: registration of /usr/lib/univention-portal/schema/univention-portal.schema failed.

Use the following commands to debug your schema file.
Most probably the error is in there. You can see the error
after running `systemctl status slapd.service`.

```
cp -f udm/schema/univention-portal.schema /var/lib/univention-ldap/local-schema/univention-portal.schema
service slapd restart
systemctl status slapd.service
```


```
cp -f udm/acls/62univention-portal.acl /etc/univention/templates/files/etc/ldap/slapd.conf.d/62univention-portal.acl
ucr commit /etc/ldap/slapd.conf
service slapd restart
```
