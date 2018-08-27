#!/usr/bin/zsh
delim="=================================================="
echo $delim
for server in "https://iitk.ac.in" "https://cse.iitk.ac.in" "https://oars.cc.iitk.ac.in"; do
    echo "Headers for $server:"
    echo "--------------------------------------------------"
    curl -sSD - "$server" -o /dev/null
    echo $delim
done
