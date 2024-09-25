import json
import pathlib

import requests
from pydantic import TypeAdapter

from scheme import Layout, SchemeElement


def read_scryfall(use_cache=True):
    def dl_scryfall():

        url = 'https://api.scryfall.com/bulk-data/oracle-cards'
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

    res: dict[str, str] = {}
    for d in scryfall_data:
        if d.layout == Layout.TOKEN:
            continue

        if d.image_uris and d.image_uris.small:
            res[d.name] = d.image_uris.small

    return res
