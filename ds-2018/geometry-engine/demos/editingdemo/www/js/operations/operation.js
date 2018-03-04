define(["require", "exports", "../CommonSymbols", "./draw"], function (require, exports, CommonSymbols, Draw) {
    var Operation = (function () {
        function Operation() {
        }
        Object.defineProperty(Operation.prototype, "name", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        Operation.prototype.deactivate = function (controller) {
        };
        Operation.prototype.activate = function (controller) {
        };
        Operation.prototype.execute = function (controller) {
        };
        Operation.prototype.setDrawingStyleForEditing = function (drawing, layer) {
            switch (layer.geometryType) {
                case "esriGeometryPolyline":
                    drawing.Symbol = CommonSymbols.defaultDrawSymbolPolyline;
                    drawing.activate(Draw.POLYLINE);
                    break;
                case "esriGeometryPolygon":
                    drawing.Symbol = CommonSymbols.defaultDrawSymbolPolygon;
                    drawing.activate(Draw.POLYGON);
                    break;
                case "esriGeometryPoint":
                    drawing.Symbol = CommonSymbols.defaultDrawSymbolPoint;
                    drawing.activate(Draw.POINT);
                    break;
                case "esriGeometryMultipoint":
                    drawing.Symbol = CommonSymbols.defaultDrawSymbolPoint;
                    drawing.activate(Draw.POINT);
                    break;
                default:
            }
        };
        return Operation;
    })();
    return Operation;
});
