export default {
	testGeoJson: {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				properties: {
					name: "PLace 1",
					amenity: "Baseball Stadium",
					popupContent: "This is where the Rockies play!"
				},
				geometry: {
					type: "Point",
					coordinates: [-0.1, 51.5]
				}
			},
			{
				type: "Feature",
				properties: {
					name: "PLace 2",
					amenity: "Baseball Stadium",
					popupContent: "This is where the others play!"
				},
				geometry: {
					type: "Point",
					coordinates: [-0.11, 51.52]
				}
			}
		]
	}
};
