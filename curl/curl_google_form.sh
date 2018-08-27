#!/usr/bin/bash
usage ()
{
    echo -e "Usage: `basename $0` [OPTION]... [FILE]...
    \rPost a feedback to the CS252 feedback form

    \r    -n, --name            Capitalize mp3 files recursively in a path
    \r    -s, --suggestion      Capitalize an mp3 file
    \r    -h, --help            Display help and exit"
}

IFS=$'\n'
name="Team Rocket"
suggestion="This is a test for cUrl"

if [[ $1 == "-n" ]] || [[ $1 == "--name" ]]; then
    if [[ $2 == "" ]]
    then
        usage
        exit 1
    else
        name=$2
        shift 2
    fi
fi

if [[ $1 == "-s" ]] || [[ $1 == "--suggestion" ]]; then
    if [[ $2 == "" ]]
    then
        usage
        exit 1
    else
        suggestion=$2
        shift 2
    fi
fi

if [[ $1 == "-h" ]] || [[ $1 == "--help" ]]; then
    usage
    exit 0
else
    usage
    exit 1
fi

curl "https://docs.google.com/forms/d/e/1FAIpQLSc3ypY5atlevImjuCVBbIqVwO2PdJuFzJn7utdDL1Lnxj6v4g/formResponse" -d ifq -d "entry.564303604='$name'" -d "entry.1542955752='$suggestion'" -d submit=Submit -o /tmp/google.html

if [ -f "/bin/google-chrome-stable" ] || [ -f "/usr/bin/google-chrome-stable" ]; then
    google-chrome-stable /tmp/google.html
else
    firefox /tmp/google.html
fi
