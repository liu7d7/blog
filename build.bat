xcopy .\assets .\final\assets\ /s /e /y
copy .\CNAME .\final\CNAME /y

for %%I in (*.html) do if not "%%I" == "basic.html" cpp %%I -P  -finput-charset=UTF-8 -fexec-charset=UTF-8 -o .\final\%%I

pushd final
py ..\conv_utf8.py
popd final
