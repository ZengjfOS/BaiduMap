import configparser
import threading
import os
import json
import time
from logging import *

# 初始化配置
class ConfigureWin(threading.Thread):

    __mutex = threading.Lock()
    __configure_file_path = "Config/config.json"

    # 使用单例模式来生成统一的对象
    def __new__(cls, *args, **kwargs):

        if not hasattr(cls, "_inst"):

            # 单例对象
            cls._inst = super(ConfigureWin, cls).__new__(cls)
            json_data = open(cls.__configure_file_path)
            cls.config = json.load(json_data)

            # 设置log等级
            infoLevel = DEBUG
            if not cls.config["debug"]:
                infoLevel = ERROR

            if not cls.config["console"]:
                basicConfig(level=infoLevel,
                            format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                            datefmt='%a, %d %b %Y %H:%M:%S',
                            filename='ws.log',
                            filemode='a'
                            )
            else:
                basicConfig(level=infoLevel,
                            format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                            datefmt='%a, %d %b %Y %H:%M:%S',
                            )

        return cls._inst

    @classmethod
    def parse_config(cls):

        cls.__mutex.acquire()
        # 配置并解析配置文件
        json_data = open(cls.__configure_file_path)
        cls.config = json.load(json_data)
        cls.__mutex.release()

    @classmethod
    def set_config_file(cls, file_path):

        cls.__configure_file_path = file_path

    @classmethod
    def get_config_file(cls):

        return cls.__configure_file_path

    @classmethod
    def getVal(cls, keys):
        if cls.config != None :
            try:
                cls.__mutex.acquire()
                exec_str = "cls.config"
                for key in keys:
                    exec_str += "[\"" + key + "\"]"
                ret = eval(exec_str)
            except:
                ret = None
            finally:
                cls.__mutex.release()
                return ret
        else :
            return None

config = ConfigureWin()

if __name__ == '__main__':

    config.set_config_file("Config/config.json")

