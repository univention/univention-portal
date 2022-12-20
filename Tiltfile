version_settings(constraint='>=0.22.2')

k8s_yaml([
    'k8s/cfg-backend.yaml',
    'k8s/backend.yaml',
    'k8s/svc-backend.yaml',
])
docker_build(
    'univention/portal-backend',
    context='.',
    dockerfile='./docker/portal-server/Dockerfile',
    only=[
        './python',
        './univention-portal-server',
        './univention-portal',
        './requirements.txt',
        './setup.py',
        './debian/',
        './docker/portal-server/',
    ],
)
k8s_resource(
    workload='backend',
    objects=['cfg-backend'],
    port_forwards='8095:80',
    labels=['backend']
)

k8s_yaml('k8s/frontend.yaml')
docker_build(
    'univention/portal-frontend',
    context='./frontend',
    target='base',
    entrypoint='yarn serve',
    live_update=[
        sync('./frontend/src', '/frontend/src'),
    ],
)
k8s_resource(
    workload='frontend',
    port_forwards='8080:8080',
    labels=['frontend']
)
