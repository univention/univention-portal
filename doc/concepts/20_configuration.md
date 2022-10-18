# Configuration

- subscribers can subscribe to topics with topic subscription keys (TSK) - this is a kind of filter to configure the subset of notifications a subscriber wants to receive
- Tiles (portal object) and Users are two types of possible subscribers
- TSKs are configured user related in OpenLDAP or the database
- TSK is represented in JSON
- TSK contains the following attributes:
    - `appId` - 
    - `appComponent`
    - `notificationType`
    - `userId`
    - `groupId`
    - `severity`
- each attribute represents a filter value that the notifications are filtered for
- the filter can be a concrete value, a list of values or '*' (all)

- tiles are subscribing to status notifications with a separate topic subscription key

- filtering for the userId is done by extracting the userID from the access token

## Initial config for a newly provisioned user
- there will be a default notification group that the user gets assigned to by the provisioning process
- this group contains templates for topic subscription keys that the user can assign to
- during the initialization process the templates get translated to final subscription keys

## Questions
> DW: how do we store the configuration? ACL?

> DW: how the access token is working through Mercure SSE subscription? Especially in case of refreshing

> DW: Who makes the filtering? Backend or Frontend?

> DW: may we foresee to duplicate the user and groups relations into the RDBMS from OpenLDAP? - this would make the notification filtering much more efficient