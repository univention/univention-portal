# Gaps — Nubus Portal Mockup

> Hinweis: `Nubus Portal OpenDesk.dc.html` ist auf ausdrückliche Entscheidung des Auftraggebers
> **außerhalb** des Design-Systems gebaut (OpenDesk-Look mit eigenem CSS). Die Lücken unten
> beziehen sich auf `Nubus Portal.dc.html`, die design-system-konforme Variante, und beschreiben
> gleichzeitig, was das Design-System bräuchte, um die OpenDesk-Variante abbilden zu können:
> Kopfzeile mit Suche/Glocke/Avatar, Icon-Set, Kachelraster, Zähler-Badges an Kacheln,
> Dringlichkeitsfarben, Text-/Typografie-Komponente.

### Anwendungs-Kachelraster mit gleich großen Kacheln

- **Screen / context:** Bereich „Anwendungen“ im Portal (Direktzugriff auf Mail, Kalender, Chat, Dateien, Projekte, …)
- **Closest existing component:** `HStack wrap` mit `Card`-Kindern
- **What was shipped instead:** eine umbrechende Reihe aus Cards; jede Kachel ist so breit wie ihr Inhalt
- **Why the vocabulary could not express it:** es gibt kein Grid und keine Möglichkeit, mehreren Kacheln eine gemeinsame feste Größe zu geben (`basis` gilt nur für eine Achse und nur in Stack-Kindern), deshalb wirkt das Raster unruhig.

### Klickbare Kachel (ganze Karte als Deep Link)

- **Screen / context:** Anwendungs-Kacheln sollen die Anwendung per Deep Link öffnen
- **Closest existing component:** `Card` (nicht interaktiv), `Link`, `Button`
- **What was shipped instead:** Kachel mit Titel, Anwendungsname und Action-Item-Badge, ohne Klickziel
- **Why the vocabulary could not express it:** `Card` hat keinen `href`/`onClick`-Vertrag und darf nicht in ein `<a>` gewrappt werden.

### Icons für Anwendungen und Informationsarten

- **Screen / context:** OpenDesk-Look mit Anwendungs-Icons auf den Kacheln und Typ-Icons an den Meldungen
- **Closest existing component:** keine (kein Icon-Component)
- **What was shipped instead:** Textlabel und `Badge` als Ersatz für Icons
- **Why the vocabulary could not express it:** das System enthält kein Icon- oder Avatar-Component.

### Benachrichtigungs-Glocke mit Zählerpanel („Alarmglöckchen“)

- **Screen / context:** Kopfzeile oben rechts
- **Closest existing component:** `Button variant="ghost"` + `Badge`
- **What was shipped instead:** Button „Benachrichtigungen“ mit vorangestelltem Zähler-Badge; kein aufklappbares Panel
- **Why the vocabulary could not express it:** es gibt kein Icon-Component, kein Dropdown/Popover und keinen Badge-Anker an einem Button.

### Visuelle Hierarchie innerhalb einer Meldung (Betreff vs. Metadaten)

- **Screen / context:** alle Meldungen (Mail-Betreff, Chat-Nachricht, Dateiname) mit Absender/Zeit als Sekundärzeile
- **Closest existing component:** keine (kein Text-/Typografie-Component außer `PageHeader`)
- **What was shipped instead:** zwei Textzeilen in einem `VStack gap="xs"`, optisch gleichwertig
- **Why the vocabulary could not express it:** ohne Text-Component und ohne CSS lassen sich Größe, Gewicht und Sekundärfarbe nicht setzen; die wichtigste Zeile hebt sich dadurch nicht ab. Für den Zeilenumbruch selbst musste jede Zeile in einen eigenen `VStack gap="none"` gelegt werden, weil reiner Text kein Flex-Kind ist.

### Trennlinien zwischen Listeneinträgen innerhalb einer Card

- **Screen / context:** Kommunikation, Aufmerksamkeit erforderlich, Newsfeed
- **Closest existing component:** `VStack gap`
- **What was shipped instead:** nur Abstand zwischen den Einträgen
- **Why the vocabulary could not express it:** kein Divider/Separator-Component.

### Dringlichkeitsstufen an Badges (error / warning)

- **Screen / context:** „in 15 Minuten“, „heute fällig“, „ungelesen“ sowie die Action-Item-Badges an den Anwendungs-Kacheln
- **Closest existing component:** `Badge variant="success"` bzw. `variant="ghost"`
- **What was shipped instead:** alle Aufmerksamkeits-Badges nutzen `success`, alle Kontextlabels `ghost`
- **Why the vocabulary could not express it:** `Badge variant="error"`, `"warning"` und `"primary"` haben keine kompilierten Styles und rendern weiß auf weiß. Dadurch gibt es nur eine einzige Signalfarbe — dringend (Termin in 15 Minuten) und normal (heute fällig) sind visuell nicht unterscheidbar.

### Ungelesen-Status als Zustand einer Zeile

- **Screen / context:** ungelesene Mail und ungelesener Chatbeitrag
- **Closest existing component:** `Badge variant="primary"` mit Text „ungelesen“
- **What was shipped instead:** Badge pro Eintrag
- **Why the vocabulary could not express it:** es gibt keinen Zeilen-Zustand (Hintergrund, Markerbalken) für „ungelesen“, das Badge kostet Platz und wiederholt sich in jeder Zeile.
