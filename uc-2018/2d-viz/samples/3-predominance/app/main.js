define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/renderers", "esri/symbols"], function (require, exports, EsriMap, MapView, FeatureLayer, Legend, renderers_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var predominanceArcade = "\n\n  // The fields from which to calculate predominance\n  // The expression will return the alias of the predominant field\n\n  var fields = [\n    { value: $feature.ACSBLT1939, alias: \"Before 1940\" },\n    { value: $feature.ACSBLT1940, alias: \"1940 - 1949\" },\n    { value: $feature.ACSBLT1950, alias: \"1950 - 1959\" },\n    { value: $feature.ACSBLT1960, alias: \"1960 - 1969\" },\n    { value: $feature.ACSBLT1970, alias: \"1970 - 1979\" },\n    { value: $feature.ACSBLT1980, alias: \"1980 - 1989\" },\n    { value: $feature.ACSBLT1990, alias: \"1990 - 1999\" },\n    { value: $feature.ACSBLT2000, alias: \"2000 - 2009\" },\n    { value: $feature.ACSBLT2010, alias: \"2010 - 2014\" },\n    { value: $feature.ACSBLT2014, alias: \"After 2014\" }\n  ];\n\n  // Returns the predominant category as the alias\n  // defined in the fields array. If there is a tie,\n  // then both names are concatenated and used to\n  // indicate the tie\n\n  function getPredominantCategory(fieldsArray){\n    var maxValue = -Infinity;\n    var maxCategory = \"\";\n    for(var k in fieldsArray){\n      if(fieldsArray[k].value > maxValue){\n        maxValue = fieldsArray[k].value;\n        maxCategory = fieldsArray[k].alias;\n      } else if (fieldsArray[k].value == maxValue){\n        maxCategory = maxCategory + \"/\" + fieldsArray[k].alias;\n      }\n    }\n    return maxCategory;\n  }\n\n  getPredominantCategory(fields);\n";
    var strengthArcade = "\n  // Returns the share of the dominant demographic as a percentage\n  var fields = [ \n    $feature.ACSBLT1939,\n    $feature.ACSBLT1940,\n    $feature.ACSBLT1950,\n    $feature.ACSBLT1960,\n    $feature.ACSBLT1970,\n    $feature.ACSBLT1980,\n    $feature.ACSBLT1990,\n    $feature.ACSBLT2000,\n    $feature.ACSBLT2010,\n    $feature.ACSBLT2014\n  ];\n  var winner = Max(fields);\n  var total = Sum(fields);\n  return (winner/total)*100;\n";
    function createSymbol(color) {
        return new symbols_1.SimpleFillSymbol({
            color: color,
            outline: {
                width: 0.5,
                color: [255, 255, 255, 0.25]
            }
        });
    }
    // The expressionInfos reference Arcade expressions and
    // assign each of them a title and name. The name is used
    // to reference it in the PopupTemplate and the title is
    // used to describe the value in the popup and legend.
    var arcadeExpressionInfos = [
        // Get Arcade expression returning the predominant demographic in the feature:
        // Highest education level attained
        {
            name: "predominance-arcade",
            title: "Predominant educational attainment",
            expression: predominanceArcade
        },
        // Get Arcade expression returning the share of the total comprised
        // by the predominant category
        {
            name: "strength-arcade",
            title: "% of population belonging to predominant category",
            expression: strengthArcade
        }
    ];
    var url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boise_housing/FeatureServer/0";
    var template = {
        title: "{expression/strength-arcade}% of housing units were built in {expression/predominance-arcade}.",
        fieldInfos: [{
                fieldName: "expression/strength-arcade",
                format: {
                    places: 0,
                    digitSeperator: true
                }
            }],
        expressionInfos: arcadeExpressionInfos
    };
    var renderer = new renderers_1.UniqueValueRenderer({
        valueExpression: arcadeExpressionInfos[0].expression,
        valueExpressionTitle: arcadeExpressionInfos[0].title,
        defaultSymbol: createSymbol("gray"),
        defaultLabel: "Tie",
        uniqueValueInfos: [
            {
                value: "After 2014",
                symbol: createSymbol("#b30000")
            }, {
                value: "2010 - 2014",
                symbol: createSymbol("#7c1158")
            }, {
                value: "2000 - 2009",
                symbol: createSymbol("#4421af")
            }, {
                value: "1990 - 1999",
                symbol: createSymbol("#1a53ff")
            }, {
                value: "1980 - 1989",
                symbol: createSymbol("#0d88e6")
            }, {
                value: "1970 - 1979",
                symbol: createSymbol("#00b7c7")
            }, {
                value: "1960 - 1969",
                symbol: createSymbol("#5ad45a")
            }, {
                value: "1950 - 1959",
                symbol: createSymbol("#8be04e")
            }, {
                value: "1940 - 1949",
                symbol: createSymbol("#c5d96d")
            }, {
                value: "Before 1940",
                symbol: createSymbol("#ebdc78")
            }
        ],
        visualVariables: [{
                type: "opacity",
                valueExpression: arcadeExpressionInfos[1].expression,
                valueExpressionTitle: arcadeExpressionInfos[1].title,
                stops: [
                    { value: 10, opacity: 0.05 },
                    { value: 56, opacity: 0.95 }
                ]
            }]
    });
    var layer = new FeatureLayer({
        url: url,
        title: "Most common decade of housing construction (Boise)",
        popupTemplate: template,
        renderer: renderer
    });
    var map = new EsriMap({
        basemap: "gray",
        layers: [layer]
    });
    var view = new MapView({
        container: "viewDiv",
        center: [-116.40161, 43.61349],
        zoom: 11,
        popup: {
            collapsed: true
        },
        map: map
    });
    view.ui.add(new Legend({ view: view }), "bottom-left");
});
//# sourceMappingURL=main.js.map