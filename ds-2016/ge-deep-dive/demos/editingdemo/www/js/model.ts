// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>


import esriMap = require("esri/map");
import esriFeatureLayer = require("esri/layers/FeatureLayer");
import esriGraphic = require("esri/graphic");
import BaseOperation = require("./operations/operation");
import Draw = require("./operations/draw");
import Dimensions = require("./operations/dimensions");

class LayerSelection {
    constructor(inlayer, ingraphics) { this.layer = inlayer; this.graphics = ingraphics; }
    public layer: esriFeatureLayer = null;
    public graphics: esriGraphic[] = null;
}


export var dimensions : Dimensions = null;
export var activeMapTool: BaseOperation = null;
export var map: esriMap = null;
export var webmap: any = null;
export var activeFeatureLayer : esriFeatureLayer = null;
export var activeTemplate: any = null;

export var drawingManager: Draw = null; // esriDrawing = null;
export var selection: {
    hasSelection: boolean,
    allSameLayer: boolean,
    singleFeatureSelected: boolean,
    feature: esriGraphic,
    featureLayer: esriFeatureLayer,
    selectedFeatures: LayerSelection[]
} = {
        hasSelection: false,
        allSameLayer: false,
        singleFeatureSelected: false,
        feature: null,
        featureLayer: null,
        selectedFeatures: []

    };




export function updateSelectionState() {
    selection.hasSelection = false;
    selection.singleFeatureSelected = false;
    selection.allSameLayer = false;
    selection.feature = null;
    selection.featureLayer = null;
    selection.selectedFeatures = [];

    for (var z = 0; z < webmap.operationalLayers.length; z++) {
        if (webmap.operationalLayers[z].layerObject instanceof esriFeatureLayer) {
            var layer: esriFeatureLayer = webmap.operationalLayers[z].layerObject;
            selection.selectedFeatures.push(new LayerSelection(layer, layer.getSelectedFeatures()));

            if (selection.selectedFeatures[z].graphics.length > 0) {

                if (selection.hasSelection == true) {
                    // A Selection has already been made in another layer.
                    selection.singleFeatureSelected = false;
                    selection.feature = null;
                    selection.featureLayer = null;
                    selection.allSameLayer = false;
                }
                else if (selection.selectedFeatures[z].graphics.length == 1) {
                    selection.allSameLayer = true;
                    selection.singleFeatureSelected = true;
                    selection.feature = selection.selectedFeatures[z].graphics[0];
                    selection.featureLayer = selection.selectedFeatures[z].layer;
                }
                else {
                    selection.allSameLayer = true;
                    selection.featureLayer =  selection.selectedFeatures[z].layer;
                  
                }

                selection.hasSelection = true;
            }
        }
    }

}
    
    
    