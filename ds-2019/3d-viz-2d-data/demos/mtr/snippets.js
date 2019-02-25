// basic extrude

layer.renderer = {
  type: "simple",
  symbol: {
    type: "polygon-3d",
    symbolLayers: [{
      type: "extrude",
      size: 1000,  // meters by default
      material: {
        color: [ 43,123,255,0.5 ]
      }
    }]
  },
};

// extrude features based on field value
// using a size visual variable
const mtrHeight = {
  type: "size",
  field: "heightField",
  valueUnit: "feet"
};

// extrude features based
// on Arcade expression
const mtrHeight = {
  type: "size",
  valueExpression: "$feature.elvnumcl - $feature.elvnumflr",
  valueUnit: "feet"
};

renderer.visualVariables = [ mtrHeight ];
layer.renderer = renderer;


// vertically offset features based on elevation
// or z-value stored in data attribute

layer.elevationInfo = {
  mode: "relative-to-ground",
  // other values: absolute height | on-the-ground | relative-to-scene
  featureExpressionInfo: {
    expression: "$feature.elvnumflr"
  },
  unit: "feet"
};

// render points using a 3D model
// of a construction crane in a web style 
// provided out-of-the box by the JS API

csvLayer.renderer = {
  type: "simple",
  symbol: {
    type: "web-style",
    name: "Tower_Crane",
    styleName: "EsriRealisticTransportationStyle"
  },
  visualVariables: [{
    type: "size",
    field: "total_ht",  // crane height in feet
    axis: "height",
    valueUnit: "feet"
  }]
};

csvLayer.renderer = turbineRenderer

// render points using a 3D model
// of a wind turbine published
// from ArcGIS Pro

csvLayer.renderer = {
  type: "simple",
  symbol: {
    type: "web-style",
    styleUrl: "https://www.arcgis.com/sharing/rest/content/items/635f270120664b6fa510ff5dd2ba099a/data",
    name: "Turbines"
  },
  visualVariables: [{
    type: "size",
    field: "total_ht",
    axis: "height",
    valueUnit: "feet"
  }]
};

// analysis

// get geometry from layer and height from UI
const projectGeometry;
const height;

const riskLevels = {
  low: 300,
  medium: 200,
  high: 100
};

let riskLevelBuffers = {};
// buffering outside of renderer function to improve performance
for (let level in riskLevels){
  riskLevelBuffers[level] = geometryEngine.geodesicBuffer(projectGeometry, riskLevels[level], "feet");
}

let classifyFeatures = function (graphic){
  let ceilingValue = graphic.attributes.elvnumcl;
  let floorValue = graphic.attributes.elvnumflr;
  let geom = graphic.geometry;
  let minRestriction = floorValue;

  let risk = "none";  // none | low | medium | high

  for (let level in riskLevels){
    let bufferValue = riskLevels[level];
    let heightRisk = height >= (floorValue - bufferValue);
    let xyRisk = geometryEngine.intersects(geom, riskLevelBuffers[level]);
    risk = heightRisk && xyRisk ? level : risk;
  }

  return risk;
}

let renderer = {
  type: "unique-value",
  field: classifyFeatures,
  uniqueValueInfos: [ 
    // set high, medium, low colors here
  ]
};

layer.renderer = renderer;