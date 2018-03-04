// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "esri/geometry/geometryEngine", "../model", "../view", "dojo/on", "./operation"], function (require, exports, esriGeometryEngine, Model, View, on, BaseOperation) {
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
                return "append";
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
            this.setDrawingStyleForEditing(Model.drawingManager, Model.selection.featureLayer);
            this.drawEndHandle = on(Model.drawingManager, "draw-end", function (evt) {
                var newgeom = esriGeometryEngine.union([evt.geometry, Model.selection.feature.geometry]);
                Model.selection.feature.setGeometry(newgeom);
                Model.selection.featureLayer.applyEdits([], [Model.selection.feature], []);
                View.Update();
            });
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
