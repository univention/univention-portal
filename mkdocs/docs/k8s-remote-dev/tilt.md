# Tilt

## Tiltfile

The Tiltfile is executed on every change.

It is **interpreted code** -- not configuration.

```python title="Example from tilt docs"
# define a function that returns the config for one microservice
def microservice_yaml(name):
  # record file access, using Python string substitution to generate filename
  read_file('config/%s.yaml' % name)
  # run the script with an argument
  return local('./config/generate.py %s' % name)

# define the service names
services = ['frontend', 'backend', 'users', 'graphql']

# loop over each service and register its config
[k8s_yaml(microservice_yaml(service)) for service in services]
```
