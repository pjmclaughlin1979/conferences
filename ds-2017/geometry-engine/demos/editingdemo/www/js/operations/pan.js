// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./operation"], function (require, exports, BaseOperation) {
    var Operation = (function (_super) {
        __extends(Operation, _super);
        function Operation() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Operation.prototype, "name", {
            /*
           * Name of Operation
           */
            get: function () {
                return "pan";
            },
            enumerable: true,
            configurable: true
        });
        Operation.prototype.deactivate = function (controller) {
            controller.disableNavigationMode();
        };
        ;
        Operation.prototype.activate = function (controller) {
            controller.enableNavigationMode();
        };
        ;
        return Operation;
    })(BaseOperation);
    return Operation;
});
