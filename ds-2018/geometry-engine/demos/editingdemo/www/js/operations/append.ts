// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>

import esriGeometryEngine = require("esri/geometry/geometryEngine");
import Util = require("../util");
import Model = require("../model");
import View = require("../view");
import on = require("dojo/on");
import BaseOperation = require("./operation");


class Operation extends BaseOperation {
   
    public controller: any = null;
    
    drawEndHandle:any = null;
    
    
    /*
    * Name of Operation
    */
    public get name(): string {
        return "append";
    }
    
    
    /*
    * UnBind Tool
    */
    public deactivate(controller) {

        if (this.drawEndHandle!==null) {
            this.drawEndHandle.remove();
            this.drawEndHandle = null;
        }
        controller.enableNavigationMode();
        Model.drawingManager.deactivate();
         
    };

    /*
    * Bind
    */
    public activate(controller) {
        this.controller = controller;
        var that = this;
        controller.disableNavigationMode();
        
        var that = this;
        this.setDrawingStyleForEditing(Model.drawingManager, Model.selection.featureLayer)
        this.drawEndHandle = on(Model.drawingManager, "draw-end", function(evt) {
            var newgeom = esriGeometryEngine.union([(<any>evt).geometry, Model.selection.feature.geometry])
            Model.selection.feature.setGeometry(newgeom);
            Model.selection.featureLayer.applyEdits([], [Model.selection.feature],[]);
            View.Update();
        });

    }
}




export = Operation;