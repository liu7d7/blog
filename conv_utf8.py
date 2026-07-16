import os
import re

for root, dirs, files in os.walk('.'):
    for fi in files:
        if fi.endswith(".html"):
            with open(fi, "r") as f:
                file_string = f.read()
            file_string = re.sub("\\\\U([0-9a-fA-F]+)", "&#x\\1;", file_string)
            file_string = re.sub("\"\\s*\"", "", file_string).replace("<br/> ", "<br/>").replace("\\t", "  ").replace("\\T", "\t").replace("\\/", "/")
            with open(fi, "w") as f:
                f.write(file_string)
