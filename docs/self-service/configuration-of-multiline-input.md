# Introduction

Related to [Epic 389](https://git.knut.univention.de/groups/univention/-/epics/398)

It should be possible to configure self service fields as multiline/TextArea. The procedure and background for this configuration is described here.

- all potentially available attributes in Self-Service are defined in the UDM Module [users/user.py](https://git.knut.univention.de/univention/ucs/-/blob/5.0-2/management/univention-directory-manager-modules/modules/univention/admin/handlers/users/user.py)
- additional attributes can be defined in two ways:
	1. extending the existing module [users/user.py](https://git.knut.univention.de/univention/ucs/-/blob/5.0-2/management/univention-directory-manager-modules/modules/univention/admin/handlers/users/user.py) with new attribute 
	2. definition of custom attributes [UMC custom attributes](https://docs.software-univention.de/manual/5.0/en/central-management-umc/extended-attributes.html#expansion-of-umc-modules-with-extended-attributes)
- Each attribute definition in [users/user.py](https://git.knut.univention.de/univention/ucs/-/blob/5.0-2/management/univention-directory-manager-modules/modules/univention/admin/handlers/users/user.py) contains a configuration for the syntax to use
- all possible syntaxes are defined in [syntax.py](https://git.knut.univention.de/univention/ucs/-/blob/5.0-2/management/univention-directory-manager-modules/modules/univention/admin/syntax.py#L1125) including the widget type to choose for rendering in the UI

# Solution 

The configuration of displayed (and potentially editable) fields in the Self Service is done by adapting two ucr variables:
- self-service/ldap_attributes and
- self-service/udm_attributes

A description to configure the available Self Service fields can be found here [UCR Config for Self Service](https://docs.software-univention.de/manual/5.0/en/user-management/user-self-service.html#contact-information)

To configure a field in self-service as "Multiline TextArea" we have two options. 

- Option 1 - Syntax override in UCR
- Option 2 - Definition of a custom attribute in UDM 

The selection of one of the options depends on the requirements (existing attribute or custom attribute). 
The underlying principal is to define for the appropriate field a syntax. The syntax name for our case "Multiline TextArea" is `TextArea`.

Setting the syntax for a field has two implications. The first one, is that the field in self-service is displayed regarding the selected syntax. The second is, that the field in the appropriate UDM Module also will use that syntax - and the widget assigned to that syntax.

## Option 1 - Syntax override in UCR
This is the simpler option and allows to override the syntax settings for an existing field. It is described in [7.2.1. UDM syntax override](https://docs.software-univention.de/developer-reference/5.0/en/udm/syntax.html#udm-syntax-override)

E.g. to change the default syntax of the attribute `description` to `TextArea` one need to set the UCR variable: `directory/manager/web/modules/users/user/properties/description/syntax` to `TextArea`

## Option 2 - Definition of a custom attribute in UDM

The definition of custom attributes is described in [UMC custom attributes](https://docs.software-univention.de/manual/5.0/en/central-management-umc/extended-attributes.html#expansion-of-umc-modules-with-extended-attributes)
The key point here is, that the new attribute is assigned to the selected UDM Module (needs to be users/user for our case) and can then be configured as a field in self service. One can choose an LDAP Mapping to a univentionFreeAttribute.

The syntax needs to be defined as `TextArea`
