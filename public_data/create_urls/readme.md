# エラー対応

## set_expが正しくない

Traceback (most recent call last):
  File "/home/slimemoss/work/hobby/mtg/browser_extension/lands17-ja/app/scripts/data/create_urls/main.py", line 20, in <module>
    data = data[set_exp]
           ~~~~^^^^^^^^^
KeyError: 'spg'

## 解決 
cat scryfall.json | jq '.[].set' | sort | uniq
