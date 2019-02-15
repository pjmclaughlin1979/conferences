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
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/views/layers/support/FeatureFilter", "esri/tasks/support/StatisticDefinition", "esri/Graphic", "esri/symbols", "esri/renderers"], function (require, exports, EsriMap, MapView, FeatureLayer, FeatureFilter, StatisticDefinition, Graphic, symbols_1, renderers_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function queryTimeStatistics(layerView, params) {
            return __awaiter(this, void 0, void 0, function () {
                var geometry, distance, units, query, queryResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            geometry = params.geometry, distance = params.distance, units = params.units;
                            query = layerView.layer.createQuery();
                            query.outStatistics = [new StatisticDefinition({
                                    onStatisticField: "1",
                                    outStatisticFieldName: "total_count",
                                    statisticType: "count"
                                }), new StatisticDefinition({
                                    onStatisticField: "(ExpiredDate - IssueDateTime) / (1000*60)",
                                    outStatisticFieldName: "avg_duration",
                                    statisticType: "avg"
                                })];
                            query.groupByFieldsForStatistics = ["MonthOfTheYear"];
                            query.geometry = geometry;
                            query.distance = distance;
                            query.units = units;
                            query.returnQueryGeometry = true;
                            return [4 /*yield*/, layerView.queryFeatures(query)];
                        case 1:
                            queryResponse = _a.sent();
                            view.graphics.removeAll();
                            view.graphics.add(new Graphic({
                                geometry: queryResponse.queryGeometry,
                                symbol: new symbols_1.SimpleFillSymbol()
                            }));
                            return [2 /*return*/, queryResponse.features.map(function (feature) {
                                    return {
                                        month: feature.attributes.MonthOfTheYear,
                                        avg_duration_minutes: Math.round(feature.attributes.avg_duration),
                                        count: feature.attributes.total_count
                                    };
                                })];
                    }
                });
            });
        }
        var url, layer, countiesLayer, map, view, layerView, previousId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Tornado_Warnings_2002_through_2011/FeatureServer/0";
                    layer = new FeatureLayer({
                        url: url,
                        outFields: ["*"]
                    });
                    countiesLayer = new FeatureLayer({
                        title: "counties",
                        portalItem: {
                            // 7566e0221e5646f99ea249a197116605
                            // 99fd67933e754a1181cc755146be21ca
                            id: "7566e0221e5646f99ea249a197116605"
                        },
                        renderer: new renderers_1.SimpleRenderer({
                            symbol: new symbols_1.SimpleFillSymbol({
                                color: [0, 0, 0, 0],
                                outline: null
                            })
                        })
                    });
                    map = new EsriMap({
                        basemap: "streets",
                        layers: [layer, countiesLayer]
                    });
                    view = new MapView({
                        map: map,
                        container: "viewDiv",
                        extent: {
                            "spatialReference": {
                                "wkid": 3857
                            },
                            "xmin": -12413984.889735641,
                            "ymin": 2697099.652298753,
                            "xmax": -7370364.015367912,
                            "ymax": 6865057.930631735
                        }
                    });
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 2:
                    layerView = _a.sent();
                    console.log(view);
                    view.on("drag", ["Control"], function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var hitTestResponse, hitTestResult, countyGraphic, objectIdField, queryOptions, filterOptions, stats;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.stopPropagation();
                                    return [4 /*yield*/, view.hitTest(event)];
                                case 1:
                                    hitTestResponse = _a.sent();
                                    hitTestResult = hitTestResponse.results.filter(function (result) {
                                        return result.graphic.layer && result.graphic.layer.title === "counties";
                                    })[0];
                                    if (!hitTestResult) {
                                        layerView.filter = new FeatureFilter({
                                            where: "1=1"
                                        });
                                        view.graphics.removeAll();
                                        return [2 /*return*/];
                                    }
                                    else {
                                        countyGraphic = hitTestResult.graphic;
                                    }
                                    objectIdField = countiesLayer.objectIdField;
                                    if (previousId === countyGraphic.attributes[objectIdField]) {
                                        return [2 /*return*/];
                                    }
                                    else {
                                        previousId = countyGraphic.attributes[objectIdField];
                                    }
                                    queryOptions = {
                                        geometry: countyGraphic.geometry
                                    };
                                    filterOptions = new FeatureFilter(queryOptions);
                                    layerView.filter = filterOptions;
                                    return [4 /*yield*/, queryTimeStatistics(layerView, queryOptions)];
                                case 2:
                                    stats = _a.sent();
                                    console.log(stats);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map