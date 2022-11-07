
# 409 Planning

Planning preparation for
[Epic 409](https://git.knut.univention.de/groups/univention/-/epics/409).

Preparing for figuring out reasonable steps to reach the goal.




## Container for portal-backend

Compare
[Issue #1](https://git.knut.univention.de/univention/components/univention-portal/-/issues/1).

TODO: Capture background of issue details from fbest. The details contain
implicit design decisions, once the background is found out we should capture
those into a note (or ADR if we do those).

TODO: Find out if there are any constraints which we don't know yet from the UCS
system context. E.g. UCS comes with a promise of quite long term support. This
is probably possible due to its basis on supported Debian packages. A container
build which runs a `pip install` to create the image does expand these
requirements towards packages on pypi, node registry for the frontend and
potentially other sources. Without taking any measures it may be challenging /
impossible to run the build process again in a distant future.


## Container for portal-frontend

Compare
[Issue #2](https://git.knut.univention.de/univention/components/univention-portal/-/issues/2).

TODO: Capture background of issue details from fbest. Capture into note or ADR.

TODO: UCS configuration integration potentially into a separate step, not yet
sure how tricky it is.

TODO: If we do ADRs, then log the design decision that the reverse proxy is in
charge now for the paths and the portal changes in that regard. I've seen this
in the code but not understood why it has been done.



## Configuration of Paths for the portal (UCM)

Compare the epic description of
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).

> Abbilden verschiedener URLs/Pfade unter denen das Portal content ausliefert
>
> Pfade müssen auf dem Host für den Reverse Proxy und im Backend Container für die
> Unterscheidung welche Inhalte ausgeliefert werden bekannt sein
>
> Aktuell gibt es ein UCR Modul zum Erstellen von Symlinks für Apache-Targets und
> eine Auswertung der UCR-Variablen im Backend. Marker: hier stehen wir in der
> Absprache Dirk/Florian/Arvid/Pawel/Ingo



## Unittest integration into CI pipeline

Compare
[Issue 4](https://git.knut.univention.de/univention/components/univention-portal/-/issues/4)

We would have an early benefit as soon as we touch the portal code.


## Change processing (Listener / UDM)

Compare
[Issue #5](https://git.knut.univention.de/univention/components/univention-portal/-/issues/2).

TODO: We have to find out what is already there, it seems to be inside the app
center form. Not sure if anything has been captured in the repository so far.

TODO: If we should go for ADRs, then we should log a note about the decision
to use the App Center listener mechanism.



## Portal can be deployed into Kubernetes

Make it possible, that the portal can be deployed into the following
environment:

1. Kubernetes
   - The portal is running in one or multiple containers
   - The portal can reach the components of the UCS stack via network

This does not contain needed modifications so that the portal can run without a
full UCS stack.



## Portal can be deployed into App Center

Make it possible, that the portal can be deployed into the following
environment:

1. App Center
   - The portal is running in one or multiple containers
   - The portal can reach the components of the UCS stack via network

This does not contain needed modifications so that the portal can run without a
full UCS stack.

Compare
[Issue 3](https://git.knut.univention.de/univention/components/univention-portal/-/issues/3).


## UCS migration path from Debian Package to App Center

Upgrading a current UCS system would have to replace the portal from a Debian
package based deployment into an App Center based deployment.



## UMC connection

TODO: Needs refinement, currently not clear what this is about.

From
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335):

> Limitierung im UMC-Server, dass sessions von ::1 / 127.0.0.1 übernommen werden
> können aufweichen?
>
> UMC-URL konfigurierbar machen?
>
>
> oder OIDC Implementieren?
>
> -> initial sollte der bestehende Ablauf beibehalten werden, das sollte über das
> App Center auf UCS möglich sein. In einem eigenen späteren Epic: Für ein
> Deployment ausserhalb von UCS / in verteilten Umgebungen ist ein SSO per OIDC an
> sowohl Portal als auch UMC notwendig und dann eine Umsetzung des Austausch
> zwischen Portal und UMC (Ermitteln der dem User anzuzeigenden Kacheln) ähnlich
> der Filepicker-Integration zwischen OX und Nextcloud durch ein SSO zwischen den
> Backends (evtl. über den Intercom Service?).



## Portal can run without a full UCS stack

This modifies the portal, so that it can run based on an alternative backend.



## Integration with SouvAP environment

Currently the automated deployment does apply quite a few patches regarding the
portal in order to integrate it.

Assumption: This has to be somehow adapted into the container based deployment.

The sources of the ansible script can be inspected here:
<https://git.knut.univention.de/univention/customers/dataport/custom/bmiux-hetzner-upgrade-automation/-/blob/master/iam_ucs_portal.yml>



## Capture logging decision in ADR

Assumed that we do ADRs, then we should capture:

> Log rotation? Nur noch nach stderr loggen? Wie bei Scripten, die durch listener
> ausgeführt werden?
>
> -> Cotainer sollten ihre Logs immer an den Host "abliefern", der Host / eine
> Implementierung des App Centers auf dem Host muss sich um das Handling der Logs
> kümmern. Implementierungsbedarf dazu muss in ein eigenes Epic gehen.

Source:
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).



## Capture OIDC decision in ADR

Assumed that we do ADRs, then we should capture:

> wollen/können/brauchen wir Maßnahmen für die Entkoppelung des Portals von
> UCS-Komponenten (UDM, UMC, ,,,)?
>
> OIDC in beiden Diensten, um UMC-Kacheln vom UMC-Server zu erhalten
>
> UDM-Reloader gegen UDM REST API? Wozu?

Source:
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).



## TODO: Remaining notes from Epic 335 to check if relevant for the plan or not


Wo findet die Paketierung statt? In UPX-Repositories?

> UCS Produktstandard (das ist keine Phoenix spezifische Entwicklung)


Einbettung von externer custom.css - einfach in den Container kopieren? Selbes
Problem in keycloak.

> wenn möglich über mounts lösen


Einbettung Javascript frontend

> unklar


Self-Service läuft im Portal - weiterhin so?

> Aktuell ist das Frontend des Self Service Teil des Javascript-Codes des
> Portals. Vorschlag: aktuell beibehalten, eine Trennung prüfen wir mit der
> Umstellung des Self Service im Rahmen dessen Containerisierung & Umstellungen
> nach dem RAM Projekt


UCR-Handler für Web-Overview Variablen, die z.b. noch von Apps wie owncloud
verwendet werden

> sollten als API des App Centers verstanden werden: die UCR Handler werden in
> das App Center verschoben und sorgen dort dafür, das Portal-Einträge über UDM
> angelegt werden


Abhängigkeit in UCS auf Docker-App nicht möglich. Im System-Setup per
univention-app install irgendwie mitinstallieren? Wie bei Upgrades? Portal
optional machen?

> die Portal App muss in einem zukünftigen UCS Release automatisch installiert
> werden, daher Anpassung von System-Setup. Zu prüfen: wir haben im Backlog aus
> UCS 5.0 Release noch offene Punkte für Appliances und Auswahl von Apps während
> der Installation, evtl. zusammen angehen?


Appcenter-Provider Portal kann keine beliebigen Dateien speichern.

> s.o., eigenes Epic zur Verbesserung der App Center Infrastruktur


Konflikt der Icon-Pfade / URL's (wird im Code geprüft, ob Datei existiert)

> das Icon wird aktuell vom "reloader" des Portals aus dem LDAP ausgelesen und
> gespeichert. Der muss angepasst werden, da die Icons nicht im Portal-Container
> sondern im Apache-Container abgelegt werden müssen. Vermutlich wird ein
> Listener Plugin für den Apache Container benötigt.

> der Code zur Prüfung des Pfades wird für die UMC-Icons verwendet. Wir müssen
> uns hier im ersten Schritt auf den UMC Server verlassen und prüfen, ob weitere
> Schritte notwendig sind.
