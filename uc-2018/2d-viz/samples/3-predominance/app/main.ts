import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Legend = require("esri/widgets/Legend");
import { UniqueValueRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";

const predominanceArcade = `

  // The fields from which to calculate predominance
  // The expression will return the alias of the predominant field

  var fields = [
    { value: $feature.ACSBLT1939, alias: "Before 1940" },
    { value: $feature.ACSBLT1940, alias: "1940 - 1949" },
    { value: $feature.ACSBLT1950, alias: "1950 - 1959" },
    { value: $feature.ACSBLT1960, alias: "1960 - 1969" },
    { value: $feature.ACSBLT1970, alias: "1970 - 1979" },
    { value: $feature.ACSBLT1980, alias: "1980 - 1989" },
    { value: $feature.ACSBLT1990, alias: "1990 - 1999" },
    { value: $feature.ACSBLT2000, alias: "2000 - 2009" },
    { value: $feature.ACSBLT2010, alias: "2010 - 2014" },
    { value: $feature.ACSBLT2014, alias: "After 2014" }
  ];

  // Returns the predominant category as the alias
  // defined in the fields array. If there is a tie,
  // then both names are concatenated and used to
  // indicate the tie

  function getPredominantCategory(fieldsArray){
    var maxValue = -Infinity;
    var maxCategory = "";
    for(var k in fieldsArray){
      if(fieldsArray[k].value > maxValue){
        maxValue = fieldsArray[k].value;
        maxCategory = fieldsArray[k].alias;
      } else if (fieldsArray[k].value == maxValue){
        maxCategory = maxCategory + "/" + fieldsArray[k].alias;
      }
    }
    return maxCategory;
  }

  getPredominantCategory(fields);
`;

const strengthArcade = `
  // Returns the share of the dominant demographic as a percentage
  var fields = [ 
    $feature.ACSBLT1939,
    $feature.ACSBLT1940,
    $feature.ACSBLT1950,
    $feature.ACSBLT1960,
    $feature.ACSBLT1970,
    $feature.ACSBLT1980,
    $feature.ACSBLT1990,
    $feature.ACSBLT2000,
    $feature.ACSBLT2010,
    $feature.ACSBLT2014
  ];
  var winner = Max(fields);
  var total = Sum(fields);
  return (winner/total)*100;
`;

function createSymbol(color: any, isMarker: boolean ){
  var options = {
    color: color,
    outline: {
      color: [ 255, 255, 255, 0.3 ],
      width: 0.5
    },
    size: 6
  };

  return isMarker ? new SimpleMarkerSymbol(options) : new SimpleFillSymbol(options);
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
    title: "% of housing belonging to predominant category",
    expression: strengthArcade
  }
];

const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boise_housing/FeatureServer/0";

const template = {
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

const renderer = new UniqueValueRenderer({
  valueExpression: arcadeExpressionInfos[0].expression,
  valueExpressionTitle: arcadeExpressionInfos[0].title,
  defaultSymbol: createSymbol("gray", false),
  defaultLabel: "Tie",
  uniqueValueInfos: [
    {
      value: "After 2014",
      symbol: createSymbol("#b30000", false)
    }, {
      value: "2010 - 2014",
      symbol: createSymbol("#7c1158", false)
    }, {
      value: "2000 - 2009",
      symbol: createSymbol("#4421af", false)
    }, {
      value: "1990 - 1999",
      symbol: createSymbol("#1a53ff", false)
    }, {
      value: "1980 - 1989",
      symbol: createSymbol("#0d88e6", false)
    }, {
      value: "1970 - 1979",
      symbol: createSymbol("#00b7c7", false)
    }, {
      value: "1960 - 1969",
      symbol: createSymbol("#5ad45a", false)
    }, {
      value: "1950 - 1959",
      symbol: createSymbol("#8be04e", false)
    }, {
      value: "1940 - 1949",
      symbol: createSymbol("#c5d96d", false)
    }, {
      value: "Before 1940",
      symbol: createSymbol("#ebdc78", false)
    }
  ],
//   visualVariables: [{
//     type: "opacity",
//     valueExpression: arcadeExpressionInfos[1].expression,
//     valueExpressionTitle: arcadeExpressionInfos[1].title,
//     stops: [
//       { value: 10, opacity: 0.05 },
//       { value: 56, opacity: 0.95}
//     ]
//   }
//   , {
//     type: "size",
//     field: "AVGVAL_CY",
//     minDataValue: 100000,
//     maxDataValue: 650000,
//     minSize: 3,
//     maxSize: 60
//   }
// ]
});

//AVGVAL_CY

const layer = new FeatureLayer({
  url,
  title: "Most common decade of housing construction (Boise)",
  popupTemplate: template,
  renderer: renderer
});

const map = new EsriMap({
  basemap: "gray",
  layers: [ layer ]
});

const view = new MapView({
  container: "viewDiv",
  center: [ -116.40161, 43.61349 ],
  zoom: 11,
  popup: {
    collapsed: true
  },
  map: map
});

view.ui.add(new Legend({ view: view }), "bottom-left");