1. Update `debian/changelog`

Before building the debian package, make sure you add a new entry to `debian/changelog` that reflects
a small description of what you've changed. The format is **very strict** so make sure to copy an existing
block, **make sure to increase the version** and change the content accordingly

If the last entry was this:
```
univention-portal (4.0.7-10) unstable; urgency=medium

  * Bug #55378: adjust CSS to correctly display the cookie banner

 -- Christian Castens <castens@univention.de>  Wed, 23 Nov 2022 11:29:17 +0100
```

a new entry might look like this:
```
univention-portal (4.0.7-11) unstable; urgency=medium

  * Bug #55379: correct some important thing

 -- Torben Köhn <torben.koehn.extern@univention.de>  Wed, 01 Jan 2023 18:30:22 +0100
```

Notice the increased version (**4.0.7-11** instead of **4.0.7-10**)

2. Build the package

To build the debian package, run the following commands from inside the project root:

```bash
apt-get build-dep .
dpkg-buildpackage -b
```

This **will** throw some signature mismatch error, you can ignore it. The package will be built anyways.

3. Install the package

To install the package with APT, run:

```bash
apt install ../*.deb
```

4. Update packages in UCS

Go into UCS Console and do a normal package update from there. The new package should install and the changes should be active.