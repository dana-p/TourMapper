import React, { Component } from "react";
import { Link } from "react-router-dom";

import TextField from "@material-ui/core/TextField";

class ListOfTours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tours: props.tours,
      filteredTours: props.tours
    };
  }

  handleChange = e => {
    // Variable to hold the original version of the list
    let currentTourList = [];
    // Variable to hold the filtered list before putting into state
    let newTourList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      currentTourList = this.props.tours;
      newTourList = currentTourList.filter(item => {
        const location = item.location.toLowerCase();
        const title = item.title.toLowerCase();
        const filter = e.target.value.toLowerCase();

        return title.includes(filter) || location.includes(filter);
      });
    } else {
      newTourList = this.props.tours;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filteredTours: newTourList
    });
  };

  render() {
    var FilteredTourList = <div>No tours to display...</div>;

    if (this.state.tours.length > 0) {
      FilteredTourList = () =>
        this.state.filteredTours.map(tour => (
          <div key={tour.id} className="col-sm-12 col-md-4 col-lg-3">
            <Link to={`/tour/${tour.id}`}>
              <div className="card text-white bg-info mb-3">
                <div className="card-header">
                  Comments: {tour.comments.length}
                </div>
                <div className="card-body">
                  <h4 className="card-title">{tour.title}</h4>
                  <h6 className="card-title">Tour in {tour.location}</h6>
                  <p className="card-text">{tour.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ));
    }
    return (
      <>
        <TextField
          id="standard-full-width"
          label="Search"
          style={{ margin: 8 }}
          placeholder="Enter a city or a tour name"
          helperText="Results will filter below"
          fullWidth
          margin="normal"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true
          }}
        />
        <FilteredTourList />
      </>
    );
  }
}

export default ListOfTours;
