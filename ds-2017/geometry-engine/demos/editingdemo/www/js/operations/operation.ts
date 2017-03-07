
import esriFeatureLayer = require("esri/layers/FeatureLayer");
import CommonSymbols = require("../CommonSymbols");
import Draw = require("./draw");


 abstract class Operation {
     
     
    public get name(): string {
        return ""
    }
    
    public  deactivate(controller:any): void {
        
    }
    public  activate(controller:any):void {
        
    }
    public  execute(controller: any) {
         
    }
     
     protected setDrawingStyleForEditing(drawing: Draw, layer: esriFeatureLayer) {
         switch(layer.geometryType) {
             case "esriGeometryPolyline":
                  drawing.Symbol = CommonSymbols.defaultDrawSymbolPolyline;
                  drawing.activate(Draw.POLYLINE);
                  
                  break;
             case "esriGeometryPolygon":
               drawing.Symbol = CommonSymbols.defaultDrawSymbolPolygon;
                    drawing.activate(Draw.POLYGON);
                    break;
             case "esriGeometryPoint":
               drawing.Symbol=CommonSymbols.defaultDrawSymbolPoint;
                 drawing.activate(Draw.POINT);
                 break;
             case "esriGeometryMultipoint":
                drawing.Symbol = CommonSymbols.defaultDrawSymbolPoint;
                 drawing.activate(Draw.POINT);
                 break;
             default:
             
         }         
     }
}

export = Operation;
