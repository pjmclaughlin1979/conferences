var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/widgets/Legend", "esri/symbols", "esri/renderers/smartMapping/creators/size"], function (require, exports, WebMap, MapView, Legend, symbols_1, sizeRendererCreator) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
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
        function changeRendererLabels(renderer, showDescriptiveLabels) {
            var numClasses = renderer.authoringInfo.numClasses;
            var field1max = renderer.authoringInfo.field1.classBreakInfos[numClasses - 1].maxValue;
            var field2max = renderer.authoringInfo.field2.classBreakInfos[numClasses - 1].maxValue;
            renderer.uniqueValueInfos.forEach(function (info) {
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
        function changeRendererSymbols(renderer) {
            var newRenderer = renderer.clone();
            newRenderer.defaultSymbol = newRenderer.defaultSymbol ? toggleSymbolType(newRenderer.defaultSymbol) : undefined;
            newRenderer.uniqueValueInfos.forEach(function (info) { info.symbol = toggleSymbolType(info.symbol); });
            return newRenderer;
        }
        function toggleSymbolType(symbol) {
            var options = {
                color: symbol.color.clone(),
                outline: symbol.outline.clone()
            };
            return symbol.type === "simple-fill" ? new symbols_1.SimpleMarkerSymbol(options) : new symbols_1.SimpleFillSymbol(options);
        }
        var webmap, view, legend, layer, showDescriptiveLabelsElement, sizeVisualVariablesResult, inactiveRenderer, inactiveVisualVariable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    webmap = new WebMap({
                        portalItem: {
                            id: "2f6ca3ffecd24a5988fc7b752d74ac13"
                        }
                    });
                    view = new MapView({
                        map: webmap,
                        container: "viewDiv"
                    });
                    legend = new Legend({
                        view: view,
                        container: "legendDiv"
                    });
                    view.ui.add("infoDiv", "bottom-left");
                    // the only layer in the web map has a relationship renderer, which is visualized
                    // with a diamond shaped legend and descriptive text. When the user checks the
                    // checkbox in the UI, the legend will rotate to display like a square, and
                    // display numbers as labels
                    return [4 /*yield*/, view.when()];
                case 1:
                    // the only layer in the web map has a relationship renderer, which is visualized
                    // with a diamond shaped legend and descriptive text. When the user checks the
                    // checkbox in the UI, the legend will rotate to display like a square, and
                    // display numbers as labels
                    _a.sent();
                    layer = view.map.layers.getItemAt(0);
                    layer.title = "Obesity, diabetes, and inactivity";
                    showDescriptiveLabelsElement = document.getElementById("descriptive-labels");
                    showDescriptiveLabelsElement.addEventListener("change", function () {
                        var currentRenderer = layer.renderer;
                        var updatedRenderer = changeRendererLabels(currentRenderer.clone(), showDescriptiveLabelsElement.checked);
                        layer.renderer = updatedRenderer;
                    });
                    return [4 /*yield*/, sizeRendererCreator.createVisualVariables({
                            layer: layer,
                            field: "Inactivity_Percent",
                            basemap: view.map.basemap,
                            legendOptions: {
                                title: "% Inactive"
                            }
                        })];
                case 2:
                    sizeVisualVariablesResult = _a.sent();
                    inactiveRenderer = changeRendererSymbols(layer.renderer);
                    inactiveVisualVariable = sizeVisualVariablesResult.visualVariables[0];
                    inactiveVisualVariable.minDataValue = sizeVisualVariablesResult.statistics.avg;
                    inactiveRenderer.visualVariables = [inactiveVisualVariable];
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map