import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import DotDensityRenderer = require("esri/renderers/DotDensityRenderer");
import Legend = require("esri/widgets/Legend");
import lang = require("esri/core/lang");
import { generateChartPopupTemplate, generateTopListPopupTemplate } from "./ArcadeExpressions";

( async () => {

  const renderer = new DotDensityRenderer({
    referenceDotValue: 1,
    outline: null,
    legendOptions: {
      unit: "House"
    },
    attributes: [
      {
        field: "ACSBLT1939",
        color: "orange",
        label: "Before 1940"
      },
      {
        field: "ACSBLT1940",
        color: "#8be04e",
        label: "1940s"
      },
      {
        field: "ACSBLT1950",
        color: "#5ad45a",
        label: "1950s"
      },
      {
        field: "ACSBLT1960",
        color: "#00b7c7",
        label: "1960s"
      },
      {
        field: "ACSBLT1970",
        color: "#1a53ff",
        label: "1970s"
      },
      {
        field: "ACSBLT1980",
        color: "#4421af",
        label: "1980s"
      },
      {
        field: "ACSBLT1990",
        color: "#7c1158",
        label: "1990s"
      },
      {
        valueExpression: "$feature.ACSBLT2000 + $feature.ACSBLT2010 + $feature.ACSBLT2014",
        color: "#b30000",
        label: "After 2000"
      }
    ]
  });

  function hideAttributes(renderer: DotDensityRenderer){
    renderer.attributes.forEach( attribute => {
      attribute.color.a = 0;
    });
  }
  

  hideAttributes(renderer);

  const layer = new FeatureLayer({
    title: "Houston Housing",
    // url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Boise_housing/FeatureServer/0",
    portalItem: {
      id: "453a70e1e36b4318a5af017d7d0188de"
    },
    renderer,
    minScale: 0,
    popupTemplate: generateChartPopupTemplate(renderer.attributes)
  });


  const map = new EsriMap({
    basemap: {
      portalItem: {
        id: "3582b744bba84668b52a16b0b6942544"
      }
    },
    layers: [ layer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    extent: {
      "spatialReference": {
        "wkid": 3857
      },
      "xmin": -10689548.884426521,
      "ymin": 3432124.7664550575,
      "xmax": -10542789.79011918,
      "ymax": 3514676.757002936
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "bottom-right"
      }
    },
    constraints: {
      maxScale: 140000,
      minScale: 580000
    }
  });

  await view.when();
  const layerView = await view.whenLayerView(layer);
  new Legend({ view, container: "legendDiv" });
  view.ui.add("controlDiv", "bottom-left");
  view.ui.add("yearDiv", "top-right");

  

  const yearDiv = document.getElementById("yearDiv") as HTMLDivElement;

  const playBtn = document.getElementById("playBtn") as HTMLDivElement;
  playBtn.addEventListener("click", () => {
    hideAttributes(layer.renderer as DotDensityRenderer);
    showNextField(layer.renderer as DotDensityRenderer);
  });

  function showNextField(renderer: DotDensityRenderer){
    let attributes = renderer.attributes;

    for( let i = 0; i <= attributes.length; i++){
      let attributeColor = attributes[i].color.clone();
      if (attributeColor.a < 1){
        startAnimation(i);
        break;
      }
    }
  }

  let animation: any;

  function startAnimation(colorIndex: number) {
    stopAnimation();
    animation = animate();
  }

  function animate() {
    // const attributes = lang.clone(newRenderer.attributes);
    // const updatedAttribute = attributes[colorIndex].clone();
    // let color = updatedAttribute.color.clone();
    let animating = true;
    let opacity = 0;
    let colorIndex = 0;
    let startYear = 1930;
    function updateStep() {
      const oldRenderer = layer.renderer as DotDensityRenderer;
      const newRenderer = oldRenderer.clone();
      if (!animating) {
        return;
      }

      if (opacity >= 1 && colorIndex < newRenderer.attributes.length){
        opacity = 0;
        colorIndex++;
        if(colorIndex > newRenderer.attributes.length - 1){
          stopAnimation();
        }
      } else {
        yearDiv.style.visibility = "visible";
        const approxYear = startYear + ( colorIndex * 10) + Math.round(opacity / 0.1);
        yearDiv.innerText = approxYear.toString();
      }

      const attributes = newRenderer.attributes.map( (attribute, i) => {
        attribute.color.a = i === colorIndex ? opacity : attribute.color.a;
        return attribute;
      });

      newRenderer.attributes = attributes;
      layer.renderer = newRenderer;
      opacity = opacity + 0.01;

      requestAnimationFrame(updateStep);

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
