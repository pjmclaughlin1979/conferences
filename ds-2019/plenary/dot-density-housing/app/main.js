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
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/DotDensityRenderer", "esri/widgets/Legend", "./ArcadeExpressions"], function (require, exports, EsriMap, MapView, FeatureLayer, DotDensityRenderer, Legend, ArcadeExpressions_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function hideAttributes(renderer) {
            renderer.attributes.forEach(function (attribute) {
                attribute.color.a = 0;
            });
        }
        function showNextField(renderer) {
            var attributes = renderer.attributes;
            for (var i = 0; i <= attributes.length; i++) {
                var attributeColor = attributes[i].color.clone();
                if (attributeColor.a < 1) {
                    startAnimation(i);
                    break;
                }
            }
        }
        function startAnimation(colorIndex) {
            stopAnimation();
            animation = animate();
        }
        function animate() {
            // const attributes = lang.clone(newRenderer.attributes);
            // const updatedAttribute = attributes[colorIndex].clone();
            // let color = updatedAttribute.color.clone();
            var animating = true;
            var opacity = 0;
            var colorIndex = 0;
            var startYear = 1930;
            function updateStep() {
                var oldRenderer = layer.renderer;
                var newRenderer = oldRenderer.clone();
                if (!animating) {
                    return;
                }
                if (opacity >= 1 && colorIndex < newRenderer.attributes.length) {
                    opacity = 0;
                    colorIndex++;
                    if (colorIndex > newRenderer.attributes.length - 1) {
                        stopAnimation();
                    }
                }
                else {
                    yearDiv.style.visibility = "visible";
                    var approxYear = startYear + (colorIndex * 10) + Math.round(opacity / 0.1);
                    yearDiv.innerText = approxYear.toString();
                    // yearDiv.innerText = newRenderer.attributes[colorIndex].label;
                }
                var attributes = newRenderer.attributes.map(function (attribute, i) {
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
        var renderer, layer, map, view, layerView, yearDiv, playBtn, animation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderer = new DotDensityRenderer({
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
                    hideAttributes(renderer);
                    layer = new FeatureLayer({
                        title: "Houston Housing",
                        // url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Boise_housing/FeatureServer/0",
                        portalItem: {
                            id: "453a70e1e36b4318a5af017d7d0188de"
                        },
                        renderer: renderer,
                        minScale: 0,
                        popupTemplate: ArcadeExpressions_1.generateChartPopupTemplate(renderer.attributes)
                    });
                    map = new EsriMap({
                        basemap: {
                            portalItem: {
                                id: "3582b744bba84668b52a16b0b6942544"
                            }
                        },
                        layers: [layer]
                    });
                    view = new MapView({
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
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 2:
                    layerView = _a.sent();
                    new Legend({ view: view, container: "legendDiv" });
                    view.ui.add("controlDiv", "bottom-left");
                    view.ui.add("yearDiv", "top-right");
                    yearDiv = document.getElementById("yearDiv");
                    playBtn = document.getElementById("playBtn");
                    playBtn.addEventListener("click", function () {
                        hideAttributes(layer.renderer);
                        showNextField(layer.renderer);
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map