// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../model", "../view", "dojo/on", "./operation", "esri/tasks/query", "esri/layers/FeatureLayer", "esri/graphic"], function (require, exports, Model, View, on, BaseOperation, esriQuery, esriFeatureLayer, esriGraphic) {
    var Operation = (function (_super) {
        __extends(Operation, _super);
        function Operation() {
            _super.apply(this, arguments);
            this.controller = null;
            this.drawEndHandle = null;
        }
        Object.defineProperty(Operation.prototype, "name", {
            /*
           * Name of Operation
           */
            get: function () {
                return "new";
            },
            enumerable: true,
            configurable: true
        });
        /*
        * UnBind Tool
        */
        Operation.prototype.deactivate = function (controller) {
            if (this.drawEndHandle !== null) {
                this.drawEndHandle.remove();
                this.drawEndHandle = null;
            }
            controller.enableNavigationMode();
            Model.drawingManager.deactivate();
        };
        ;
        /*
        * Bind
        */
        Operation.prototype.activate = function (controller) {
            this.controller = controller;
            var that = this;
            controller.disableNavigationMode();
            var that = this;
            if (Model.activeFeatureLayer == null)
                return;
            this.setDrawingStyleForEditing(Model.drawingManager, Model.activeFeatureLayer);
            var alayer = Model.activeFeatureLayer;
            var aitem = Model.activeTemplate;
            this.drawEndHandle = on(Model.drawingManager, "draw-end", function (evt) {
                var newgeom = evt.geometry;
                var templateSymbol = Model.activeFeatureLayer.renderer.getSymbol(Model.activeTemplate.prototype);
                var newfeature = new esriGraphic(newgeom, templateSymbol, JSON.parse(JSON.stringify(Model.activeTemplate.prototype)));
                Model.activeFeatureLayer.applyEdits([newfeature], [], []).then(function (res) {
                    for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
                        Model.webmap.operationalLayers[z].layerObject.clearSelection();
                    }
                    var query = new esriQuery();
                    query.objectIds = [res[0].objectId];
                    alayer.selectFeatures(query, esriFeatureLayer.SELECTION_NEW);
                    Model.updateSelectionState();
                    View.Update();
                });
                // Unselect anything currently selected
                View.Update();
            });
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
