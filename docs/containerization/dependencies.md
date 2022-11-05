# Dependencies


## TODO:  Package repository `updates.knut.univention.de`

Clarify the dependency on the package
`python3-univention-group-membership-cache` which seems to be present. Currently
this causes trouble in the CI build.

The file `sources.list` in the branch from pbednarski does state the following:

> TODO Use the official mirrors. Can't use them currently, as they don't
> contain: `python3-univention-group-membership-cache`

The CI build fails as follows:

```
Step 7/27 : RUN curl http://updates.knut.univention.de/dists/ucs502/InRelease   || curl https://updates.knut.univention.de/dists/ucs502/InRelease   && echo "Testing"   && exit 1
 ---> Running in db97d6700b12
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (6) Could not resolve host: updates.knut.univention.de
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (6) Could not resolve host: updates.knut.univention.de
The command '/bin/sh -c curl http://updates.knut.univention.de/dists/ucs502/InRelease   || curl https://updates.knut.univention.de/dists/ucs502/InRelease   && echo "Testing"   && exit 1' returned a non-zero code: 6
```
