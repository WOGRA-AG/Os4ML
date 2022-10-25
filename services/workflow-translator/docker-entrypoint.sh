#!/bin/sh

set -e

. /opt/pysetup/.venv/bin/activate

exec "$@"
