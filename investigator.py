from univention.udm import UDM, NoObject
from univention.udm.encoders import Base64Bzip2BinaryProperty
import json

udm = UDM.machine().version(2)
portal = udm.get("portals/portal")


def _extract_announcements(udm, portal):
		ret = []
        
		def add(announcement, ret, in_portal):
			ret.append({
				"dn": announcement.dn,
				"allowedGroups": announcement.props.allowedGroups,
				"name": announcement.props.name,
				"message": announcement.props.message,
				"title": announcement.props.title,
				"startTime": announcement.props.startTime,
				"endTime": announcement.props.endTime,
				"isSticky": announcement.props.isSticky,
				"needsConfirmation": announcement.props.needsConfirmation,
				"severity": announcement.props.severity
			})


            
		for obj in udm.get("portals/announcement").search():
			add(obj, ret, True)

		return ret


print(_extract_announcements(udm, portal))
# def unmapTranslationValue(vals, encoding=()):
# 	return [val.decode(*encoding).split(u' ', 1) for val in vals]

# def mapTranslationValue(vals, encoding=()):
# 	return [u' '.join(val).encode(*encoding) for val in vals]

# print(mapTranslationValue(unmapTranslationValue([b'"de_DE" "My Title"'])))