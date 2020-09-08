import React, { Component } from 'react';

import './Auth.css';
import AuthContext from  '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.usernameEl = React.createRef();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const username = !this.state.isLogin ? this.usernameEl.current.value : '';
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if ( (!this.state.isLogin && username.trim().length === 0) || email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody ={};
    if (this.state.isLogin) {
      requestBody = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              username
              token
              tokenExpiration
            }
          }
        `
      };
    }

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {username: "${username}", email: "${email}", password: "${password}"}) {
              _id
              username
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      if (resData.data.login && resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.username,
          resData.data.login.tokenExpiration
        );
      } else if (resData.data.createUser && resData.data.createUser._id) {
        this.setState( () => {
          return { isLogin: true };
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        {!this.state.isLogin &&
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input type="username" id="username" ref={this.usernameEl} />
          </div>
        }

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>

        <div className="form-actions">
          <button type="submit">{ this.state.isLogin ? 'Login' : 'Signup' }</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;