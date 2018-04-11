#!/usr/bin/env python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import json
import threading
import random
import time

# 初始化配置
class DataTransfer(threading.Thread):

    __mutex = threading.Lock()
    __mqttc = None

    def __init__(self):
        print("in init")

        self.connect();

    def connect(self):
        self.__mutex.acquire()
        self.__mqttc = mqtt.Client(client_id="DeviceId-" + '%06x' % random.randrange(16**12))
        self.__mqttc.username_pw_set("baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=")
        self.__mqttc.connect('baidumap.mqtt.iot.gz.baidubce.com', port=1883)
        self.__mutex.release()

    def send(self, json_data):
        json_data["timestamp"] = int(time.time())
        msg = json.dumps(json_data)

        try:
            self.__mutex.acquire()
            self.__mqttc.publish('baidumap/iot/' + json_data["name"] + '/DataTransfer', payload=msg)
            self.__mutex.release()
        except:
            self.connect()


if __name__ == '__main__':

    msg = {
        'pin': 17,
        'value': 10
    }

    dataTransfer = DataTransfer()
    dataTransfer.send(msg)

