import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloudUpload from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
	restrictButtonHeight: {
		maxHeight: '27px'
	}
}));

const loadFile = (file, onUpload) => {
	const reader = new FileReader();
	reader.onload = (ev) => {
		try {
			const res = ev.target.result;
			const parts = res ? res.split(':') : [];
			onUpload({ file, data: parts.length > 1 ? parts[1] : parts[0] });
		} catch (error) {
			onUpload({ file, error });
		}
	};
	reader.readAsText(file);
};

const onChange = (onUpload) => (event) => {
	const { files } = event.target;
	if (files && files.length) {
		loadFile(files[0], onUpload);
	}
};

const UploadButton = ({ name, disabled, onUpload }) => {
	const classes = useStyles();
	return (
		<Button
			className={`${classes.button} ${classes.restrictButtonHeight}`}
			color="secondary"
			component="label"
			disabled={disabled}
			onChange={onChange(onUpload)}
			size="small"
			startIcon={<CloudUpload />}
			variant="contained"
		>
			Choose File
			<input name={name} hidden type="file" />
		</Button>
	);
};
export default UploadButton;
