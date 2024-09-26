import argparse
import json
from pathlib import Path

from create_urls import get_urls

parser = argparse.ArgumentParser(
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument('output_dir', type=str)
parser.add_argument('set_exp', type=str)
parser.add_argument('-c', '--clear_cache', action='store_true',
                    help='17landsのデータをオンライン上から再取得します。')

args = parser.parse_args()
output_dir = args.output_dir
set_exp = args.set_exp
clear_cache = args.clear_cache

data = get_urls(not clear_cache)
data = data[set_exp]
path = Path(output_dir, '{}.json'.format(set_exp))

print('card num: {}'.format(len(data)))
print('write to {}'.format(path))
with open(path, 'w') as f:
    json.dump(data, f)
