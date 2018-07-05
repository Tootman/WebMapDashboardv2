export default {
	testGeoJson: {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				properties: {
					name: "Litter bin",
					Asset: "Litter bin",
					description: "metal, circular",
					lastInspection: "4 May 2016",
					condition: 3,
					instructions: "paint it green",
					OBJECTID: "0004Point"
				
					
				},
				geometry: {
					type: "Point",
					coordinates: [-0.1, 51.5]
				}
			},
			{
				type: "Feature",
				properties: {
					name: "Gulley Grating",
					Asset: "Gulley Grating",
					description: "metal, small",
					lastInspection: "2 May 2016",
					condition: 2,
					instructions: "clear if it is blocked",
					OBJECTID: "0006Point"
				},
				geometry: {
					type: "Point",
					coordinates: [-0.11, 51.52]
				}
			}
		]
	}
};
