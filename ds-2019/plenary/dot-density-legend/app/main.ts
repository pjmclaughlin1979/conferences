import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import DotDensityRenderer = require("esri/renderers/DotDensityRenderer");
import Legend = require("esri/widgets/Legend");
import Bookmarks = require("esri/widgets/Bookmarks");
import Search = require("esri/widgets/Search")
import Expand = require("esri/widgets/Expand");

( async () => {

  const map = new WebMap({
    portalItem: {
      id: "f708e15ee9dd485b81b9741d91399b45"
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    highlightOptions: {
      fillOpacity: 0,
      color: "white"
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-right",
        breakpoint: false
      }
    },
    constraints: {
      maxScale: 35000
    }
  });

  await view.when();
  const dotDensityRenderer = new DotDensityRenderer({
    referenceDotValue: 100,
    outline: null,
    referenceScale: 577790,
    legendOptions: {
      unit: "people"
    },
    attributes: [
                            {
                              field: "ReligionSA___Copy__Catholic",
                              color: "#f23c3f",
                              label: "Catholic"
                            },
                            {
                              field: "ReligionSA___Copy__Protestantan",
                              color: "#e8ca0d",
                              label: "Protestant and Other Christian"
                            },
                            {
                              field: "ReligionSA___Copy__OtherReligio",
                              color: "#00b6f1",
                              label: "OtherReligions"
                            },
                            {
                              field: "ReligionSA___Copy__ReligionNone",
                              color: "#32ef94",
                              label: "ReligionNone"
                            }
                        ]
  });

  // Add renderer to the layer and define a popup template
  const url = "https://services.arcgis.com/pMnvm7HXxTmNXxGi/ArcGIS/rest/services/NISRA_SA2011_Religion/FeatureServer/0";
  const layer = new FeatureLayer({
    url: url,
    minScale: 20000000,
    maxScale: 35000,
    title: "Religion 2011 Census",
   popupTemplate: {
                            title: "{SA2011}, {SA2011}",
                            content: [
                                {
                                  type: "fields",
                                  fieldInfos: [
                                    {
                                      fieldName: "ReligionSA___Copy__Catholic",
                                      label: "Catholic",
                                      format: {
                                        digitSeparator: true,
                                        places: 0
                                      }
                                    },
                                    {
                                      fieldName: "ReligionSA___Copy__Protestantan",
                                      label: "Protestant and Other Christian",
                                      format: {
                                        digitSeparator: true,
                                        places: 0
                                      }
                                    },
                                    {
                                      fieldName: "ReligionSA___Copy__OtherReligio ",
                                      label: "Other Religions",
                                      format: {
                                        digitSeparator: true,
                                        places: 0
                                      }
                                    },
                                    {
                                      fieldName: "ReligionSA___Copy__ReligionNone",
                                      label: "Religion None",
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
      view,
      content: document.getElementById("controlDiv"),
      group: "top-left",
      expanded: true,
      expandIconClass: "esri-icon-layer-list"
    }),
    new Expand({
      view,
      expandIconClass: "esri-icon-filter",
      content: document.getElementById("sliderDiv"),
      group: "top-left"
    }),
    new Expand({
      view,
      content: new Search({ view }),
      group: "top-left"
    })
  ], "top-left" );

  view.ui.add(
    new Expand({
      view,
      content: new Bookmarks({ view }),
      group: "bottom-right",
      expanded: true
    }), "bottom-right");

  legendContainer.addEventListener("mousemove", legendEventListener);
  legendContainer.addEventListener("click", legendEventListener);

  let mousemoveEnabled = true;

  // enables exploration on mouse move
  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  resetButton.addEventListener("click", () => {
    mousemoveEnabled = true;
    layer.renderer = dotDensityRenderer;
    legendContainer.addEventListener("mousemove", legendEventListener);
  });

  function legendEventListener (event:any) {
    const selectedText =   event.target.alt || event.target.innerText;
    const legendInfos: Array<any> = legend.activeLayerInfos.getItemAt(0).legendElements[0].infos;
    const matchFound = legendInfos.filter( (info:any) => info.label === selectedText ).length > 0;
    if (matchFound){
      showSelectedField(selectedText);
      if (event.type === "click"){
        mousemoveEnabled = false;
        legendContainer.removeEventListener("mousemove", legendEventListener);
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

  const dotValueSlider = document.getElementById("dotValueInput") as HTMLInputElement;
  const dotValueDisplay = document.getElementById("dotValueDisplay") as HTMLSpanElement;
  dotValueSlider.addEventListener("input", () => {
    const oldRenderer = layer.renderer as DotDensityRenderer;
    const newRenderer = oldRenderer.clone();
    dotValueDisplay.innerText = dotValueSlider.value;
    const dotValue = parseInt(dotValueSlider.value);
    newRenderer.referenceDotValue = dotValue;
    layer.renderer = newRenderer;
  });

})();
