// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../model", "../view", "./operation"], function (require, exports, Model, View, BaseOperation) {
    var Operation = (function (_super) {
        __extends(Operation, _super);
        function Operation() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Operation.prototype, "name", {
            /*
           * Name of Operation
           */
            get: function () {
                return "delete";
            },
            enumerable: true,
            configurable: true
        });
        Operation.prototype.execute = function (controller) {
            for (var z = 0; z < Model.selection.selectedFeatures.length; z++) {
                var graphicsToDelete = Model.selection.selectedFeatures[z].graphics;
                for (var g = 0; g < graphicsToDelete.length; g++) {
                    graphicsToDelete[g].hide();
                }
                Model.selection.selectedFeatures[z].layer.clearSelection();
                Model.selection.selectedFeatures[z].layer.applyEdits([], [], graphicsToDelete);
            }
            Model.updateSelectionState();
            View.Update();
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
