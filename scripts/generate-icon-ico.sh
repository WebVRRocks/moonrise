#!/usr/bin/env sh

#
# Generate `.ico` icon for Windows binaries.
#
# - Requires the ImageMagick library.

SRC=$1
DEST=$2

convert -density 400 -background transparent $SRC -define icon:auto-resize=16,32,48,64,256 -colors 256 $DEST
