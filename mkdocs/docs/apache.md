# Apache webserver configuration

=== "Config"
    ```shell
    /etc/apache2/
    ├── apache2.conf
    ├── envvars
    ├── magic
    ├── ports.conf
    ├── conf-enabled
    │   ├── charset.conf -> ../conf-available/charset.conf
    │   ├── localized-error-pages.conf -> ../conf-available/localized-error-pages.conf
    │   ├── other-vhosts-access-log.conf -> ../conf-available/other-vhosts-access-log.conf
    │   ├── security.conf -> ../conf-available/security.conf
    │   ├── serve-cgi-bin.conf -> ../conf-available/serve-cgi-bin.conf
    │   ├── ucs.conf -> ../conf-available/ucs.conf
    │   ├── univention-system-setup.conf -> ../conf-available/univention-system-setup.conf
    │   └── univention-web.conf -> ../conf-available/univention-web.conf
    ├── sso-vhost.conf.d
    │   ├── 01redirect.conf
    │   └── csp.conf
    └── ucs-sites.conf.d
    ├── ucs-sites.conf
    └── univention-portal.conf
    ```

=== "Modules"
    ```shell
    /etc/apache2/
    └── mods-enabled
       ├── access_compat.load -> ../mods-available/access_compat.load
       ├── actions.conf -> ../mods-available/actions.conf
       ├── actions.load -> ../mods-available/actions.load
       ├── alias.conf -> ../mods-available/alias.conf
       ├── alias.load -> ../mods-available/alias.load
       ├── auth_basic.load -> ../mods-available/auth_basic.load
       ├── authn_core.load -> ../mods-available/authn_core.load
       ├── authn_file.load -> ../mods-available/authn_file.load
       ├── authnz_pam.conf -> ../mods-available/authnz_pam.conf
       ├── authnz_pam.load -> ../mods-available/authnz_pam.load
       ├── authz_core.load -> ../mods-available/authz_core.load
       ├── authz_host.load -> ../mods-available/authz_host.load
       ├── authz_user.load -> ../mods-available/authz_user.load
       ├── autoindex.conf -> ../mods-available/autoindex.conf
       ├── autoindex.load -> ../mods-available/autoindex.load
       ├── cgi.load -> ../mods-available/cgi.load
       ├── deflate.conf -> ../mods-available/deflate.conf
       ├── deflate.load -> ../mods-available/deflate.load
       ├── dir.conf -> ../mods-available/dir.conf
       ├── dir.load -> ../mods-available/dir.load
       ├── env.load -> ../mods-available/env.load
       ├── expires.load -> ../mods-available/expires.load
       ├── filter.load -> ../mods-available/filter.load
       ├── headers.load -> ../mods-available/headers.load
       ├── lbmethod_bybusyness.load -> ../mods-available/lbmethod_bybusyness.load
       ├── mime.conf -> ../mods-available/mime.conf
       ├── mime.load -> ../mods-available/mime.load
       ├── mpm_prefork.conf -> ../mods-available/mpm_prefork.conf
       ├── mpm_prefork.load -> ../mods-available/mpm_prefork.load
       ├── negotiation.conf -> ../mods-available/negotiation.conf
       ├── negotiation.load -> ../mods-available/negotiation.load
       ├── proxy_balancer.conf -> ../mods-available/proxy_balancer.conf
       ├── proxy_balancer.load -> ../mods-available/proxy_balancer.load
       ├── proxy.conf -> ../mods-available/proxy.conf
       ├── proxy_connect.load -> ../mods-available/proxy_connect.load
       ├── proxy_http.load -> ../mods-available/proxy_http.load
       ├── proxy.load -> ../mods-available/proxy.load
       ├── reqtimeout.conf -> ../mods-available/reqtimeout.conf
       ├── reqtimeout.load -> ../mods-available/reqtimeout.load
       ├── rewrite.load -> ../mods-available/rewrite.load
       ├── setenvif.conf -> ../mods-available/setenvif.conf
       ├── setenvif.load -> ../mods-available/setenvif.load
       ├── slotmem_shm.load -> ../mods-available/slotmem_shm.load
       ├── socache_shmcb.load -> ../mods-available/socache_shmcb.load
       ├── ssl.conf -> ../mods-available/ssl.conf
       ├── ssl.load -> ../mods-available/ssl.load
       ├── status.conf -> ../mods-available/status.conf
       ├── status.load -> ../mods-available/status.load
       ├── suexec.load -> ../mods-available/suexec.load
       ├── unique_id.load -> ../mods-available/unique_id.load
       ├── wsgi.conf -> ../mods-available/wsgi.conf
       └── wsgi.load -> ../mods-available/wsgi.load
    ```

=== "Sites"
    ```shell
    /etc/apache2/
    └── sites-enabled
       ├── 000-default.conf -> ../sites-available/000-default.conf
       ├── default-ssl.conf -> ../sites-available/default-ssl.conf
       ├── univention.conf -> ../sites-available/univention.conf
       ├── univention-portal.conf -> ../sites-available/univention-portal.conf
       ├── univention-saml.conf -> ../sites-available/univention-saml.conf
       ├── univention-server-overview.conf -> ../sites-available/univention-server-overview.conf
       ├── univention-udm.conf -> ../sites-available/univention-udm.conf
       └── univention-vhosts.conf -> ../sites-available/univention-vhosts.conf
    ```

## Condensed configuration

??? abstract "Notes on Apache configuration"

    === "Configuration sections"
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
        nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
        massa, nec semper lorem quam in massa.

    === "Rewrite incoming requests"
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
        nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
        massa, nec semper lorem quam in massa.


??? abstract "Condensed Apache configuration"

    ```shell
    DefaultRuntimeDir ${APACHE_RUN_DIR}
    PidFile ${APACHE_PID_FILE}
    Timeout 300
    KeepAlive On
    MaxKeepAliveRequests 100
    KeepAliveTimeout 5
    User ${APACHE_RUN_USER}
    Group ${APACHE_RUN_GROUP}
    HostnameLookups Off
    ErrorLog ${APACHE_LOG_DIR}/error.log
    LogLevel warn

    IncludeOptional mods-enabled/*.load
    IncludeOptional mods-enabled/*.conf

    Listen 80  # Listen 443 is specified 'mods-enabled/ssl.conf

    <Directory />
            Options FollowSymLinks
            AllowOverride None
            Require all denied
    </Directory>

    <Directory /usr/share>
            AllowOverride None
            Require all granted
    </Directory>

    <Directory /var/www/>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
    </Directory>

    AccessFileName .htaccess
    <FilesMatch "^\.ht">
            Require all denied
    </FilesMatch>

    LogFormat "%v:%p %h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" vhost_combined
    LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
    LogFormat "%h %l %u %t \"%r\" %>s %O" common
    LogFormat "%{Referer}i -> %U" referer
    LogFormat "%{User-agent}i" agent

    CustomLog ${APACHE_LOG_DIR}/other_vhosts_access.log vhost_combined
    ServerTokens OS
    ServerSignature On
    TraceEnable Off

    <IfModule mod_alias.c>
            <IfModule mod_cgi.c>
                    Define ENABLE_USR_LIB_CGI_BIN
            </IfModule>

            <IfModule mod_cgid.c>
                    Define ENABLE_USR_LIB_CGI_BIN
            </IfModule>

            <IfDefine ENABLE_USR_LIB_CGI_BIN>
                    ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
                    <Directory "/usr/lib/cgi-bin">
                            AllowOverride None
                            Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
                            Require all granted
                    </Directory>
            </IfDefine>
    </IfModule>

    MaxRequestWorkers 150
    ServerAdmin webmaster@ucs-8322.univention.intranet
    ServerSignature On

    LogLevel warn

    <Directory /var/www/>
            Options +Indexes +FollowSymLinks +MultiViews
            AllowOverride AuthConfig Limit FileInfo

            Order allow,deny
            allow from all
    </Directory>

    RewriteEngine On
    RewriteCond "%{HTTP_HOST}" "!^localhost$" [NC]
    RewriteRule "^/univention/setup/" "/univention/management/" [R]
            
    <Directory "/var/www/univention/">
            Options -Indexes
            RewriteEngine On
            ExpiresActive On
            # one month for images and fonts
            ExpiresByType image/* A2592000
            ExpiresByType application/font-woff A2592000
            # zero time for json files
            ExpiresByType application/json M0
            # one week for CSS and HTML files
            ExpiresByType text/css A604800
            ExpiresByType text/html A604800
            # one day for JavaScript files
            ExpiresByType application/javascript A86400

            # workaround for Bug #37720 comment 14: consider enabling the following line with httpd >= 2.5
            RequestHeader edit "If-None-Match" '^"((.*)-(gzip|br))"$' '"$1", "$2"'
            # DeflateAlterETag NoChange
    </Directory>

    <LocationMatch "/univention/.*\.(js|html|css)$">
            Header set Cache-Control "max-age=3600, must-revalidate, private"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/js/(hooks|config).js$">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/(languages|meta).json$">
            Header set Cache-Control "no-cache, private"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/(login|management)/(index.html)?$">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </LocationMatch>

    <Location "/univention/js/dojo/dojo.js">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </Location>

    <Location "/univention/js/dijit/themes/umc/umc.css">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </Location>

    <LocationMatch "^/univention/$">
            <If "-d '/var/www/univention/portal/' || -L '/var/www/univention/portal/'">
                    Redirect temp /univention/ /univention/portal/
            </If>
            <Else>
                    Redirect temp /univention/ /univention/management/
            </Else>
    </LocationMatch>
        
    <VirtualHost *:80>
            RewriteEngine on
            RewriteOptions Inherit
            ProxyPreserveHost on
            ProxyTimeout 600

            RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
            RequestHeader set "X-Forwarded-SSL" expr=%{HTTPS}

            DocumentRoot /var/www/
            CustomLog /var/log/apache2/access.log combined
            RedirectMatch ^/$ /univention/

            ProxyPassMatch /(univention/portal/.*) http://127.0.0.1:8095/$1 retry=0

            <Directory /var/www/univention/portal/>
                    <FilesMatch "(portal|apps)\.json|portal\.css">
                            Header set Cache-Control "max-age=0, must-revalidate"
                    </FilesMatch>
            </Directory>
            <Directory /var/www/univention/portal/>
                    Header set Cache-Control "max-age=0, must-revalidate"
            </Directory>


            ProxyPassMatch /(univention/umc/.*) http://127.0.0.1:8095/$1 retry=0

            <Directory /var/www/univention/umc/>
                    <FilesMatch "(portal|apps)\.json|portal\.css">
                            Header set Cache-Control "max-age=0, must-revalidate"
                    </FilesMatch>
            </Directory>
            <Directory /var/www/univention/umc/>
                    Header set Cache-Control "max-age=0, must-revalidate"
            </Directory>
    </VirtualHost>

    <IfModule mod_ssl.c>
    <VirtualHost *:443>
            RewriteEngine on
            RewriteOptions Inherit
            ProxyPreserveHost on
            ProxyTimeout 600

            RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
            RequestHeader set "X-Forwarded-SSL" expr=%{HTTPS}

            DocumentRoot /var/www/
            CustomLog /var/log/apache2/access.log combined
            RedirectMatch ^/$ /univention/

            ProxyPassMatch /(univention/portal/.*) http://127.0.0.1:8095/$1 retry=0

            <Directory /var/www/univention/portal/>
                    <FilesMatch "(portal|apps)\.json|portal\.css">
                            Header set Cache-Control "max-age=0, must-revalidate"
                    </FilesMatch>
            </Directory>
            <Directory /var/www/univention/portal/>
                    Header set Cache-Control "max-age=0, must-revalidate"
            </Directory>


            ProxyPassMatch /(univention/umc/.*) http://127.0.0.1:8095/$1 retry=0

            <Directory /var/www/univention/umc/>
                    <FilesMatch "(portal|apps)\.json|portal\.css">
                            Header set Cache-Control "max-age=0, must-revalidate"
                    </FilesMatch>
            </Directory>
            <Directory /var/www/univention/umc/>
                    Header set Cache-Control "max-age=0, must-revalidate"
            </Directory>
            
            SSLEngine on
            SSLProxyEngine on
            SSLProxyCheckPeerCN off
            SSLProxyCheckPeerName off
            SSLProxyCheckPeerExpire off
            SSLCertificateFile /etc/univention/ssl/ucs-8322.univention.intranet/cert.pem
            SSLCertificateKeyFile /etc/univention/ssl/ucs-8322.univention.intranet/private.key
            SSLCACertificateFile /etc/univention/ssl/ucsCA/CAcert.pem
    </VirtualHost>
    </IfModule>

    ProxyPreserveHost on
    RewriteEngine On

    # avoid 404 Not Found errors for not existing translation files
    RewriteCond %{REQUEST_URI} ^/univention/js/.*/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/management/modules/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/(management|portal|login|server-overview|self-service|setup)/i18n/[^/]*/.*\.json
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-f
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-d
    RewriteRule .* /univention/management/widgets/i18n/empty.json [T=application/json,L]

    # prevent to proxy requests under /univention/ to the UMC-Webserver if the request URI matches a existing file
    SetEnvIfExpr "'%{REQUEST_URI}' =~ m#^/univention/# && '%{REQUEST_URI}' !~ m#^/univention/udm/?$# && (-f '%{DOCUMENT_ROOT}%{REQUEST_URI}' || -d '%{DOCUMENT_ROOT}%{REQUEST_URI}')" "no-proxy=1"



    <LocationMatch "^/univention/login/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval'  https://www.piwik.univention.de/ ; frame-ancestors 'self';"

    </LocationMatch>

    <LocationMatch "^/univention/saml/">
            Header always setifempty "Content-Security-Policy" "frame-ancestors 'self';"

    </LocationMatch>

    <LocationMatch "^/univention/management/.*">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com/ https://s.ytimg.com/ https://www.piwik.univention.de/ https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src data: *; media-src *; frame-src *; font-src 'self'; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; form-action 'self'; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; "

    </LocationMatch>



    <LocationMatch "^/univention/(.*)$">
            RequestHeader set X-UMC-HTTPS %{HTTPS}s
            ErrorDocument 502 /error-univention
            ErrorDocument 503 /error-univention
            # fix for bug in cherrypy returning 408/409 errors out of the blue:
            #   http://cherrypy.org/ticket/853
            SetEnv proxy-nokeepalive 1
            Header always setifempty "X-Permitted-Cross-Domain-Policies" "master-only"
            Header always setifempty "X-XSS-Protection" "1; mode=block"
            Header always setifempty "X-Content-Type-Options" "nosniff"
            Header always setifempty "Content-Security-Policy" "frame-ancestors 'none';"
    </LocationMatch>

    WSGIScriptAlias "/error-univention" "/usr/share/univention-management-console/error.py"

    # do not proxy forward certain requests
    ProxyPassMatch "^/univention/js(/|_.*)" "!"
    ProxyPassMatch /univention/management/modules/ "!"

    ProxyPassMatch "^/univention/((auth|saml|get|set|command|upload|logout)/?.*)$" http://127.0.0.1:8090/$1 retry=0 timeout=311
    ProxyPassReverse "^/univention/((auth|saml|get|set|command|upload|logout)/?.*)$" http://127.0.0.1:8090/


    RedirectMatch ^/umc(/$|$) /univention/umc/
    RewriteRule ^/univention-management-console(/|/index.html)?$ /univention/management/ [R]

    <LocationMatch "^/univention/portal/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; style-src-elem 'self' 'unsafe-inline'; font-src 'self'; img-src data: *; frame-src *; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/;"
    </LocationMatch>


    <LocationMatch "^/univention/umc/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; style-src-elem 'self' 'sha256-kDRQ3dagwwb3nrm8xnMC0VgLt6lNN98+2oajznduaKI='; font-src 'self'; img-src data: *; frame-src *; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/;"
    </LocationMatch>

    Alias /simplesamlphp/saml2/idp/certificate /etc/simplesamlphp/ucs-sso.univention.intranet-idp-certificate.crt
    <Directory "/etc/simplesamlphp">
            <Files "ucs-sso.univention.intranet-idp-certificate.crt">
                    Require all granted
            </Files>
    </Directory>

    Alias /simplesamlphp /usr/share/simplesamlphp/www
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^/?simplesamlphp/(.*) https://%{SERVER_NAME}/simplesamlphp/$1 [R,L]


    <Directory /usr/share/simplesamlphp/www/>
            <FilesMatch ".+\.ph(p[345]?|t|tml)$">
                    SetHandler php-cgi
            </FilesMatch>
            Action php-cgi /saml-bin/php-cgi

            Order allow,deny
            Allow from all
    </Directory>
    <Directory /var/www/saml/>
            Options -Indexes
    </Directory>

    <IfModule mod_ssl.c>
    <VirtualHost *:443>
            # If we are in ucs-sso virtualhost context we need to redirect the requests to the correct FQDN

            RewriteCond %{HTTP_HOST} ^ucs-sso.univention.intranet$
            RewriteCond %{REQUEST_URI} ^/univention/(login|management|self-service|portal|server-overview)/$
            RewriteRule ^/univention/(.*)$ %{REQUEST_SCHEME}://ucs-8322.univention.intranet/univention/$1 [L,QSA,R=301,END]
            
            SSLEngine on
            SSLProxyEngine on
            ServerName ucs-sso.univention.intranet
            SSLCertificateFile /etc/univention/ssl/ucs-sso.univention.intranet/cert.pem
            SSLCertificateKeyFile /etc/univention/ssl/ucs-sso.univention.intranet/private.key
            SSLCACertificateFile /etc/univention/ssl/ucsCA/CAcert.pem
            
            DocumentRoot /var/www/
            RedirectMatch ^/$ /simplesamlphp/

            ScriptAlias /saml-bin /var/www/saml
            SuexecUserGroup samlcgi samlcgi

            # simplesamlphp uses this header to decide which idp config to use.
            # This decision is case sensitive. Setting the HOST header here, ensures the right case.
            RequestHeader set HOST ucs-sso.univention.intranet

            RewriteEngine on
            RewriteCond %{HTTP:Authorization}  !^$
            RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
    </VirtualHost>
    <VirtualHost *:80>
            # If we are in ucs-sso virtualhost context we need to redirect the requests to the correct FQDN

            RewriteCond %{HTTP_HOST} ^ucs-sso.univention.intranet$
            RewriteCond %{REQUEST_URI} ^/univention/(login|management|self-service|portal|server-overview)/$
            RewriteRule ^/univention/(.*)$ %{REQUEST_SCHEME}://ucs-8322.univention.intranet/univention/$1 [L,QSA,R=301,END]
            
            ServerName ucs-sso.univention.intranet
            DocumentRoot /var/www/
            RedirectMatch ^/$ /simplesamlphp/

            ScriptAlias /saml-bin /var/www/saml
            SuexecUserGroup samlcgi samlcgi

            RewriteEngine on
            RewriteCond %{HTTP:Authorization}  !^$
            RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
    </VirtualHost>
    </IfModule>

    <LocationMatch "^/univention/server-overview/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; img-src data: *; frame-src *; connect-src 'self' https:/// http:///; frame-ancestors 'self' https:/// http:///;"

    </LocationMatch>

    ProxyPass /univention/udm/ http://127.0.0.1:9979/udm/ retry=0
    <LocationMatch "^/univention/udm/.*">
            ErrorDocument 502 /error-univention
            ErrorDocument 503 /error-univention
            # Header always setifempty "X-Frame-Options" "SAMEORIGIN"
    </LocationMatch>



    # FIXME: this rule does not work
    <If "%{REQUEST_URI} == '/univention/udm/'">
            UnsetEnv "no-proxy"
    </If>
    ```

## Individual configuration files

=== "apachectl -S"
    ```shell
    VirtualHost configuration:
    *:443                  is a NameVirtualHost
             default server ucs-8322.univention.intranet (/etc/apache2/sites-enabled/default-ssl.conf:16)
             port 443 namevhost ucs-8322.univention.intranet (/etc/apache2/sites-enabled/default-ssl.conf:16)
             port 443 namevhost ucs-sso.univention.intranet (/etc/apache2/sites-enabled/univention-saml.conf:38)
    *:80                   is a NameVirtualHost
             default server ucs-8322.univention.intranet (/etc/apache2/sites-enabled/000-default.conf:13)
             port 80 namevhost ucs-8322.univention.intranet (/etc/apache2/sites-enabled/000-default.conf:13)
             port 80 namevhost ucs-sso.univention.intranet (/etc/apache2/sites-enabled/univention-saml.conf:61)
    ServerRoot: "/etc/apache2"
    Main DocumentRoot: "/var/www/html"
    Main ErrorLog: "/var/log/apache2/error.log"
    Mutex mpm-accept: using_defaults
    Mutex watchdog-callback: using_defaults
    Mutex proxy-balancer-shm: using_defaults
    Mutex rewrite-map: using_defaults
    Mutex ssl-stapling-refresh: using_defaults
    Mutex ssl-stapling: using_defaults
    Mutex proxy: using_defaults
    Mutex ssl-cache: using_defaults
    Mutex default: dir="/var/run/apache2/" mechanism=default 
    PidFile: "/var/run/apache2/apache2.pid"
    Define: DUMP_VHOSTS
    Define: DUMP_RUN_CFG
    Define: ENABLE_USR_LIB_CGI_BIN
    User: name="www-data" id=33
    Group: name="www-data" id=33
    ```

=== "apache2.conf"
    ```shell
    # This is the main Apache server configuration file.  It contains the
    # configuration directives that give the server its instructions.
    # See http://httpd.apache.org/docs/2.4/ for detailed information about
    # the directives and /usr/share/doc/apache2/README.Debian about Debian specific
    # hints.
    #
    #
    # Summary of how the Apache 2 configuration works in Debian:
    # The Apache 2 web server configuration in Debian is quite different to
    # upstream's suggested way to configure the web server. This is because Debian's
    # default Apache2 installation attempts to make adding and removing modules,
    # virtual hosts, and extra configuration directives as flexible as possible, in
    # order to make automating the changes and administering the server as easy as
    # possible.

    # It is split into several files forming the configuration hierarchy outlined
    # below, all located in the /etc/apache2/ directory:
    #
    #       /etc/apache2/
    #       |-- apache2.conf
    #       |       `--  ports.conf
    #       |-- mods-enabled
    #       |       |-- *.load
    #       |       `-- *.conf
    #       |-- conf-enabled
    #       |       `-- *.conf
    #       `-- sites-enabled
    #               `-- *.conf
    #
    #
    # * apache2.conf is the main configuration file (this file). It puts the pieces
    #   together by including all remaining configuration files when starting up the
    #   web server.
    #
    # * ports.conf is always included from the main configuration file. It is
    #   supposed to determine listening ports for incoming connections which can be
    #   customized anytime.
    #
    # * Configuration files in the mods-enabled/, conf-enabled/ and sites-enabled/
    #   directories contain particular configuration snippets which manage modules,
    #   global configuration fragments, or virtual host configurations,
    #   respectively.
    #
    #   They are activated by symlinking available configuration files from their
    #   respective *-available/ counterparts. These should be managed by using our
    #   helpers a2enmod/a2dismod, a2ensite/a2dissite and a2enconf/a2disconf. See
    #   their respective man pages for detailed information.
    #
    # * The binary is called apache2. Due to the use of environment variables, in
    #   the default configuration, apache2 needs to be started/stopped with
    #   /etc/init.d/apache2 or apache2ctl. Calling /usr/bin/apache2 directly will not
    #   work with the default configuration.


    # Global configuration
    #

    #
    # ServerRoot: The top of the directory tree under which the server's
    # configuration, error, and log files are kept.
    #
    # NOTE!  If you intend to place this on an NFS (or otherwise network)
    # mounted filesystem then please read the Mutex documentation (available
    # at <URL:http://httpd.apache.org/docs/2.4/mod/core.html#mutex>);
    # you will save yourself a lot of trouble.
    #
    # Do NOT add a slash at the end of the directory path.
    #
    #ServerRoot "/etc/apache2"

    #
    # The accept serialization lock file MUST BE STORED ON A LOCAL DISK.
    #
    #Mutex file:${APACHE_LOCK_DIR} default

    #
    # The directory where shm and other runtime files will be stored.
    #

    DefaultRuntimeDir ${APACHE_RUN_DIR}

    #
    # PidFile: The file in which the server should record its process
    # identification number when it starts.
    # This needs to be set in /etc/apache2/envvars
    #
    PidFile ${APACHE_PID_FILE}

    #
    # Timeout: The number of seconds before receives and sends time out.
    #
    Timeout 300

    #
    # KeepAlive: Whether or not to allow persistent connections (more than
    # one request per connection). Set to "Off" to deactivate.
    #
    KeepAlive On

    #
    # MaxKeepAliveRequests: The maximum number of requests to allow
    # during a persistent connection. Set to 0 to allow an unlimited amount.
    # We recommend you leave this number high, for maximum performance.
    #
    MaxKeepAliveRequests 100

    #
    # KeepAliveTimeout: Number of seconds to wait for the next request from the
    # same client on the same connection.
    #
    KeepAliveTimeout 5


    # These need to be set in /etc/apache2/envvars
    User ${APACHE_RUN_USER}
    Group ${APACHE_RUN_GROUP}

    #
    # HostnameLookups: Log the names of clients or just their IP addresses
    # e.g., www.apache.org (on) or 204.62.129.132 (off).
    # The default is off because it'd be overall better for the net if people
    # had to knowingly turn this feature on, since enabling it means that
    # each client request will result in AT LEAST one lookup request to the
    # nameserver.
    #
    HostnameLookups Off

    # ErrorLog: The location of the error log file.
    # If you do not specify an ErrorLog directive within a <VirtualHost>
    # container, error messages relating to that virtual host will be
    # logged here.  If you *do* define an error logfile for a <VirtualHost>
    # container, that host's errors will be logged there and not here.
    #
    ErrorLog ${APACHE_LOG_DIR}/error.log

    #
    # LogLevel: Control the severity of messages logged to the error_log.
    # Available values: trace8, ..., trace1, debug, info, notice, warn,
    # error, crit, alert, emerg.
    # It is also possible to configure the log level for particular modules, e.g.
    # "LogLevel info ssl:warn"
    #
    LogLevel warn

    # Include module configuration:
    IncludeOptional mods-enabled/*.load
    IncludeOptional mods-enabled/*.conf

    # Include list of ports to listen on
    Include ports.conf


    # Sets the default security model of the Apache2 HTTPD server. It does
    # not allow access to the root filesystem outside of /usr/share and /var/www.
    # The former is used by web applications packaged in Debian,
    # the latter may be used for local directories served by the web server. If
    # your system is serving content from a sub-directory in /srv you must allow
    # access here, or in any related virtual host.
    <Directory />
            Options FollowSymLinks
            AllowOverride None
            Require all denied
    </Directory>

    <Directory /usr/share>
            AllowOverride None
            Require all granted
    </Directory>

    <Directory /var/www/>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
    </Directory>

    #<Directory /srv/>
    #       Options Indexes FollowSymLinks
    #       AllowOverride None
    #       Require all granted
    #</Directory>




    # AccessFileName: The name of the file to look for in each directory
    # for additional configuration directives.  See also the AllowOverride
    # directive.
    #
    AccessFileName .htaccess

    #
    # The following lines prevent .htaccess and .htpasswd files from being
    # viewed by Web clients.
    #
    <FilesMatch "^\.ht">
            Require all denied
    </FilesMatch>


    #
    # The following directives define some format nicknames for use with
    # a CustomLog directive.
    #
    # These deviate from the Common Log Format definitions in that they use %O
    # (the actual bytes sent including headers) instead of %b (the size of the
    # requested file), because the latter makes it impossible to detect partial
    # requests.
    #
    # Note that the use of %{X-Forwarded-For}i instead of %h is not recommended.
    # Use mod_remoteip instead.
    #
    LogFormat "%v:%p %h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" vhost_combined
    LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
    LogFormat "%h %l %u %t \"%r\" %>s %O" common
    LogFormat "%{Referer}i -> %U" referer
    LogFormat "%{User-agent}i" agent

    # Include of directories ignores editors' and dpkg's backup files,
    # see README.Debian for details.

    # Include generic snippets of statements
    IncludeOptional conf-enabled/*.conf

    # Include the virtual host configurations:
    IncludeOptional sites-enabled/*.conf

    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    ```

=== "ports.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/ports.conf
    # 
    Listen 80
    ```

=== "cat conf-enabled/*.conf"
    ```shell
    # Read the documentation before enabling AddDefaultCharset.
    # In general, it is only a good idea if you know that all your files
    # have this encoding. It will override any encoding given in the files
    # in meta http-equiv or xml encoding tags.

    #AddDefaultCharset UTF-8

    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    # Customizable error responses come in three flavors:
    # 1) plain text
    # 2) local redirects
    # 3) external redirects
    #
    # Some examples:
    #ErrorDocument 500 "The server made a boo boo."
    #ErrorDocument 404 /missing.html
    #ErrorDocument 404 "/cgi-bin/missing_handler.pl"
    #ErrorDocument 402 http://www.example.com/subscription_info.html
    #

    #
    # Putting this all together, we can internationalize error responses.
    #
    # We use Alias to redirect any /error/HTTP_<error>.html.var response to
    # our collection of by-error message multi-language collections.  We use
    # includes to substitute the appropriate text.
    #
    # You can modify the messages' appearance without changing any of the
    # default HTTP_<error>.html.var files by adding the line:
    #
    #Alias /error/include/ "/your/include/path/"
    #
    # which allows you to create your own set of files by starting with the
    # /usr/share/apache2/error/include/ files and copying them to /your/include/path/,
    # even on a per-VirtualHost basis.  If you include the Alias in the global server
    # context, is has to come _before_ the 'Alias /error/ ...' line.
    #
    # The default include files will display your Apache version number and your
    # ServerAdmin email address regardless of the setting of ServerSignature.
    #
    # WARNING: The configuration below will NOT work out of the box if you have a
    #                 SetHandler directive in a <Location /> context somewhere. Adding
    #                 the following three lines AFTER the <Location /> context should
    #                 make it work in most cases:
    #                 <Location /error/>
    #                        SetHandler none
    #                 </Location>
    #
    # The internationalized error documents require mod_alias, mod_include
    # and mod_negotiation.  To activate them, uncomment the following 37 lines.

    #<IfModule mod_negotiation.c>
    #       <IfModule mod_include.c>
    #               <IfModule mod_alias.c>
    #
    #                       Alias /error/ "/usr/share/apache2/error/"
    #
    #                       <Directory "/usr/share/apache2/error">
    #                               Options IncludesNoExec
    #                               AddOutputFilter Includes html
    #                               AddHandler type-map var
    #                               Order allow,deny
    #                               Allow from all
    #                               LanguagePriority en cs de es fr it nl sv pt-br ro
    #                               ForceLanguagePriority Prefer Fallback
    #                       </Directory>
    #
    #                       ErrorDocument 400 /error/HTTP_BAD_REQUEST.html.var
    #                       ErrorDocument 401 /error/HTTP_UNAUTHORIZED.html.var
    #                       ErrorDocument 403 /error/HTTP_FORBIDDEN.html.var
    #                       ErrorDocument 404 /error/HTTP_NOT_FOUND.html.var
    #                       ErrorDocument 405 /error/HTTP_METHOD_NOT_ALLOWED.html.var
    #                       ErrorDocument 408 /error/HTTP_REQUEST_TIME_OUT.html.var
    #                       ErrorDocument 410 /error/HTTP_GONE.html.var
    #                       ErrorDocument 411 /error/HTTP_LENGTH_REQUIRED.html.var
    #                       ErrorDocument 412 /error/HTTP_PRECONDITION_FAILED.html.var
    #                       ErrorDocument 413 /error/HTTP_REQUEST_ENTITY_TOO_LARGE.html.var
    #                       ErrorDocument 414 /error/HTTP_REQUEST_URI_TOO_LARGE.html.var
    #                       ErrorDocument 415 /error/HTTP_UNSUPPORTED_MEDIA_TYPE.html.var
    #                       ErrorDocument 500 /error/HTTP_INTERNAL_SERVER_ERROR.html.var
    #                       ErrorDocument 501 /error/HTTP_NOT_IMPLEMENTED.html.var
    #                       ErrorDocument 502 /error/HTTP_BAD_GATEWAY.html.var
    #                       ErrorDocument 503 /error/HTTP_SERVICE_UNAVAILABLE.html.var
    #                       ErrorDocument 506 /error/HTTP_VARIANT_ALSO_VARIES.html.var
    #               </IfModule>
    #       </IfModule>
    #</IfModule>

    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    # Define an access log for VirtualHosts that don't define their own logfile
    CustomLog ${APACHE_LOG_DIR}/other_vhosts_access.log vhost_combined

    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    #
    # Disable access to the entire file system except for the directories that
    # are explicitly allowed later.
    #
    # This currently breaks the configurations that come with some web application
    # Debian packages.
    #
    #<Directory />
    #   AllowOverride None
    #   Require all denied
    #</Directory>


    # Changing the following options will not really affect the security of the
    # server, but might make attacks slightly more difficult in some cases.

    #
    # ServerTokens
    # This directive configures what you return as the Server HTTP response
    # Header. The default is 'Full' which sends information about the OS-Type
    # and compiled in modules.
    # Set to one of:  Full | OS | Minimal | Minor | Major | Prod
    # where Full conveys the most information, and Prod the least.
    #ServerTokens Minimal
    ServerTokens OS
    #ServerTokens Full

    #
    # Optionally add a line containing the server version and virtual host
    # name to server-generated pages (internal error documents, FTP directory
    # listings, mod_status and mod_info output etc., but not CGI generated
    # documents or custom error documents).
    # Set to "EMail" to also include a mailto: link to the ServerAdmin.
    # Set to one of:  On | Off | EMail
    #ServerSignature Off
    ServerSignature On

    #
    # Allow TRACE method
    #
    # Set to "extended" to also reflect the request body (only for testing and
    # diagnostic purposes).
    #
    # Set to one of:  On | Off | extended
    TraceEnable Off
    #TraceEnable On

    #
    # Forbid access to version control directories
    #
    # If you use version control systems in your document root, you should
    # probably deny access to their directories. For example, for subversion:
    #
    #<DirectoryMatch "/\.svn">
    #   Require all denied
    #</DirectoryMatch>

    #
    # Setting this header will prevent MSIE from interpreting files as something
    # else than declared by the content type in the HTTP headers.
    # Requires mod_headers to be enabled.
    #
    #Header set X-Content-Type-Options: "nosniff"

    #
    # Setting this header will prevent other sites from embedding pages from this
    # site as frames. This defends against clickjacking attacks.
    # Requires mod_headers to be enabled.
    #
    #Header set X-Frame-Options: "sameorigin"


    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    <IfModule mod_alias.c>
            <IfModule mod_cgi.c>
                    Define ENABLE_USR_LIB_CGI_BIN
            </IfModule>

            <IfModule mod_cgid.c>
                    Define ENABLE_USR_LIB_CGI_BIN
            </IfModule>

            <IfDefine ENABLE_USR_LIB_CGI_BIN>
                    ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
                    <Directory "/usr/lib/cgi-bin">
                            AllowOverride None
                            Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
                            Require all granted
                    </Directory>
            </IfDefine>
    </IfModule>

    # vim: syntax=apache ts=4 sw=4 sts=4 sr noet
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/conf-available/ucs.conf
    # 

    MaxRequestWorkers 150
    ServerAdmin webmaster@ucs-8322.univention.intranet
    ServerSignature On


    # Possible values include: debug, info, notice, warn, error, crit,
    # alert, emerg.
    LogLevel warn

    <Directory /var/www/>
            Options +Indexes +FollowSymLinks +MultiViews
            AllowOverride AuthConfig Limit FileInfo

            Order allow,deny
            allow from all
    </Directory>
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/conf-available/univention-system-setup.conf
    # 


    # only allow access to "/univention/setup" for access to localhost
    # (i.e., for the setup within the virtual machine... this allows us to
    # handle a page reload during the setup process within the virtual machine)
    RewriteEngine On
    RewriteCond "%{HTTP_HOST}" "!^localhost$" [NC]
    RewriteRule "^/univention/setup/" "/univention/management/" [R]
            

    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/conf-available/univention-web.conf
    # 

    <Directory "/var/www/univention/">
            Options -Indexes
            RewriteEngine On
            ExpiresActive On
            # one month for images and fonts
            ExpiresByType image/* A2592000
            ExpiresByType application/font-woff A2592000
            # zero time for json files
            ExpiresByType application/json M0
            # one week for CSS and HTML files
            ExpiresByType text/css A604800
            ExpiresByType text/html A604800
            # one day for JavaScript files
            ExpiresByType application/javascript A86400

            # workaround for Bug #37720 comment 14: consider enabling the following line with httpd >= 2.5
            RequestHeader edit "If-None-Match" '^"((.*)-(gzip|br))"$' '"$1", "$2"'
            # DeflateAlterETag NoChange
    </Directory>

    # default match: must be first!
    <LocationMatch "/univention/.*\.(js|html|css)$">
            Header set Cache-Control "max-age=3600, must-revalidate, private"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/js/(hooks|config).js$">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/(languages|meta).json$">
            Header set Cache-Control "no-cache, private"
            Header unset Expires
    </LocationMatch>

    <LocationMatch "/univention/(login|management)/(index.html)?$">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </LocationMatch>

    <Location "/univention/js/dojo/dojo.js">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </Location>

    <Location "/univention/js/dijit/themes/umc/umc.css">
            Header set Cache-Control "no-cache, public"
            Header unset Expires
    </Location>

    <LocationMatch "^/univention/$">
            <If "-d '/var/www/univention/portal/' || -L '/var/www/univention/portal/'">
                    Redirect temp /univention/ /univention/portal/
            </If>
            <Else>
                    Redirect temp /univention/ /univention/management/
            </Else>
    </LocationMatch>
    ```

---

=== "sso-vhost.conf.d/01redirect.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sso-vhost.conf.d/01redirect.conf
    # 

    # If we are in ucs-sso virtualhost context we need to redirect the requests to the correct FQDN

    RewriteCond %{HTTP_HOST} ^ucs-sso.univention.intranet$
    RewriteCond %{REQUEST_URI} ^/univention/(login|management|self-service|portal|server-overview)/$
    RewriteRule ^/univention/(.*)$ %{REQUEST_SCHEME}://ucs-8322.univention.intranet/univention/$1 [L,QSA,R=301,END]
    ```

=== "sso-vhost.conf.d/csp.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sso-vhost.conf.d/csp.conf
    # 

    ```

=== "ucs-sites.conf.d/ucs-sites.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/ucs-sites.conf.d/ucs-sites.conf
    # 

    RewriteEngine on
    RewriteOptions Inherit
    ProxyPreserveHost on
    ProxyTimeout 600

    RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
    RequestHeader set "X-Forwarded-SSL" expr=%{HTTPS}

    DocumentRoot /var/www/
    CustomLog /var/log/apache2/access.log combined
    RedirectMatch ^/$ /univention/
    ```

=== "ucs-sites.conf.d/univention-portal.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/ucs-sites.conf.d/univention-portal.conf
    # 


    ProxyPassMatch /(univention/portal/.*) http://127.0.0.1:8095/$1 retry=0

    <Directory /var/www/univention/portal/>
            <FilesMatch "(portal|apps)\.json|portal\.css">
                    Header set Cache-Control "max-age=0, must-revalidate"
            </FilesMatch>
    </Directory>
    <Directory /var/www/univention/portal/>
            Header set Cache-Control "max-age=0, must-revalidate"
    </Directory>


    ProxyPassMatch /(univention/umc/.*) http://127.0.0.1:8095/$1 retry=0

    <Directory /var/www/univention/umc/>
            <FilesMatch "(portal|apps)\.json|portal\.css">
                    Header set Cache-Control "max-age=0, must-revalidate"
            </FilesMatch>
    </Directory>
    <Directory /var/www/univention/umc/>
            Header set Cache-Control "max-age=0, must-revalidate"
    </Directory>
    ```

---

=== "000-default.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/000-default.d/00start
    #       /etc/univention/templates/files/etc/apache2/sites-available/000-default.d/10univention-appcenter
    #       /etc/univention/templates/files/etc/apache2/sites-available/000-default.d/99end
    # 

    <VirtualHost *:80>
            IncludeOptional /etc/apache2/ucs-sites.conf.d/*.conf


    </VirtualHost>
    ```

=== "default-ssl.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/ssl.d/00start
    #       /etc/univention/templates/files/etc/apache2/sites-available/ssl.d/10hsts
    #       /etc/univention/templates/files/etc/apache2/sites-available/ssl.d/10univention-appcenter
    #       /etc/univention/templates/files/etc/apache2/sites-available/ssl.d/99end
    # 

    <IfModule mod_ssl.c>

    <VirtualHost *:443>
            IncludeOptional /etc/apache2/ucs-sites.conf.d/*.conf
            SSLEngine on
            SSLProxyEngine on
            SSLProxyCheckPeerCN off
            SSLProxyCheckPeerName off
            SSLProxyCheckPeerExpire off
            SSLCertificateFile /etc/univention/ssl/ucs-8322.univention.intranet/cert.pem
            SSLCertificateKeyFile /etc/univention/ssl/ucs-8322.univention.intranet/private.key
            SSLCACertificateFile /etc/univention/ssl/ucsCA/CAcert.pem

            #SetEnvIf User-Agent ".*MSIE.*" nokeepalive ssl-unclean-shutdown

            ### To enable special log format for HTTPS-access
            # LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\" %p" combinedssl
            # CustomLog /var/log/apache2/access.log combinedssl     ## with port number




    </VirtualHost>
    </IfModule>
    ```

=== "univention.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention.conf
    # 

    ProxyPreserveHost on
    RewriteEngine On

    # avoid 404 Not Found errors for not existing translation files
    RewriteCond %{REQUEST_URI} ^/univention/js/.*/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/management/modules/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/i18n/[^/]*/.*\.json [OR]
    RewriteCond %{REQUEST_URI} ^/univention/(management|portal|login|server-overview|self-service|setup)/i18n/[^/]*/.*\.json
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-f
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-d
    RewriteRule .* /univention/management/widgets/i18n/empty.json [T=application/json,L]

    # prevent to proxy requests under /univention/ to the UMC-Webserver if the request URI matches a existing file
    SetEnvIfExpr "'%{REQUEST_URI}' =~ m#^/univention/# && '%{REQUEST_URI}' !~ m#^/univention/udm/?$# && (-f '%{DOCUMENT_ROOT}%{REQUEST_URI}' || -d '%{DOCUMENT_ROOT}%{REQUEST_URI}')" "no-proxy=1"



    <LocationMatch "^/univention/login/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval'  https://www.piwik.univention.de/ ; frame-ancestors 'self';"

    </LocationMatch>

    <LocationMatch "^/univention/saml/">
            Header always setifempty "Content-Security-Policy" "frame-ancestors 'self';"

    </LocationMatch>

    <LocationMatch "^/univention/management/.*">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com/ https://s.ytimg.com/ https://www.piwik.univention.de/ https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src data: *; media-src *; frame-src *; font-src 'self'; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; form-action 'self'; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; "

    </LocationMatch>



    <LocationMatch "^/univention/(.*)$">
            RequestHeader set X-UMC-HTTPS %{HTTPS}s
            ErrorDocument 502 /error-univention
            ErrorDocument 503 /error-univention
            # fix for bug in cherrypy returning 408/409 errors out of the blue:
            #   http://cherrypy.org/ticket/853
            SetEnv proxy-nokeepalive 1
            Header always setifempty "X-Permitted-Cross-Domain-Policies" "master-only"
            Header always setifempty "X-XSS-Protection" "1; mode=block"
            Header always setifempty "X-Content-Type-Options" "nosniff"
            Header always setifempty "Content-Security-Policy" "frame-ancestors 'none';"
    </LocationMatch>

    WSGIScriptAlias "/error-univention" "/usr/share/univention-management-console/error.py"

    # do not proxy forward certain requests
    ProxyPassMatch "^/univention/js(/|_.*)" "!"
    ProxyPassMatch /univention/management/modules/ "!"

    ProxyPassMatch "^/univention/((auth|saml|get|set|command|upload|logout)/?.*)$" http://127.0.0.1:8090/$1 retry=0 timeout=311
    ProxyPassReverse "^/univention/((auth|saml|get|set|command|upload|logout)/?.*)$" http://127.0.0.1:8090/


    RedirectMatch ^/umc(/$|$) /univention/umc/
    RewriteRule ^/univention-management-console(/|/index.html)?$ /univention/management/ [R]
    ```

=== "univention-portal.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention-portal.conf
    # 


    <LocationMatch "^/univention/portal/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; style-src-elem 'self' 'unsafe-inline'; font-src 'self'; img-src data: *; frame-src *; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/;"
    </LocationMatch>


    <LocationMatch "^/univention/umc/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; style-src-elem 'self' 'sha256-kDRQ3dagwwb3nrm8xnMC0VgLt6lNN98+2oajznduaKI='; font-src 'self'; img-src data: *; frame-src *; connect-src 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/; frame-ancestors 'self' https://ucs-sso.univention.intranet/ http://ucs-sso.univention.intranet/;"
    </LocationMatch>
    ```

=== "univention-saml.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention-saml.conf
    # 

    Alias /simplesamlphp/saml2/idp/certificate /etc/simplesamlphp/ucs-sso.univention.intranet-idp-certificate.crt
    <Directory "/etc/simplesamlphp">
            <Files "ucs-sso.univention.intranet-idp-certificate.crt">
                    Require all granted
            </Files>
    </Directory>

    Alias /simplesamlphp /usr/share/simplesamlphp/www
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^/?simplesamlphp/(.*) https://%{SERVER_NAME}/simplesamlphp/$1 [R,L]


    <Directory /usr/share/simplesamlphp/www/>
            <FilesMatch ".+\.ph(p[345]?|t|tml)$">
                    SetHandler php-cgi
            </FilesMatch>
            Action php-cgi /saml-bin/php-cgi

            Order allow,deny
            Allow from all
    </Directory>
    <Directory /var/www/saml/>
            Options -Indexes
    </Directory>

    <IfModule mod_ssl.c>
    <VirtualHost *:443>
            IncludeOptional /etc/apache2/sso-vhost.conf.d/*.conf
            SSLEngine on
            SSLProxyEngine on
            ServerName ucs-sso.univention.intranet
            SSLCertificateFile /etc/univention/ssl/ucs-sso.univention.intranet/cert.pem
            SSLCertificateKeyFile /etc/univention/ssl/ucs-sso.univention.intranet/private.key
            SSLCACertificateFile /etc/univention/ssl/ucsCA/CAcert.pem
            
            DocumentRoot /var/www/
            RedirectMatch ^/$ /simplesamlphp/

            ScriptAlias /saml-bin /var/www/saml
            SuexecUserGroup samlcgi samlcgi

            # simplesamlphp uses this header to decide which idp config to use.
            # This decision is case sensitive. Setting the HOST header here, ensures the right case.
            RequestHeader set HOST ucs-sso.univention.intranet

            RewriteEngine on
            RewriteCond %{HTTP:Authorization}  !^$
            RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
    </VirtualHost>
    <VirtualHost *:80>
            IncludeOptional /etc/apache2/sso-vhost.conf.d/*.conf
            ServerName ucs-sso.univention.intranet
            DocumentRoot /var/www/
            RedirectMatch ^/$ /simplesamlphp/

            ScriptAlias /saml-bin /var/www/saml
            SuexecUserGroup samlcgi samlcgi

            RewriteEngine on
            RewriteCond %{HTTP:Authorization}  !^$
            RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
    </VirtualHost>
    </IfModule>
    ```

=== "univention-server-overview.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention-server-overview.conf
    # 

    <LocationMatch "^/univention/server-overview/.*$">
            Header always setifempty "Content-Security-Policy" "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.piwik.univention.de/; img-src data: *; frame-src *; connect-src 'self' https:/// http:///; frame-ancestors 'self' https:/// http:///;"

    </LocationMatch>
    ```

=== "univention-udm.conf"
    ```shell
    # Warning: This file is auto-generated and might be overwritten by
    #          univention-config-registry.
    #          Please edit the following file(s) instead:
    # Warnung: Diese Datei wurde automatisch generiert und kann durch
    #          univention-config-registry ueberschrieben werden.
    #          Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    # 
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention-udm.conf
    # 

    ProxyPass /univention/udm/ http://127.0.0.1:9979/udm/ retry=0
    <LocationMatch "^/univention/udm/.*">
            ErrorDocument 502 /error-univention
            ErrorDocument 503 /error-univention
            # Header always setifempty "X-Frame-Options" "SAMEORIGIN"
    </LocationMatch>



    # FIXME: this rule does not work
    <If "%{REQUEST_URI} == '/univention/udm/'">
            UnsetEnv "no-proxy"
    </If>
    ```

=== "univention-vhosts.conf"
    ```shell
    #Warning: This file is auto-generated and might be overwritten by
    #         univention-config-registry.
    #         Please edit the following file(s) instead:
    #Warnung: Diese Datei wurde automatisch generiert und kann durch
    #         univention-config-registry ueberschrieben werden.
    #         Bitte bearbeiten Sie an Stelle dessen die folgende(n) Datei(en):
    #
    #       /etc/univention/templates/files/etc/apache2/sites-available/univention-vhosts.conf
    #

    ```