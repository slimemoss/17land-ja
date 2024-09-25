import argparse
import json
from pathlib import Path

from create_urls import get_urls

parser = argparse.ArgumentParser(
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument('output')
parser.add_argument('-c', '--clear_cache', action='store_true',
                    help='17landsのデータをオンライン上から再取得します。')

args = parser.parse_args()
output = Path(args.output)
clear_cache = args.clear_cache

data = get_urls(not clear_cache)
with open(output, 'w') as f:
    json.dump(data, f)
