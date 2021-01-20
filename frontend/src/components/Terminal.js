import React, { useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import { green, red } from '@material-ui/core/colors';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { updateClient, updateClients, updateGroups } from '../actions/actions';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import PluginDisabledIcon from '@material-ui/icons/Cancel';
import PluginEnabledIcon from '@material-ui/icons/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Terminal from 'terminal-in-react';
import Typography from '@material-ui/core/Typography';
import { WebSocketContext } from '../websockets/WebSocket';
import moment from 'moment';
import useLocalStorage from '../helpers/useLocalStorage';

const useStyles = makeStyles((theme) => ({
	terminal: {
		fontWeight: 'bold',
		fontSize: '2em'
	},
	badges: {
		'& > *': {
			margin: theme.spacing(0.3)
		}
	},
	breadcrumbItem: theme.palette.breadcrumbItem,
	breadcrumbLink: theme.palette.breadcrumbLink
}));

const Plugins = (props) => {
	const dispatch = useDispatch();
	const [darkMode, setDarkMode] = useLocalStorage('cedalo.managementcenter.darkMode');
	const theme = useTheme();
	const context = useContext(WebSocketContext);
	const { client: brokerClient } = context;

	const classes = useStyles();

	return (
		<Terminal
			startState="maximised"
			className={classes.terminal}
			showActions={false}
			hideTopBar={true}
			allowTabs={false}
			prompt={darkMode === 'true' ? 'yellow' : 'darkgrey'}
			color={darkMode === 'true' ? 'yellow' : 'darkgrey'}
			style={{ fontWeight: 'bold', fontSize: '1.4em', width: '100%' }}
			backgroundColor={darkMode === 'true' ? 'black' : 'white'}
			barColor="black"
			outputColor={darkMode === 'true' ? 'green' : 'grey'}
			commands={{
				addGroupClient: (args, print, runCommand) => {
					brokerClient
						.addGroupClient(args[1], args[2])
						.then(() => {
							print(`Client "${args[1]}" successfully added to group "${args[2]}"!`);
						});
				},
				removeGroupClient: (args, print, runCommand) => {
					brokerClient
						.removeGroupClient(args[1], args[2])
						.then(() => {
							print(`Client "${args[1]}" successfully removed from group "${args[2]}"!`);
						});
				},
				createClient: (args, print, runCommand) => {
					brokerClient
						.createClient(args[1], args[2], args[3])
						.then(() => {
							print(`Client "${args[1]}" successfully created!`);
						})
						.then(() => brokerClient.listClients())
						.then((clients) => dispatch(updateClients(clients)));
				},
				createGroup: (args, print, runCommand) => {
					brokerClient
						// groupname, rolename, textname, textdescription
						.createGroup(args[1], args[2], args[3])
						.then(() => {
							print(`Group "${args[1]}" successfully created!`);
						})
						.then(() => brokerClient.listGroups())
						.then((groups) => dispatch(updateGroups(groups)));
				},
				getGroup: (args, print, runCommand) => {
					brokerClient.getGroup(args[1]).then((group) => {
						print(`Name: ${group.groupname}`);
						print(`Description: ${group.textdescription}`);
					});
				},
				listClients: (args, print, runCommand) => {
					brokerClient.listClients().then((clients) => {
						const message = clients
							.map((client) => `${client.username}\t${client.clientid ? client.clientid : ''}`)
							.join('\n');
						print(message);
					});
				},
				listGroups: (args, print, runCommand) => {
					brokerClient.listGroups().then((groups) => {
						const message = groups.map((group) => `${group.groupname}`).join('\n');
						print(message);
					});
				},
				listRoles: (args, print, runCommand) => {
					brokerClient.listRoles().then((roles) => {
						const message = roles.map((role) => `${role.rolename}`).join('\n');
						print(message);
					});
				},
				deleteClient: (args, print, runCommand) => {
					brokerClient.deleteClient(args[1]).then(() => {
						print(`Client "${args[1]}" successfully deleted!`);
					});
				}
			}}
			descriptions={{
				addClient: 'Add a new client',
				deleteClient: 'Delete a client',
				listClients: 'List all clients',
				listGroups: 'List all groups',
				listRoles: 'List all roles'
			}}

			msg="Welcome to the Management Center Terminal, type 'help' for more information."
		/>
	);
};

const mapStateToProps = (state) => {
	return {
		license: state.license?.license,
		version: state.version?.version
	};
};

export default connect(mapStateToProps)(Plugins);
