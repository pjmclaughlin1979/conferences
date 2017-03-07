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
                return "subtract";
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
            var workingLayer = Model.selection.featureLayer;
            var workingFeature = Model.selection.feature;
            this.drawEndHandle = on(Model.drawingManager, "draw-end", function (evt) {
                var workingGeom = esriGeometryEngine.simplify(evt.geometry);
                if (workingGeom !== null) {
                    var newgeom = esriGeometryEngine.difference(workingFeature.geometry, workingGeom);
                    if (newgeom !== null) {
                        workingFeature.setGeometry(newgeom);
                        workingLayer.applyEdits([], [workingFeature], []).then(function (here) {
                        }, function (erre) {
                        });
                    }
                    else {
                        workingLayer.clearSelection();
                        Model.updateSelectionState();
                        workingLayer.applyEdits([], [], [workingFeature]);
                    }
                }
                View.Update();
            });
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
