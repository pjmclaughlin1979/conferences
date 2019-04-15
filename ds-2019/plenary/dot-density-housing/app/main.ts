import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import DotDensityRenderer = require("esri/renderers/DotDensityRenderer");
import Legend = require("esri/widgets/Legend");
import Search = require("esri/widgets/Search");
import Expand = require("esri/widgets/Expand");
import { generateChartPopupTemplate } from "./ArcadeExpressions";

( async () => {

  const renderer = new DotDensityRenderer({
    referenceDotValue: 1,
    outline: null,
    legendOptions: {
      // Legend will display
      // 1 Dot = 1 House
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

  const yearDiv = document.getElementById("yearDiv") as HTMLDivElement;

  function hideAttributes(renderer: DotDensityRenderer){
    renderer.attributes.forEach( (attribute, i) => {
      attribute.color.a = (i > 0) ? 0 : 1;
    });
    yearDiv.innerText = `Before 1940`;
  }

  function showAttributes(renderer: DotDensityRenderer): DotDensityRenderer {
    const newRenderer = renderer.clone();
    newRenderer.attributes.forEach( attribute => {
      attribute.color.a = 1;
    });
    yearDiv.innerText = `After 2000`;
    return newRenderer;
  }

  hideAttributes(renderer);

  const layer = new FeatureLayer({
    title: "Housing units built by decade",
    portalItem: {
      // 478888c07fe14d9b87e33d4708417c95 - U.S.
      // 453a70e1e36b4318a5af017d7d0188de - Houston
      id: "478888c07fe14d9b87e33d4708417c95"
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
      spatialReference: {
        wkid: 3857
      },
      xmin: -10689548,
      ymin: 3432124,
      xmax: -10542789,
      ymax: 3514676
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
  const legendContainer = document.getElementById("legendDiv");
  const legend = new Legend({ view, container: legendContainer });
  view.ui.add(document.getElementById("controlDiv"), "bottom-left");
  view.ui.add("yearDiv", "top-right");
  view.ui.add(new Expand({
    group: "top-left",
    view,
    content: new Search({ 
      view,
      resultGraphicEnabled: false,
      popupEnabled: false 
    })
  }), "top-left");

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
        startAnimation();
        break;
      }
    }
  }

  let animation: any;

  function startAnimation() {
    stopAnimation();
    animation = animate();
  }

  function animate() {
    let animating = true;
    let opacity = 0;
    let colorIndex = 1;  // starts animation with second attribute
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

  legendContainer.addEventListener("click", legendEventListener);

  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  resetButton.addEventListener("click", () => {
    stopAnimation();
    layer.renderer = showAttributes(renderer);
  });

  function legendEventListener (event:any) {
    const selectedText =   event.target.alt || event.target.innerText;
    const legendInfos: Array<any> = legend.activeLayerInfos.getItemAt(0).legendElements[0].infos;
    const matchFound = legendInfos.filter( (info:any) => info.label === selectedText ).length > 0;
    if (matchFound){
      showSelectedField(selectedText);
    }
  }

  function showSelectedField (label: string) {
    const oldRenderer = layer.renderer as DotDensityRenderer;
    const newRenderer = oldRenderer.clone();
    let year: number;
    const attributes = newRenderer.attributes.map( (attribute, i) => {
      if(attribute.label === label){
        attribute.color.a = 1;
        // if field doesn't exist, return 2000 (valueExpression is used for year 2000 and after)
        year = attribute.field ? parseInt(attribute.field.substr( attribute.field.length - 4)) : 2000;
      } else {
        attribute.color.a = 0.1;
      }
      // attribute.color.a = attribute.label === label ? 1 : 0.1;
      return attribute;
    });
    newRenderer.attributes = attributes;
    layer.renderer = newRenderer;
    if (year < 1940){
      yearDiv.innerText = `Before ${year}`;
    } 
    else if (year === 2000){
      yearDiv.innerText = `After ${year}`;
    }
    else {
      yearDiv.innerText = `${year} - ${year+10}`;
    }
  }

})();
