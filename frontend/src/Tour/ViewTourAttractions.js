import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = {
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  num: {
    padding: "0 10px 0 0"
  },
  hover: {
    cursor: "pointer"
  }
};

class ViewTourAttractions extends React.Component {
  render() {
    const { classes } = this.props;
    const AttractionList = this.props.attractions.map((attraction, i) => (
      <TableRow
        hover="true"
        classes={{ hover: classes.hover }}
        key={attraction.title}
        onClick={() => this.props.zoomToAttraction(attraction.markerPosition)}
      >
        <TableCell classes={{ root: classes.num }} align="center">
          {i + 1}
        </TableCell>
        <TableCell classes={{ root: classes.num }} component="th" scope="row">
          {attraction.title}
        </TableCell>
        <TableCell classes={{ root: classes.num }}>
          {attraction.description}
        </TableCell>
      </TableRow>
    ));

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center" classes={{ root: classes.num }} />
              <TableCell classes={{ root: classes.num }}>Name</TableCell>
              <TableCell classes={{ root: classes.num }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{AttractionList}</TableBody>
        </Table>
      </Paper>
    );
  }
}

ViewTourAttractions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewTourAttractions);
