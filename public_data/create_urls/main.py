import argparse
import json
import sys
from pathlib import Path

from create_urls import get_urls


class CustomArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        # Display custom error message
        sys.stderr.write(f"Error: {message}\n\n")
        # Show usage
        self.print_help()
        sys.exit(2)


parser = CustomArgumentParser(
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    description='ex) python {} .. dsk DSK'.format(sys.argv[0]))
parser.add_argument('output_dir', type=str)
parser.add_argument('scryfall_sym', type=str)
parser.add_argument('lands17_sym', type=str)
parser.add_argument('-c', '--clear_cache', action='store_true',
                    help='17landsのデータをオンライン上から再取得します。')
args = parser.parse_args()

output_dir = args.output_dir
scryfall_sym = args.scryfall_sym
lands17_sym = args.lands17_sym
clear_cache = args.clear_cache

data = get_urls(not clear_cache)
data = data[scryfall_sym]
path = Path(output_dir, '{}.json'.format(lands17_sym))

print('card num: {}'.format(len(data)))
print('write to {}'.format(path))
with open(path, 'w') as f:
    json.dump(data, f)
