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

    # 使用单例模式来生成统一的对象
    def __new__(cls, *args, **kwargs):

        if not hasattr(cls, "_inst"):

            # 单例对象
            cls._inst = super(DataTransfer, cls).__new__(cls)
            cls.connect()

        return cls._inst

    @classmethod
    def connect(cls):
        cls.__mutex.acquire()
        cls.__mqttc = mqtt.Client(client_id="DeviceId-" + '%06x' % random.randrange(16**12))
        cls.__mqttc.username_pw_set("baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=")
        cls.__mqttc.connect('baidumap.mqtt.iot.gz.baidubce.com', port=1883)
        cls.__mutex.release()

    @classmethod
    def send(cls, json_data):
        json_data["timestamp"] = int(time.time())
        msg = json.dumps(json_data)

        try:
            cls.__mutex.acquire()
            cls.__mqttc.publish('DataTransfer', payload=msg)
            cls.__mutex.release()
        except:
            cls.connect()

dataTransfer = DataTransfer()

if __name__ == '__main__':

    msg = {
        'pin': 17,
        'value': 10
    }

    dataTransfer.send(msg)

