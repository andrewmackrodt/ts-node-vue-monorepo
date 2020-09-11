#!/bin/bash
set -euo pipefail

package_dir=$(cd "$(dirname "$(readlink -f "$0")")" && pwd)
packages_dir=$(cd "$package_dir/.." && pwd)
project_dir=$(cd "$packages_dir/.." && pwd)
dist_dir="$project_dir/build/dist"

mkdir -p "$dist_dir"
cd "$package_dir"
tsc --sourcemap --outDir "$dist_dir"

cd "$dist_dir"
yarn install --production=true --modules-folder="$PWD/node_modules" --frozen-lockfile
rm -f node_modules/@app/{backend,common,frontend}
cp "$packages_dir/common/package.json" common/
mv common/ node_modules/@app/common/

mv backend/* .
rmdir backend/
