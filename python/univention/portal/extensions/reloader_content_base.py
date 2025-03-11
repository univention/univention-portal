
class PortalContentFetcherBase:

    def _validate_assets_base_url(self, url: str) -> str:
        if url and not url.endswith("/"):
            url += "/"
        return url
