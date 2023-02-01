from pages.base.base_page_element import BasePageElement


class NotificationElement(BasePageElement):
    """
    This represents a single notification element.
    """
    def __init__(self, page, element, parent):
        super().__init__(page, element, parent)
        self.close_button = self.element.locator("//*[contains(@data-test, 'closeNotification')]")

    def close(self):
        self.close_button.click()
