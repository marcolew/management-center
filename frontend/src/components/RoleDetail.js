import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ClientIDIcon from '@material-ui/icons/Fingerprint';
import HelpIcon from '@material-ui/icons/Help';
import RoleIcon from '@material-ui/icons/Policy';
import ACLIcon from '@material-ui/icons/Security';
import {useConfirm} from 'material-ui-confirm';
import {useSnackbar} from 'notistack';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {updateEditDefaultClient, updateRole, updateRoles} from '../actions/actions';
import {useFormStyles} from '../styles';
import {WebSocketContext} from '../websockets/WebSocket';
import ACLTypesHelpDialog from './ACLTypesHelpDialog';
import ContainerBox from './ContainerBox';
import ContainerBreadCrumbs from './ContainerBreadCrumbs';
import ContainerHeader from './ContainerHeader';
import { getAdminRolesFromState } from '../helpers/utils';
import StyledTypography from './StyledTypography';

const ACL_TABLE_COLUMNS = [
	{id: 'type', key: 'Type'},
	{id: 'topic', key: 'Topic'},
	{id: 'priority', key: 'Priority'},
	{id: 'allow', key: 'Allow / Deny'}
];

function TabPanel(props) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-prevent-tabpanel-${index}`}
			aria-labelledby={`scrollable-prevent-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box pt={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `scrollable-prevent-tab-${index}`,
		'aria-controls': `scrollable-prevent-tabpanel-${index}`
	};
}

const roleShape = PropTypes.shape({
	rolename: PropTypes.string
});

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	form: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {
		// marginLeft: theme.spacing(1),
		// marginRight: theme.spacing(1),
		// width: 200,
	},
	buttons: {
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	margin: {
		margin: theme.spacing(1)
	},
	breadcrumbItem: theme.palette.breadcrumbItem,
	breadcrumbLink: theme.palette.breadcrumbLink
}));


const RoleDetail = (props) => {
	const classes = useStyles();
	const context = useContext(WebSocketContext);
	const dispatch = useDispatch();
	const confirm = useConfirm();
	const {enqueueSnackbar} = useSnackbar();
	const {client: brokerClient} = context;
	const formClasses = useFormStyles();

	const {adminRoles, defaultClient, role = {}, onSort, sortBy, sortDirection} = props;

	const [aclTypesHelpDialogOpen, setACLTypesHelpDialogOpen] = React.useState(false);

	const handleOpenACLTypesHelpDialog = () => {
		setACLTypesHelpDialogOpen(true);
	};

	const handleCloseACLTypesHelpDialog = () => {
		setACLTypesHelpDialogOpen(false);
	};

	const [selectedTab, setSelectedTab] = React.useState(0);
	const [newACL, setNewACL] = React.useState({
		acltype: 'publishClientReceive',
		allow: true,
		topic: '',
		priority: 0
	});

	const [editMode, setEditMode] = React.useState(false);
	const [updatedRole, setUpdatedRole] = React.useState({
		...role
	});

	const isRoleUsedByAdmin = adminRoles.includes(role.rolename);

	const validate = () => {
		const valid = updatedRole.rolename !== '';
		return valid;
	};

	const validateACL = () => {
		const valid = newACL.topic !== '' && newACL.priority !== '';
		return valid;
	};

	const handleChange = (event, newSelectedTab) => {
		setSelectedTab(newSelectedTab);
	};

	const onUpdateRole = async () => {
		// TODO: quick hack
		delete updatedRole.groups;
		delete updatedRole.roles;
		await brokerClient.modifyRole(updatedRole);
		enqueueSnackbar('Role successfully updated', {
			variant: 'success'
		});
		const roleObject = await brokerClient.getRole(role.rolename);
		dispatch(updateRole(roleObject));
		const roles = await brokerClient.listRoles();
		dispatch(updateRoles(roles));
		setEditMode(false);
	};

	const onCancelEdit = async () => {
		await confirm({
			title: 'Cancel role editing',
			description: `Do you really want to cancel editing this role?`,
			cancellationButtonProps: {
				variant: 'contained'
			},
			confirmationButtonProps: {
				color: 'primary',
				variant: 'contained'
			}
		});
		setUpdatedRole({
			...role
		});
		setEditMode(false);
	};

	const showConfirm = async () => {
		const hasRole = await brokerClient.clientHasRole(defaultClient.username, role.rolename);
		if (hasRole) {
			await confirm({
				title: 'Edit role',
				description: `You are about to edit a role associated with the user that is used by the Management Center server to connect to your broker instance. 
				The Management Center server will therefore be disconnected from the broker and automatically reconnected when the changes are applied.`,
				cancellationButtonProps: {
					variant: 'contained'
				},
				confirmationButtonProps: {
					color: 'primary',
					variant: 'contained'
				}
			});
			dispatch(updateEditDefaultClient(true));
		}
	}

	const onAddACL = async (acl) => {
		await showConfirm();
		await brokerClient.addRoleACL(role.rolename, acl);
		const updatedRole = await brokerClient.getRole(role.rolename);
		dispatch(updateRole(updatedRole));
		setNewACL({
			acltype: 'publishClientReceive',
			allow: true,
			topic: '',
			priority: 0
		});
		const roles = await brokerClient.listRoles();
		dispatch(updateRoles(roles));
	};

	const onRemoveACL = async (acl) => {
		// await confirm({
		// 	title: 'Confirm ACL deletion',
		// 	description: `Do you really want to delete the ACL "${acl.topic}"?`,
		// 	cancellationButtonProps: {
		// 		variant: 'contained'
		// 	},
		// 	confirmationButtonProps: {
		// 		color: 'primary',
		// 		variant: 'contained'
		// 	}
		// });
		await showConfirm();
		await brokerClient.removeRoleACL(role.rolename, acl);
		const updatedRole = await brokerClient.getRole(role.rolename);
		dispatch(updateRole(updatedRole));
		const roles = await brokerClient.listRoles();
		dispatch(updateRoles(roles));
	};

	return role.rolename ? (
		<ContainerBox>
			<ACLTypesHelpDialog open={aclTypesHelpDialogOpen} handleClose={handleCloseACLTypesHelpDialog} />
			<ContainerBreadCrumbs
				title={role.rolename}
				links={[
					{ name: 'Home', route: '/home' },
					{ name: 'Roles', route: '/roles' }
				]}
			/>
			<ContainerHeader
				title={`Edit Role: ${role.rolename}`}
				subTitle="Modify role properties and assign Access Control List Settings."
			/>
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="off"
				aria-label="Role"
			>
				<Tab label="Details" icon={<RoleIcon />} aria-label="details" {...a11yProps(0)} />
				<Tab label="ACLs" icon={<ACLIcon />} aria-label="acls" {...a11yProps(1)} />
			</Tabs>
			<TabPanel value={selectedTab} index={0}>
				<Grid container spacing={1} alignItems="flex-end">
					<Grid item xs={12}>
						<TextField
							required
							disabled
							id="role-name"
							label="Name"
							value={updatedRole.rolename}
							defaultValue=""
							variant="outlined"
							fullWidth
							size="small"
							margin="dense"
							className={formClasses.textField}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<ClientIDIcon />
									</InputAdornment>
								)
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							disabled={!editMode}
							onChange={(event) => {
								if (editMode) {
									setUpdatedRole({
										...updatedRole,
										textname: event.target.value
									});
								}
							}}
							id="textname"
							label="Text Name"
							value={updatedRole.textname}
							defaultValue=""
							variant="outlined"
							fullWidth
							size="small"
							margin="dense"
							className={formClasses.textField}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							disabled={!editMode}
							onChange={(event) => {
								if (editMode) {
									setUpdatedRole({
										...updatedRole,
										textdescription: event.target.value
									});
								}
							}}
							id="textdescription"
							label="Description"
							value={updatedRole.textdescription}
							defaultValue=""
							variant="outlined"
							fullWidth
							size="small"
							margin="dense"
							className={formClasses.textField}
						/>
					</Grid>
				</Grid>
			</TabPanel>
			<TabPanel value={selectedTab} index={1}>
				<Grid container spacing={1} alignItems="flex-end">
					<Hidden xsDown implementation="css">
						<div style={{ height: '100%', overflowY: 'auto' }}>
							<TableContainer>
								<Table stickyHeader size="small" aria-label="sticky table">
									<TableHead>
										<TableRow>
											{ACL_TABLE_COLUMNS.map((column) => (
												<TableCell
													key={column.id}
													sortDirection={sortBy === column.id ? sortDirection : false}
												>
													<TableSortLabel
														active={sortBy === column.id}
														direction={sortDirection}
														onClick={() => onSort(column.id)}
													>
														{column.key}
													</TableSortLabel>
												</TableCell>
											))}
											<TableCell />
										</TableRow>
									</TableHead>
									<TableBody>
										{role &&
											role.acls &&
											role.acls.map((acl) => (
												<TableRow
													hover
													// TODO: add key
													// key={role.rolename}
												>
													<TableCell>
														<StyledTypography
															disabled={isRoleUsedByAdmin}
															text={acl.acltype}
														/>
													</TableCell>

													<TableCell>
														<StyledTypography
															disabled={isRoleUsedByAdmin}
															text={acl.topic}
														/>
													</TableCell>

													<TableCell>
														<StyledTypography
															disabled={isRoleUsedByAdmin}
															text={acl.priority}
														/>
													</TableCell>

													<TableCell>
														<Select disabled value={acl.allow ? 'allow' : 'deny'}>
															<MenuItem value="allow">allow</MenuItem>
															<MenuItem value="deny">deny</MenuItem>
														</Select>
													</TableCell>

													<TableCell align="right">
														<IconButton
															size="small"
															disabled={isRoleUsedByAdmin}
															onClick={(event) => {
																event.stopPropagation();
																onRemoveACL(acl);
															}}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										{!isRoleUsedByAdmin && (
											<TableRow
											// TODO: add key
											// key={role.rolename}
											>
												<TableCell>
													<FormControl>
														<InputLabel id="new-acl-type-label">ACL Type</InputLabel>
														<Select
															labelId="new-acl-type-label"
															id="new-acl-type"
															value={newACL.acltype}
															defaultValue="publishClientToBroker"
															onChange={(event) =>
																setNewACL({
																	...newACL,
																	acltype: event.target.value
																})
															}
														>
															<MenuItem value={'publishClientSend'}>
																publishClientSend
															</MenuItem>
															<MenuItem value={'publishClientReceive'}>
																publishClientReceive
															</MenuItem>
															<MenuItem value={'subscribeLiteral'}>
																subscribeLiteral
															</MenuItem>
															<MenuItem value={'subscribePattern'}>
																subscribePattern
															</MenuItem>
															<MenuItem value={'unsubscribeLiteral'}>
																unsubscribeLiteral
															</MenuItem>
															<MenuItem value={'unsubscribePattern'}>
																unsubscribePattern
															</MenuItem>
														</Select>
													</FormControl>
													<IconButton
														variant="contained"
														edge="end"
														aria-label="help"
														onClick={handleOpenACLTypesHelpDialog}
													>
														<HelpIcon fontSize="small" />
													</IconButton>
												</TableCell>

												<TableCell>
													<TextField
														required
														id="new-acl-topic"
														label="Topic"
														value={newACL.topic}
														onChange={(event) =>
															setNewACL({
																...newACL,
																topic: event.target.value
															})
														}
													/>
												</TableCell>

												<TableCell>
													<TextField
														required
														id="new-acl-priority"
														label="Priority"
														value={newACL.priority}
														type="number"
														onChange={(event) =>
															setNewACL({
																...newACL,
																priority:
																	event.target.value !== ''
																		? parseInt(event.target.value)
																		: ''
															})
														}
													/>
												</TableCell>
												<TableCell>
													<FormControl>
														<InputLabel id="allow-deny-label"></InputLabel>
														<Select
															value={newACL.allow ? 'allow' : 'deny'}
															onChange={(event) => {
																setNewACL({
																	...newACL,
																	allow: event.target.value === 'allow'
																});
															}}
														>
															<MenuItem value="allow">allow</MenuItem>
															<MenuItem value="deny">deny</MenuItem>
														</Select>
													</FormControl>
												</TableCell>

												<TableCell align="right">
													<Button
														disabled={!validateACL()}
														variant="contained"
														color="primary"
														startIcon={<SaveIcon />}
														onClick={(event) => {
															event.stopPropagation();
															onAddACL(newACL);
														}}
													>
														Add
													</Button>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</Hidden>
					<Hidden smUp implementation="css">
						<Paper>
							<List className={classes.root}>
								{role &&
									role.acls &&
									role.acls.map((acl) => (
										<React.Fragment>
											<ListItem button>
												<ListItemText
													primary={acl.acltype}
													secondary={
														<React.Fragment>
															<Typography
																component="span"
																variant="body2"
																className={classes.inline}
																color="textPrimary"
															>
																Topic: {acl.topic}
															</Typography>
															<br />
															<Typography
																component="span"
																variant="body2"
																className={classes.inline}
																color="textPrimary"
															>
																Priority: {acl.priority}
															</Typography>
															<br />
															<Typography
																component="span"
																variant="body2"
																className={classes.inline}
																color="textPrimary"
															>
																Allow: <Checkbox checked={acl.allow} disabled />
															</Typography>
														</React.Fragment>
													}
												/>
												<ListItemSecondaryAction>
													<IconButton edge="end" aria-label="delete">
														<DeleteIcon />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
											<Divider variant="inset" component="li" />
										</React.Fragment>
									))}
							</List>
						</Paper>
					</Hidden>
				</Grid>
			</TabPanel>
			{!editMode && !isRoleUsedByAdmin && selectedTab === 0 && (
				<Grid item xs={12}>
					<Button
						variant="contained"
						className={formClasses.buttonTop}
						color="primary"
						startIcon={<EditIcon />}
						disabled={isRoleUsedByAdmin}
						onClick={() => setEditMode(true)}
					>
						Edit
					</Button>
				</Grid>
			)}
			{editMode && selectedTab === 0 && (
				<Grid item xs={12}>
					<Button
						variant="contained"
						disabled={!validate()}
						color="primary"
						className={formClasses.buttonTopRight}
						startIcon={<SaveIcon />}
						onClick={(event) => {
							event.stopPropagation();
							onUpdateRole();
						}}
					>
						Save
					</Button>
					<Button
						variant="contained"
						className={formClasses.buttonTop}
						onClick={(event) => {
							event.stopPropagation();
							onCancelEdit();
						}}
					>
						Cancel
					</Button>
				</Grid>
			)}
		</ContainerBox>
	) : (
		<Redirect to="/roles" push />
	);
};

RoleDetail.propTypes = {
	role: roleShape.isRequired
};

const mapStateToProps = (state) => {
	return {
		role: state.roles?.role,
		roles: state.roles?.roles,
		adminRoles: getAdminRolesFromState(state),
		defaultClient: state.brokerConnections?.defaultClient
	};
};

export default connect(mapStateToProps)(RoleDetail);
