::
::  This batch script executes a simple sequence of tests for the cart endpoint based on curl.
::

@echo off
SETLOCAL
set cartURL=http://localhost:3000/cart/
set cookie=tmp.txt
set example1=example_artwork1.json
set example2=example_artwork2.json

echo.
echo.
echo.
echo Running test...
echo.
echo.

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
curl -v -b %cookie% -H "Content-Type: application/json" -d @%example1% %cartURL%

echo.
echo.
echo Request cart contents with previously received session cookie:
curl -v -b %cookie% %cartURL%

echo.
echo.
echo Add a bunch of valid items:
for /l %%i in (1,1,10) do curl -s -b %cookie% -H "Content-Type: application/json" -d @%example1% %cartURL%

echo.
echo.
echo Request cart contents again:
curl -v -b %cookie% %cartURL%

echo.
echo.
echo Delete the cart item with ID 7:
curl -v -X DELETE -b %cookie% %cartURL%7

echo.
echo.
echo Try to delete the non-existing cart item with ID 13:
curl -v -X DELETE -b %cookie% %cartURL%13

echo.
echo.
echo Request cart contents again:
curl -v -b %cookie% %cartURL%

echo.
echo.
echo Request cart item with ID 5:
curl -v -b %cookie% %cartURL%5

echo.
echo.
echo Try to request the non-existing cart item with ID 42:
curl -v -b %cookie% %cartURL%42

echo.
echo.
echo Clear the whole cart:
curl -v -X DELETE -b %cookie% %cartURL%

echo.
echo.
echo Request cart contents again:
curl -v -b %cookie% %cartURL%

ENDLOCAL
