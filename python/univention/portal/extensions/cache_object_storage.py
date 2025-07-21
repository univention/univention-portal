#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#


import json
import logging

from botocore.exceptions import ClientError

from univention.portal import PluginWithAbcBase
from univention.portal.extensions.cache import CacheAbc, PortalCacheMixin
from univention.portal.log import get_logger
from univention.portal.util import get_object_storage_client


logger = logging.getLogger(__name__)


class CacheObjectStorage(CacheAbc, metaclass=PluginWithAbcBase):
    """
    Cache implementation which relies on an S3 compatible object store.

    Attributes:
      - ucs_internal_path(str): The path inside the bucket
        where the UCS internal portal/groups/selfservice data are available.
      - object_storage_endpoint(str): url where an object storage server can
        be found (e.g. minio or s3 compatible).
      - bucket(str): The bucket where the portal/groups/selfservice files are
        stored.
      - access_key_id(str): The key identifier (or username) used to
        authenticate with the object storage server.
      - secret_access_key(str): The key's secret (or password) used to
        authenticate with the object storage server.
    """

    def __init__(
        self,
        ucs_internal_path,
        object_storage_endpoint,
        bucket,
        access_key_id,
        secret_access_key,
    ):
        logger.info("Initializing %s with path %s", self.__class__.__name__, ucs_internal_path)
        self._ucs_internal_path = ucs_internal_path
        self._etag = None
        self._cache = {}

        self._object_storage_endpoint = object_storage_endpoint
        self._bucket = bucket
        self._access_key_id = access_key_id
        self._secret_access_key = secret_access_key

        self._object_storage_client = get_object_storage_client(
            object_storage_endpoint,
            access_key_id,
            secret_access_key,
        )

    def get_id(self):
        return self._ucs_internal_path

    def _load(self):
        get_logger("cache").info("Loading data from %s" % self._ucs_internal_path)

        try:
            etag_parameter = {}
            if self._etag:
                etag_parameter = {"IfNoneMatch": self._etag}
            resource_object = self._object_storage_client.get_object(
                Bucket=self._bucket,
                Key=self._ucs_internal_path,
                **etag_parameter,
            )
        except ClientError as err:
            if "Not Modified" in str(err):
                get_logger("cache").info(
                    "%s not modified, no need to refresh cache",
                    self._ucs_internal_path,
                )
                return
            raise err
        except Exception as err:
            get_logger("cache").exception(
                "Error loading %s from object storage: %s",
                self._ucs_internal_path,
                err,
            )
            return

        try:
            self._cache = json.load(resource_object["Body"])
            self._etag = resource_object["ETag"]
            get_logger("cache").info(
                "Loaded from %s",
                self._ucs_internal_path,
            )
        except Exception:
            get_logger("cache").exception(
                "Could not decode the contents of %s",
                self._ucs_internal_path,
            )
            return

    def get(self):
        return self._cache

    def refresh(self, reason=None):
        self._load()


class PortalFileCacheObjectStorage(PortalCacheMixin, CacheObjectStorage):
    pass


class GroupFileCacheObjectStorage(CacheObjectStorage):
    pass
