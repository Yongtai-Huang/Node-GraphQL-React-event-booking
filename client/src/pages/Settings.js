import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
import './Settings.css';

class SettingsPage extends Component {
  state = {
    username: '',
    email: '',
    password: ''
  };

  static contextType = AuthContext;
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    const queryBody = {
      query: `
        query {
          getUser {
            username
            email
          }
        }
      `
    };

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(queryBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      const user = resData.data.getUser;
      this.setState({ username: user.username, email: user.email });
    })
    .catch(err => {
      console.log(err);
    });
  };

  handleChange = field => event => {
    const state = this.state;
    const newState = Object.assign({}, state, { [field]: event.target.value });
    this.setState(newState);
  }

  submitHandler(event) {
    event.preventDefault();
    const user = Object.assign({}, this.state);
    if (!user.password) {
      delete user.password;
    }

    if (user.username.trim().length === 0 || user.email.trim().length === 0 || (user.password && user.password.trim().length === 0)) {
      return;
    }

    let requestBody = {
      query: `
        mutation {
          updateUser(userInput: {username: "${user.username}", email: "${user.email}", password: "${user.password}"}) {
            userId
            username
            token
            tokenExpiration
          }
        }
      `
    };
    
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      if (resData.data.updateUser && resData.data.updateUser.token) {
        this.context.login(
          resData.data.updateUser.token,
          resData.data.updateUser.userId,
          resData.data.updateUser.username,
          resData.data.updateUser.tokenExpiration
        );

				this.setState({
					username: '',
					email: '',
					password: ''
				});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  render() {
    return (
      <form className="settings-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={this.state.username} onChange={this.handleChange('username')} />
        </div>
				
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={this.state.email} onChange={this.handleChange('email')} />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={this.state.password} onChange={this.handleChange('password')} />
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default SettingsPage;