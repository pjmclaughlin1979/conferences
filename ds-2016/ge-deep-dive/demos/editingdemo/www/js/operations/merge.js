// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "esri/geometry/geometryEngine", "../model", "../view", "./operation", "esri/tasks/query", "esri/layers/FeatureLayer"], function (require, exports, esriGeometryEngine, Model, View, BaseOperation, esriQuery, esriFeatureLayer) {
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
                return "merge";
            },
            enumerable: true,
            configurable: true
        });
        /*
        * Execute the Merge Command
        */
        Operation.prototype.execute = function (controller) {
            for (var z = 0; z < Model.selection.selectedFeatures.length; z++) {
                if (Model.selection.selectedFeatures[z].graphics.length > 1) {
                    if (Model.selection.selectedFeatures[z].graphics.length > 1) {
                        // Merge all the Selected Features in this Layer
                        this.mergeGraphicsInLayer(Model.selection.selectedFeatures[z].layer, Model.selection.selectedFeatures[z].graphics[0], Model.selection.selectedFeatures[z].graphics.slice(1));
                    }
                }
            }
        };
        /*
        *  Merge all the Features into the first selected feature, and delete the others
        */
        Operation.prototype.mergeGraphicsInLayer = function (layer, targetGraphic, mergeGraphics) {
            // First Union the Geometries
            // Create an Array of geometries to Union
            var geoms = [targetGraphic.geometry];
            var ids = [];
            for (var n = 0; n < mergeGraphics.length; n++) {
                geoms.push(mergeGraphics[n].geometry);
                if (n > 0) {
                    // Get the list of IDs. This will be used to reselect afterwards
                    ids.push(mergeGraphics[n].attributes[layer.objectIdField]);
                }
            }
            // Union all the Geometries
            var newgeom = esriGeometryEngine.union(geoms);
            // Hide the Graphics
            for (var k = 0; k < mergeGraphics.length; k++) {
                mergeGraphics[k].hide();
            }
            targetGraphic.setGeometry(newgeom);
            // Remove the Selection
            var query = new esriQuery();
            query.objectIds = ids;
            layer.selectFeatures(query, esriFeatureLayer.SELECTION_SUBTRACT).then(function () {
                Model.updateSelectionState();
                View.Update();
            });
            layer.applyEdits([], [targetGraphic], mergeGraphics).then(function () {
                Model.updateSelectionState();
                View.Update();
            });
        };
        return Operation;
    })(BaseOperation);
    return Operation;
});
