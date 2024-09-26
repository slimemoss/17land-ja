import json
import pathlib

import requests
from pydantic import TypeAdapter

from scheme import Layout, SchemeElement


def read_scryfall(use_cache=True):
    def dl_scryfall():

        url = 'https://api.scryfall.com/bulk-data/unique_artwork'
        d = requests.get(url).json()

        bluk_url = d['download_uri']

        print('dowonload: ', bluk_url)
        d = requests.get(bluk_url).json()
        return d

    filepath = pathlib.Path('scryfall.json')

    if not use_cache or not filepath.exists():
        data = dl_scryfall()
        with open(filepath, 'w') as f:
            json.dump(data, f)

    with open(filepath) as f:
        return json.load(f)


def get_urls(use_cache=True) -> dict[str, str]:
    scryfall_data = read_scryfall(use_cache)
    scryfall_data: list[SchemeElement] = TypeAdapter(
        list[SchemeElement]).validate_python(scryfall_data)

    # res[setid][cardname] = url
    res: dict[str, dict[str, str]] = {}
    for d in scryfall_data:
        if d.layout == Layout.TOKEN:
            continue

        setid = d.set
        if setid not in res:
            res[setid] = {}

        if d.image_uris and d.image_uris.small:
            res[setid][d.name] = d.image_uris.small

    return res
