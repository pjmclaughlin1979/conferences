import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Legend = require("esri/widgets/Legend");

import { SimpleFillSymbol, SimpleMarkerSymbol} from "esri/symbols";
import { UniqueValueRenderer } from "esri/renderers";


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

//////////////////////////////////////
/////   RENDERER   ///////////////////
//////////////////////////////////////

const totalVotes = {
  type: "size",
  field: "PRS_TOT_16",  // PRS_TOT_12
  legendOptions: {
    title: "Voter turnout"
  },
  minDataValue: 100,
  maxDataValue: 1000000,
  minSize: "4px",
  maxSize: "60px"
};

const percentWinner = {
  type: "opacity",
  field: "GAP16",  // GAP12
  legendOptions: {
    title: "Margin of victory"
  },
  stops: [
    { value: 5, opacity: 0.05, label: "contested" },
    { value: 50, opacity: 0.95, label: "landslide" }
  ]
};

const winnerRenderer = new UniqueValueRenderer({
  field: "PRS_PARTY_16",  // PRS_PARTY_12
  defaultSymbol: createSymbol("#a7c636", true),
  defaultLabel: "Other",
  legendOptions: {
    title: "Winner"
  },
  uniqueValueInfos: [{
    value: "Dem",
    symbol: createSymbol("#149ece", true)
  }, {
    value: "GOP",
    symbol: createSymbol("#ed5151", true)
  }],
  visualVariables: [ percentWinner, totalVotes ]
});

const layer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/us_counties_election_join/FeatureServer/0",
  outFields: [ "*" ],
  title: "Election results (2016) by county",
  renderer: winnerRenderer
});

const map = new EsriMap({
  basemap: "gray",
  layers: [ layer ]
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [ -95, 38 ],
  zoom: 5
});

const legend = new Legend({
  view: view
});
view.ui.add(legend, "bottom-left");