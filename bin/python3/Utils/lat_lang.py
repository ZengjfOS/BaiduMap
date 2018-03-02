import random
import sys
import math
from Config.ConfigureWin import *

def generate_random_lat_long(num_rows):
    lat_long = []

    for _ in range(num_rows):
        dec_lat = random.uniform(0, 10)
        dec_lon = random.uniform(0, 10)
        lat_long.append((dec_lon + config.getVal(["common", "longitude"]), dec_lat + config.getVal(["common","latitude"])))

    return lat_long

if __name__ == '__main__':
    lat_long = generate_random_lat_long(5)
    print(lat_long)

