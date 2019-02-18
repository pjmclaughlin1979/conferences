import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import DotDensityRenderer = require("esri/renderers/DotDensityRenderer");
import Legend = require("esri/widgets/Legend");

( async () => {

  const renderer = new DotDensityRenderer({
    referenceDotValue: 1,
    outline: {
      width: 0,
      color: "gray"
    },
    attributes: [
      {
        field: "ACSBLT1939",
        color: "orange",
        label: "Before 1939"
      },
      {
        field: "ACSBLT1940",
        color: "#8be04e",
        label: "1940-1949"
      },
      {
        field: "ACSBLT1950",
        color: "#5ad45a",
        label: "1950-1959"
      },
      {
        field: "ACSBLT1960",
        color: "#00b7c7",
        label: "1960-1969"
      },
      {
        field: "ACSBLT1970",
        color: "#1a53ff",
        label: "1970-1979"
      },
      {
        field: "ACSBLT1980",
        color: "#4421af",
        label: "1980-1989"
      },
      {
        field: "ACSBLT1990",
        color: "#7c1158",
        label: "1990-1999"
      },
      {
        valueExpression: "$feature.ACSBLT2000 + $feature.ACSBLT2010 + $feature.ACSBLT2014",
        color: "#b30000",
        label: "After 2000"
      }
    ]
  });

  renderer.attributes.forEach( attribute => {
    attribute.color.a = 0;
  });



  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Boise_housing/FeatureServer/0",
    renderer: renderer,
    minScale: 0
  });


  const map = new EsriMap({
    basemap: "dark-gray-vector",
    layers: [ layer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    extent: {
      "spatialReference": {
        "wkid": 3857
      },
      "xmin": -12964654.184796918,
      "ymin": 5392109.310964468,
      "xmax": -12925403.770772532,
      "ymax": 5423792.45918863
    }
  });

  await view.when();
  const layerView = await view.whenLayerView(layer);

  view.ui.add(new Legend({ view: view }), "bottom-left");

  view.on("click", () => {
    showNextField(layer.renderer as DotDensityRenderer);
  });

  function showNextField(renderer: DotDensityRenderer){
    let attributes = renderer.attributes;

    for( let i = 0; i <= attributes.length; i++){
      let attributeColor = attributes[i].color;
      if (attributeColor.a < 1){
        startAnimation(attributeColor);
        // attributeColor.a = 1;
        break;
      }
    }
    // let done = false;
    // attributes.forEach( (attribute) => {
    //   const attributeColor = attribute.color;
        
        
    //     if(!done && attributeColor.a !== 1){
    //       startAnimation(attributeColor);
    //       done = true;
    //       // attributeColor.a = 1;
    //     }
        
    // });
  }

  let animation: any;

  function startAnimation(color: esri.Color) {
    stopAnimation();
    animation = animate(color);
  }

  function animate(color: esri.Color) {
    let animating = true;
    let opacity = 0;

    function updateStep() {
      if (!animating) {
        return;
      }

      if (opacity >= 1){
        opacity = 1;
        stopAnimation();
      }
      color.a = opacity;
      opacity = opacity + 0.01;
      // setTimeout(function() {
        requestAnimationFrame(updateStep);
      // }, 1000);

    }
    requestAnimationFrame(updateStep);

    return {
      remove: function() {
        animating = false;
      }
    };
  }

  function stopAnimation() {
    if (!animation) {
      return;
    }
    animation.remove();
    animation = null;
  }

})();
