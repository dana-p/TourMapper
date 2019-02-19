import React from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import { Query } from "react-apollo";

import { UserQuery, ToursByUser } from "../GraphQLCalls";
import Loading from "../Loading";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 10,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  },
  cardMedia: {
    width: 160
  }
});

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null
    };
  }

  async componentDidMount() {
    const {
      match: { params }
    } = this.props;

    this.setState({
      userId: params.userId
    });
  }

  render() {
    const { classes } = this.props;

    const UserInfo = ({ id }) => (
      <Query query={UserQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          if (data.user === null) return "Error! No such user...";
          return (
            <Grid container spacing={40} className={classes.cardGrid}>
              <Grid item xs={12} md={12}>
                <Card md={10} xs={10} className={classes.card}>
                  <div className={classes.cardDetails}>
                    <CardContent>
                      <Typography component="h2" variant="h5">
                        {data.user.name}
                      </Typography>
                      <Typography variant="subtitle1">
                        Contact tour guide at {data.user.email}
                      </Typography>
                      {data.user.paypal && (
                        <Typography variant="subtitle1" color="textSecondary">
                          Want to send this tourguide a tip?{" "}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data.user.paypal}
                          >
                            Click here!
                          </a>
                        </Typography>
                      )}
                    </CardContent>
                  </div>

                  <CardMedia
                    md={2}
                    xs={2}
                    className={classes.cardMedia}
                    image={data.user.picture}
                    title="User Profile Picture"
                  />
                </Card>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );

    let ToursData = () => <Loading />;
    if (this.state.userId != null) {
      ToursData = ({ userId }) => (
        <Query query={ToursByUser} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return `Error! ${error.message}`;
            if (data.toursByUser.length === 0) {
              return "User hasn't made any tours yet";
            }
            return data.toursByUser.map(tour => (
              <div key={tour.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/tour/${tour.id}`}>
                  <div className="card text-white bg-info mb-3">
                    <div className="card-header">
                      Comments: {tour.comments.length}
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{tour.title}</h4>
                      <p className="card-text">{tour.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ));
          }}
        </Query>
      );
    }

    const ToursData2 = ({ userId }) => (
      <Query query={ToursByUser} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          if (data.toursByUser.length === 0) {
            return "User hasn't made any tours yet";
          }
          return (
            <Grid container spacing={40} className={classes.cardGrid}>
              {data.toursByUser.map(tour => (
                <Grid item key={tour.id} xs={12} md={6}>
                  <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                      <CardContent>
                        <Typography component="h2" variant="h5">
                          {tour.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {tour.location}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                          {tour.description}
                        </Typography>
                        <Link to={`/tour/${tour.id}`}>
                          <Typography variant="subtitle1" color="primary">
                            Check it out!
                          </Typography>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          );
        }}
      </Query>
    );

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
          <UserInfo id={this.state.userId} />
          <ToursData2 userId={this.state.userId} />
        </div>
      </React.Fragment>
    );
  }
}

PublicProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PublicProfile);
