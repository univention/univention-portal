# Install development environment

- Have a UCS instance you can develop on
  - **With KVM:**
    - SSH to VM server `$ ssh <ldap-username>@ranarp.knut.univention.de`
    - Create a new KVM Instance with `$ ucs-kt-get`
    - Enter VNC with the provided VNC URL and install UCS
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

# Test changes

Once you made changes, deploy the new package using the build task

- Press `CTRL+P`
- Enter `build` and find `Tasks: Run Build Task`
- Wait for process to finish and test your changes in UCS
