# "Information Integration" Mockups

## Overview

This directory contains interactive Mockups to discuss the Look & Feel of
future versions of the Nubus Portal internally and with customers.

## Usage of the Mockups

There are "static" and "interactive" Mockups.

* The static mockups are screenshots stored as PNG
* The "interactive" mockups in the "Portal Mockup HTML" folder are HTML files
  which allow limited interaction, for example some menus and popups of the
  portal can be opened. To test them you need a local copy / checkout of the
  directory to open the "Mockup V[...].html" file in a browser.

There are different stages of discussion with ongoing numbers, as of writing
this there are V1 up to V6. Further versions might follow. If you want to give
feedback please mention the version you are looking at.

## Goal Description

Currently, the Univention Nubus Portal provides an overview of the available
functions within an IT landscape, in which all applications are represented as
tiles in the Portal via deep links. Additionally, information from sources such
as a blog can be displayed in a news feed.

The goal of the Univention Nubus Portal is to present all relevant information
from the IT applications accessible to an end user in a clear and quickly
accessible manner. This should include notifications of updates from the
applications (e.g., new blog posts, newly shared files, newly created projects
or chat rooms), new communications (new emails, chat messages, or comments on
files or projects), as well as action items (today's appointments, to-dos due
today).

When visualizing this relevant information, the presentation should be
logically classified—for example, separating communication from to-dos. In
doing so, the information should not be organized by application, but rather
based on its semantics. This allows a single application to provide information
across multiple semantically separate areas. To provide the user with
orientation, summary portions of the information (e.g., the subject line of an
email) should be accessible within the Portal.

The Portal provides direct access to applications via the tiles. The presence
of "Action Items" per application should be visualized on the tiles, so that
users can immediately identify which application requires their attention.

The Portal is not intended to replicate functions from the applications, but
only to display content and make the applications quickly accessible. If a user
wishes to react to a piece of information, the Portal will provide a deep link
leading directly into the application. This may be a deep link that opens in a
separate browser tab, or an element of the application displayed within the
Portal.

## Status

The mockups in this directory are based on the openDesk
(https://www.opendesk.eu/) theming of the Univention Portal and try to
visualize how End Users would benefit from integrating information from
openDesk modules into the portal. They focus on the look&feel, the technical
feasability will follow. As implemntation will happen in iterations and based
on technical feasability, the final result will differ from this mockups.

The generation of the mockups happened in claude design, the exports are stored
in this directory. The different "Versions" show iterations in the ongoing
discussion.
