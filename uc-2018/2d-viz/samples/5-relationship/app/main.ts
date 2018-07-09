import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Legend = require("esri/widgets/Legend");
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import sizeRendererCreator = require("esri/renderers/smartMapping/creators/size");

(async () => {

  const webmap = new WebMap({
    portalItem: {
      id: "2f6ca3ffecd24a5988fc7b752d74ac13"
    }
  });

  const view = new MapView({
    map: webmap,
    container: "viewDiv"
  });

  const legend = new Legend({
    view: view,
    container: "legendDiv"
  });
  view.ui.add("infoDiv", "bottom-left");

  // the only layer in the web map has a relationship renderer, which is visualized
  // with a diamond shaped legend and descriptive text. When the user checks the
  // checkbox in the UI, the legend will rotate to display like a square, and
  // display numbers as labels

  await view.when();
  // changing the title of the layer will change the text
  // describing the layer in the legend widget

  const layer = view.map.layers.getItemAt(0) as esri.FeatureLayer;
  layer.title = "Obesity, diabetes, and inactivity";

  const showDescriptiveLabelsElement = document.getElementById("descriptive-labels") as HTMLInputElement;

  showDescriptiveLabelsElement.addEventListener("change", function() {
    const currentRenderer = layer.renderer as esri.UniqueValueRenderer;
    const updatedRenderer = changeRendererLabels(currentRenderer.clone(), showDescriptiveLabelsElement.checked);
    layer.renderer = updatedRenderer;
  });

  /**
   * Changes the labels and orientation of the relationship legend.
   *
   * @param {module:esri/renderers/UniqueValueRenderer} renderer - An instance of a relationship renderer.
   * @param {boolean} showDescriptiveLabels - Indicates whether to orient the legend as a diamond and display
   *   descriptive labels. If `false`, then the legend is oriented as a square with numeric labels, similar to
   *   a chart with an x/y axis.
   *
   * @return {renderer} - The input renderer with the modified descriptions and orientation.
   */
  function changeRendererLabels(renderer:esri.UniqueValueRenderer, showDescriptiveLabels:boolean) {

    const numClasses = renderer.authoringInfo.numClasses;
    const field1max = renderer.authoringInfo.field1.classBreakInfos[numClasses - 1].maxValue;
    const field2max = renderer.authoringInfo.field2.classBreakInfos[numClasses - 1].maxValue;

    renderer.uniqueValueInfos.forEach(function(info) {
      switch (info.value) {
        case "HH":
          info.label = showDescriptiveLabels ? "High Diabetes; High Obesity" : "";
          break;
        case "HL":
          info.label = showDescriptiveLabels ? "High Diabetes; Low Obesity" : Math.round(field1max) + "%";
          break;
        case "LH":
          info.label = showDescriptiveLabels ? "Low Diabetes; High Obesity" : Math.round(field2max) + "%";
          break;
        case "LL":
          info.label = showDescriptiveLabels ? "Low Diabetes; Low Obesity" : "0";
          break;
      }
    });

    // When a focus is specified, the legend renders as a diamond with the
    // indicated focus value on the top. If no value is specified, then
    // the legend renders as a square

    renderer.authoringInfo.focus = showDescriptiveLabels ? "HH" : null;

    return renderer;
  }

  function changeRendererSymbols(renderer:esri.UniqueValueRenderer): esri.UniqueValueRenderer {
    const newRenderer = renderer.clone(); 
    newRenderer.defaultSymbol = newRenderer.defaultSymbol ? toggleSymbolType(newRenderer.defaultSymbol as SimpleFillSymbol|SimpleMarkerSymbol) : undefined;
    newRenderer.uniqueValueInfos.forEach( info => { info.symbol = toggleSymbolType(info.symbol as SimpleFillSymbol|SimpleMarkerSymbol) });
    return newRenderer;
  }

  function toggleSymbolType(symbol: SimpleFillSymbol|SimpleMarkerSymbol): SimpleFillSymbol|SimpleMarkerSymbol {
    const options = {
      color: symbol.color.clone(),
      outline: symbol.outline.clone()
    };

    return symbol.type === "simple-fill" ? new SimpleMarkerSymbol(options) : new SimpleFillSymbol(options);
  }

  const sizeVisualVariablesResult = await sizeRendererCreator.createVisualVariables({
    layer: layer,
    field: "Inactivity_Percent",
    basemap: view.map.basemap,
    legendOptions: {
      title: "% Inactive"
    }
  });

  const inactiveRenderer = changeRendererSymbols(layer.renderer as esri.UniqueValueRenderer);
  const inactiveVisualVariable = sizeVisualVariablesResult.visualVariables[0] as esri.BoundedMinMax;
  inactiveVisualVariable.minDataValue = sizeVisualVariablesResult.statistics.avg;
  inactiveRenderer.visualVariables = [ inactiveVisualVariable ];

  // layer.renderer = inactiveRenderer;

})();