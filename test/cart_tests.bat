@echo off
SETLOCAL
set cartURL=http://localhost:3000/cart/
set cookie=tmp.txt
set example=example_artwork.json

echo.
echo.
echo Request cart contents with invalid session cookie:
curl -v -b sessionId=anInvalidCookie %cartURL%

echo.
echo.
echo Request and store session cookie:
curl -v -c %cookie% %cartURL%

echo.
echo.
echo Add a valid item to the previously created cart:
curl -v -b %cookie% -H "Content-Type: application/json" -d @%example% %cartURL%

echo.
echo.
echo Request cart contents with previously received session cookie:
curl -v -b %cookie% %cartURL%

echo.
echo.
echo Delete cart contents with previously received session cookie:
curl -v -X DELETE -b %cookie% %cartURL%

echo.
echo.
echo Request cart contents again with previously received session cookie:
curl -v -b %cookie% %cartURL%

ENDLOCAL
