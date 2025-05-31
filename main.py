import sys
import requests
import json

word1 = sys.argv[1]
word2 = sys.argv[2] 
word = word1 + ' ' + word2

result = {
    "initial": [word1, word2],
    "final": word
}

sys.stdout.write(json.dumps(result))

