#!/usr/bin/env sh

if [[ $OSTYPE =~ ^msys ]]; then OS_IS_WIN=true; else OS_IS_WIN=false; fi
if $OS_IS_WIN; then DOWNLOADS_DIR=$USERPROFILE"\\downloads\\"; else DOWNLOADS_DIR="~/Downloads/"; fi

MOONRISE_DIR=${MOONRISE_DIR:=$(readlink -f $(dirname $BASH_SOURCE)"/..")}
STEAMWORKS_VERSION=""
STEAMWORKS_ZIP=${STEAMWORKS_DIR:=$DOWNLOADS_DIR"/steamworks_sdk_*.zip"}
GREENWORKS_DIR=${GREENWORKS_DIR:=$MOONRISE_DIR"/greenworks"}
GREENWORKS_REPO_DIR=${GREENWORKS_REPO_DIR:=$GREENWORKS_DIR"/.git"}
GREENWORKS_REPO_URL=${GREENWORKS_REPO_URL:="git@github.com:greenheartgames/greenworks.git"}
GREENWORKS_DEPS_DIR=${GREENWORKS_DEPS_DIR:=$GREENWORKS_DIR"/deps"}
GREENWORKS_STEAMWORKS_DIR=${GREENWORKS_STEAMWORKS_DIR:=$GREENWORKS_DEPS_DIR"/steamworks_sdk"}
MSVS_VERSION=${MSVS_VERSION:="2015"}
NODE_GYP_BIN=${NODE_GYP_BIN:=$GREENWORKS_DIR"/node_modules/.bin/node-gyp"}
NW_GYP_BIN=${NW_GYP_BIN:=$GREENWORKS_DIR"/node_modules/.bin/nw-gyp"}

pushd $MOONRISE_DIR
if [ -d $GREENWORKS_REPO_DIR ]
then
  cd $GREENWORKS_DIR && git pull
else
  git clone $GREENWORKS_REPO_URL $GREENWORKS_DIR
fi
popd

pushd $GREENWORKS_DIR
if [ -d $GREENWORKS_STEAMWORKS_DIR ]
then
  echo "Steamworks SDK already installed in Greenworks directory"
else
  unzip -o -q $STEAMWORKS_ZIP -d $GREENWORKS_DEPS_DIR && \
    mv $GREENWORKS_DEPS_DIR/sdk $GREENWORKS_STEAMWORKS_DIR
fi
npm install node-gyp --msvs_version=$MSVS_VERSION
#npm install nw-gyp --msvs_version=$MSVS_VERSION
npm install --msvs_version=$MSVS_VERSION
$NODE_GYP_BIN configure
$NODE_GYP_BIN build
#$NW_GYP_BIN --msvs_version=$MSVS_VERSION
popd

# echo "Downloading " $FIREFOX_ZIP_DOWNLOAD_URL " to " $FIREFOX_TMP_ZIP &&
#   curl -C - -L --progress-bar $FIREFOX_ZIP_DOWNLOAD_URL -o $FIREFOX_TMP_ZIP && \
#   echo "Extracting "$FIREFOX_TMP_ZIP && \
#   unzip $FIREFOX_TMP_ZIP
