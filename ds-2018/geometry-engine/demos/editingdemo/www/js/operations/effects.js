// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../model", "../view", "./operation", "esri/geometry/geometryEngine"], function (require, exports, Model, View, BaseOperation, esriGeometryEngine) {
    var Operation = (function (_super) {
        __extends(Operation, _super);
        function Operation() {
            _super.apply(this, arguments);
            this.controller = null;
            this.drawEndHandle = null;
            this.mapClickHandle = null;
            this.clickTimeout = null;
            this.lastTime = new Date().getTime();
            this._originalShape = null;
        }
        Object.defineProperty(Operation.prototype, "name", {
            /*
           * Name of Operation
           */
            get: function () {
                return "effects";
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
            if (this.clickTimeout != null) {
                this.clickTimeout.clear();
                this.clickTimeout = null;
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
            //   Model.drawingManager.Symbol = CommonSymbols.selectionEnvelopeSymbol;
            //   Model.drawingManager.activate(Draw.EXTENT);
            var that = this;
        };
        /*
       * Change State of Feature with Saving
       */
        Operation.prototype.executeCommand = function (commandName, commandParams) {
            var workingLayer = Model.selection.featureLayer;
            var workingFeature = Model.selection.feature;
            var newgeom = null;
            switch (commandName) {
                case "shrink":
                    newgeom = esriGeometryEngine.buffer(workingFeature.geometry, commandParams.value * -1, "meters");
                    if (newgeom !== null) {
                        workingFeature.setGeometry(newgeom);
                        workingLayer.applyEdits([], [workingFeature], []).then(function (here) {
                        }, function (erre) {
                        });
                    }
                    break;
                case "grow":
                    newgeom = esriGeometryEngine.buffer(workingFeature.geometry, commandParams.value, "meters");
                    if (newgeom !== null) {
                        workingFeature.setGeometry(newgeom);
                        workingLayer.applyEdits([], [workingFeature], []).then(function (here) {
                        }, function (erre) {
                        });
                    }
                    break;
                case "rotate":
                    if (this._originalShape == null) {
                        this._originalShape = workingFeature.geometry;
                    }
                    newgeom = esriGeometryEngine.rotate(this._originalShape, commandParams.value);
                    workingFeature.setGeometry(newgeom);
                    workingLayer.applyEdits([], [workingFeature], []).then(function (here) {
                    }, function (erre) {
                    });
                    this._originalShape = null;
                    break;
            }
            View.Update();
        };
        /*
        * Change State of Feature, without saving
        */
        Operation.prototype.feedbackCommand = function (commandName, commandParams) {
            var workingLayer = Model.selection.featureLayer;
            var workingFeature = Model.selection.feature;
            switch (commandName) {
                case "rotate":
                    if (this._originalShape == null) {
                        this._originalShape = workingFeature.geometry;
                    }
                    var newgeom = esriGeometryEngine.rotate(this._originalShape, commandParams.value);
                    workingFeature.setGeometry(newgeom);
                    workingLayer.emit("application-refresh-selection");
                    break;
            }
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
