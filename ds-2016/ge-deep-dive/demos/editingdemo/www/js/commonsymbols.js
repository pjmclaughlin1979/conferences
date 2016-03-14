/* CommonSymbols.ts :  This Module provides all the Map Symbols needed by the application. Provides a simple single place location for all Definitions
*/
define(["require", "exports", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/jsonUtils"], function (require, exports, SimpleFillSymbol, SimpleLineSymbol, Color, SimpleMarkerSymbol, esriSymbolJsonUtils) {
    exports.dimensionLine = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255, 0.4]), 1);
    exports.dimensionLineBack = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255, 1]), 1);
    exports.polygonSelectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([62, 234, 253]), 3), new Color([255, 255, 255, 1]));
    exports.polylineSelectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([62, 234, 253]), 3);
    exports.drawPointFeedbackSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 1), new Color([255, 255, 255, 1]));
    exports.drawLastPointFeedbackSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([255, 255, 255, 1]));
    exports.drawPolygonLineBackSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([0, 0, 0, 0.25]));
    exports.drawMouseDownPointFeedbackSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 16, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([255, 0, 0, 1]));
    exports.drawSnappingPointFeedbackSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 8, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([255, 0, 0, 0]));
    exports.defaultDrawSymbolPolyline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2);
    exports.defaultDrawSymbolPolygon = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 250, 0]), 2), new Color([0, 0, 0, 0.25]));
    exports.defaultDrawSymbolPoint = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0.25]));
    /* Symbols Relating to a Bad, Point, Line or Polygon Feature. */
    exports.feedbackBadPointSymbol = new SimpleMarkerSymbol({
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
    exports.feedbackBadPolygonSymbol = new SimpleFillSymbol({
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
    exports.feedbackBadLineSymbol = new SimpleLineSymbol({
        "type": "esriSLS",
        "style": "esriSLSSolid",
        "color": [242, 222, 222],
        "width": 1
    });
    /*  Symbols relating to Drag Selection */
    exports.selectionEnvelopeSymbol = new SimpleFillSymbol({ "type": "esriSFS", "style": "esriSFSNull", "color": "red", "outline": { "type": "esriSLS", "style": "esriSLSShortDashDot", "color": [0, 0, 0], "width": 1 } });
    exports.selectionCandidate = new SimpleFillSymbol({ "type": "esriSFS", "style": "esriSFSNull", "color": "red", "outline": { "type": "esriSLS", "style": "esriSLSSolid", "color": [169, 215, 241], "width": 1 } });
    var pulsatingid = 0;
    var pulsatingGraphics = {};
    /*
              * Create a Pulsating Effect for a Graphic. This is achieved by increasing and decreasing the size of the graphic
              */
    function pulsateGraphic(graphic, minsize, maxsize) {
        pulsatingid++;
        pulsatingGraphics["T" + pulsatingid] = {
            graphic: graphic,
            minsize: minsize,
            maxsize: maxsize,
            direction: "up"
        };
        var theitem = pulsatingGraphics["T" + pulsatingid];
        pulsatingGraphics["T" + pulsatingid].intervalHandle = setInterval(function () {
            if ((theitem.direction === "up") && (theitem.graphic.symbol.size >= maxsize)) {
                theitem.direction = "down";
            }
            if ((theitem.direction === "down") && (theitem.graphic.symbol.size <= minsize)) {
                theitem.direction = "up";
            }
            var newsymbol = esriSymbolJsonUtils.fromJson(theitem.graphic.symbol.toJson());
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
    exports.pulsateGraphic = pulsateGraphic;
    function clearPulsateGraphic(itemid) {
        if (pulsatingGraphics[itemid] !== undefined) {
            var theitem = pulsatingGraphics[itemid];
            delete pulsatingGraphics[itemid];
            clearInterval(theitem.intervalHandle);
        }
    }
    exports.clearPulsateGraphic = clearPulsateGraphic;
});
