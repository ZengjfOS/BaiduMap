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
}

function deviceTemperature_click() {
    console.log($(".deviceTemperature")[0]);
    navDisplayControl("deviceTemperature");
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
