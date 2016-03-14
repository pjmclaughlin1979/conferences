
// Get all the AMD dependencies
define(["esri/Map", "esri/views/SceneView", "esri/Graphic", "esri/geometry/geometryEngine", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol", "dojo/on", "esri/layers/GraphicsLayer","esri/geometry/Point"
], function (esriMap, SceneView, esriGraphic, esriGeometryEngine, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, on, GraphicsLayer, esriPoint) {





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
            that.launcherSymbol = new SimpleMarkerSymbol({
                color: [255, 0, 0],
                outline: new SimpleLineSymbol({
                    color: [255, 255, 255],
                    width: 1
                }),
                size: 7
            });
            that.impactAreaSymbol = new SimpleFillSymbol({
                color: [227, 139, 79, 0.6],
                outline: new SimpleLineSymbol({
                    color: [227, 139, 79, 0.6],
                    width: 2
                })
            });
            
            
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
                    that.view.width = $("#map").width();
                    that.view.height = $("#map").height();
                    //     that.map.resize();
                    //       that.map.reposition();
                }, 400);

            });

            this.map = new esriMap({
                basemap: "streets"
            });

            this.view = new SceneView({
                container: "viewDiv",
                map: this.map,
                scale: 50000000,
                center: [-101.17, 21, 78]
            });

            var graphicsLayer = new GraphicsLayer();
            this.map.add(graphicsLayer);

            this.view.then(function () {


                $(window).resize(function () {
                    that.view.width = $("#map").width();
                    that.view.height = $("#map").height();
                })

                $("#loader").hide();
                $("#launchPageGo").show();
                $("#pre-load").fadeOut('slow', function () {
                    $(this).css("visibility", "hidden");
                });
                $("#post-load").css("visibility", "visible");



                on(that.view, "click", function (evt) {
                    if (that._maptool === "position") {
                        that.performMissileBuffer(graphicsLayer, evt.mapPoint, that.map, parseFloat($("input[name=type-of-missile]:checked").attr("data-range")), $("#isgeodesic-true").prop("checked") == true);
                    }
                })

                $("input[name=type-of-missile]").change(function (evt) {
                    if (this.checked) {
                        if (that.geodesicCenter !== null) {
                            that.performMissileBuffer(graphicsLayer, that.geodesicCenter.geometry, that.map, parseFloat($(this).attr("data-range")), $("#isgeodesic-true").prop("checked") == true);
                        }
                    }
                });

                $("input[name=isgeodesic]").change(function (evt) {
                    if (this.checked) {
                        if (that.geodesicCenter !== null) {
                            that.performMissileBuffer(graphicsLayer, that.geodesicCenter.geometry, that.map, parseFloat($("input[name=type-of-missile]:checked").attr("data-range")),
                                $("#isgeodesic-true").prop("checked") == true);
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
                that._maptool = "position";



                $("[data-toolname=position]").trigger("click");
            }, function (erre) {
                console.log(erre)

            });

        },


        performMissileBuffer: function (graphicsLayer, mapLocation, map, distance, geodesic) {
            var that = this;
            
            var mloc = new esriPoint({x: mapLocation.x, y:  mapLocation.y, spatialReference: mapLocation.spatialReference});
            mapLocation = mloc;
            if (that.geodesicGraphic !== null) {
                graphicsLayer.remove(that.geodesicGraphic);
                that.geodesicGraphic = null;
            }
            if (that.geodesicCenter !== null) {
                graphicsLayer.remove(that.geodesicCenter);
                that.geodesicCenter = null;
            }

            that.geodesicCenter = new esriGraphic(mapLocation, that.launcherSymbol);
            graphicsLayer.add(that.geodesicCenter);

            var newgeom = null;
            if (geodesic == true) {
                newgeom = esriGeometryEngine.geodesicBuffer(mapLocation, distance, 9001);
            }
            else {
                newgeom = esriGeometryEngine.buffer(mapLocation, distance, 9001);
            }
            if (newgeom !== null) {
                that.geodesicGraphic = new esriGraphic(newgeom, that.impactAreaSymbol);
                graphicsLayer.add(that.geodesicGraphic);
            }
        }









    };
}

    );
