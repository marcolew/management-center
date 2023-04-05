import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PasswordIcon from '@material-ui/icons/VpnKey';
import {Alert, AlertTitle} from '@material-ui/lab';
import {useConfirm} from 'material-ui-confirm';
import {useSnackbar} from 'notistack';
import React, {useContext, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import ContainerBox from '../../../components/ContainerBox';
import ContainerBreadCrumbs from '../../../components/ContainerBreadCrumbs';
import ContainerHeader from '../../../components/ContainerHeader';
import SaveCancelButtons from '../../../components/SaveCancelButtons';
import SelectList from '../../../components/SelectList';
import {useFormStyles} from '../../../styles';
import {WebSocketContext} from '../../../websockets/WebSocket';
import {updateUsers} from '../actions/actions';

const UserNew = (props) => {
	const { users, userRoles = [], userManagementFeature, backendParameters } = props;
	const formClasses = useFormStyles();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [roles, setRoles] = useState([]);

	const roleSuggestions = userRoles
		.sort()
		.map((rolename) => ({
			label: rolename,
			value: rolename
		}));

	const usernameExists = props?.users?.find((searchUser) => {
		return searchUser.username === username;
	});

	const passwordsMatch = password === passwordConfirm;

	const validate = () => {
		const valid = passwordsMatch
			&& !usernameExists
			&& username !== ''
			&& (password !== '' || backendParameters.ssoUsed)
			&& roles.length
			&& username.match(/^[0-9a-zA-Z!#$%&'*+\-/=?^_`{|}~.@]+$/); // we can technically also send this pattern
																	   // from the backend in backendParameters
		return valid;
	};

	const {enqueueSnackbar} = useSnackbar();
	const context = useContext(WebSocketContext);
	const dispatch = useDispatch();
	const history = useHistory();
	const confirm = useConfirm();
	const {client} = context;

	const onSaveUser = async () => {
		let pwd = password;
		if (backendParameters.ssoUsed) {
			pwd = undefined;
		}
		try {
			await client.createUser(username, pwd, roles);
			const users = await client.listUsers();
			dispatch(updateUsers(users));
			history.push(`/admin/users`);
			enqueueSnackbar(`User "${username}" successfully created.`, {
				variant: 'success'
			});
		} catch (error) {
			enqueueSnackbar(`Error creating user "${username}". Reason: ${error.message || error}`, {
				variant: 'error'
			});
			throw error;
		}
	};

	const onCancel = async () => {
		await confirm({
			title: 'Cancel user creation',
			description: `Do you really want to cancel creating this user?`,
			cancellationButtonProps: {
				variant: 'contained'
			},
			confirmationButtonProps: {
				color: 'primary',
				variant: 'contained'
			}
		});
		history.goBack();
	};

	return (
		<ContainerBox>
			<ContainerBreadCrumbs title="New" links={[{name: 'Home', route: '/home'},
				{name: 'Users', route: '/users'}
			]}/>
			<ContainerHeader
				title="New User"
				subTitle="Create a new user. User name and the password are required."
			/>
			{/* TODO: Quick hack to detect whether feature is supported */}
			{userManagementFeature?.error ? <><br/><Alert severity="warning">
				<AlertTitle>{userManagementFeature.error.title}</AlertTitle>
				{userManagementFeature.error.message}
			</Alert></> : null}
			{!userManagementFeature?.error &&
			<div>
				<Grid container spacing={1} alignItems="flex-end">
					<Grid item xs={12}>
						<TextField
							error={usernameExists}
							helperText={usernameExists && 'A user with this username already exists.'}
							className={formClasses.textField}
							required
							id="username"
							label="Name"
							onChange={(event) => setUsername(event.target.value)}
							defaultValue=""
							variant="outlined"
							fullWidth
							size="small"
							margin="dense"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AccountCircle/>
									</InputAdornment>
								)
							}}
						/>
					</Grid>

					{backendParameters.ssoUsed ?
						null
						:
						<>
							<Grid item xs={12}>
								<TextField
									required
									id="password"
									label="Password"
									error={!passwordsMatch}
									helperText={!passwordsMatch && 'Passwords must match.'}
									className={formClasses.textField}
									onChange={(event) => setPassword(event.target.value)}
									defaultValue=""
									variant="outlined"
									fullWidth
									type="password"
									size="small"
									margin="dense"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PasswordIcon/>
											</InputAdornment>
										)
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									id="password-confirm"
									label="Password Confirm"
									error={!passwordsMatch}
									helperText={!passwordsMatch && 'Passwords must match.'}
									className={formClasses.textField}
									onChange={(event) => setPasswordConfirm(event.target.value)}
									defaultValue=""
									variant="outlined"
									fullWidth
									type="password"
									size="small"
									margin="dense"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PasswordIcon/>
											</InputAdornment>
										)
									}}
								/>
							</Grid>
						</>
					}

					<Grid item xs={12}>
						<SelectList
							variant="outlined"
							className={formClasses.autoComplete}
							label="Select Roles"
							values={roles}
							getValue={value => value}
							onChange={(event, value) => {
								setRoles((value && value.map((role) => role.value)) || []);
							}}
							disabled={false}
							suggestions={roleSuggestions}
						/>
					</Grid>
					<Grid container xs={12} alignItems="flex-start">
						<Grid item xs={12}>
							<SaveCancelButtons
								onSave={onSaveUser}
								saveDisabled={!validate()}
								onCancel={onCancel}
							/>
						</Grid>
					</Grid>
				</Grid>
			</div>}
		</ContainerBox>
	);
};

const mapStateToProps = (state) => {
	return {
		userRoles: state.userRoles?.userRoles,
		users: state.users?.users,
		userManagementFeature: state.systemStatus?.features?.usermanagement,
		backendParameters: state.backendParameters?.backendParameters,
	};
};

export default connect(mapStateToProps)(UserNew);
