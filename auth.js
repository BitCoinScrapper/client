window.fbAsyncInit = function () {
  FB.init({
    appId: '1559530880816171',
    cookie: true,
    xfbml: true,
    version: 'v3.2'
  });

  FB.AppEvents.logPageView();

};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

const toggleLogin = () => {
  if (localStorage.token) {
    $('#signupButton').hide()
    $('#loginButton').hide()
    $('#logoutButton').show()
    $('#loginModal').modal('hide')
    $('#signupModal').modal('hide')
  } else {
    $('#signupButton').show()
    $('#loginButton').show()
    $('#logoutButton').hide()
  }
}

const checkFBLoginState = () => {
  FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
      $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/fSignIn',
        headers: {
          ftoken: response.authResponse.accessToken,
          userID: response.authResponse.userID
        }
      })
        .done(token => {
          localStorage.setItem('token', token)
          toggleLogin()
        })
        .fail((xhr, status, errorThrown) => {
          console.error(errorThrown)
        })
    } else {
      localStorage.removeItem('token')
      toggleLogin()
    }
  });
}

$(document).ready(toggleLogin)

$(document).ready($('#logoutButton').on('click', event => {
  localStorage.removeItem('token')
  toggleLogin()
  FB.logout(response => { })
}))

$('#loginForm').on('submit', event => {
  event.preventDefault()
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/login',
    data: {
      identity: $('#inputEmail').val(),
      password: $('#inputPassword').val()
    }
  })
    .done(token => {
      localStorage.setItem('token', token)
      toggleLogin()
    })
    .fail((xhr, status, errorThrown) => {
      console.error(errorThrown)
    })
})

$('#signupForm').on('submit', event => {
  event.preventDefault()
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/signup',
    data: {
      username: $('#registerUsername').val(),
      email: $('#registerEmail').val(),
      password: $('#registerPassword').val()
    }
  })
    .done(response => {
      console.log(response)
      $('#signupModal').modal('hide')
    })
    .fail((xhr, status, errorThrown) => {
      $('#signupModal').modal('hide')
      console.error(errorThrown)
    })
})

