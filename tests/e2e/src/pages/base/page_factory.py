class PageFactory:
    """
    All base page objects, page parts and page elements should be derived
    from this class. Utility methods that are common to all page objects, page
    parts and page elements should be defined here.
    """
    def __init__(self, page):
        self.page = page
