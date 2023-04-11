import React from 'react';

export default [
	{
		selector: '[data-tour="navbar-connections"]',
		routing: '/connections',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>Broker Connections</p>
				<p>
					Define broker connections for the Management Center.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-connections"]',
		routing: '/connections',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					Set up and manage your connection here. The connection is done via regular client connection to the
					broker. Make sure the connected client has the necessary ACLs to be able to control the Management
					Center. The roles “super-admin”,”topic-observe” and “sys-observe” cover these ACLs.
					Depending on your subscription, the Management Center is able to connect to one or multiple brokers
					at the same time.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-clusters"]',
		routing: '/clusters',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>Cluster Management</p>
				<p>
					Create and manage clusters.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-clusters"]',
		routing: '/clusters',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					A cluster connects multiple brokers. To be able to set up a cluster, the brokers need to be
					configured to work as cluster nodes. At least three brokers form a cluster. The cluster type can
					either be a dynamic-security cluster or a high-availability cluster.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-certs"]',
		routing: '/certs',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>Certificate Management</p>
				<p>
					Upload and deploy client CA certificates with the Management Center.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-certs"]',
		routing: '/certs',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					Management Center users can upload CA certificates to the Management Center and deploy them to a
					connected broker instances.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-info"]',
		routing: '/info',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>Info</p>
				<p>
					Get information about the Management Center.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-info"]',
		routing: '/info',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					Information about the current license, version, and plugins are listed in the “info” menu.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-users"]',
		routing: '/users',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>User Management</p>
				<p>
					Create and manage users to access the Management Center.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-users"]',
		routing: '/users',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					Assign different roles to different users.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-user-groups"]',
		routing: '/user-groups',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>User Groups</p>
				<p>
					Create user groups to manage user access to different connections.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-user-groups"]',
		routing: '/user-groups',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					User groups add an extra layer of user management on top of the regular user management.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="navbar-tokens"]',
		routing: '/tokens',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p style={{fontSize: '13pt'}}>App Token</p>
				<p>
					Create and manage App Token.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tour="page-tokens"]',
		routing: '/tokens',
		content: () => (
			<div style={{fontSize: '10pt'}}>
				<p>
					Create tokens to be used for the Management Center API.
				</p>
				<p>
					Click on Close to finish the Tour.
				</p>
			</div>
		),
	},
];
