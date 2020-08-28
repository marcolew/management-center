import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

import policies from "../data/policies";

const remove = (array, item) => {
  const index = array.indexOf(item);
  array.splice(index, 1);
};

const useStyles = makeStyles((theme) => ({
  badges: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Policieshape = PropTypes.shape({
  groupname: PropTypes.string,
});

const POLICY_TABLE_COLUMNS = [
  { id: "policyname", key: "Name" },
  { id: "features", key: "Features" },
];

const FormattedGroupType = (props) => {
  switch (props.provider) {
    case "local":
      return "Local";
    default:
      return props.provider || "";
  }
};

const Policies = (props) => {
  const classes = useStyles();
  const {
    /* policies, */ onDeletePolicy,
    onSelectPolicy,
    onSort,
    sortBy,
    sortDirection,
  } = props;

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/security">Security</RouterLink>
        <Typography color="textPrimary">Policies</Typography>
      </Breadcrumbs>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {POLICY_TABLE_COLUMNS.map((column) => (
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
            {policies.map((policy) => (
              <TableRow
                hover
                key={policy.policyName}
                onClick={() => onSelectPolicy(policy.policyName)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <b>{policy.policyName}</b>
                </TableCell>
                {/* <TableCell>{moment(group.lastModified).fromNow()}</TableCell> */}
                <TableCell className={classes.badges}>
                  {policy.features.map((feature) => (
                    <Chip
                      // icon={<FaceIcon />}
                      label={feature.name}
                      onDelete={(event) => {
                        event.stopPropagation();
                      }}
                      color="secondary"
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {
                    <div>
                      <IconButton
                        style={{ color: "#FF0022" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeletePolicy(policy.policyName);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#FF0022" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeletePolicy(policy.policyName);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
	  <Fab color="primary" aria-label="add" className={classes.fab}>
        <AddIcon />
      </Fab>
    </div>
  );
};

Policies.propTypes = {
  Policies: PropTypes.arrayOf(Policieshape).isRequired,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  onDeletePolicy: PropTypes.func.isRequired,
  onSelectPolicy: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
};

Policies.defaultProps = {
  sortBy: undefined,
  sortDirection: undefined,
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(Policies);
