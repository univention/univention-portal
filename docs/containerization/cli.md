# Portal CLI

## Commands

```python
@cli.command("add-default")
@click.option("--update/--dont-update", default=False)

@cli.command("add-umc-default")
@click.option("--update/--dont-update", default=False)

@cli.command("add-selfservice-default")
@click.option("--update/--dont-update", default=False)

@cli.command("add")
@click.argument("name")
@click.option("--update/--dont-update", default=True)

@cli.command("remove")
@click.argument("name")
@click.option("--purge", default=False)

@cli.command("list")

@cli.command("push")
@click.argument("name")

@cli.command("pull")
@click.argument("name")

@cli.command("update")
@click.argument("name", nargs=-1)
@click.option("--reason", default="force")

@cli.command("list-extensions")
```

## UCS dependencies

- univention.portal
- univention.udm
- univention.ldap_cache

## Portal listeners

### UCS dependencies

- univention.listener
- listener
- univention.debug
