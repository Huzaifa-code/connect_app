#!/bin/bash

# Read eas.json and extract the "preview" profile for Android
EAS_JSON_PATH="../eas.json"
PROFILE="preview"

# Use jq to extract the profile configuration
EAS_BUILD_COMMAND=$(jq -r ".build.$PROFILE.android.buildType // empty" $EAS_JSON_PATH)

if [[ -z "$EAS_BUILD_COMMAND" ]]; then
    echo "Error: Could not find buildType for profile $PROFILE in eas.json"
    exit 1
fi

# Output the EAS build command
echo "eas build --profile $PROFILE -p android --non-interactive"
