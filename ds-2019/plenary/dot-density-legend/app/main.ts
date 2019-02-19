import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import DotDensityRenderer = require("esri/renderers/DotDensityRenderer");
import Legend = require("esri/widgets/Legend");
import Bookmarks = require("esri/widgets/Bookmarks");
import Expand = require("esri/widgets/Expand");

( async () => {

  const map = new WebMap({
    portalItem: {
      id: "56b5bd522c52409c90d902285732e9f1"
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    highlightOptions: {
      fillOpacity: 0,
      color: [50, 50, 50]
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-right",
        breakpoint: false
      }
    }
  });

  await view.when();
  const dotDensityRenderer = new DotDensityRenderer({
    referenceDotValue: 100,
    outline: null,
    referenceScale: view.scale,
    legendOptions: {
      unit: "people"
    },
    attributes: [
      {
        field: "B03002_003E",
        color: "#f23c3f",
        label: "White (non-Hispanic)"
      },
      {
        field: "B03002_012E",
        color: "#e8ca0d",
        label: "Hispanic"
      },
      {
        field: "B03002_004E",
        color: "#00b6f1",
        label: "Black or African American"
      },
      {
        field: "B03002_006E",
        color: "#32ef94",
        label: "Asian"
      },
      {
        field: "B03002_005E",
        color: "#ff7fe9",
        label: "American Indian/Alaskan Native"
      },
      {
        field: "B03002_007E",
        color: "#e2c4a5",
        label: "Pacific Islander/Hawaiian Native"
      },
      {
        field: "B03002_008E",
        color: "#ff6a00", // ff6a00  a632ff
        label: "Other race"
      },
      {
        field: "B03002_009E",
        color: "#96f7ef",
        label: "Two or more races"
      }
    ]
  });

  // Add renderer to the layer and define a popup template
  const url = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2";
  const layer = new FeatureLayer({
    url: url,
    minScale: 20000000,
    maxScale: 70000,
    title: "Current Population Estimates (ACS)",
    popupTemplate: {
      title: "{County}, {State}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "B03002_003E",
              label: "White (non-Hispanic)",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_012E",
              label: "Hispanic",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_004E",
              label: "Black or African American",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_006E",
              label: "Asian",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_005E",
              label: "American Indian/Alaskan Native",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_007E",
              label: "Pacific Islander/Hawaiian Native",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_008E",
              label: "Other race",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "B03002_009E",
              label: "Two or more races",
              format: {
                digitSeparator: true,
                places: 0
              }
            }
          ]
        }
      ]
    },
    renderer: dotDensityRenderer
  });

  map.add(layer);

  const legendContainer = document.getElementById("legendDiv");
  const legend = new Legend({ 
    view,
    container: legendContainer
  });

  view.ui.add([
    new Expand({
      view: view,
      content: legendContainer,
      group: "top-left",
      expanded: true,
      expandIconClass: "esri-icon-layer-list"
    }),
    new Expand({
      view: view,
      content: new Bookmarks({ view }),
      group: "top-left"
    })], "top-left" );

  legendContainer.addEventListener("mousemove", eventListener);
  legendContainer.addEventListener("click", eventListener);

  let mousemoveEnabled = true;
  function eventListener (event:any) {
    const selectedText = event.target.alt || event.target.innerText;
    const legendInfos = legend.activeLayerInfos.getItemAt(0).legendElements[0].infos;
    const matchFound = legendInfos.filter( (info:any) => info.label === selectedText ).length > 0;

    if (matchFound){
      showSelectedField(selectedText);
      if (event.type === "click"){
        mousemoveEnabled = !mousemoveEnabled;

        if(mousemoveEnabled){
          legendContainer.addEventListener("mousemove", eventListener);
        } else {
          legendContainer.removeEventListener("mousemove", eventListener);
        }
      }
    } else {
      layer.renderer = dotDensityRenderer;
    }
  }

  function showSelectedField (label: string) {
    const oldRenderer = layer.renderer as DotDensityRenderer;
    const newRenderer = oldRenderer.clone();
    const attributes = newRenderer.attributes.map( attribute => {
      attribute.color.a = attribute.label === label ? 1 : 0.2;
      return attribute;
    });
    newRenderer.attributes = attributes;
    layer.renderer = newRenderer;
  }
})();