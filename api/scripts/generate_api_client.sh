cd ../
openapi-generator generate \
-g typescript-fetch \
-i ./openapi.json \
-o ../js-api-client/ \
--git-user-id ss21-js \
--git-repo-id ss21-js-api-client \
--skip-validate-spec \
--additional-properties=npmName=js-api-client \
--additional-properties=supportsES6=true