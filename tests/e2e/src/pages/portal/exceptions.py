class PortalError(Exception):
    """
    Should be raised by Page Object methods if an expectation from the portal
    is violated and playwright's expect() cannot be used for some reason.
    """
