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
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/DotDensityRenderer", "esri/widgets/Legend", "esri/widgets/Search", "esri/widgets/Expand", "./ArcadeExpressions"], function (require, exports, EsriMap, MapView, FeatureLayer, DotDensityRenderer, Legend, Search, Expand, ArcadeExpressions_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function hideAttributes(renderer) {
            renderer.attributes.forEach(function (attribute, i) {
                attribute.color.a = (i > 0) ? 0 : 1;
            });
            yearDiv.innerText = "Before 1940";
        }
        function showAttributes(renderer) {
            var newRenderer = renderer.clone();
            newRenderer.attributes.forEach(function (attribute) {
                attribute.color.a = 1;
            });
            yearDiv.innerText = "After 2000";
            return newRenderer;
        }
        function showNextField(renderer) {
            var attributes = renderer.attributes;
            for (var i = 0; i <= attributes.length; i++) {
                var attributeColor = attributes[i].color.clone();
                if (attributeColor.a < 1) {
                    startAnimation();
                    break;
                }
            }
        }
        function startAnimation() {
            stopAnimation();
            animation = animate();
        }
        function animate() {
            var animating = true;
            var opacity = 0;
            var colorIndex = 1; // starts animation with second attribute
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
                    var approxYear = startYear + (colorIndex * 10) + Math.round(opacity / 0.1);
                    yearDiv.innerText = approxYear.toString();
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
        function legendEventListener(event) {
            var selectedText = event.target.alt || event.target.innerText;
            var legendInfos = legend.activeLayerInfos.getItemAt(0).legendElements[0].infos;
            var matchFound = legendInfos.filter(function (info) { return info.label === selectedText; }).length > 0;
            if (matchFound) {
                showSelectedField(selectedText);
            }
            else {
                layer.renderer = showAttributes(renderer);
            }
        }
        function showSelectedField(label) {
            var oldRenderer = layer.renderer;
            var newRenderer = oldRenderer.clone();
            var year;
            var attributes = newRenderer.attributes.map(function (attribute, i) {
                if (attribute.label === label) {
                    attribute.color.a = 1;
                    // if field doesn't exist, return 2000 (valueExpression is used for year 2000 and after)
                    year = attribute.field ? parseInt(attribute.field.substr(attribute.field.length - 4)) : 2000;
                }
                else {
                    attribute.color.a = 0.1;
                }
                // attribute.color.a = attribute.label === label ? 1 : 0.1;
                return attribute;
            });
            newRenderer.attributes = attributes;
            layer.renderer = newRenderer;
            if (year < 1940) {
                yearDiv.innerText = "Before " + year;
            }
            else if (year === 2000) {
                yearDiv.innerText = "After " + year;
            }
            else {
                yearDiv.innerText = year + " - " + (year + 10);
            }
        }
        var renderer, yearDiv, layer, map, view, legendContainer, legend, playBtn, animation, resetButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderer = new DotDensityRenderer({
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
                    yearDiv = document.getElementById("yearDiv");
                    hideAttributes(renderer);
                    layer = new FeatureLayer({
                        title: "Housing units built by decade",
                        portalItem: {
                            // 478888c07fe14d9b87e33d4708417c95 - U.S.
                            // 453a70e1e36b4318a5af017d7d0188de - Houston
                            id: "478888c07fe14d9b87e33d4708417c95"
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
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    legendContainer = document.getElementById("legendDiv");
                    legend = new Legend({ view: view, container: legendContainer });
                    view.ui.add(document.getElementById("controlDiv"), "bottom-left");
                    view.ui.add("yearDiv", "top-right");
                    view.ui.add(new Expand({
                        group: "top-left",
                        view: view,
                        content: new Search({
                            view: view,
                            resultGraphicEnabled: false,
                            popupEnabled: false
                        })
                    }), "top-left");
                    playBtn = document.getElementById("playBtn");
                    playBtn.addEventListener("click", function () {
                        hideAttributes(layer.renderer);
                        showNextField(layer.renderer);
                    });
                    legendContainer.addEventListener("click", legendEventListener);
                    resetButton = document.getElementById("reset-button");
                    resetButton.addEventListener("click", function () {
                        stopAnimation();
                        layer.renderer = showAttributes(renderer);
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map