# Architectural Decision Records (ADRs)

---

- status: proposed
- date: 2022-10-20
- deciders: phoenix-portal
- consulted: Sebastian König-Festl (extern)

---

## Context and Problem Statement

In the context of the Phoenix Portal, so far no architectural decisions (AD) have 
been tracked in ADRs, although architectural decisions are made constantly.

We want to use ADRs to provide a single point of information for ADs and create a
reliable and comprehensible log for common understanding and later reference.

## Decision Drivers

- ADs made.
- Currently no ADs recorded or recorded inconsistently.
- Growing team and growing requirements.
- ADRs are already used at Univention in the UDS@school team

## Considered Options

- Use no ADRs and rely on a mix of Wiki, Issues and code changes for tracing back 
  ADs.
- Use ADRs like they are used in the UCS@school team
- Use a different format of ADRs


## Decision Outcome

TBD

### Positive Consequences

- Single source of information for ADs.
- Provide motivation to make proactive ADs.
- Be able to trace back and revise ADs.

### Negative Consequences

- Initial ramp-up and potential overhead.
- ADs might still be made or changed and not recorded.

## More Information

### Background

https://adr.github.io/

### Example ADR

The strucure of 
https://git.knut.univention.de/univention/ucsschool/-/blob/5.0/doc/devel/decisions/0001-new-ui-architecture.md
is used.

ADRs are created as Markdown files.
