// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>

import esriGeometryEngine = require("esri/geometry/geometryEngine");
import Util = require("../util");
import Model = require("../model");
import View = require("../view");
import on = require("dojo/on");
import BaseOperation = require("./operation");
import esriGraphic = require("esri/graphic");

class Operation extends BaseOperation {

    public controller: any = null;

    drawEndHandle: any = null;
    
    
    /*
   * Name of Operation
   */
    public get name(): string {
        return "split";
    }
    
    
    
    /*
    * UnBind Tool
    */
    public deactivate(controller) {

        if (this.drawEndHandle !== null) {
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
        var workingLayer = Model.selection.featureLayer;
        var workingFeature = Model.selection.feature
        this.drawEndHandle = on(Model.drawingManager, "draw-end", function(evt) {
            var workingGeom = esriGeometryEngine.simplify((<any>evt).geometry);
            if (workingGeom !== null) {
                var leftshape = esriGeometryEngine.difference(workingFeature.geometry, workingGeom)
                var splitshape = esriGeometryEngine.intersect(workingFeature.geometry, workingGeom);
                if ((leftshape !== null) && (splitshape !== null)) {
                    workingFeature.setGeometry(leftshape);
                    var g = new esriGraphic(workingFeature.toJson());
                    g.setGeometry(splitshape);
                    delete g.attributes[Model.selection.featureLayer.objectIdField];
                    workingLayer.applyEdits([g], [workingFeature], []).then(function(here) {
                    
                    }, function(erre) {
                       
                    })
                    Model.updateSelectionState();
                    View.Update();
                }

            }

            View.Update();
        });




    }




}




export = Operation;