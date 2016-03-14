// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>

import esriGeometryEngine = require("esri/geometry/geometryEngine");
import Util = require("../util");
import Model = require("../model");
import View = require("../view");
import BaseOperation = require("./operation");



class Operation extends BaseOperation {
     /*
    * Name of Operation
    */
    public get name(): string {
        return "delete";
    }
    


    public execute(controller) {
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
    }

}

export = Operation;