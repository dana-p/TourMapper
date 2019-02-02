import React from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import { renderPlaygroundPage } from "@apollographql/graphql-playground-html/dist/render-playground-page";

import { Query } from "react-apollo";
import gql from "graphql-tag";

const UserQuery = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      firstName
      picture
      email
      tours
    }
  }
`;

const UserToursQuery = gql`
  query GetToursByUser($userId: String!) {
    toursByUser(userId: $userId) {
      id
      title
      description
      location
    }
  }
`;

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
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  },
  toolbarTitle: {
    flex: 1
  },
  toolbarSecondary: {
    justifyContent: "space-between"
  },
  mainFeaturedPost: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4
  },
  mainFeaturedPostContent: {
    padding: `${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up("md")]: {
      paddingRight: 0
    }
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 3
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
  userPhoto: {
    width: "auto"
  },
  markdown: {
    padding: `${theme.spacing.unit * 3}px 0`
  },
  sidebarAboutBox: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200]
  },
  sidebarSection: {
    marginTop: theme.spacing.unit * 3
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`
  }
});

const featuredPosts = [
  {
    title: "Featured post",
    date: "Nov 12",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content."
  },
  {
    title: "Post title",
    date: "Nov 11",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content."
  }
];

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
          if (loading) return "Loading user info...";
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
                      <Typography variant="subtitle1" color="primary">
                        Want to send a tip? Click here!
                      </Typography>
                    </CardContent>
                  </div>

                  <CardMedia
                    md={2}
                    xs={2}
                    className={classes.cardMedia}
                    image={data.user.picture}
                    title="Image title"
                  />
                </Card>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );

    let ToursData = () => <h1>Loading your tours...</h1>;
    if (this.state.userId != null) {
      ToursData = ({ userId }) => (
        <Query query={UserToursQuery} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading tours...";
            if (error) return `Error! ${error.message}`;
            if (data.toursByUser.length === 0) {
              return "User hasn't made any tours yet";
            }
            return data.toursByUser.map(tour => (
              <div key={tour.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/tour/${tour.id}`}>
                  <div className="card text-white bg-success mb-3">
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
      <Query query={UserToursQuery} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading tours...";
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
          {/* <main>
            {/* Main featured post */}
          {/*<Paper className={classes.mainFeaturedPost}>
            <Grid container>
              <Grid item md={6}>
                <div className={classes.mainFeaturedPostContent}>
                  <Typography
                    component="h1"
                    variant="h3"
                    color="inherit"
                    gutterBottom
                  >
                    Title of a longer featured blog post
                  </Typography>
                  <Typography variant="h5" color="inherit" paragraph>
                    Multiple lines of text that form the lede, informing new
                    readers quickly and efficiently about what&apos;s most
                    interesting in this post&apos;s contents…
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>{" "}
          */}
          {/* End main featured post */}
          <UserInfo id={this.state.userId} />
          <ToursData2 userId={this.state.userId} />
          {/* Sub featured posts */}
          {/* <Grid container spacing={40} className={classes.cardGrid}>
              {featuredPosts.map(post => (
                <Grid item key={post.title} xs={12} md={6}>
                  <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                      <CardContent>
                        <Typography component="h2" variant="h5">
                          {post.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {post.date}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                          {post.description}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          Continue reading...
                        </Typography>
                      </CardContent>
                    </div>
                    <Hidden xsDown>
                      <CardMedia
                        className={classes.cardMedia}
                        image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
                        title="Image title"
                      />
                    </Hidden>
                  </Card>
                </Grid>
              ))}
            </Grid> */}
          {/* End sub featured posts */}
          {/* /   </main> */}
        </div>
      </React.Fragment>
    );
  }
}

PublicProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PublicProfile);
