# Istio compatibility in HELM charts


---

- status: final
- date: 2023-03-08
- deciders: jbornhold

---

## Context

We've so far developed our HELM charts based on the assumption to use an Nginx
based ingress. Our current SouvAP deployment environment does use Istio instead.

Istio does currently seem to sort the various objects of type `VirtualService`
by their creation timestamp. This means that especially the frontend container
may accidentally steal the whole prefix `/univention/portal/` if things are
deployed in a different order.


## Decisions

### Support Istio and Nginx Ingress

For now we support both cases in our HELM charts. The support shall be
configurable as follows:

- `istio.enable` to select the Istio support.
- `ingress.enable` to select the Nginx Ingress support.

### Avoid depending on the order of match rules

Especially for the frontend container we formulate all matches as explicit as
possible:

- Using the match type `"exact"` for all files in the root of
  `/univention/portal/`.
- Using the match type `"prefix"` for all subpaths which are owned by the
  frontend.


## Rejected alternatives

### Using `delegate` in the `VirtualService` configuration

A `delegate` does allow to pass certain subpaths to other `VirtualService`
configurations. The following example for content of the file `values.yaml`
shows the idea:

```yaml
  virtualService:
    enabled: true
    annotations:
    paths:
      - match: "prefix"
        path: "/univention/portal/notifications-api/"
        delegate: "notifications-api"
      - match: "prefix"
        path: "/univention/portal/icons/"
        delegate: "ucs"
      - match: "prefix"
        path: "/univention/portal/"
        rewrite: "/"
```

This approach has not been further followed because it does entangle the
frontend configuration with the configuration of other components. E.g. the
frontend HELM Chart would have to *know* that there are e.g. `notifications-api`
and `ucs` were certain subpaths have to be delegated to.

The chosen approach with exact fine grained matches does avoid this
interdependence completely.


## Consequences

- Supporting both has a slight overhead because multiple objects have to be
  formulated in the HELM chart template. Keeping us independent from the
  decision which components will be used in the cluster does currently this.
- The Istio configuration for the frontend will be quite verbose.


## Pointers

- [Istio VirtualService documentation](https://istio.io/latest/docs/reference/config/networking/virtual-service/)
- [Istio VirtualService delegate](https://istio.io/latest/docs/reference/config/networking/virtual-service/#Delegate)
- [Issue regarding the priorities in Istio VirtualService](https://github.com/istio/istio/issues/10464)
