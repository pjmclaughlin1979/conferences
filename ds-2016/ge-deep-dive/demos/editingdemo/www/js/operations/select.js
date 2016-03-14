// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../model", "../view", "dojo/on", "esri/tasks/query", "esri/layers/FeatureLayer", "dojo/promise/all", "./operation", "../CommonSymbols", "./draw", "esri/geometry/Point", "esri/geometry/Extent"], function (require, exports, Model, View, on, esriQuery, esriFeatureLayer, dojoAll, BaseOperation, CommonSymbols, Draw, esriPoint, esriExtent) {
    var Operation = (function (_super) {
        __extends(Operation, _super);
        function Operation() {
            _super.apply(this, arguments);
            this.controller = null;
            this.drawEndHandle = null;
            this.mapClickHandle = null;
            this.lastTime = new Date().getTime();
        }
        Object.defineProperty(Operation.prototype, "name", {
            /*
           * Name of Operation
           */
            get: function () {
                return "select";
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
            Model.drawingManager.Symbol = CommonSymbols.selectionEnvelopeSymbol;
            Model.drawingManager.activate(Draw.EXTENT);
            var that = this;
            this.drawEndHandle = on(Model.drawingManager, "draw-end", function (evt) {
                that.lastTime = new Date().getTime();
                // Handle case where it is a point
                var selectionExtent = evt.geometry;
                if (selectionExtent instanceof esriPoint) {
                    selectionExtent = new esriExtent(selectionExtent.x, selectionExtent.y, selectionExtent.x, selectionExtent.y, selectionExtent.spatialReference);
                }
                var selections = [];
                for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
                    var layer = Model.webmap.operationalLayers[z].layerObject;
                    var query = new esriQuery();
                    query.geometry = selectionExtent;
                    selections.push(layer.selectFeatures(query, evt.shift == true ? esriFeatureLayer.SELECTION_ADD : esriFeatureLayer.SELECTION_NEW));
                }
                dojoAll(selections).then(function (results) {
                    Model.updateSelectionState();
                    View.Update();
                }, function (erre) {
                    Model.updateSelectionState();
                    View.Update();
                });
            });
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
