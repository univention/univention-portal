from datetime import MAXYEAR, MINYEAR, datetime
from urllib.parse import urlsplit, urlunsplit

import dateutil.parser

from univention.portal.log import get_logger


def _sanitize_and_parse_iso_datetime_str(iso_datetime: str, default: datetime):
    try:
        datetime_obj = dateutil.parser.isoparse(iso_datetime)
    except (ValueError, TypeError):
        datetime_obj = default
    return datetime_obj


def _extend_end_day_to_midnight_if_necessary(end_iso_datetime_str: str, range_end: datetime):
    """
    This is to handle cases, where only an end date is given, but no time.
    In this case isoparse would return a date with hours, mins, ... set to 0.
    This is unintuitive when comparing the current day, as datetime.now()
    returns later hours, mins, ... than 0 but it is still the same day.
    """
    new_range_end = range_end
    if (end_iso_datetime_str and
        len(end_iso_datetime_str) <= len("YYYY-MM-DD") and
            range_end != datetime(MAXYEAR, 12, 31)):
        new_range_end = range_end.replace(
            hour=23,
            minute=59,
            second=59,
            microsecond=999999,
        )
    return new_range_end


def is_current_time_between(start_iso_datetime_str: str, end_iso_datetime_str: str) -> bool:
    """
    Return if the current system time (datetime.now()) lies within the given range.
    In case, start is later than end, ignore both.

    start_iso_datetime_str : str
            the first point in time that is in range
    end_iso_datetime_str : str
            the last point in time that is in range

    return: bool
            is datetime.now() between start_iso_datetime_str and end_iso_datetime_str,
            including boundaries
    """
    now = datetime.now()
    range_start = _sanitize_and_parse_iso_datetime_str(start_iso_datetime_str, datetime(MINYEAR, 1, 1))
    range_end = _sanitize_and_parse_iso_datetime_str(end_iso_datetime_str, datetime(MAXYEAR, 12, 31))
    range_end = _extend_end_day_to_midnight_if_necessary(end_iso_datetime_str, range_end)
    if range_start <= range_end:
        return range_start <= now <= range_end
    else:
        get_logger("util").warning("given time boundaries not in chronological order")
        return True


def log_url_safe(url):
    """
    Hide the password in the URL if present.

    Intended to be used when logging URLs which may contain a password in it.
    """
    parts = urlsplit(url)
    if parts.password:
        netloc_without_auth = parts.netloc.split("@")[1]
        new_netloc = f"{parts.username}:***hidden***@{netloc_without_auth}"
        url = urlunsplit((
            parts.scheme, new_netloc, parts.path, parts.query, parts.fragment))
    return url
