import { useMemo } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useAuthenticationPresenter } from "../presenter/context/AuthenticationContext"
import { UserType } from "../model/user/UserType"

/**
 * ProtectedRouteProps
 * Defines the props for the ProtectedRoute
 */
type ProtectedRouteProps = {
  /**
   * The types of users which are allowed into that route
   */
  allowedUserTypes: Set<UserType>
}

/**
 * Protects the components underneath if the user is not logged in
 * @param children of JSX.Elements that are protected
 * @param allowedUserTypes types that are allowed in (user having one of the types is enough for this route)
 * @returns {JSX.Element} protected route
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
  // Get user
  const { currentUser: user } = useAuthenticationPresenter()
  const testSiteNavigate = useMemo(() => <Navigate to="/testsites" replace />, [])

  // Check whether the user has the correct permissions
  const hasPermission: boolean = useMemo(() => {
    if (!user) return false
    for (const type of Array.from(allowedUserTypes)) {
      // Has permission
      if (user.hasType(type)) {
        return true
      }
    }
    return false
  }, [user])

  // Check whether logged in
  if (!user) return testSiteNavigate
  if (!hasPermission) return testSiteNavigate
  return <>{children}</>;
}

/**
 * Protects the components underneath if the user is not logged in
 * Allows user in if the user in the path is the same as the user given
 * @param children of JSX.Elements that are protected
 * @param allowedUserTypes types that are allowed in (user having one of the types is enough for this route)
 * @returns {JSX.Element} protected route
 */
export const PatientProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
  const { currentUser } = useAuthenticationPresenter()
  const testSiteNavigate = useMemo(() => <Navigate to="/testsites" replace />, [])
  // Get username from params
  const { userName } = useParams()
  // Check user in path is the same as the user given
  const userSame: boolean = useMemo(() => userName === currentUser?.getUsername(), [currentUser])

  if (!currentUser) return testSiteNavigate
  if (!userSame) return (
    <ProtectedRoute allowedUserTypes={allowedUserTypes}>
      { children }
    </ProtectedRoute>
  )
  return <>{ children }</>
}