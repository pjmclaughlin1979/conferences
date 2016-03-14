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

import esriGeometryEngine = require("esri/geometry/geometryEngine");

class Operation extends BaseOperation {
    public controller: any = null;

    drawEndHandle: any = null;
    mapClickHandle: any = null;
    clickTimeout: any = null;
    lastTime: number = new Date().getTime();
    _originalShape: esriGeometry = null;
    
    /*
   * Name of Operation
   */
    public get name(): string {
        return "effects";
    }
    
    
    /*
    * UnBind Tool
    */
    public deactivate(controller) {

        if (this.drawEndHandle !== null) {
            this.drawEndHandle.remove();
            this.drawEndHandle = null;
        }

        if (this.clickTimeout != null) {
            this.clickTimeout.clear();
            this.clickTimeout = null;
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
        //   Model.drawingManager.Symbol = CommonSymbols.selectionEnvelopeSymbol;
        //   Model.drawingManager.activate(Draw.EXTENT);
        var that = this;

    }
    
    
    /*
   * Change State of Feature with Saving
   */
    public executeCommand(commandName: string, commandParams: any): void {
        var workingLayer = Model.selection.featureLayer;
        var workingFeature = Model.selection.feature
        var newgeom: esriGeometry = null;
        switch (commandName) {
            case "shrink":
                newgeom = esriGeometryEngine.buffer(workingFeature.geometry, <any>commandParams.value * -1, <any>"meters");
                if (newgeom !== null) {
                    workingFeature.setGeometry(newgeom);
                    workingLayer.applyEdits([], [workingFeature], []).then(function(here) {

                    }, function(erre) {

                    });
                }
                break;
            case "grow":
                newgeom = esriGeometryEngine.buffer(workingFeature.geometry, <any>commandParams.value, <any>"meters");
                if (newgeom !== null) {
                    workingFeature.setGeometry(newgeom);
                    workingLayer.applyEdits([], [workingFeature], []).then(function(here) {

                    }, function(erre) {

                    });
                }
                break;
            case "rotate":
                if (this._originalShape == null) {
                    this._originalShape = workingFeature.geometry;
                }
                newgeom = esriGeometryEngine.rotate(this._originalShape, commandParams.value);
                workingFeature.setGeometry(newgeom);
                workingLayer.applyEdits([], [workingFeature], []).then(function(here) {

                }, function(erre) {

                });
                this._originalShape = null;
                break;

        }
        View.Update();
    }
    
    
    /*
    * Change State of Feature, without saving
    */
    public feedbackCommand(commandName: string, commandParams: any): void {
        var workingLayer = Model.selection.featureLayer;
        var workingFeature = Model.selection.feature
        switch (commandName) {
            case "rotate":
                if (this._originalShape == null) {
                    this._originalShape = workingFeature.geometry;
                }
                var newgeom = esriGeometryEngine.rotate(this._originalShape, commandParams.value);
                workingFeature.setGeometry(newgeom);
                (<any>workingLayer).emit("application-refresh-selection")
                break;
        }

    }

}




export = Operation;