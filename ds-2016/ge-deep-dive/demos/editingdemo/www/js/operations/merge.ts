// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>

import esriGeometryEngine = require("esri/geometry/geometryEngine");
import Util = require("../util");
import Model = require("../model");
import View = require("../view");
import on = require("dojo/on");
import BaseOperation = require("./operation");
import esriQuery = require("esri/tasks/query");
import esriFeatureLayer = require("esri/layers/FeatureLayer");
import esriGeometry = require("esri/geometry/Geometry");
import esriGraphic = require("esri/graphic");





class Operation extends BaseOperation {
  
    /*
    * Name of Operation
    */
    public get name(): string {
        return "merge";
    }
    


    /*
    * Execute the Merge Command
    */
    public execute(controller) {
        for (var z = 0; z < Model.selection.selectedFeatures.length; z++) {
            if (Model.selection.selectedFeatures[z].graphics.length > 1) {
                if (Model.selection.selectedFeatures[z].graphics.length > 1) {
                    
                    // Merge all the Selected Features in this Layer
                    this.mergeGraphicsInLayer(Model.selection.selectedFeatures[z].layer, Model.selection.selectedFeatures[z].graphics[0],
                        Model.selection.selectedFeatures[z].graphics.slice(1));
                }
            }
        }
    }


    /*
    *  Merge all the Features into the first selected feature, and delete the others
    */
    protected mergeGraphicsInLayer(layer: esriFeatureLayer, targetGraphic: esriGraphic, mergeGraphics: esriGraphic[]) {
        // First Union the Geometries
        
        // Create an Array of geometries to Union
        var geoms: esriGeometry[] = [targetGraphic.geometry];
        var ids = [];
        for (var n = 0; n < mergeGraphics.length; n++) {
            geoms.push(mergeGraphics[n].geometry)
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
        layer.selectFeatures(query, esriFeatureLayer.SELECTION_SUBTRACT).then(function() {
            Model.updateSelectionState();
            View.Update()
        });
        layer.applyEdits([], [targetGraphic], mergeGraphics).then(function() {
            Model.updateSelectionState();
            View.Update()
        });
   
    }

}

export = Operation;