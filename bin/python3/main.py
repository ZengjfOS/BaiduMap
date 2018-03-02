#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Config.ConfigureWin import *
from Utils.lat_lang import *
from Simulation import *
from Utils.RandomString import *

def main():
    lat_longs = generate_random_lat_long(config.getVal(["common", "simulationThreads"]))
    print(lat_longs)

    for lat_long in lat_longs:
        simulation = Simulation(randomString(), lat_long)
        simulation.start()

# ak=bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=
if __name__ == '__main__':
    main()
