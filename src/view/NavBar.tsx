import { AppBar, Box, Button, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthenticationPresenter } from "../presenter/context/AuthenticationContext";
import { UserType } from "../model/user/UserType";

type Route = {
  display: string,
  pathname: string
}

/**
 * Navigation Bar
 * @returns {JSX.Element}
 */
const NavBar = () => {
  const navigate = useNavigate()
  const authContext = useAuthenticationPresenter()
  const location = useLocation()

  // Get current user
  const user = useMemo(() => authContext.currentUser, [authContext.currentUser])

  // Create routes for navigation use
  const routes: Route[] = useMemo(() => {
    const r: Route[] = [{ display: 'TestSites', pathname: '/testsites' }]

    // Check for on site testing capability
    if (user?.hasType(UserType.HEALTHCAREWORKER) || user?.hasType(UserType.RECEPTIONIST)) {
      r.push({ pathname: '/patients', display: 'Patients' })
      r.push({ pathname: '/notifications', display: 'Notifications' })
    }

    if (user?.hasType(UserType.HEALTHCAREWORKER)) {
      r.push({ pathname: '/onsite-testing', display: 'Onsite-Testing' })
    }

    if (user?.hasType(UserType.CUSTOMER)) {
      r.push({ pathname: `patients/${user.getUsername()}`, display: 'Bookings'})
    }

    return r
  }, [user])

  // Generate components for the links
  const routeComponents = useMemo(() => {
    return routes.map((route, i) => {
      const isSelected = route.pathname === location.pathname

      /**
       * Navigates to the route given if it is not selected
       */
      const routeNavigate = () => {
        // Navigate if not current page
        if (!isSelected) navigate(route.pathname)
      }

      // Links to other parts of the site
      return (
        <MenuItem key={i} onClick={() => routeNavigate()}>
          <Typography textAlign="center">{route.display}</Typography>
        </MenuItem>
      )
    })
  }, [routes, location])

  /**
   * Create the navigation bar
   */
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: '5px' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Booking System
          </Typography>
          {routeComponents}
          <div style={{ flexGrow: 1 }} />
          {
            user ?
              <>
                <Typography variant="subtitle1" component="div">
                  {user.display()}
                </Typography>
                <Button color="inherit" onClick={authContext?.logout}>Logout</Button>
              </>
              :
              <>
                <div style={{ flexGrow: 1 }} />
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export const LayoutNavBar: React.VFC = () => (
  <>
    <NavBar />
    <Outlet />
  </>
)