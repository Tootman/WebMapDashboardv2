import { db } from "./firebase";

// User API

export const doCreateUser = (id, username, email) =>
	db.ref(`users/${id}`).set({
		username,
		email
	});

export const onceGetUsers = () => db.ref("users").once("value");

// Other db APIs ...
export const retriveMapIndex = () => {
	return db
		.ref("/App/Mapindex")
		.once("value")
		.then(function(snapshot) {
			
			return snapshot.val();
			//displayMapIndeces(snapshot)
		});
};
