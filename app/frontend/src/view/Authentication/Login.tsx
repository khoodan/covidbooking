import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StyledLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import { useAuthenticationPresenter } from '../../presenter/context/AuthenticationContext';
import { APIStatus } from "../../model/client/APIStatus";

/**
 * Login Component
 * For logging into the account
 * @returns {JSX.Element}
 */
export const Login: React.FC = () => {
  // Form state
  const [userName, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  // User Context
  const { currentUser: user, login: userLogin } = useAuthenticationPresenter();

  /**
   * Handles the login request
   * @param e Form Submit Event
   * @post sets the JWT and redirects to home page
   */
  const login = async (e: React.FormEvent) => {
    e.preventDefault()

    // Set loading
    setLoading(true)
    setMessage('')

    // Send request
    await userLogin?.(userName, password)
      // Catch errors
      .catch((err: any) => {
        if (err.message == APIStatus.UNAUTHORIZED) {
          // Set message for wrong credentials
          setMessage('Invalid credentials')
        }
        else if (err.message === APIStatus.BADREQUEST) {
          setMessage('Please fill the inputs correctly')
        }
        else {
          // Don't know what the error was
          setMessage('Unknown Error')
        }

      })
    setLoading(false)
  }

  // Once the user is loaded, redirect to home
  if (user) return <Navigate replace to="/testsites" />

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={e => setUsername(e.currentTarget.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.currentTarget.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {loading && <span>Loading...</span>}
          {message && <span>{message}</span>}
        </Box>
        <Grid item>
          <StyledLink component={Link} to="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </StyledLink>
        </Grid>
      </Box>
    </Container>
  )
}