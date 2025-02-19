var map;
		var markers = [];
		var centerLat = null;
		var centerLon = null;
		var infowindow = new google.maps.InfoWindow();
		
		if (param("radius") != null) {
			radius = parseInt(param("radius"));
		} else {
			var radius = 32;
		}
		
      function initialize() {
		$.get("https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=" + param("zip"), function(data) {
			centerLat = data.results[0].geometry.location.lat;
			centerLon = data.results[0].geometry.location.lng;
			var mapOptions = {
			  center: new google.maps.LatLng(centerLat, centerLon),
			  zoom: 10
			};
			map = new google.maps.Map(document.getElementById("map-canvas"),
				mapOptions);
			
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(centerLat, centerLon),
				animation: google.maps.Animation.DROP,
				title: "Me",
				icon: "maps_markers/yellow_markerL.png"
			});
			
			var contentString = "<div>Me</div>";
				infowindow = new google.maps.InfoWindow({
					content: contentString
				});
				infowindow.open(map, marker);
			
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.close();
				var contentString = "<div>Me</div>";
				infowindow = new google.maps.InfoWindow({
					content: contentString
				});
				infowindow.open(map, marker);
			});
				
			marker.setMap(map);
				
			/*var ctaLayer = new google.maps.KmlLayer({
				url: 'http://okeefm.myrpi.org/hikingtrails_100_dedup.kmz'
			  });
			ctaLayer.setMap(map);*/
			
			loadAdditionalData();
			
			//var myParser = new geoXML3.parser({map: map, zoom: false, singleInfoWindow: true});
			//myParser.parse('recreation_data/hikingtrails_100.kml');
			//myParser.parse('recreation_data/biketrails_100.kml');
		});

      }
      google.maps.event.addDomListener(window, 'load', initialize);
	  
	  function loadAdditionalData() {
		  if (param("type").indexOf("parks") != -1) {
			  $.getJSON("recreation_data/state_parks.json", function(data) {
				$.each(data.data, function(index, elem) {
					if (getDistanceFromLatLonInKm(centerLat, centerLon, elem[21], elem[20]) < radius) {
						var latLng = new google.maps.LatLng(elem[21], elem[20]); 
						// Creating a marker and putting it on the map
						var marker = new google.maps.Marker({
							position: latLng,
							animation: google.maps.Animation.DROP,
							title: elem[8] + " " + elem[9],
							icon: "maps_markers/darkgreen_markerP.png"
						});
						
						google.maps.event.addListener(marker, 'click', function() {
							infowindow.close();
							var contentString = "<div>"+elem[8] + " " + elem[9] + "</div> <div>Link:<a target='_blank' href='" + elem[17][0] + "'>" + elem[17][0] + "</a>";
							infowindow = new google.maps.InfoWindow({
								content: contentString
							});
							infowindow.open(map, marker);
						});
						
						marker.setMap(map);
					}
				});
			  });
			  
			  $.getJSON("recreation_data/todos_outdoors.json", function(data) {
				$.each(data.data, function(index, elem) {
					if (getDistanceFromLatLonInKm(centerLat, centerLon, elem[18][1], elem[18][2]) < radius) {
						var latLng = new google.maps.LatLng(elem[18][1], elem[18][2]); 
						// Creating a marker and putting it on the map
						var marker = new google.maps.Marker({
							position: latLng,
							animation: google.maps.Animation.DROP,
							title: elem[10],
							icon: "maps_markers/darkgreen_markerS.png"
						});
						
						google.maps.event.addListener(marker, 'click', function() {
							infowindow.close();
							if (elem[16][0] == null) {
								var link_str = "";
							} else {
								var link_str = "<div>Link: <a href='"+ elem[16][0]+ "' target='_blank'>" + elem[16][0] + "</a></div>";
							}
							if (elem[16][1] == null) {
								var imgString = "";
							} else {
								var imgString = "<div><img src='"+ elem[16][1] +"' /></div>";
							}
							var contentString = "<h3>" + elem[10] + "</h3><div>" + elem[11] + "</div>" + imgString + link_str;
							infowindow = new google.maps.InfoWindow({
								content: contentString
							});
							infowindow.open(map, marker);
						});
						marker.setMap(map);
					}
				});
			});
		}
		
		if (param("type").indexOf("trails") != -1) {
			$.getJSON("recreation_data/hikingtrails_100_dedup.json", function(data) {
				$.each(data.features, function(index, elem) {
				if (getDistanceFromLatLonInKm(centerLat, centerLon, elem.geometry.geometries[0].coordinates[1], elem.geometry.geometries[0].coordinates[0]) < radius) {
					var latLng = new google.maps.LatLng(elem.geometry.geometries[0].coordinates[1], elem.geometry.geometries[0].coordinates[0]); 
					// Creating a marker and putting it on the map
					var marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						title: toTitleCase(elem.properties.Name),
						icon: "maps_markers/brown_markerH.png"
					});
					
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.close();
						var contentString = "<div>" + toTitleCase(elem.properties.Name) + "</div>";
						infowindow = new google.maps.InfoWindow({
							content: contentString
						});
						infowindow.open(map, marker);
					});
					
					marker.setMap(map);
				}
				});
			});
			
			$.getJSON("recreation_data/biketrails_100_dedup.json", function(data) {
				$.each(data.features, function(index, elem) {
				if (getDistanceFromLatLonInKm(centerLat, centerLon, elem.geometry.geometries[0].coordinates[1], elem.geometry.geometries[0].coordinates[0]) < radius) {
					var latLng = new google.maps.LatLng(elem.geometry.geometries[0].coordinates[1], elem.geometry.geometries[0].coordinates[0]); 
					// Creating a marker and putting it on the map
					var marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						title: toTitleCase(elem.properties.Name),
						icon: "maps_markers/brown_markerB.png"
					});
					
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.close();
						var contentString = "<div>" + toTitleCase(elem.properties.Name) + "</div>";
						infowindow = new google.maps.InfoWindow({
							content: contentString
						});
						infowindow.open(map, marker);
					});
					
					marker.setMap(map);
				}
				});
			});
		}
	  }
	
	function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
		; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}
	
	function param(name) {
		var prmstr = window.location.search.substr(1);
		var prmarr = prmstr.split ("&");
		var params = {};

		for ( var i = 0; i < prmarr.length; i++) {
			var tmparr = prmarr[i].split("=");
			params[tmparr[0]] = tmparr[1];
		}
		return params[name];
	}
	
	function toTitleCase(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}