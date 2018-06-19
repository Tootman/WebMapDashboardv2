import React from 'react';

const AppProvider extends Component {
	state= {
		name: 'Dan',
		age: 26
	}
render(){
	return 
	<AppContext.Provider value="im the App provider value">
		{this.props.children}
	</AppContext.Provider>

}
}




 React.createContext(null);

export default AppProvider;
