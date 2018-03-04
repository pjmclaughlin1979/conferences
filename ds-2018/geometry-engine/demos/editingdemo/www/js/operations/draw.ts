// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>


declare var $: any;



import esri = require("esri");
import esriMap = require("esri/map");
import esriGeometry = require("esri/geometry/Geometry");
import esriPolygon = require("esri/geometry/Polygon");
import esriPolyline = require("esri/geometry/Polyline");
import esriPoint = require("esri/geometry/Point");
import esriExtent = require("esri/geometry/Extent");
import esriMultiPoint = require("esri/geometry/Multipoint");
import esriSpatialReference = require("esri/SpatialReference");
import geometryJsonUtils = require("esri/geometry/jsonUtils")
import CommonSymbols = require("../commonsymbols");
import Util = require("../util");
import esriSymbol = require("esri/symbols/Symbol");
import esriGraphic = require("esri/graphic");
import dojoKeys = require("dojo/keys");
import dojoAspect = require("dojo/aspect");
import dojoOn = require("dojo/on");

import Dimensions = require("./dimensions");

/*determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
points-are-in-clockwise-order*/
function ringIsClockwise(ringToTest) {
    var total = 0, i = 0,
        rLength = ringToTest.length,
        pt1 = ringToTest[i],
        pt2;
    for (i; i < rLength - 1; i++) {
        pt2 = ringToTest[i + 1];
        total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
        pt1 = pt2;
    }
    return (total >= 0);
}

var _currentgraphiccount = 0; /// Number used to prevent naming clashes

class DrawingManager {
    map: esriMap = null;

    canCancel: boolean = false;
    canComplete: boolean = false;
    isActive: boolean = false;
    canUndoPoint: boolean = false;


    private _dragged: boolean = false;
    private _currentDrawingMode: string = "point";
    private _drawingSymbol: esriSymbol = null;
    private pointFeedbackSymbol: esriSymbol = null;
    private lastPointFeedbackSymbol: esriSymbol = null;
    private polygonLineBackSymbol: esriSymbol = null;
    private mouseDownPointFeedbackSymbol: esriSymbol = null;

    private _mouseDownGraphic: esriGraphic = null;
    private _segmentGraphic: esriGraphic = null;
    private _graphic: esriGraphic = null;
    private _currentLastPulsate = "";
    private _eventHandles = [];
    
    // Detect Double Click
    private _lastpttime = new Date().getTime();
    private _lastscreenX = -1;
    private _lastscreenY = -1;
    private dimensions: Dimensions = null;

    private dimensionFeedbackSegment = "";
    private dimensionFeedbackGeometry = "";

    private _orderReversed: boolean = false;

    static POLYLINE: string = "polyline";
    static POLYGON: string = "polygon";
    static EXTENT: string = "extent";
    static POINT: string = "point";


    _points: any = [];

    constructor(map: esriMap, dim: Dimensions = null) {
        this.map = map;
        this.pointFeedbackSymbol = CommonSymbols.drawPointFeedbackSymbol;
        this.lastPointFeedbackSymbol = CommonSymbols.drawLastPointFeedbackSymbol;
        this.polygonLineBackSymbol = CommonSymbols.drawPolygonLineBackSymbol;
        this.mouseDownPointFeedbackSymbol = CommonSymbols.drawMouseDownPointFeedbackSymbol;
        this.dimensions = dim;
    }

    public get Symbol() {
        return this._drawingSymbol;
    }

    public set Symbol(sym: esriSymbol) {
        this._drawingSymbol = sym;
    }

    /*
    * Implementation of Dojo Evented
    */
    public on(type: any, listener: any) {

        return (<any>dojoOn).parse(this, type, listener, function(target, type) {
            return dojoAspect.after(target, 'on' + type, listener, true);
        });
    }
    
    /*
   * Implementation of Dojo Evented
   */
    public emit(type: any, event: any) {
        var args = [this];
        args.push.apply(args, arguments);
        return dojoOn.emit.apply(dojoOn, args);
    }

    public activate(mode: string): void {
        this.isActive = true;
        this._currentDrawingMode = mode;
        this._bindEvents();
    }

    private _bindEvents(): void {
        var mousedown = false;
        var mouseup = false;
        var mousedrag = false;
        var mousemove = false;
        var keydown = false;


        switch (this._currentDrawingMode) {
            case "extent":
                mousedown = true;
                mouseup = true;
                mousedrag = true;


                break;
            case "point":
                mousedown = true;
                mouseup = true;
                mousedrag = true;


                break;
            case "polyline":
            case "polygon":
                mousedown = true;
                mouseup = true;
                mousemove = true;
                mousedrag = true;

                keydown = true;



                break;
        }
        var that = this;
        if (mousedown) {
            this._eventHandles.push(this.map.on("mouse-down", function(evt) {
                that._mouseDown(evt);
            }));

        }
        if (mousemove) {
            this._eventHandles.push(this.map.on("mouse-move", function(evt) {
                that._mouseMove(evt);
            }));
        }
        if (mousedrag) {
            this._eventHandles.push(this.map.on("mouse-drag", function(evt) {
                that._mouseDrag(evt);
            }));
        }
        if (mouseup) {
            this._eventHandles.push(this.map.on("mouse-up", function(evt) {
                that._mouseUp(evt);
            }));
        }
        if (keydown) {
            this._eventHandles.push(this.map.on("key-down", function(evt) {
                that._onKeyDown(evt);
            }));
        }

    }

    public deactivate(): void {
        this.isActive = false;
        for (var z = 0; z < this._eventHandles.length; z++) {
            this._eventHandles[z].remove();
        }
        this._eventHandles = [];
        this._clearGraphics();
        this._points = [];
        this._graphic = null;
        this._segmentGraphic = null;
        this._dragged = false;
        this._clearPulsateLastPoint();
        this._orderReversed = false;
        this._updateState();


    }


    public cancelDrawing(): void {

        this._clearGraphics();
        this._points = [];
        this._graphic = null;
        this._orderReversed = false;
        this._segmentGraphic = null;
        this._dragged = false;
        this._clearPulsateLastPoint();
        this._updateState();
    }


    public finishDrawing(): void {
        switch (this._currentDrawingMode) {

            case "polyline":
                if (!this._graphic || this._points.length < 2) {
                    this.cancelDrawing();
                    return;
                }
                this._dblClick(null);

                break;
            case "polygon":
                if (!this._graphic || this._points.length < 2) { //this._points.length < 2) {
                    this.cancelDrawing();

                    return;
                }
                this._dblClick(null);
                break;
        }
    }


    _clearGraphics(): void {

        if (this._graphic !== null) { this.map.graphics.remove(this._graphic); }
        if (this._segmentGraphic !== null) { this.map.graphics.remove(this._segmentGraphic); }
        if (this._mouseDownGraphic !== null) { this.map.graphics.remove(this._mouseDownGraphic); }
        this._graphic = null;
        this._segmentGraphic = null;
        this._mouseDownGraphic = null;

        for (var z = this.map.graphics.graphics.length - 1; z >= 0; z--) {
            if ((<any>this.map.graphics.graphics[z]).drawFeedbackId !== undefined) {
                this.map.graphics.remove(this.map.graphics.graphics[z]);
            }
        }

        this._clearPulsateLastPoint();
        
        // Clear Dimensions on the Map
        if (this.dimensions != null) {
            this.dimensionFeedbackGeometry = this.dimensions.removeDimension(this.dimensionFeedbackGeometry);
            this.dimensionFeedbackSegment = this.dimensions.removeDimension(this.dimensionFeedbackSegment);
        }
    }

    _clearPulsateLastPoint(): void {
        if (this._currentLastPulsate !== "") {
            CommonSymbols.clearPulsateGraphic(this._currentLastPulsate);
            this._currentLastPulsate = "";
        }
    }

    _updateState() {
        this.canUndoPoint = false;
        this.canCancel = false;
        this.canComplete = false;
        if (this.isActive === false) return;
        if (this._currentDrawingMode === "point") {
            this.canCancel = false;
        }
        else {
            if (this._points.length > 0) {
                this.canCancel = true;
                this.canUndoPoint = true;
            }
        }

        if (this._currentDrawingMode === "polygon") {
            if (this._points.length > 2) {
                this.canComplete = true;
            }
        }
        if (this._currentDrawingMode === "polyline") {
            if (this._points.length > 1) {
                this.canComplete = true;
            }
        }
    }

    _onKeyDown(evt): void {
        if (evt.keyCode === dojoKeys.ESCAPE) {

            this._clearGraphics();
            this._points = [];
            this._graphic = null;
            this._segmentGraphic = null;
            this._dragged = false;
            this._updateState();
        }
    }

    _mouseDown(evt): void {

        try {
            var start = evt.mapPoint;

            switch (this._currentDrawingMode) {
                case "extent":
                    this._points = [];
                    this._points.push([start.x, start.y]);
                    break;

                case "point":
                case "polyline":
                case "polygon":
                    if (this._mouseDownGraphic !== null) { this.map.graphics.remove(this._mouseDownGraphic); }
                    this._mouseDownGraphic = new esriGraphic(new esriPoint(start.x, start.y, this.map.spatialReference), this.mouseDownPointFeedbackSymbol);
                    this.map.graphics.add(this._mouseDownGraphic);


                    break;
            }
        }
        catch (ex) {
            Util.error("Draw Mouse Down", ex)
        }

    }
    _mouseMove(evt): void {
        try {

            var eventPoint = evt.mapPoint;

            if (this._mouseDownGraphic !== null) {
                this._mouseDownGraphic.setGeometry(new esriPoint(eventPoint.x, eventPoint.y, this.map.spatialReference));
            }

            if (this._points.length > 0) {
                var start = this._points[this._points.length - 1],
                    end = eventPoint,
                    geom: esriPolyline = <any>this._segmentGraphic.geometry;
                switch (this._currentDrawingMode) {
                    case "polygon":
                    case "polyline":

                        geom.setPoint(0, geom.paths[0].length - 2, <any>{ x: start[0], y: start[1] });
                        geom.setPoint(0, geom.paths[0].length - 1, <any>{ x: end.x, y: end.y });

                        this._segmentGraphic.setGeometry(geom);
                        if (this.dimensions != null) {
                            this.dimensionFeedbackSegment = this.dimensions.removeDimension(this.dimensionFeedbackSegment);
                            this.dimensionFeedbackSegment = this.dimensions.addDimension(this._segmentGraphic.geometry);
                        }
                        break;
                }
            }


        }
        catch (ex) {
            Util.error("Error Occured MouseMove:", ex);
        }
    }

    _mouseDrag(evt): void {

        try {


            switch (this._currentDrawingMode) {

                case "extent":
                    if (this._points.length === 0) { return; }
                    this._dragged = true;
                    var start = new esriPoint(this._points[0][0], this._points[0][1], this.map.spatialReference);
                    var end = evt.mapPoint;

                    if (this._graphic) {
                        this.map.graphics.remove(this._graphic);
                        this._graphic = null;
                    }
                    var rect = new esriExtent(this._normalizeRect(start, end, this.map.spatialReference));

                    this._graphic = this.map.graphics.add(new esriGraphic(rect, this._drawingSymbol));

                    break;
                default:
                    this._mouseMove(evt);


            }
            // Prevent iOS from panning the web page
            evt.preventDefault();
        }
        catch (ex) {
            Util.error("Error Occured Drag:", ex);
        }
    }


    _mouseUp(evt): void {


        try {
            var geometry,
                _pts = this._points,
                start, end


            if (this._mouseDownGraphic !== null) { this.map.graphics.remove(this._mouseDownGraphic); }

            switch (this._currentDrawingMode) {
                case "point":
                case "polygon":
                case "polyline":
                    this._doMouseClickAction(evt);
                    this._updateState()
                    break;

                case "extent":
                    if (this._points.length > 0) {
                        start = new esriPoint(this._points[0][0], this._points[0][1], this.map.spatialReference);
                        end = evt.mapPoint;
                        if (this._graphic) {
                            this.map.graphics.remove(this._graphic);
                            this._graphic = null;
                        }
                        var rect = new esriExtent(this._normalizeRect(start, end, this.map.spatialReference));
                        this._graphic = this.map.graphics.add(new esriGraphic(rect, this._drawingSymbol));
                        if ((rect.getWidth() === 0) || (rect.getHeight() === 0)) {

                            this._completeGeomOperation(evt.mapPoint, evt.ctrlKey, evt.shiftKey);

                        }
                        else {

                            this._completeGeomOperation(this._graphic.geometry, evt.ctrlKey, evt.shiftKey);

                        }
                    }
                    else {
                        // This is just a click
                        this._completeGeomOperation(evt.mapPoint, evt.ctrlKey, evt.shiftKey);

                    }
                    break;
            }

        }
        catch (ex) {
            Util.error("Error Occured MouseUp:", ex);
        }
    }



    _doMouseClickAction(evt): void {
        var that = this;
        try {

            var start = evt.mapPoint, geom, screenPt, newgeom, oldgeom, tpath


            switch (this._currentDrawingMode) {
                case "point":
                    if (this._checkRules(start, null, start) === true) {
                        this._completeGeomOperation(start, evt.ctrlKey, evt.shiftKey);
                    }
                    break;
                case "polyline":
                    try {
                        this._orderReversed = false;
                        if (this._points.length === 0) {
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] });
                            if (this._checkRules(start, null, newgeom) === true) {

                                this._points.push([start.x, start.y]);
                                if (this._graphic) {
                                    this.map.graphics.remove(this._graphic);
                                    this._graphic = null;
                                }
                                this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] }), this._drawingSymbol));
                                this._drawingFeedback(this._segmentGraphic.geometry, [start.x, start.y]);
                            }
                        } else if (this._points.length === 1) {
                            if (!((this._points[this._points.length - 1][0] === start.x) && (this._points[this._points.length - 1][1] === start.y))) {
                                newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [start.x, start.y]]] });
                                oldgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] });
                                if (this._checkRules(start, oldgeom, newgeom) === true) {

                                    this._points.push([start.x, start.y]);
                                    this._graphic = this.map.graphics.add(new esriGraphic(newgeom, this._drawingSymbol));
                                    geom = this._segmentGraphic.geometry;
                                    geom.setPoint(0, 0, start.offset(0, 0));
                                    geom.setPoint(0, 1, start.offset(0, 0));
                                    this._segmentGraphic.setGeometry(geom);
                                    this._drawingFeedback(this._graphic.geometry, [start.x, start.y]);
                                }
                            }

                        }
                        else {
                            if (!((this._points[this._points.length - 1][0] === start.x) && (this._points[this._points.length - 1][1] === start.y))) {
                                tpath = (<esriPolyline>this._graphic.geometry).paths[0].slice(0);  // Shallow Clone Array
                                tpath.push([start.x, start.y]);
                                newgeom = new esriPolyline(this.map.spatialReference);
                                newgeom.addPath(tpath);
                                if (this._checkRules(start, this._graphic.geometry, newgeom) === true) {

                                    this._points.push([start.x, start.y]);
                                    (<any>this._graphic.geometry)._insertPoints([start.offset(0, 0)], 0);
                                    this._graphic.setGeometry(this._graphic.geometry).setSymbol(this._drawingSymbol);
                                    geom = this._segmentGraphic.geometry;
                                    geom.setPoint(0, 0, start.offset(0, 0));
                                    geom.setPoint(0, 1, start.offset(0, 0));
                                    this._segmentGraphic.setGeometry(geom);
                                    this._drawingFeedback(this._graphic.geometry, [start.x, start.y]);
                                }
                            }
                        }


                        screenPt = this.map.toScreen(start);
                        if ((((new Date().getTime()) - this._lastpttime) < 300) && (screenPt.y === this._lastscreenY) && (screenPt.x === this._lastscreenX)) {
                            this._dblClick(evt);
                        } else {
                            this._lastpttime = new Date().getTime();
                            this._lastscreenX = screenPt.x;
                            this._lastscreenY = screenPt.y;
                        }
                    }
                    catch (ex) {

                    }
                    break;
                case "polygon":
                    try {

                        if (this._points.length === 0) {
                            this._orderReversed = false;
                            if (this._checkRules(start, null, null) === true) {

                                this._points.push([start.x, start.y]);
                                if (this._graphic) {
                                    this.map.graphics.remove(this._graphic);
                                    this._graphic = null;
                                }
                                this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] }), (<any>this._drawingSymbol).outline));
                                this._drawingFeedback(this._segmentGraphic.geometry, [start.x, start.y]);
                            }
                        }
                        else if (this._points.length === 1) {
                            this._orderReversed = false;
                            if (!((this._points[this._points.length - 1][0] === start.x) && (this._points[this._points.length - 1][1] === start.y))) {
                                newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [start.x, start.y]]] });
                                oldgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] });
                                if (this._checkRules(start, oldgeom, newgeom) === true) {

                                    this._points.push([start.x, start.y]);
                                    if (this._graphic) {
                                        this.map.graphics.remove(this._graphic);
                                        this._graphic = null;
                                    }
                                    var polyline = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[1][0], this._points[1][1]], [start.x, start.y]]] });
                                    this._segmentGraphic.setGeometry(polyline);
                                    this._drawingFeedback(this._segmentGraphic.geometry, [start.x, start.y]);
                                }
                            }
                        }
                        else if (this._points.length === 2) {
                            if (!((this._points[this._points.length - 1][0] === start.x) && (this._points[this._points.length - 1][1] === start.y))) {
                                oldgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[1][0], this._points[1][1]]]] });

                                tpath = [[this._points[0][0], this._points[0][1]], [this._points[1][0], this._points[1][1]], [start.x, start.y]];
                                this._orderReversed = false;
                                if (ringIsClockwise(tpath) === false) {
                                    tpath.reverse();
                                    this._orderReversed = true;
                                }
                                newgeom = new esriPolygon({ rings: [tpath], spatialReference: this.map.spatialReference });
                                if (this._checkRules(start, oldgeom, newgeom) === true) {

                                    this._points.push([start.x, start.y]);
                                    if (this._graphic) {
                                        this.map.graphics.remove(this._graphic);
                                        this._graphic = null;
                                    }
                                    this._graphic = this.map.graphics.add(new esriGraphic(newgeom, this._drawingSymbol));
                                    // OK. Now Have A full Polygon, as 3 points, so can treat path as normal
                                    this._segmentGraphic.setGeometry(new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[start.x, start.y], [start.x, start.y]]] }));
                                    this._drawingFeedback(this._graphic.geometry, [start.x, start.y]);
                                }
                            }
                        }
                        else {
                            if (!((this._points[this._points.length - 1][0] === start.x) && (this._points[this._points.length - 1][1] === start.y))) {
                                // Ensure the path is Clockwise
                                tpath = this._points.slice(0);  // Shallow Clone Array
                                tpath.push([start.x, start.y]);
                                this._orderReversed = false;
                                if (ringIsClockwise(tpath) === false) {
                                    tpath.reverse();
                                    this._orderReversed = true;
                                }
                                newgeom = new esriPolygon({ rings: [tpath], spatialReference: this.map.spatialReference });
                                if (this._checkRules(start, this._graphic.geometry, newgeom) === true) {

                                    this._points.push([start.x, start.y]);
                                    this._graphic.setGeometry(newgeom).setSymbol(this._drawingSymbol);
                                    geom = this._segmentGraphic.geometry;
                                    geom.setPoint(0, 0, start.offset(0, 0));
                                    geom.setPoint(0, 1, start.offset(0, 0));
                                    this._segmentGraphic.setGeometry(geom);
                                    this._drawingFeedback(this._graphic.geometry, [start.x, start.y]);
                                }
                            }
                        }

                        screenPt = this.map.toScreen(start);
                        if ((((new Date().getTime()) - this._lastpttime) < 300) && (screenPt.y === this._lastscreenY) && (screenPt.x === this._lastscreenX)) {
                            this._dblClick(evt);
                        } else {
                            this._lastpttime = new Date().getTime();
                            this._lastscreenX = screenPt.x;
                            this._lastscreenY = screenPt.y;
                        }
                    }
                    catch (ex2) { }
                    break;


            }

        }
        catch (ex) {
            Util.error("Error Occured Mouse Down: ", ex);
        }
    }




    _dblClick(evt): void {
        try {
            var geometry;

            switch (this._currentDrawingMode) {

                case "polyline":
                    if (!this._graphic || this._points.length < 2) {
                        this._clearGraphics();
                        this._mouseDown(evt);
                        return;
                    }
                    geometry = new esriPolyline(this.map.spatialReference);
                    geometry.addPath([].concat(this._points));

                    if (evt === null) {
                        this._completeGeomOperation(geometry, false, false);
                    }
                    else {
                        this._completeGeomOperation(geometry, evt.ctrlKey, evt.shiftKey);
                    }

                    break;
                case "polygon":
                    if (!this._graphic || this._points.length < 2) { //this._points.length < 2) {
                        this._clearGraphics();
                        this._mouseDown(evt);
                        return;
                    }

                    geometry = new esriPolygon(this.map.spatialReference);
                    var ring = [].concat(this._points, [[this._points[0][0], this._points[0][1]]]);
                    if (!ringIsClockwise(ring)) {

                        ring.reverse();
                    }
                    geometry.addRing(ring);
                    if (evt === null) {
                        this._completeGeomOperation(geometry, false, false);
                    }
                    else {
                        this._completeGeomOperation(geometry, evt.ctrlKey, evt.shiftKey);
                    }

                    break;
            }
        }
        catch (ex) {
            Util.error("Error Occured DblClick", ex);
        }
    }

    _normalizeRect(start, end, spatialReference): any {
        var sx = start.x,
            sy = start.y,
            ex = end.x,
            ey = end.y,
            width = Math.abs(sx - ex),
            height = Math.abs(sy - ey),
            xmin = Math.min(sx, ex),
            ymin = Math.min(sy, ey);
        return { xmin: xmin, ymin: ymin, xmax: xmin + width, ymax: ymin + height, spatialReference: spatialReference };
    }


    _checkRules(newPt, currentShape, shapeWithNewPt): boolean {
        try {
            var valid = true;
          
            //   $.each(that._rules, function(ruleindex, ruleitem) {
            //      valid = ruleitem.newPointValid(newPt, currentShape, shapeWithNewPt, lazyConverts);
            //     if (valid === false) {
            //         return false; // Break out of loop
            //     }
            //  });
            if (valid === true) {
                //    FeedbackManager.clearDrawFeedback();
            }
            return valid;
        }
        catch (ex) {
            Util.error("Error Occured checking rules: ", ex);
            return false;
        }
    }



    _completeGeomOperation(capturedgeom, ctrlKey, shiftKey) {
        var that = this;


        this._points = [];
        this._orderReversed = false;

        if (capturedgeom !== null) {
            if (this._checkRulesBeforeFinishing(capturedgeom) === true) {
                this.emit("draw-end", {
                    geometry: capturedgeom,
                    ctrl: ctrlKey,
                    shift: shiftKey
                })

            }
        }
        this._clearGraphics();
        this._updateState();


    }

    _checkRulesBeforeFinishing(newshape: esriGeometry) {
        try {
            var valid = true;
  
            //  $.each(that._rules, function(ruleindex, ruleitem) {
            //      valid = ruleitem.finishedShapeValid(newshape, lazyConverts);
            //     if (valid === false) {
            //          return false; // Break out of loop
            //     }
            //  });
            return valid;
        }
        catch (ex) {
            Util.error("Error Occured checking rules before finishing: ", ex);
            return false;
        }
    }



    undoLastPoint() {
        var tpath, newgeom;


        if (this.canUndoPoint === true) {
            if (this._points.length === 1) {
                this.cancelDrawing();
            }
            else {
                this._points.pop();
                switch (this._currentDrawingMode) {

                    case "polyline":

                        if (this._points.length === 1) {
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[0][0], this._points[0][1]]]] });

                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            if (this._segmentGraphic) {
                                this.map.graphics.remove(this._segmentGraphic);
                                this._segmentGraphic = null;
                            }
                            this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({
                                spatialReference: this.map.spatialReference,
                                paths: [[[this._points[0][0], this._points[0][1]], [this._points[0][0], this._points[0][1]]]]
                            }), this._drawingSymbol));
                            this._drawingFeedback(this._segmentGraphic.geometry, [this._points[0][0], this._points[0][1]]);
                        }
                        else if (this._points.length === 2) {
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[1][0], this._points[1][1]]]] });
                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            this._graphic = this.map.graphics.add(new esriGraphic(newgeom, this._drawingSymbol));
                            this._segmentGraphic.setGeometry(geometryJsonUtils.fromJson(newgeom.toJson()));
                            this._drawingFeedback(this._graphic.geometry, [this._points[1][0], this._points[1][1]]);
                        }
                        else {
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [this._points.slice(0)] });
                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            this._graphic = this.map.graphics.add(new esriGraphic(newgeom, this._drawingSymbol));
                            this._segmentGraphic.setGeometry(new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[this._points.length - 2][0], this._points[this._points.length - 2][1]], [this._points[this._points.length - 1][0], this._points[this._points.length - 1][1]]]] }));
                            this._drawingFeedback(this._graphic.geometry, [this._points[this._points.length - 1][0], this._points[this._points.length - 1][1]]);
                        }
                        break;
                    case "polygon":
                        if (this._points.length === 1) {
                            this._orderReversed = false;
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[0][0], this._points[0][1]]]] });

                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            if (this._segmentGraphic) {
                                this.map.graphics.remove(this._segmentGraphic);
                                this._segmentGraphic = null;
                            }
                            this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({
                                spatialReference: this.map.spatialReference,
                                paths: [[[this._points[0][0], this._points[0][1]], [this._points[0][0], this._points[0][1]]]]
                            }), (<any>this._drawingSymbol).outline));
                            this._drawingFeedback(this._segmentGraphic.geometry, [this._points[0][0], this._points[0][1]]);
                        }
                        else if (this._points.length === 2) {
                            this._orderReversed = false;
                            newgeom = new esriPolyline({ spatialReference: this.map.spatialReference, paths: [[[this._points[0][0], this._points[0][1]], [this._points[1][0], this._points[1][1]]]] });
                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            if (this._segmentGraphic) {
                                this.map.graphics.remove(this._segmentGraphic);
                                this._segmentGraphic = null;
                            }
                            this._graphic = this.map.graphics.add(new esriGraphic(newgeom, (<any>this._drawingSymbol).outline));
                            this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({
                                spatialReference: this.map.spatialReference,
                                paths: [[[this._points[0][0], this._points[0][1]], [this._points[0][0], this._points[0][1]]]]
                            }), (<any>this._drawingSymbol).outline));
                            this._drawingFeedback(this._graphic.geometry, [this._points[1][0], this._points[1][1]]);
                        }
                        else {
                            tpath = this._points.slice(0);
                            this._orderReversed = false;
                            if (ringIsClockwise(tpath) === false) {
                                tpath.reverse();
                                this._orderReversed = true;
                            }
                            newgeom = new esriPolygon({ rings: [tpath], spatialReference: this.map.spatialReference });

                            if (this._graphic) {
                                this.map.graphics.remove(this._graphic);
                                this._graphic = null;
                            }
                            if (this._segmentGraphic) {
                                this.map.graphics.remove(this._segmentGraphic);
                                this._segmentGraphic = null;
                            }
                            this._segmentGraphic = this.map.graphics.add(new esriGraphic(new esriPolyline({
                                spatialReference: this.map.spatialReference,
                                paths: [[[this._points[this._points.length - 1][0], this._points[this._points.length - 1][1]], [this._points[this._points.length - 1][0], this._points[this._points.length - 1][1]]]]
                            }), (<any>this._drawingSymbol).outline));
                            this._graphic = this.map.graphics.add(new esriGraphic(newgeom, this._drawingSymbol));
                            this._drawingFeedback(this._graphic.geometry, [this._points[this._points.length - 1][0], this._points[this._points.length - 1][1]]);
                        }
                        break;
                }
                this._updateState();
            }

        }
    }

    _drawingFeedback(theshape, thelastpt) {
        var tg = null;
        _currentgraphiccount += 1;
        var uniquepoints = [];
        if (thelastpt !== null) {
            uniquepoints.push(thelastpt[0].toString() + ":" + thelastpt[1].toString());
        }

        var pointcol = null;
        if (theshape.type === "polygon") {
            pointcol = theshape.rings[0];
            var newshape = geometryJsonUtils.fromJson(theshape.toJson());
            tg = new esriGraphic(newshape, this.polygonLineBackSymbol);
            tg.drawFeedbackId = _currentgraphiccount;
            this.map.graphics.add(tg);

            // that._totalLengthArea = newshape.sweetGetAreaInMeters();
        }
        else if (theshape.type === "polyline") {
            pointcol = theshape.paths[0];
        }

        for (var z = 0; z < pointcol.length; z++) {
            var ptitem = pointcol[z];
            var test = ptitem[0].toString() + ":" + ptitem[1].toString();
            if (uniquepoints.indexOf(test) == -1) {
                tg = new esriGraphic(new esriPoint(ptitem[0], ptitem[1], theshape.spatialReference), this.pointFeedbackSymbol);
                tg.drawFeedbackId = _currentgraphiccount;
                this.map.graphics.add(tg);
                uniquepoints.push(ptitem[0].toString() + ":" + ptitem[1].toString());
            }
        }


        this._clearPulsateLastPoint();
        if (thelastpt !== null) {
            tg = new esriGraphic(new esriPoint(thelastpt[0], thelastpt[1], theshape.spatialReference), this.lastPointFeedbackSymbol);
            tg.drawFeedbackId = _currentgraphiccount;
            this.map.graphics.add(tg);
            this._currentLastPulsate = CommonSymbols.pulsateGraphic(tg, 7, 12);
        }

        for (var z = this.map.graphics.graphics.length - 1; z >= 0; z--) {
            var tgitem = this.map.graphics.graphics[z];
            if ((<any>tgitem).drawFeedbackId !== undefined) {
                if ((<any>tgitem).drawFeedbackId < _currentgraphiccount) {
                    this.map.graphics.remove(tgitem);
                }
            }
        }

        if (this.dimensions != null) {
            this.dimensionFeedbackSegment = this.dimensions.removeDimension(this.dimensionFeedbackSegment);
            if (this._segmentGraphic !== null) this.dimensionFeedbackSegment = this.dimensions.addDimension(this._segmentGraphic.geometry);

            this.dimensionFeedbackGeometry = this.dimensions.removeDimension(this.dimensionFeedbackGeometry);
            if ((theshape.type === "polygon") || (theshape.type == "polyline")) {
                this.dimensionFeedbackGeometry = this.dimensions.addDimension(theshape, this._orderReversed);
            }
        }
       
        
        // this._displayOperationFeedback();
    }



}
export = DrawingManager




   

   
  