import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  mainFeaturedPost: {
    backgroundColor: "#3F51B5",
    color: theme.palette.common.white,
    margin: theme.spacing.unit * 4
  },
  mainFeaturedPostContent: {
    padding: `${theme.spacing.unit * 2}px`
  }
});

function Welcome(props) {
  const { classes } = props;
  return (
    <Paper className={classes.mainFeaturedPost}>
      <Grid container>
        <div className={classes.mainFeaturedPostContent}>
          <Typography component="h5" variant="h5" color="inherit" gutterBottom>
            Welcome to Tour-Mapper
          </Typography>
          <Typography color="inherit" paragraph>
            Explore the available tours below. If you're looking for something
            in particular, feel free to use the search bar below!{" "}
          </Typography>
          <Typography color="inherit" paragraph>
            If you'd like to share your tour, start by making an account.
          </Typography>
        </div>
      </Grid>
    </Paper>
  );
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Welcome);
