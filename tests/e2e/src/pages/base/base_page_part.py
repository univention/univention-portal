from pages.base.page_factory import PageFactory


class BasePagePart(PageFactory):
    """
    Page parts represent parts of pages.
    They hold a reference to their parent page in the `parent` instance variable.
    The instance variable `part` holds the playwright locator of the page part,
    in relation to the parent page.
    Page parts should be defined in the parent page objects as follows.

    ```
    class MyPagePart(BasePagePart):
        ...

    class MyPage(BasePage):
        def __init__(self, page):
            super().__init__(page)
            my_page_part_locator = self.page.locator(...)
            self.my_page_part = MyPagePart(self.page, my_page_part_locator, self)
    ```

    To create locators relative to the page part, you have to use the `self.part`
    instance variable.

    ```
    my_page = MyPage(page)
    my_page_part = my_page.my_page_part
    locator_relative_to_page_part = my_page_part.part.locator(...)
    ```

    TODO: In the future, we want to make all playwright locator methods
    accessible via the instance directly i.e. using `self.locator(...)`
    instead of `self.part.locator(...)`.

    Expectations regarding the page part should also use `self.part`, e.g.

    ```
    expect(my_page_part.part).to_be_visible()  # this waits for visibility
    ```

    However, some convenience methods are provided that can be directly accessed
    from the page part e.g.

    ```
    my_page_part.is_visible()  # this does not wait and returns immediately
    ```
    """

    def __init__(self, page, part, parent):
        super().__init__(page)
        self.page = page
        self.parent = parent
        self.part = part

    def is_visible(self):
        return self.part.is_visible()

    def is_hidden(self):
        return self.part.is_hidden()
