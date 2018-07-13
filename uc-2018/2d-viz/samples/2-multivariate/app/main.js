define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/symbols", "esri/renderers"], function (require, exports, EsriMap, MapView, FeatureLayer, Legend, symbols_1, renderers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createSymbol(color, isMarker) {
        var options = {
            color: color,
            outline: {
                color: [255, 255, 255, 0.3],
                width: 0.5
            },
            size: 6
        };
        return isMarker ? new symbols_1.SimpleMarkerSymbol(options) : new symbols_1.SimpleFillSymbol(options);
    }
    //////////////////////////////////////
    /////   RENDERER   ///////////////////
    //////////////////////////////////////
    var totalVotes = {
        type: "size",
        field: "PRS_TOT_16",
        legendOptions: {
            title: "Voter turnout"
        },
        minDataValue: 100,
        maxDataValue: 1000000,
        minSize: "4px",
        maxSize: "60px"
    };
    var percentWinner = {
        type: "opacity",
        field: "GAP16",
        legendOptions: {
            title: "Margin of victory"
        },
        stops: [
            { value: 5, opacity: 0.05, label: "contested" },
            { value: 50, opacity: 0.95, label: "landslide" }
        ]
    };
    var winnerRenderer = new renderers_1.UniqueValueRenderer({
        field: "PRS_PARTY_16",
        defaultSymbol: createSymbol("#a7c636", true),
        defaultLabel: "Other",
        legendOptions: {
            title: "Winner"
        },
        uniqueValueInfos: [{
                value: "Dem",
                symbol: createSymbol("#149ece", true),
                label: "Clinton"
            }, {
                value: "GOP",
                symbol: createSymbol("#ed5151", true),
                label: "Trump"
            }],
        visualVariables: [percentWinner, totalVotes]
    });
    var layer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/us_counties_election_join/FeatureServer/0",
        outFields: ["*"],
        title: "Election results (2016) by county",
        renderer: winnerRenderer
    });
    var map = new EsriMap({
        basemap: "gray",
        layers: [layer]
    });
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-95, 38],
        zoom: 5
    });
    var legend = new Legend({
        view: view
    });
    view.ui.add(legend, "bottom-left");
});
//# sourceMappingURL=main.js.map