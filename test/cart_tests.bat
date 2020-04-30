@echo off
SETLOCAL
set cartURL=http://localhost:3000/cart/
set cookie=tmp.txt
set example=example_artwork.json

echo.
echo.
echo GET /cart without session cookie:
curl -v -c %cookie% %cartURL%

echo.
echo.
echo GET /cart with invalid session cookie:
curl -v -b sessionId=anInvalidCookie %cartURL%

echo.
echo.
echo GET /cart with previously received session cookie:
curl -v -b %cookie% %cartURL%

echo.
echo.
echo POST /cart with previously received session cookie and valid payload:
curl -v -b %cookie% -H "Content-Type: application/json" -d @%example% %cartURL%

ENDLOCAL
