import React, { Component } from "react";
import userData from "../UserService";
import FormErrors from "../NewTour/FormErrors";

import { Mutation } from "react-apollo";
import { validateEmail, validateUrl } from "../Helpers";

import { UserQuery, AddPaypalAndEmail } from "../GraphQLCalls";

class PaypalEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      email: "",
      paypal: "",
      formErrors: { email: "", paypal: "" },
      formValidity: {
        email: false,
        paypal: false
      },
      formValid: false
    };
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let formValidity = this.state.formValidity;

    switch (fieldName) {
      case "email":
        formValidity.email = validateEmail(value);
        fieldValidationErrors.email = formValidity.email
          ? ""
          : " Email is invalid.";
        break;
      case "paypal":
        formValidity.paypal = validateUrl(value);
        fieldValidationErrors.paypal = formValidity.paypal
          ? ""
          : " Link format is wrong. Make sure to include 'https://www' at the beginning.";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValidity: formValidity
      },
      this.validateForm
    );
  }

  validateForm = () => {
    this.setState({
      formValid: this.state.formValidity.email || this.state.formValidity.paypal
    });
  };

  handleUserInput(e) {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  addFullUrlStart = () => {
    if (this.state.paypal === "") this.setState({ paypal: "https://www." });
  };

  async componentDidMount() {
    var user = await userData.getUserData();
    this.setState({
      userId: user.id
    });
  }

  render() {
    return (
      <Mutation
        mutation={AddPaypalAndEmail}
        update={(cache, { data: { addPaypalAndEmail } }) => {
          this.setState({
            email: "",
            paypal: ""
          });
          cache.writeQuery({
            query: UserQuery,
            data: {
              user: addPaypalAndEmail
            }
          });
        }}
      >
        {addPaypalAndEmail => (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="email">Change your email:</label>
                  <input
                    type="text"
                    onChange={e => this.handleUserInput(e)}
                    value={this.state.email}
                    className="form-control"
                    id="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="paypal">Input your paypal.me link</label>
                  <input
                    type="text"
                    onChange={e => this.handleUserInput(e)}
                    onClick={this.addFullUrlStart}
                    value={this.state.paypal}
                    className="form-control"
                    id="paypal"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  disabled={!this.state.formValid}
                  onClick={() => {
                    addPaypalAndEmail({
                      variables: {
                        id: this.state.userId,
                        email: this.state.email,
                        paypal: this.state.paypal
                      }
                    });
                  }}
                >
                  Submit changes
                </button>
              </div>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default PaypalEmailForm;
