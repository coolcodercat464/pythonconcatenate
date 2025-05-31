import sys
import requests
import json

args = sys.argv[1:]
word1, word2 = args 
word = word1 + ' ' + word2

result = {
    "initial": [word1, word2],
    "final": word
}

sys.stdout.write(json.dumps(result))

