#!/bin/bash

DIRECTORY="." # Change this to the path of your folder

count=$(find "$DIRECTORY" -type f -iname '*.png' | wc -l)

if [[ $count -gt 0 ]]; then
  echo "Warning: $count PNG files found in $DIRECTORY."
else
  echo "No PNG files found."
fi

count=$(find "$DIRECTORY" -type f -iname '*.gif' | wc -l)

if [[ $count -gt 0 ]]; then
  echo "Warning: $count GIF files found in $DIRECTORY."
else
  echo "No GIF files found."
fi

count=$(find "$DIRECTORY" -type f -iname '*.jpg' | wc -l)

if [[ $count -gt 0 ]]; then
  echo "Warning: $count JPG files found in $DIRECTORY."
else
  echo "No JPG files found."
fi

count=$(find "$DIRECTORY" -type f -iname '*.jpeg' | wc -l)

if [[ $count -gt 0 ]]; then
  echo "Warning: $count JPEG files found in $DIRECTORY."
else
  echo "No JPEG files found."
fi

echo "---"
echo "Final repo size is: "
du -sh .