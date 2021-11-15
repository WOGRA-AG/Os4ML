#!/usr/bin/bash
./.init-env.sh

terraform init -reconfigure \
    -backend-config="address=https://gitlab.wogra.com/api/v4/projects/160/terraform/state/gcp-budget-watchdog-local" \
    -backend-config="lock_address=https://gitlab.wogra.com/api/v4/projects/160/terraform/state/gcp-budget-watchdog-local/lock" \
    -backend-config="unlock_address=https://gitlab.wogra.com/api/v4/projects/160/terraform/state/gcp-budget-watchdog-local/lock" \
    -backend-config="username=${GITLAB_USER_NAME}" \
    -backend-config="password=${GITLAB_ACCESS_TOKEN}" \
    -backend-config="lock_method=POST" \
    -backend-config="unlock_method=DELETE" \
    -backend-config="retry_wait_min=5"
