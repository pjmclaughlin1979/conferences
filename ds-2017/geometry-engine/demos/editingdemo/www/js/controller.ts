/* Controller.ts :Provides the logic which controls the be
*/


// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>


///<amd-dependency path="dojo/i18n!./nls/resources" name="localeConfig"/>

declare var $;

import Config = require("./config");
import Util = require("./util");
import Deferred = require("dojo/Deferred");
import esriArcgisUtils = require("esri/arcgis/utils")
import OperationPan = require("./operations/pan");
import OperationSelect = require("./operations/select");
import OperationAppend = require("./operations/append");
import OperationSubtract = require("./operations/subtract");
import OperationDelete = require("./operations/delete");
import OperationMerge = require("./operations/merge");
import OperationSplit = require("./operations/split");
import OperationNew = require("./operations/new");
import OperationEffects = require("./operations/effects");
import esriMap = require("esri/map");
import Draw = require("./operations/draw");
import Dimensions = require("./operations/dimensions");
import esriFeatureLayer = require("esri/layers/FeatureLayer");
import esriTemplatePicker = require("esri/dijit/editing/TemplatePicker");

import Model = require("./model");
import View = require("./view");
declare var localeConfig;

/*
      *  Setup i18n
      */
function configureLocale(): dojo.Promise<boolean> {
    var d = new Deferred();
            
    // Register the Resource Strings
    Util.registerLocaleResource(localeConfig, "app");
    // Update the UI to the new language
    Util.i18n("html");
    d.resolve(true);
    return d.promise;
}


/*
       * Display a Start Error
       */
function startError(error): void {
    try {
        $("#errorloading").fadeIn();
        $("#post-load").fadeOut();
        $("#pre-load").fadeOut();
        $("#errorloading").find("h1").html(Util.t("app.applicationmessages.errorloading"));
        $("#errorloading").find("h3").html(Util.t("app.applicationmessages.errorloadingstraplin"));

    }
    catch (ex) {
    }
}


function wireupToolbar() {
    $("a[data-toolname]").bind("click touchstart", function(evt) {
        evt.stopPropagation(); evt.preventDefault();
        if ($(this).hasClass("disabled") == true) {
            return;
        }
        var command = $(this).attr("data-toolname");
        if ($(this).attr("data-maptool") == "true") {
            Controller.changeMapTool(command);
        }
        else {
            Controller.commandClicked(command)
        }
    });
    
    $("#footer ul li.footer-measure-tool a").bind("click touchstart", function(evt) {
        evt.stopPropagation(); evt.preventDefault();
        Model.dimensions.show = !Model.dimensions.show;
        View.Update();
       
         
    });
    
    
    $("#effects-panel").find("[data-effecttool=true]").bind("click touchstart", function(evt) {
        evt.stopPropagation(); evt.preventDefault();
        if (Model.activeMapTool.name=="effects") {
            (<OperationEffects>Model.activeMapTool).executeCommand(
                $(this).attr("data-effectname"), {  value: 
                    parseFloat($("#" +$(this).attr("data-effectname") ).val())
                }
            )
        }
    });
     $("#rotate").bind("change", function(evt) {
          if (Model.activeMapTool.name=="effects") {
            (<OperationEffects>Model.activeMapTool).executeCommand("rotate",
                {  value: 
                    parseFloat($(this).val())
                }
            )
        }
        $(this).val(0);
     })
     
      $("#rotate").on("input", function(evt) {
          if (Model.activeMapTool.name=="effects") {
            (<OperationEffects>Model.activeMapTool).feedbackCommand("rotate",
                {  value: 
                    parseFloat($(this).val())
                }
            )
        }
     })
    
    
}

class Controller {

    public static start(): void {
        try {
            
            // Localise the App
            configureLocale().then(function() {
                esriArcgisUtils.createMap(Config.webmap, "map", { ignorePopups: true, mapOptions: { wrapAround180: false, autoResize: true, logo: false, slider: false } }).then(function(response) {
                    Model.map = response.map;
                    Model.webmap = response.itemInfo.itemData;
                    Model.dimensions = new Dimensions(response.map);
                    Model.drawingManager = new Draw(response.map, Model.dimensions); // new esriDrawing(response.map);
                    wireupToolbar();
                    Controller.changeMapTool("pan");
                    View.createSelectionViews();
                    View.Update();

                    var fss = [];
                    for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
                        if (Model.webmap.operationalLayers[z].layerObject instanceof esriFeatureLayer) {
                            fss.push(Model.webmap.operationalLayers[z].layerObject)
                        }
                    }

                    var widget = new (<any>esriTemplatePicker)({
                        featureLayers: fss,
                        rows: "auto",
                        columns: 4,
                        showTooltip: true,
                        style: "height: 100%; width: 400px;"
                    }, "template-picker");

                    widget.startup();

                    widget.on("selection-change", function() {
                        var selected = widget.getSelected();
                        if (selected !== null) {
                            Model.activeFeatureLayer = selected.featureLayer;
                            Model.activeTemplate = selected.template;
                        }
                        else {
                            Model.activeFeatureLayer = null;
                            Model.activeTemplate = null;
                        }
                        if (Model.activeMapTool instanceof OperationNew) {
                            Controller.changeMapTool("new");
                        }
                    });


                    $("#post-load").css("visibility", "visible").fadeIn();
                    $("#pre-load").fadeOut();

                }, function(erre) {
                    startError(erre);
                })
                // Display the Contents of the App
             
                
                
            }, function(erre) {
                startError(erre);
            })
        }
        catch (erre) {
            startError(erre);
        }
    }
    
    

    public static changeMapTool(tool: string): void {

        $("a[data-maptool=true]").removeClass("active");
        if (tool !== "") {
            $("a[data-toolname=" + tool + "]").addClass("active");
        }
        try {
            if (Model.activeMapTool !== null) {
                Model.activeMapTool.deactivate(Controller);
                Model.activeMapTool = null;
            }
        }
        catch (ex) {
        }
        switch (tool) {
            case "pan":
                Model.activeMapTool = new OperationPan();
                Model.activeMapTool.activate(Controller);
                break;
            case "select":
                Model.activeMapTool = new OperationSelect();
                Model.activeMapTool.activate(Controller);
                break;
            case "new":
                Model.activeMapTool = new OperationNew();
                Model.activeMapTool.activate(Controller);
                break;
            case "append":
                Model.activeMapTool = new OperationAppend();
                Model.activeMapTool.activate(Controller);
                break;
            case "split":
                Model.activeMapTool = new OperationSplit();
                Model.activeMapTool.activate(Controller);
                break;
            case "subtract":
                Model.activeMapTool = new OperationSubtract();
                Model.activeMapTool.activate(Controller);
                break;
              case "effects":
                Model.activeMapTool = new OperationEffects();
                Model.activeMapTool.activate(Controller);
                break;
        }
        View.Update();
    }

    public static commandClicked(command: string): void {
         switch (command) {
             case "delete":
                new OperationDelete().execute(Controller);
                break;
             case "merge":
                new OperationMerge().execute(Controller);
         }
        View.Update();
    }



    public static disableNavigationMode(): void {
        try {
            Model.map.disableDoubleClickZoom();
            Model.map.disableClickRecenter();
            Model.map.disablePan();
            Model.map.disableRubberBandZoom();
            Model.map.disableKeyboardNavigation();
        }
        catch (ex) {
        }
    }
    public static enableNavigationMode(): void {
        Model.map.enableDoubleClickZoom();
        Model.map.enableClickRecenter();
        Model.map.enablePan();
        Model.map.enableRubberBandZoom();
        Model.map.enableKeyboardNavigation();
    }
}


export = Controller;



