import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import StyledLink from '@mui/material/Link';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { APIStatus } from '../../model/client/APIStatus';
import { useAuthenticationPresenter } from '../../presenter/context/AuthenticationContext';

/**
 * Register Component
 * Allows a person to register their account
 * @returns {JSX.Element}
 */
export const Register: React.FC = () => {
  /**
   * Form state
   */
  const [givenName, setGivenName] = useState<string>('')
  const [familyName, setFamilyName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isCustomer, setIsCustomer] = useState<boolean>(false)
  const [isReceptionist, setIsReceptionist] = useState<boolean>(false)
  const [isHealthcareWorker, setIsHealthcareWorker] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  // Authentication context
  const { register: registerUser } = useAuthenticationPresenter();
  const navigate = useNavigate();

  /**
   * Flex styles
   */
  const flexContainer = {
    display: 'flex',
    justifyContent: 'center'
  }

  /**
   * Sends a registration request to the API
   * @param e {React.FormEvent} event when form is submitted
   */
  const register = (e: React.FormEvent) => {
    setMessage('Loading...')
    e.preventDefault()
    registerUser?.({
      givenName,
      familyName,
      userName,
      password,
      phoneNumber,
      isCustomer,
      isReceptionist,
      isHealthcareWorker,
      additionalInfo: undefined
    })
      .then(_ => {
        // Show message
        setMessage('Success!')
        // Redirect to login
        setTimeout(navigate, 1000, '/login')
      })
      // Catch error
      .catch(err => {
        if (err.message === APIStatus.BADREQUEST) {
          setMessage("Please select at least one role")
          return
        }
        setMessage(err.message)
      })
  }
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={register} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e => setGivenName(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={e => setFamilyName(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                onChange={e => setPhoneNumber(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={e => setUserName(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={e => setPassword(e.currentTarget.value)}
              />
            </Grid>
          </Grid>
          <div style={flexContainer}>
            <FormControlLabel control={<Switch value={isCustomer} onChange={e => setIsCustomer(!isCustomer)} />} label="Customer" />
            <FormControlLabel control={<Switch value={isReceptionist} onChange={e => setIsReceptionist(!isReceptionist)} />} label="Receptionist" />
          </div>
          <div style={flexContainer}>
            <FormControlLabel control={<Switch value={isHealthcareWorker} onChange={e => setIsHealthcareWorker(!isHealthcareWorker)} />} label="Healthcare Worker" />
          </div>
          {message}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <StyledLink component={Link} to="/login" variant="body2">
                Already have an account? Sign in
              </StyledLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}