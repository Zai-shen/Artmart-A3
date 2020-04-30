@echo off
SETLOCAL
set cartURL=http://localhost:3000/cart/
set cookie=tmp.txt

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

ENDLOCAL
