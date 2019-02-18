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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/DotDensityRenderer", "esri/widgets/Legend"], function (require, exports, EsriMap, MapView, FeatureLayer, DotDensityRenderer, Legend) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function showNextField(renderer) {
            var attributes = renderer.attributes;
            for (var i = 0; i <= attributes.length; i++) {
                var attributeColor = attributes[i].color;
                if (attributeColor.a < 1) {
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
        function startAnimation(color) {
            stopAnimation();
            animation = animate(color);
        }
        function animate(color) {
            var animating = true;
            var opacity = 0;
            function updateStep() {
                if (!animating) {
                    return;
                }
                if (opacity >= 1) {
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
                remove: function () {
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
        var renderer, layer, map, view, layerView, animation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderer = new DotDensityRenderer({
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
                    renderer.attributes.forEach(function (attribute) {
                        attribute.color.a = 0;
                    });
                    layer = new FeatureLayer({
                        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Boise_housing/FeatureServer/0",
                        renderer: renderer,
                        minScale: 0
                    });
                    map = new EsriMap({
                        basemap: "dark-gray-vector",
                        layers: [layer]
                    });
                    view = new MapView({
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
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 2:
                    layerView = _a.sent();
                    view.ui.add(new Legend({ view: view }), "bottom-left");
                    view.on("click", function () {
                        showNextField(layer.renderer);
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map