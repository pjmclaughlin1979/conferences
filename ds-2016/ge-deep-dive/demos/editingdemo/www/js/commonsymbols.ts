/* CommonSymbols.ts :  This Module provides all the Map Symbols needed by the application. Provides a simple single place location for all Definitions
*/

// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>

import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import Color = require("esri/Color");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import TextSymbol = require("esri/symbols/TextSymbol");
import esriSymbolJsonUtils = require("esri/symbols/jsonUtils");
import esriGraphic = require("esri/graphic");

export var dimensionLine : SimpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255,0.4]), 1);
export var dimensionLineBack : SimpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255,1]), 1);



export var polygonSelectionSymbol: SimpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([62, 234, 253]), 3), new Color([255, 255, 255, 1]));

export var polylineSelectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([62, 234, 253]), 3);

export var drawPointFeedbackSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 1), new Color([255, 255, 255, 1]));
export var drawLastPointFeedbackSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([255, 255, 255, 1]));
export var drawPolygonLineBackSymbol: SimpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([0, 0, 0, 0.25]));
export var drawMouseDownPointFeedbackSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 16, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([255, 0, 0, 1]));
export var drawSnappingPointFeedbackSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([255, 0, 0, 0]));


export var defaultDrawSymbolPolyline: SimpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2);
export var defaultDrawSymbolPolygon: SimpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([0, 0, 0, 0.25]));
export var defaultDrawSymbolPoint: SimpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0.25]));


/* Symbols Relating to a Bad, Point, Line or Polygon Feature. */

export var feedbackBadPointSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
    "type": "esriSMS",
    "style": "esriSMSCircle",
    "size": 8,
    "color": [185, 74, 72],
    "outline": {
        "type": "esriSLS",
        "style": "esriSLSSolid",
        "color": [242, 222, 222],
        "width": 1
    }
});

// Define a Bad Polygon Entry Symbol
export var feedbackBadPolygonSymbol: SimpleFillSymbol = new SimpleFillSymbol({
    "type": "esriSFS",
    "style": "esriSFSSolid",
    "color": [248, 148, 6],
    "outline": {
        "type": "esriSLS",
        "style": "esriSLSSolid",
        "color": [251, 180, 80],
        "width": 2
    }
});


// Define a Bad Line Entry Symbol
export var feedbackBadLineSymbol: SimpleLineSymbol = new SimpleLineSymbol(
    {
        "type": "esriSLS",
        "style": "esriSLSSolid",
        "color": [242, 222, 222],
        "width": 1
    }
);



/*  Symbols relating to Drag Selection */
export var selectionEnvelopeSymbol: SimpleFillSymbol = new SimpleFillSymbol({ "type": "esriSFS", "style": "esriSFSNull", "color": "red", "outline": { "type": "esriSLS", "style": "esriSLSShortDashDot", "color": [0, 0, 0], "width": 1 } });
export var selectionCandidate: SimpleFillSymbol = new SimpleFillSymbol({ "type": "esriSFS", "style": "esriSFSNull", "color": "red", "outline": { "type": "esriSLS", "style": "esriSLSSolid", "color": [169, 215, 241], "width": 1 } });




var pulsatingid = 0;
var pulsatingGraphics: any = {};
/*
          * Create a Pulsating Effect for a Graphic. This is achieved by increasing and decreasing the size of the graphic
          */
export function pulsateGraphic(graphic: esriGraphic, minsize: number, maxsize: number) {
    pulsatingid++;
    pulsatingGraphics["T" + pulsatingid] = {
        graphic: graphic,
        minsize: minsize,
        maxsize: maxsize,
        direction: "up"
    };
    var theitem = pulsatingGraphics["T" + pulsatingid];
    pulsatingGraphics["T" + pulsatingid].intervalHandle = setInterval(function() {
        if ((theitem.direction === "up") && (theitem.graphic.symbol.size >= maxsize)) {
            theitem.direction = "down";

        }
        if ((theitem.direction === "down") && (theitem.graphic.symbol.size <= minsize)) {
            theitem.direction = "up";

        }
        var newsymbol = <any>esriSymbolJsonUtils.fromJson(theitem.graphic.symbol.toJson());
        if (theitem.direction === "up") {
            newsymbol.size += 1;
        }
        else {
            newsymbol.size -= 1;
        }
        theitem.graphic.setSymbol(newsymbol);

    }, 90);
    return "T" + pulsatingid;
}

export function clearPulsateGraphic(itemid: string) {
    if (pulsatingGraphics[itemid] !== undefined) {
        var theitem = pulsatingGraphics[itemid];
        delete pulsatingGraphics[itemid];
        clearInterval(theitem.intervalHandle);
    }
}
