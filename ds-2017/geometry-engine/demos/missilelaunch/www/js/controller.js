
// Get all the AMD dependencies
define(["esri/map", "esri/arcgis/utils", "esri/graphic", "esri/geometry/geometryEngine", "esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol"
], function (esriMap, esriArcgisUtils, esriGraphic, esriGeometryEngine, esriColor, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {





    // Returns the Main Controller Function
    return {


        settings: null,  // Object containing the Application settings that were retrieved during initialisation


     
        /*
        * This function is called when the Application First Starts
        * It is a startup sequence that is used by Marketplace Apps to correctly login and get settings
        */
        start: function () {
            this.init({
                useLaunchPage: true,

            });


        },


        /*
        * This is the init Function called when the user is logged in, settings retrieved, and the application
        * logic must start.
        */
        init: function (settings) {

            var that = this;
            that.geodesicGraphic = null;
            that.geodesicCenter = null;
            that.launcherSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new esriColor(255, 140, 0), 2), new esriColor(255, 140, 0))
            that.impactAreaSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new esriColor([255, 255, 0, 0.35]), 2), new esriColor([255, 255, 0, 0.35])
                );
            
            
            // Remember the Settings
            this.settings = settings;
            $("#home").show();
            $("ul.social").remove();
            $(".homepagination").show();
            $(".homepagination").click(function () {
                $(".zone").removeClass("movedfromlaunchpage");
            });
            $("body").css("background-image", "url('assets/img/missiles.jpg')");
            $("#pre-load").fadeOut('slow', function () {
                $(this).css("visibility", "hidden");
            });
            $("#post-load").css("visibility", "visible");

            $("#launchPageGo").hide();
            $("#launchPageGo").click(function () {

                $(".zone").addClass("movedfromlaunchpage");

                // Wait for 300 seconds until animation is over, before getting
                setTimeout(function () {

                    that.map.resize();
                    that.map.reposition();
                }, 400);

            });

            esriArcgisUtils.createMap("a25176477a17487d9114f39e8a4fd5f9", "map", { ignorePopups: true, mapOptions: { wrapAround180: false, autoResize: true, logo: false, slider: false } }).then(function (response) {
                that.map = response.map;
                $("#loader").hide();
                $("#launchPageGo").show();
                $("#pre-load").fadeOut('slow', function () {
                    $(this).css("visibility", "hidden");
                });
                $("#post-load").css("visibility", "visible");


                that.map.on("mouse-down", function (evt) {
                    if (that._maptool === "position") {
                        that.performMissileBuffer(evt.mapPoint, that.map,  parseFloat($("input[name=type-of-missile]:checked").attr("data-range")), $("#isgeodesic-true").prop("checked")==true);
                    }
                })
                
                $("input[name=type-of-missile]").change(function(evt) {
                    if (this.checked) {
                        if (that.geodesicCenter !==null) {
                              that.performMissileBuffer(that.geodesicCenter.geometry, that.map,  parseFloat($(this).attr("data-range")), $("#isgeodesic-true").prop("checked")==true);
                        }
                    }
                });
                
                $("input[name=isgeodesic]").change(function(evt) {
                    if (this.checked) {
                        if (that.geodesicCenter !==null) {
                              that.performMissileBuffer(that.geodesicCenter.geometry, that.map, parseFloat($("input[name=type-of-missile]:checked").attr("data-range")), 
                              $("#isgeodesic-true").prop("checked")==true);
                        }
                    }
                });

                $("[data-toolname=zoomin]").click(function () {
                    var zoomlevel = that.map.getZoom();
                    if (zoomlevel === -1) {
                        that.map.centerAndZoom(that.map.extent.getCenter(), 2);
                    }
                    else {
                        if (zoomlevel < that.map.getMaxZoom()) {
                            that.map.centerAndZoom(that.map.extent.getCenter(), zoomlevel + 1);
                        }
                    }
                });
                $("[data-toolname=zoomout]").click(function () {

                    var zoomlevel = that.map.getZoom();
                    if (zoomlevel === -1) {
                        that.map.centerAndZoom(that.map.extent.getCenter(), 0.5);
                    }
                    else {
                        if (zoomlevel > that.map.getMinZoom()) {
                            that.map.centerAndZoom(that.map.extent.getCenter(), zoomlevel - 1);
                        }
                    }
                });

                $("[data-maptool=true]").click(function () {
                    $("[data-maptool=true]").removeClass("active");
                    $(this).addClass("active");
                    that._maptool = $(this).attr("data-toolname");
                    switch (that._maptool) {
                        case "pan":
                            that.enableNavigationMode();
                            break;
                        case "position":
                            that.disableNavigationMode();
                            break;
                        default:
                    }
                });


                $("[data-toolname=position]").trigger("click");
            });

        },
        disableNavigationMode: function () {
            this.map.disableDoubleClickZoom();
            this.map.disableClickRecenter();
            this.map.disablePan();
            this.map.disableRubberBandZoom();
            this.map.disableKeyboardNavigation();
        },
        /*
       * Allows the map to respond to map navigation using its default behaviour
       */
        enableNavigationMode: function () {
            this.map.enableDoubleClickZoom();
            this.map.enableClickRecenter();
            this.map.enablePan();
            this.map.enableRubberBandZoom();
            this.map.enableKeyboardNavigation();
        },

        performMissileBuffer: function (mapLocation, map, distance, geodesic) {
            var that = this;

            if (that.geodesicGraphic !== null) {
                that.map.graphics.remove(that.geodesicGraphic);
                that.geodesicGraphic = null;
            }
            if (that.geodesicCenter !== null) {
                that.map.graphics.remove(that.geodesicCenter);
                that.geodesicCenter = null;
            }

            that.geodesicCenter = new esriGraphic(mapLocation, that.launcherSymbol);
            that.map.graphics.add(that.geodesicCenter);

            var newgeom = null;
            if (geodesic==true) {
                newgeom = esriGeometryEngine.geodesicBuffer(mapLocation, distance, 9001);
            }
            else {
                  newgeom = esriGeometryEngine.buffer(mapLocation, distance, 9001);
            }
            if (newgeom !== null) {
                that.geodesicGraphic = new esriGraphic(newgeom, that.impactAreaSymbol);
                that.map.graphics.add(that.geodesicGraphic);
            }
        }









    };
}

    );
