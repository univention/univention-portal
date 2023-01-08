import json
import os
import logging
import requests

import jwt
from jwt import PyJWKClient
from jwt import InvalidAudienceError, InvalidIssuerError, ExpiredSignatureError
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends

security = HTTPBearer()


# oauth2_scheme = OAuth2AuthorizationCodeBearer(authorizationUrl="", tokenUrl="")
credentials: HTTPAuthorizationCredentials = Depends(security)


class Keycloak:

    def __init__(self):
        """
        Initialize instance of the object
        """

        self.realm_name = os.environ.get("REALM_NAME", "ucs")
        self.base_url = os.environ.get("KEYCLOAK_BASE_URL", None)
        assert "http" in self.base_url
        self.client_id = os.environ.get("KEYCLOAK_CLIENT_ID", "notifications-api")
        self.client_secret = os.environ.get("KEYCLOAK_CLIENT_SECRET", None)
        self.audience = os.environ.get("KEYCLOAK_AUDIENCE", "notifications-api")

        # FIXME: This URL could be different since it can be customized
        # for every KC (UCS KC removes /auth/ from the path)
        self.keys_url = f"{self.base_url}/realms/{self.realm_name}/protocol/openid-connect/certs"
        self.public_keys = self.get_jwks()

        # Configure logging
        log_level = os.environ.get('LOG_LEVEL', 'INFO')
        logging.basicConfig(
            format='%(asctime)s %(levelname)s %(message)s',
            datefmt='%d/%m/%Y %I:%M:%S',
            level=log_level)
        self.logger = logging.getLogger(__name__)

    def get_jwks(self):
        response = requests.get(f"{self.keys_url}", verify=False)
        public_keys = {}
        for jwk in response.json().get("keys", []):
            kid = jwk['kid']
            public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
        return public_keys

    def verify_and_decode_token(self, credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials
        kid = jwt.get_unverified_header(token)['kid']
        key = self.public_keys[kid]
        try:
            data = jwt.decode(
                token,
                key=key,  # signing_key.key,
                algorithms=["RS256"],
                audience=self.audience,
                issuer=f"{self.base_url}/realms/{self.realm_name}",
            )
        except (InvalidAudienceError, InvalidIssuerError, ExpiredSignatureError) as error:
            self.logger.warning("Could not verify the token:")
            self.logger.warning(error)
            return
        return data
