import React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
    background: 'rgba(0, 0, 0, 0.94)',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: 'rgba(0, 0, 0, 0.79)',
    color: 'white',
  },
}))
export default function SignIn() {
  const classes = useStyles()
  const history = useHistory()

  const [loggedInToken, setLoggedInToken] = React.useState(
    localStorage.getItem('loggedInToken') ? localStorage.getItem('loggedInToken') : null,
  )
  const [isError, setIsError] = React.useState('')
  const [userInfo, setUserInfo] = React.useState('')
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  })

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const fetchUserInfo = async token => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }
      // login and get user information
      const userInfoResult = await axios.get('http://localhost:7000/api/profile', config)
      if (userInfoResult.status === 200) {
        setUserInfo(userInfoResult.data)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    const { email, password } = values

    const user = {
      email,
      password,
    }
    try {
      const result = await axios.post('http://localhost:7000/api/login', user)

      if (result.status === 200) {
        setIsError('')
        setLoggedInToken(result.data.data.token)

        // save token to localStorage
        localStorage.setItem('loggedInToken', result.data.data.token)

        //  fetch user information
        await fetchUserInfo(result.data.data.token)

        if (email === 'ladybages@gmail.com' && password === 'ladybages@gmail.com') {
          history.push('/admin')
        } else {
          history.push('/categories')
        }
      }
    } catch (error) {
      console.log('error.response', error.response)
      if (error.response) {
        setIsError(error.response.data.msg)
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Typography component="p" variant="p" color="error">
          {isError}
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} method="post" noValidate>
          <TextField
            value={values.email}
            onChange={handleChange('email')}
            variant="outlined"
            name="email"
            label="email"
            type="email"
            variant="outlined"
            required
            fullWidth
            id="email"
            autoComplete="email"
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is not valid']}
          />
          <TextField
            value={values.password}
            onChange={handleChange('password')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            <Grid item>
              <p id="result"></p>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
