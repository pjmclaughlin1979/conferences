// Import Some Definition Files about ESRI and DOJO
/// <reference path="../../definitions/esri.d.ts"/>
/// <reference path="../../definitions/dojo/dojo.d.ts"/>

import BaseOperation = require("./operation");


class Operation extends BaseOperation {
    
    
    /*
   * Name of Operation
   */
    public get name(): string {
        return "pan";
    }


    public deactivate(controller) {
        controller.disableNavigationMode();
    };

    public activate(controller) {
        controller.enableNavigationMode();
    };

}

export = Operation;


