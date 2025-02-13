import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Legend = require("esri/widgets/Legend");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");

const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/boise_housing_low_income/FeatureServer/0";

const template = {
  title: "{HINC0_CY} households earn less than $15k per year",
  fieldInfos: [{
    fieldName: "HINC0_CY",
    format: {
      places: 0,
      digitSeperator: true
    }
  }]
};

const layer = new FeatureLayer({
  url: url,
  title: "Block groups (Boise)",
  popupTemplate: template
});

const arcadeExpression = "Round( ( $feature.HINC0_CY / $feature.TOTHH_CY ) * 100 )";

const householdsMinWage = {
  type: "color",
  // field: "HINC0_CY",
  // normalizationField: "TOTHH_CY",
  valueExpression: arcadeExpression,
  legendOptions: {
    title: "% households earning less than minimum wage"
  },
  stops: [
    { value: 4, color: "#fffcd4" },
    { value: 8.3, color: "#b1cdc2" },
    { value: 12.7, color: "#629eb0" },
    { value: 17.3, color: "#38627a" },
    { value: 21.8, color: "#0d2644" }
  ]
};

// set the renderer on the layer
layer.renderer = new SimpleRenderer({
  symbol: {
    type: "simple-fill",
    outline: {
      color: [ 255, 255, 255, 0.2 ],
      width: 0.7
    }
  },
  visualVariables: [ householdsMinWage ]
});

const map = new EsriMap({
  basemap: "streets",
  layers: [ layer ]
});

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [ -116.40161, 43.61349 ],
  zoom: 11,
  popup: {
    collapsed: true
  }
});

view.ui.add(new Legend({ view: view }), "bottom-left");