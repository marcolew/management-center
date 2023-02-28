import React from 'react';
import {connect} from 'react-redux';
import ConnectionNewComponent from '../../../components/ConnectionNewComponent';
import ContainerBreadCrumbs from '../../../components/ContainerBreadCrumbs';
import ContainerHeader from '../../../components/ContainerHeader';

const ConnectionNew = () => {
	return (
		<div>
			<ContainerBreadCrumbs title="New" links={[{name: 'Home', route: '/home'},{name: 'Connections', route: '/connections'}]}/>
			<ContainerHeader
				title="New Connection"
				subTitle="Create a new connection to an existing broker. The name has to be unique."
			/>
			<ConnectionNewComponent />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		connections: state.brokerConnections?.brokerConnections
	};
};

export default connect(mapStateToProps)(ConnectionNew);
