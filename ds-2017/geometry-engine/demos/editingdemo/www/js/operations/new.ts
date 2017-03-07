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
   
    public controller: any = null;

    drawEndHandle: any = null;
    
     /*
    * Name of Operation
    */
    public get name(): string {
        return "new";
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
        if (Model.activeFeatureLayer == null) return;
        this.setDrawingStyleForEditing(Model.drawingManager, Model.activeFeatureLayer)

        var alayer = Model.activeFeatureLayer;
        var aitem = Model.activeTemplate;

        this.drawEndHandle = on(Model.drawingManager, "draw-end", function(evt) {

            var newgeom = (<any>evt).geometry;

            var templateSymbol = Model.activeFeatureLayer.renderer.getSymbol(Model.activeTemplate.prototype);
            var newfeature = new esriGraphic(newgeom, templateSymbol, JSON.parse(JSON.stringify(Model.activeTemplate.prototype)));



            Model.activeFeatureLayer.applyEdits([newfeature], [], []).then(function(res) {
                for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
                    Model.webmap.operationalLayers[z].layerObject.clearSelection();
                }
                var query = new esriQuery();
                query.objectIds = [res[0].objectId];

                alayer.selectFeatures(query, esriFeatureLayer.SELECTION_NEW);
                Model.updateSelectionState();
                View.Update();
            })
            
            // Unselect anything currently selected
          
            
            View.Update();
        });




    }




}




export = Operation;