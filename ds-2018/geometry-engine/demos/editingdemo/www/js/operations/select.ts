// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>


declare var $: any;

import Model = require("../model");
import View = require("../view");

import on = require("dojo/on");
import esriQuery = require("esri/tasks/query");
import esriFeatureLayer = require("esri/layers/FeatureLayer");
import dojoAll = require("dojo/promise/all");
import BaseOperation = require("./operation");
import Util = require("../util");
import CommonSymbols = require("../CommonSymbols");
import Draw = require("./draw");
import esriGeometry = require("esri/geometry/Geometry");
import esriPoint = require("esri/geometry/Point");
import esriExtent = require("esri/geometry/Extent");


class Operation extends BaseOperation {
    public controller: any = null;

    drawEndHandle: any = null;
    mapClickHandle: any = null;

    lastTime: number = new Date().getTime();
    
    /*
   * Name of Operation
   */
    public get name(): string {
        return "select";
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
        Model.drawingManager.Symbol = CommonSymbols.selectionEnvelopeSymbol;
        Model.drawingManager.activate(Draw.EXTENT);
        var that = this;
        this.drawEndHandle = on(Model.drawingManager, "draw-end", function(evt) {
         
            that.lastTime = new Date().getTime();
            
            // Handle case where it is a point
            var selectionExtent =<esriGeometry> (<any> evt).geometry;
            if (selectionExtent instanceof esriPoint) {
                selectionExtent = new esriExtent((<esriPoint>selectionExtent).x,(<esriPoint>selectionExtent).y,(<esriPoint>selectionExtent).x,(<esriPoint>selectionExtent).y, selectionExtent.spatialReference )
            }

            var selections: dojo.Promise<any>[] = [];
            for (var z = 0; z < Model.webmap.operationalLayers.length; z++) {
                var layer = Model.webmap.operationalLayers[z].layerObject;
                var query = new esriQuery();
                query.geometry = selectionExtent;
                selections.push(layer.selectFeatures(query, (<any>evt).shift == true ? esriFeatureLayer.SELECTION_ADD : esriFeatureLayer.SELECTION_NEW));

            }
            dojoAll(selections).then(function(results) {
                Model.updateSelectionState();
                View.Update();
            }, function(erre) {
                Model.updateSelectionState();
                View.Update();
            })
        });
    }

}




export = Operation;