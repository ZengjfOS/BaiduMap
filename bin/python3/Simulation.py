import threading
import time
from mqtt.DataTransfer import *
from Utils.Temperature import *
from Utils.Brightness import *
from Utils.RandomString import *

class Simulation (threading.Thread):

    def __init__(self, name, data):
        threading.Thread.__init__(self)
        self.lat_long = data
        self.name = name
        self.dataTransfer = DataTransfer()

    def run(self):
        while True:
            data = {}
            data["latitude"] = self.lat_long[0]
            data["longitude"] = self.lat_long[1]
            data["temperature"] = generate_random_templature()
            data["brightness"] = generate_random_brightness()
            data["name"] = self.name

            self.dataTransfer.send(data)
            print(data)

            time.sleep(5)

if __name__ == '__main__':
    pass
