from pages.base.page_factory import PageFactory


class BasePageElement(PageFactory):
    """
    Page elements represent individual elements like a notification, icon etc.
    They hold a reference to their parent page/part in the `parent` instance variable.
    The instance variable `element` holds the playwright locator of the page element,
    in relation to the parent page/part.

    To create locators relative to the page part, you have to use the `self.part`
    instance variable.

    ```
    locator_relative_to_page_element = my_page_element.element.locator(...)
    ```

    TODO: In the future, we want to make all playwright locator methods
    accessible via the instance directly i.e. using `self.locator(...)`
    instead of `self.part.locator(...)`.

    Expectations regarding the page element should also use `self.element`, e.g.

    ```
    expect(my_page_element.element).to_be_visible()  # this waits for visibility
    ```
    """
    def __init__(self, page, element, parent):
        super().__init__(page)
        self.element = element
        self.parent = parent
