import React, { useRef, useState, useEffect, useContext } from 'react'

import { useStateContext } from '../../contexts/ContextProvider';

import LogoutButton from '../../components/LogoutButton';

const URL = "/userData"
const url1 = `http://localhost:5000${URL}`;
const url2 = `https://relayai.onrender.com${URL}`;
const URLS = [url1, url2];


class UserProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: '',
      password: '',
    }

  }

  componentDidMount() {
    fetch(URLS[1], {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token')
      })
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data, "userData");
        this.setState({ userData: data.data });
        if (data.data == "token expired") {
          window.localStorage.clear();
          window.location.href = './sign-in';
        }
      })
  }

  render() {
    return (
      <div>
        UserProfile
        Name<h1>{this.state.userData.fname}, {this.state.userData.lname}</h1>
        Email<h1>{this.state.userData.email}</h1>
        <LogoutButton />

      </div>
    )
  }
}

export default UserProfile