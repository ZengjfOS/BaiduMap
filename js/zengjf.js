class Context{
    constructor() {
        this.currentPage = "systemSettings";
        this.config = null;
        this.currentSettings = {};
    }
}

context = new Context()

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

    // 百度地图API功能
    var map = new BMap.Map("baidumap");    // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
        mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]}));      
    map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
}

function deviceTemperature_click() {
    console.log($(".deviceTemperature")[0]);
    navDisplayControl("deviceTemperature");

    var config = {
        type: 'line',
        data: {
            labels: ['0'],
            datasets: [{
                label: 'Show Temperature Curve',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
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
    window.myLine = new Chart(ctx, config);

    if (config.data.datasets.length > 0) {
        config.data.labels.push(1);

        config.data.datasets.forEach(function(dataset) {
            dataset.data.push(randomScalingFactor());
        });

        window.myLine.update();
    }

}

function systemSettings_Save_click() {

    context.currentSettings["Country"] = $(".systemSettingsCountry_selectpicker")[0].options[$(".systemSettingsCountry_selectpicker")[0].selectedIndex].value;

    console.log(context.currentSettings);
}

$(function(){ 
    $.get("js/config.json", function(src) {
        context.config = src;
        console.log(context.config);
        console.log(context.config.nav);

        var nav_compiled = _.template($("#nav_tpl")[0].innerHTML);
        var nav_html = nav_compiled(context.config.nav);
        $(".leftContainer")[0].innerHTML = nav_html;

        var systemSettings_compiled = _.template($("#systemSettings_tpl")[0].innerHTML);
        var systemSettings_html = systemSettings_compiled(context.config.systemSettings);
        $(".systemSettings")[0].innerHTML = systemSettings_html;

    });
});
