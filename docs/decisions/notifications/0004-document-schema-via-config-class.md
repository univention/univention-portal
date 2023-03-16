# Document attributes via Config class method


---

- status: final
- date: 2023-03-16
- deciders: jbornhold

---

## Context

The documentation of the API is generated from the definitions of the data
models. The models are basically referring back to the way how Pydantic is
describing the schema of a data model.

Pydantic offers two ways to add details to an attribute in a data model:

1. Use of a special function `Field` inside of the class definition.

2. Use of a "Config class" which is an inline class definition.


## Decision

We prefer to use the "Config class" approach to document the attributes of our
data models.

After trying out both approaches it turned out that the inline documentation of
the fields does clutter the data models quite a bit.


## Consequences

We have guidance of which approach to prefer when working on the API documentation.


## References

- *Config class* approach of Pydantic -- <https://docs.pydantic.dev/usage/model_config/>

- `Field` function of Pydantic -- <https://docs.pydantic.dev/usage/schema/#field-customization>
