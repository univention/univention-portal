# Install development environment

- Have a UCS instance you can develop on
  - **With KVM:**
    - SSH to VM server `$ ssh <ldap-username>@ranarp.knut.univention.de`
    - Create a new KVM Instance with `$ ucs-kt-get`
    - Enter VNC with the provided VNC URL and install UCS

## Develop with PyCharm

- TBD

## Develop with Vim

- TBD


## Develop with VSCode

- Install VSCode
  - Install `ms-vscode-remote.vscode-remote-extensionpack` extension in VSCode
- Open `Remote Explorer` on the left of a VSCode window
- Select `SSH-Targets` in the dropdown at the top of the remote explorer bar
- Click on `+` and add a new SSH target: Your UCS instance
- Connect to your UCS instance using the button in the SSH-Targets list
- Open a Terminal once connected, should show something like `root@ucs-4241:~#`
- `$ apt install python-univentionunittests`
- `$ ssh-keygen` and add your SSH key to GitLab
- `$ mkdir -p $HOME/repositories && cd $HOME/repositories`
- `$ git clone git@git.knut.univention.de:univention/components/univention-portal.git`
- `$ cd univention-portal`
- `$ code .`

From that point on you can directly open VSCode and directly enter the UCS instance in that repository and develop properly.

You may also add some VSCode configuration in order to ease up development:

**.vscode/extensions.json**
```json
{
    "recommendations": ["ms-vscode.makefile-tools", "donjayamanne.python-extension-pack", "ms-vscode-remote.vscode-remote-extensionpack"]
}
```

**.vscode/settings.json**
```json
{
    "python.testing.pytestArgs": [
        "unittests"
    ],
    "python.testing.unittestEnabled": false,
    "python.testing.pytestEnabled": true
}
```

**.vscode/tasks.json**
```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build & Install",
      "type": "shell",
      "command": "apt-get build-dep . && (dpkg-buildpackage -b || true); apt install ../*.deb",
      "group": "build"
    }
  ]
}
```

### Test changes

Once you made changes, deploy the new package using the build task

- Press `CTRL+P`
- Enter `build` and find `Tasks: Run Build Task`
- Wait for process to finish and test your changes in UCS


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