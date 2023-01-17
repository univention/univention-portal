# Specify where tests should be kept and how they should be organized

---

- status: proposed
- date: 2023-01-17
- deciders: dchakravorty, dwolf
- consulted: arequate, fbest, skoenig, tzelleke

---

## Context

The univention-portal repository is a monorepo containing several subprojects.
Some of them are listed below.

1. Portal backend
2. Notification API
3. Portal frontend

We currently have no specification for where tests for these various subprojects
should be kept and how should they be organized.

The portal backend unit tests are at the repository root, while the portal
frontend and notification API have tests inside their respective folders. There
is no folder (yet) for end-to-end tests.

```
├── frontend
│   └── tests
├── notifications-api
│   └── tests
├── python
│   └── univention  # portal backend
├── unittests  # portal backend unit tests
├── univention-portal  # portal backend
└── univention-portal-server  # portal backend
```

The test files sometimes don't have a one-to-one correspondence to code files.

This leads to the following problems.

1. The top level `unittests` folder seems to be a container for all unit tests
in the project, while it only tests the portal backend. This can be confusing
for new developers and clients.
2. Since there are no standard norms being followed, one has to inspect the
entire repository to be sure that they didn't miss out some tests hiding in
non-standard locations.
3. Since there is sometimes no one-to-one correspondence between test files and
code files, one has to dive deep inside the test code and the code-under-test to
figure out which component is tested and which component isn't. This is not only
inefficient, but also erodes the value of unit tests as documentation.
4. There is a functional difference between unit, integration and end-to-end
tests. Clients/devops engineers often focus on end-to-end tests (because those
are end-user facing), while developers focus more on unit tests during
development since they run faster. Integration tests lie somewhere in the middle
of this spectrum and may test multiple subprojects together. As a result of
these functional differences, there is a need to clearly separate these three
kinds of tests so that users can selectively run/inspect the tests that they
care about.
5. Since there is a lack of consensus on test location and organization, there
is a risk of repeated debates (especially at merge time) about these topics
when new tests are added.

A specification for test location and organization, which is agreed upon by the
team and documented, is expected to improve the situation.

However, while making such a specification, it is imperative not to make it too
strict because some frameworks have their own best-practice guidelines on how to
organize tests. We shouldn't make a specification so strict as to exclude those
best practices.

## Decision

The recommended structure is as follows.

### Subproject level `tests` folder for unit tests

Each subproject should be contained in its own folder. Each subproject
should have a folder called `tests` inside it. All unit tests for the subproject
should reside in this `tests` folder.

```
├── frontend
│   └── tests
├── notifications-api
│   └── tests
└── backend
    └── tests
```

### Top-level `tests` folder for end-to-end tests

There should be a top level `tests` folder containing tests whose scope is
larger than a single subproject e.g. end-to-end tests.

```
├── tests
│   └── e2e
├── frontend
│   └── tests
├── notifications-api
│   └── tests
└── backend
    └── tests
```

### Integration test organization

Integration tests lie between the extremes of unit tests and end-to-end
tests. Unit tests test only one function or class, and therefore, naturally
belong to a single subproject. End-to-end tests test the whole project, and
naturally belong to the whole repo. However, classifying integration tests is
not so simple. Here, the key is to identify the components under test. If
all components under test belong to a single subproject, that integration test
should go inside the subproject-level `tests` folder. If the components under
test span multiple subprojects, they should reside in the top-level `tests`
folder. While making these considerations, one should remember that mocked
components are *not* components under test.

We recommend that the top-level `tests` folder contain two subfolders `e2e` and
`integration`. This `integration` folder contains integration tests where the
components under test span multiple subprojects.

The subproject level `tests` folder contains integration tests that test only
components of that subproject. We make no strict recommendation about the
location of such integration tests in the subproject level `tests` folder, since
each language and framework have different best practices for that. For example,
 `cypress` tests are often split into two folders called `unit` and `e2e`, where
 the `e2e` folder actually contain integration tests (and not end-to-end tests,
as the name seems to imply).

Our recommendation is as follows:

1. Please include a `README.md` file in the subproject level `tests` folder
which explains where a user can expect to find unit and integration tests.
2. In case the language or the test framework do not have best practices in
regard to integration tests, you have two options.
    - Create two folders `unit` and `integration` inside the subproject level
    `tests` folder. Unit tests will go in the `unit` folder and integration
    tests go in the `integration` folder.
    - Don't create any subfolders if you want to consider unit and integration
    tests on the same footing.

Choose what works best for the subproject, but document this in the README
file.

```
├── tests
│   ├── e2e
│   └── integration
├── frontend
│   └── tests
│       ├── README.md  # organization is explained here
│       ├── unit
│       └── e2e  # `cypress` convention for naming integration tests folder
├── notifications-api
│   └── tests
│       ├── README.md  # organization is explained here
│       └── test_app.py  # Example: unit and integration tests live together
└── backend
    └── tests
        ├── README.md  # organization is explained here
        ├── unit
        └── integration  # Example: integration tests live in its own folder
```

### Test organization in non-monorepos

In the SWP project, we also have non-monorepos such as ICS and BFP. For these,
the recommended test organization is as follows.

```
└── tests  # top-level tests folder
    ├── README.md  # explains test organization inside this folder
    ├── unit  # name this unit_and_integration if keeping both here
    ├── integration  # optional: omit if kept together with unit tests
    └── e2e
```

### One-to-one correspondence between unit test files and code files

It is recommended that unit test files have a one-to-one correspondence to
code files, unless the language or testing framework makes a different
recommendation.

For example, the recommended structure in Python projects is as follows.

```
backend
├── __init__.py
├── portal
│   ├── __init__.py
│   ├── log.py
│   ├──  ...
│   └── extensions
│       ├── __init__.py
│       ├── authenticator.py
│       └── ...
└── tests
    ├── README.md
    ├── unit
    │   └── portal
    │       ├── test_log.py  # Path mirrors file under test
    │       ├── ...
    │       └── extensions
    │           ├── test_authenticator.py  # Path mirrors file under test
    │           └── ...
    └── integration
```

Unit test files have no line limit. They can have as many lines as needed to
test the code file under test.

## Consequences

### Positive consequences

1. Better overview of tests for both clients and developers.
2. Unit tests more efficiently serve the function of documentation.
3. Users able to selectively run/inspect tests that concern them.
4. Agreement in the team regarding test organization. Fewer debates at merge
time regarding test organization and lower barrier to add tests.

### Negative consequences

Initial overhead because of the following.

1. We will need to refactor the portal backend files so that they go into one
subproject folder.
2. We will need to refactor the existing tests and Dockerfiles, and create the
recommended `README.md` files.



