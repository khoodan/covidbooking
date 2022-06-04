import { Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { TestSite } from "../../model/location/TestSite"
import { TestSiteType } from "../../model/location/TestSiteType"
import { WalkDriveFacility } from "../../model/location/WalkDriveFacility"
import { useTestSitePresenter } from "../../presenter/context/TestSitePresenterContext"
import { StyledContainer } from "../StyledContainer"

type SearchTestSiteType = {
  setTestSites(sites: TestSite[]): void
}

/**
 * Component which deals with searching for test sites
 */
export const SearchTestSites: React.FC<SearchTestSiteType> = ({ setTestSites }) => {
  const containerStyles = useMemo(() => ({
    display: 'flex',
    maxWidth: '50rem',
    flexFlow: 'column wrap',
    alignItems: 'center',
    gap: '1rem',
    margin: 'auto'
  }), [])

  const switchContainer = useMemo(() => ({
    display: 'flex',
    gap: '1rem'
  }), [])

  /**
   * Form State
   */
  const [suburb, setSuburb] = useState<string>('')
  const [driveThrough, setDriveThrough] = useState<boolean>()
  const [walkIn, setWalkIn] = useState<boolean>()
  const [clinic, setClinic] = useState<boolean>()
  const [GP, setGP] = useState<boolean>()
  const [hospital, setHospital] = useState<boolean>()

  const { testSites: testSiteCollection } = useTestSitePresenter()

  /**
   * Searches for test sites
   * @param e form submit event
   * @post sets test sites found from query
   */
  const searchSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // Create sets
    const walkDriveFacility: Set<WalkDriveFacility> = new Set()
    if (driveThrough) walkDriveFacility.add(WalkDriveFacility.DRIVE)
    if (walkIn) walkDriveFacility.add(WalkDriveFacility.WALK)

    const testSiteType: Set<TestSiteType> = new Set()
    if (clinic) testSiteType.add(TestSiteType.CLINIC)
    if (GP) testSiteType.add(TestSiteType.GP)
    if (hospital) testSiteType.add(TestSiteType.HOSPITAL)

    // Make search
    testSiteCollection?.searchTestSites(suburb as string, walkDriveFacility, testSiteType)
      // Set sites if successful
      .then(sites => setTestSites(sites))
      // Else check for errors
      .catch(error => {
        setTestSites([])
      })
  }

  /**
   * Create form
   */
  return (
    <StyledContainer maxWidth="lg">
      <form style={containerStyles} onSubmit={searchSubmit}>
        <Typography component="h1" variant="h5">
          Test Site Search
        </Typography>
        <TextField
          fullWidth
          id="searchInput"
          label="Suburb"
          name="searchInput"
          autoComplete="searchInput"
          onChange={e => setSuburb(e.currentTarget.value)}
        />
        <div style={switchContainer}>
          <FormControlLabel control={<Switch value={driveThrough} onChange={() => setDriveThrough(!driveThrough)} />} label="Drive Through" />
          <FormControlLabel control={<Switch value={walkIn} onChange={() => setWalkIn(!walkIn)} />} label="Walk-In" />
        </div>
        <div style={switchContainer}>
          <FormControlLabel control={<Switch value={clinic} onChange={() => setClinic(!clinic)} />} label="Clinic" />
          <FormControlLabel control={<Switch value={GP} onChange={() => setGP(!GP)} />} label="GP" />
          <FormControlLabel control={<Switch value={hospital} onChange={() => setHospital(!hospital)} />} label="Hospital" />
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: '200px' }}
        >
          Search
        </Button>
      </form>
    </StyledContainer>
  )

}