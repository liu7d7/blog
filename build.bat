xcopy .\assets .\final\assets\ /s /e /y
copy .\CNAME .\final\CNAME /y

for %%I in (*.html) do if not "%%I" == "basic.html" cpp %%I -P -o .\final\%%I
