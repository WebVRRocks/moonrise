#!/usr/bin/env sh

#
# Generate `.icns` icon for macOS binaries.
#
# - Requires the ImageMagick library.

SRC=$1
DEST=$2

if [ $# -ne 1 ]
then
  SRC=${SRC:="icon.png"}
fi

if [ $# -ne 2 ]
then
  DEST=`dirname $SRC `"/"`basename ${SRC}`
fi

rm -rf $DEST

DEST=${DEST%\.*}".iconset"

rm -rf $DEST

mkdir -p $DEST

sizes=(16 32 128 256 512)
for size in ${sizes[@]}; do
  let "double = $size * 2"
  sips -z $size $size $SRC --out $DEST/icon_${size}x${size}.png > /dev/null
  sips -z $double $double $SRC --out $DEST/icon_${size}x${size}@2x.png > /dev/null
done

iconutil -c icns $DEST

rm -rf $DEST
