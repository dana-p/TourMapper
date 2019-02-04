import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import userData from "../UserService";
import PaypalEmailForm from "./PaypalEmailForm";

import { Query } from "react-apollo";

import { UserQuery } from "../GraphQLCalls";
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
  },
  marginTop: {
    marginTop: theme.spacing.unit * 2
  }
});

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      email: "",
      paypal: ""
    };
  }

  async componentDidMount() {
    var user = await userData.getUserData();
    this.setState({
      userId: user.id
    });
  }

  render() {
    const { classes } = this.props;

    let UserInfo = () => <Loading />;
    if (this.state.userId != null) {
      UserInfo = ({ id }) => (
        <Query query={UserQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return `Error! ${error.message}`;
            if (data.user === null) return "Error! No such user...";

            return (
              <>
                <Grid container spacing={40} className={classes.cardGrid}>
                  <Grid item xs={12} md={12}>
                    <Card md={10} xs={10} className={classes.card}>
                      <div className={classes.cardDetails}>
                        <CardContent>
                          <Typography component="h1" variant="h5">
                            {data.user.name}
                          </Typography>
                          <Typography variant="subtitle1">
                            Your email: {data.user.email}
                          </Typography>
                          {data.user.paypal && (
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Your donation link: {data.user.paypal}
                            </Typography>
                          )}
                          {!data.user.paypal && (
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Want to receive tips? Set up a Paypal.Me link.
                              More info{" "}
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.paypal.me/"
                              >
                                here
                              </a>
                              .
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
              </>
            );
          }}
        </Query>
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
          <UserInfo id={this.state.userId} />
          <PaypalEmailForm />
        </div>
      </React.Fragment>
    );
  }
}

MyProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyProfile);
