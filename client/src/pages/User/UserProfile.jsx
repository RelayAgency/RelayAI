import React, { useRef, useState, useEffect, useContext } from 'react'

import { useStateContext } from '../../contexts/ContextProvider';

const LogoutButton = (props) => {
  const { currentColor } = useStateContext();
  const form = document.getElementById(props.formId);

  const textLinkStyles = "cursor-pointer"

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = './sign-in';
  }

  return (
    <div className="text-center">
      <button
        id="submit-button"
        color="white"
        style={{ backgroundColor: currentColor }}
        type="submit"
        className="text-m opacity-0.9 text-white hover:drop-shadow-xl rounded-xl p-4 mt-8"
        onClick={(e) => logOut(e)}>
        Log Out
      </button>
    </div>
  )

}

class UserProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: '',
      password: '',
    }

  }

  componentDidMount() {
    fetch(`http://localhost:5000/userData`, {
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
        this.setState({ userData: data.data })
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