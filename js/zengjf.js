class Context{
    constructor() {
        this.currentPage = "systemSettings";
        this.config = null;
        this.currentSettings = {};
        this.mqtt = null;                       // mqtt client
        this.map = null;                        // 百度地图
        this.temperature = null;                // 温度
        this.cityCount = 0;                     // 城市计数
        this.positions = new Array();
    }
}

class BaiduIoTHubMQTT {
    constructor(address, port, username, passwd, topic) {
        // Create a client instance
        this.client = new Paho.MQTT.Client(address, port, "DeviceId-" + Math.random().toString(36).substring(7));
        this.username = username;
        this.passwd = passwd;
        this.topic = topic;
        this.serverConnected = false;
        
        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;
        this.connect();
    }

    connect() {
        // connect the client
        this.client.connect({onSuccess:this.onConnect, onFailure:this.onConnectError, userName:this.username, password:this.passwd, useSSL:true});
    }

    // called when the client connects
    onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        this.serverConnected = true;
        console.log("mqtt connect");
    }

    subscribe(topic) {
        console.log("subscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.subscribe(topic);
            this.topic = topic;
        }
    }

    unsubscribe(topic) {
        console.log("unsubscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.unsubscribe(this.topic);
        }
    }

    // called when the client connects
    onConnectError() {
        console.log("mqtt connect error");
    }
    
    // called when the client loses its connection
    onConnectionLost(responseObject) {
        console.log(responseObject);
    }
    
    // called when a message arrives
    onMessageArrived(message) {
        var stminfo = JSON.parse(message.payloadString);

        context.positions[stminfo["name"]] = stminfo;

        // console.log(stminfo);
        // console.log(context.positions);
    }
}

function navDisplayControl(type) {
    var navArray = ["systemSettings", "devicePositionMap", "deviceTemperature"];

    for (t in navArray) {
        var divElement = $($("." + navArray[t])[0]);
        if (navArray[t] == type) {
            context.currentPage = navArray[t];
            divElement.css('display', 'block');
        } else {
            divElement.css('display', 'none');
        }
    }

    console.log(context.currentPage);
}

function systemSettings_click() {
    console.log($(".systemSettings")[0]);
    navDisplayControl("systemSettings");
}

function devicePositionMap_click() {
    console.log($(".devicePositionMap")[0]);
    navDisplayControl("devicePositionMap");

    if (context.map == null) {
        // 百度地图API功能
        context.map = new BMap.Map("baidumap");                         // 创建Map实例
        context.map.centerAndZoom(new BMap.Point(116.404, 39.915), 1); // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
        context.map.addControl(new BMap.MapTypeControl({
            mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]}));      
        context.map.setCurrentCity("北京");                             // 设置地图显示的城市 此项是必须设置的
        context.map.enableScrollWheelZoom(true);                        //开启鼠标滚轮缩放
    }
}

function deviceTemperature_click() {
    console.log($(".deviceTemperature")[0]);
    navDisplayControl("deviceTemperature");

    if (context.temperature == null) {
        var config = {
            type: 'line',
            data: {
                labels: ['0'],
                datasets: [{
                    label: 'BeiJing',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [
                        0
                    ],
                    fill: false,
                }, {
                    label: 'ShangHai',
                    backgroundColor: window.chartColors.yellow,
                    borderColor: window.chartColors.yellow,
                    data: [
                        0
                    ],
                    fill: false,
                }, {
                    label: 'ShenZhen',
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    data: [
                        0
                    ],
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Temperature Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Timestamp'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };


        var ctx = document.getElementById('deviceTemperatureChart').getContext('2d');
        context.temperature = new Chart(ctx, config);

        if (config.data.datasets.length > 0) {
            /*
            config.data.labels.push(1);

            config.data.datasets.forEach(function(dataset) {
                dataset.data.push(randomScalingFactor());
            });

            context.temperature.update();
            */
        }
    }
}

function systemSettings_Subscribe_click() {
    if (($($(".subscribeButton")[0]).text()).trim() == "Subscribe") {
        context.currentSettings["city"] = $(".systemSettingsCity_selectpicker")[0].options[$(".systemSettingsCity_selectpicker")[0].selectedIndex].value;
        if (context.currentSettings["city"] == "ALL") {
            context.mqtt.subscribe("baidumap/iot/+/DataTransfer");
        } else {
            context.mqtt.subscribe("baidumap/iot/" + context.currentSettings["city"] + "/DataTransfer");
        }
        $($(".subscribeButton")[0]).text("UnSubscribe");

        if (context.map != null)
            context.map.clearOverlays();

        if (context.map != null)
            context.positions = new Array();
    } else {
        if (context.currentSettings["city"] == "ALL") {
            context.mqtt.unsubscribe("baidumap/iot/+/DataTransfer");
        } else {
            context.mqtt.unsubscribe("baidumap/iot/" + context.currentSettings["city"] + "/DataTransfer");
        }
        $($(".subscribeButton")[0]).text("Subscribe");
    }
    console.log(context.currentSettings);
}

function circulateExecute() {

    console.log("circulateExecute");

    for (var i in context.positions) { 

        stminfo = context.positions[i];
        if (context.map != null) {
            var point = new BMap.Point(stminfo["longitude"], stminfo["latitude"]);
            var marker = new BMap.Marker(point);
            // context.map.setCenter(point);
            context.map.addOverlay(marker);
            var opts = {
                width : 200,
                height: 100,
                title : "Device Infomation" ,
                enableMessage:true
            }
            var infoWindow = new BMap.InfoWindow(String(stminfo["temperature"]) + " ℃", opts);
            marker.addEventListener("click", function(){          
                context.map.openInfoWindow(infoWindow, point);
            });
        }

        if (context.temperature != null) {
            if (context.temperature.config.data.datasets.length > 0) {
                if (context.temperature.config.data.labels.length > context.config.deviceTemperature.chartLength) {
                    context.temperature.config.data.labels.shift();
                }
                if (context.currentSettings["city"] == "ALL") {
                    // if (context.cityCount++ % context.positions.length == 0) {
                    if (context.cityCount++ % 3 == 0) {
                        context.temperature.config.data.labels.push(stminfo["timestamp"]);
                    }
                } else {
                    context.temperature.config.data.labels.push(stminfo["timestamp"]);
                }

                context.temperature.config.data.datasets.forEach(function(dataset) {
                    if (dataset.label == stminfo["name"]) {
                        if (dataset.data.length > context.config.deviceTemperature.chartLength)
                            dataset.data.shift();
                        dataset.data.push(stminfo["temperature"]);
                    }
                });

                context.temperature.update();
            }
        }
    }

    context.positions = new Array();
}

$(function(){ 
    context = new Context();
    context.mqtt = new BaiduIoTHubMQTT("baidumap.mqtt.iot.gz.baidubce.com", 8884, "baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=", "DataTransfer");

    $.get("js/config.json", function(src) {
        context.config = JSON.parse(src);
        console.log(context.config);
        console.log(context.config.nav);

        $.get("tpls/nav.tpl", function(src) {
            var nav_compiled = _.template(src);
            var nav_html = nav_compiled(context.config.nav);
            
            $(".leftContainer")[0].innerHTML = nav_html;

            $("#systemSettings_click").click(systemSettings_click);
            $("#devicePositionMap_click").click(devicePositionMap_click);
            $("#deviceTemperature_click").click(deviceTemperature_click);
        });

        $.get("tpls/systemSetings.tpl", function(src) {
            var systemSettings_compiled = _.template(src);
            var systemSettings_html = systemSettings_compiled(context.config.systemSettings);

            $(".systemSettings")[0].innerHTML = systemSettings_html;

            $("#systemSettings_Subscribe_click").click(systemSettings_Subscribe_click);
        });
    });

    setInterval("circulateExecute();", 2000);
});
