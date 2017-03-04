// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>
define(["require", "exports", "esri/layers/FeatureLayer"], function (require, exports, esriFeatureLayer) {
    var LayerSelection = (function () {
        function LayerSelection(inlayer, ingraphics) {
            this.layer = null;
            this.graphics = null;
            this.layer = inlayer;
            this.graphics = ingraphics;
        }
        return LayerSelection;
    })();
    exports.dimensions = null;
    exports.activeMapTool = null;
    exports.map = null;
    exports.webmap = null;
    exports.activeFeatureLayer = null;
    exports.activeTemplate = null;
    exports.drawingManager = null; // esriDrawing = null;
    exports.selection = {
        hasSelection: false,
        allSameLayer: false,
        singleFeatureSelected: false,
        feature: null,
        featureLayer: null,
        selectedFeatures: []
    };
    function updateSelectionState() {
        exports.selection.hasSelection = false;
        exports.selection.singleFeatureSelected = false;
        exports.selection.allSameLayer = false;
        exports.selection.feature = null;
        exports.selection.featureLayer = null;
        exports.selection.selectedFeatures = [];
        for (var z = 0; z < exports.webmap.operationalLayers.length; z++) {
            if (exports.webmap.operationalLayers[z].layerObject instanceof esriFeatureLayer) {
                var layer = exports.webmap.operationalLayers[z].layerObject;
                exports.selection.selectedFeatures.push(new LayerSelection(layer, layer.getSelectedFeatures()));
                if (exports.selection.selectedFeatures[z].graphics.length > 0) {
                    if (exports.selection.hasSelection == true) {
                        // A Selection has already been made in another layer.
                        exports.selection.singleFeatureSelected = false;
                        exports.selection.feature = null;
                        exports.selection.featureLayer = null;
                        exports.selection.allSameLayer = false;
                    }
                    else if (exports.selection.selectedFeatures[z].graphics.length == 1) {
                        exports.selection.allSameLayer = true;
                        exports.selection.singleFeatureSelected = true;
                        exports.selection.feature = exports.selection.selectedFeatures[z].graphics[0];
                        exports.selection.featureLayer = exports.selection.selectedFeatures[z].layer;
                    }
                    else {
                        exports.selection.allSameLayer = true;
                        exports.selection.featureLayer = exports.selection.selectedFeatures[z].layer;
                    }
                    exports.selection.hasSelection = true;
                }
            }
        }
    }
    exports.updateSelectionState = updateSelectionState;
});
