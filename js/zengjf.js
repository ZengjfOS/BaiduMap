class Context{
    constructor() {
        this.currentPage = "systemSettings";
        this.config = null;
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
}

function deviceTemperature_click() {
    console.log($(".deviceTemperature")[0]);
    navDisplayControl("deviceTemperature");
}

$(function(){ 
    $.get("js/config.json", function(src) {
        console.log(src);
        context = src;
    });
});
