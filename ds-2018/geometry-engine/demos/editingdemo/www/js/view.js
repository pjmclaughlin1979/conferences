// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>
define(["require", "exports", "./model", "esri/layers/FeatureLayer", "esri/graphic", "esri/layers/GraphicsLayer", "./commonsymbols"], function (require, exports, Model, esriFeatureLayer, esriGraphic, esriGraphicsLayer, CommonSymbols) {
    /*
    * Utility Function for Disabling or Enabling a Button
    */
    function setButtonState(buttonname, state) {
        if (state) {
            $("#mainmenu").find("a[data-toolname=" + buttonname + "]").removeClass("disabled");
        }
        else {
            $("#mainmenu").find("a[data-toolname=" + buttonname + "]").addClass("disabled");
        }
    }
    /*
    * Update the State of the UI
    */
    function Update() {
        setButtonState("delete", Model.selection.hasSelection);
        setButtonState("merge", Model.selection.hasSelection && Model.selection.allSameLayer && Model.selection.singleFeatureSelected == false);
        setButtonState("split", Model.selection.hasSelection && Model.selection.allSameLayer && Model.selection.singleFeatureSelected == true);
        setButtonState("append", Model.selection.hasSelection && Model.selection.allSameLayer && Model.selection.singleFeatureSelected == true);
        setButtonState("subtract", Model.selection.hasSelection && Model.selection.allSameLayer && Model.selection.singleFeatureSelected == true);
        setButtonState("effects", Model.selection.hasSelection && Model.selection.allSameLayer && Model.selection.singleFeatureSelected == true);
        if (Model.activeMapTool.name == "new") {
            $("#template-picker-panel").addClass("panel-active");
        }
        else {
            $("#template-picker-panel").removeClass("panel-active");
        }
        if (Model.activeMapTool.name == "effects") {
            $("#effects-panel").addClass("panel-active");
        }
        else {
            $("#effects-panel").removeClass("panel-active");
        }
        if (Model.dimensions.show) {
            $("#footer ul li.footer-measure-tool").addClass("active");
        }
        else {
            $("#footer ul li.footer-measure-tool").removeClass("active");
        }
    }
    exports.Update = Update;
    /*
    * Creates Layers to host Selection Graphics, so can see Selection.
    * Uses this, so can just outline
    */
    function createSelectionViews() {
        for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
            if (Model.webmap.operationalLayers[z].layerObject instanceof esriFeatureLayer) {
                var layer = Model.webmap.operationalLayers[z].layerObject;
                var selLayer = new esriGraphicsLayer();
                Model.map.addLayer(selLayer);
                bindSelectionStateChanges(layer, selLayer);
            }
        }
    }
    exports.createSelectionViews = createSelectionViews;
    /*
    *   Bind events to the layer, to keep the Selection Layer In Sync
    */
    function bindSelectionStateChanges(layer, selLayer) {
        var rebuild = function () {
            var g = layer.getSelectedFeatures();
            selLayer.clear();
            if (layer.geometryType === "esriGeometryPolygon") {
                for (var z = 0; z < g.length; z++) {
                    selLayer.add(new esriGraphic(g[z].geometry, CommonSymbols.polygonSelectionSymbol));
                }
            }
            else if (layer.geometryType === "esriGeometryPolyline") {
                for (var z = 0; z < g.length; z++) {
                    selLayer.add(new esriGraphic(g[z].geometry, CommonSymbols.polylineSelectionSymbol));
                }
            }
            else {
            }
        };
        layer.on("selection-complete", function () {
            rebuild();
        });
        layer.on("application-refresh-selection", function () {
            rebuild();
        });
        layer.on("selection-clear", function () {
            selLayer.clear();
        });
        layer.on("before-apply-edits", function () {
            try {
                Model.updateSelectionState();
                rebuild();
            }
            catch (ex) {
                console.log(ex.message);
            }
        });
        layer.on("edits-complete", function () {
            try {
                Model.updateSelectionState();
                rebuild();
            }
            catch (ex) {
                console.log(ex.message);
            }
        });
        layer.on("visibilty-change", function (evt) {
            selLayer.setVisibility(evt.visible);
        });
        selLayer.setVisibility(layer.visible);
    }
});
