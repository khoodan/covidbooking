import { Button, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { useEffect, useState } from "react";
import { Booking } from "../../model/booking/Booking";
import { ResultType } from "../../model/test/result/ResultType";
import { TestType } from "../../model/test/TestType";
import { User } from "../../model/user/User";
import { useAuthenticationPresenter } from "../../presenter/context/AuthenticationContext";
import { useRecordPresenter } from "../../presenter/context/RecordPresenterContext";
import { StyledContainer } from "../StyledContainer";
import { AdvisedTest } from "./AdvisedTest";
import { SelectBooking } from "./SelectBooking";
import { SelectPatient } from "./SelectPatient";
import { SymptomsForm } from "./SymptomsForm";

/**
 * OnSiteTesting Component
 * Handles the OnSite Testing Functionality
 * @returns {JSX.Element}
 */
export const OnSiteTesting: React.FC = () => {
  const { createTest } = useRecordPresenter()
  const { currentUser } = useAuthenticationPresenter()
  /**
   * Form state
   */
  const [patient, setPatient] = useState<User>()
  const [booking, setBooking] = useState<Booking>()
  const [testType, setTestType] = useState<TestType | 'NONE'>()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'UNSAVED' | 'SAVING' | 'SAVED' | 'ERROR'>('UNSAVED')

  const steps = ['Patient', 'Booking', 'Select Test'];

  /**
   * Chooses the component to return based on the form progression
   * @param step 
   * @returns 
   */
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <SelectPatient setPatient={setPatient} />;
      case 1:
        return <SelectBooking patient={patient} setBooking={setBooking} />
      case 2:
        return <SymptomsForm setTestType={setTestType} />;
      case 3:
        return <AdvisedTest advisedTest={testType} />;
      default:
        throw new Error('Unknown step');
    }
  }

  /**
   * Saves Test to API
   */
  const saveTest = async () => {
    if (testType === 'NONE') {
      setMessage('No test to set')
      return
    }
    if (saveStatus === 'SAVING') {
      return
    }
    setSaveStatus('SAVING')
    // Create test and post
    createTest({
      id: '',
      type: testType as TestType,
      patient: { id: patient?.getId() as string },
      administerer: { id: currentUser?.getId() as string },
      booking: { id: booking?.getId() as string },
      result: ResultType.INITIATED,
      notes: ' ',
      status: ' ',
      datePerformed: '',
      dateOfResults: '',
      createdAt: '',
      updatedAt: ''
    })
      .then(_ => setSaveStatus('SAVED'))
      .catch(err => {
        console.log(err)
        setSaveStatus('ERROR')
      })
  }

  useEffect(() => {
    if (patient || booking) {
      // Scroll to bottom on select
      const scrollingElement = (document.scrollingElement || document.body);
      scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }
  }, [patient, booking])

  /**
   * Go to next page
   */
  const handleNext = () => {
    setMessage('')
    // If no user selected, do not allow going
    if (!patient) {
      setMessage("Please select a user")
      return
    }
    if (activeStep == 1 && !booking) {
      setMessage("Please select a booking")
      return
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <StyledContainer maxWidth='lg'>
        <Typography component="h1" variant="h5" align="center">
          On-Site Testing
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </StyledContainer>
      {getStepContent(activeStep)}
      {activeStep === steps.length ? (
        <StyledContainer maxWidth='lg' margin="1rem auto">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Typography variant="h6">
              {patient?.display()}
            </Typography> :
            {
              saveStatus === 'SAVED' ?
                <Typography variant="h6">
                  Testing Saved!
                </Typography> :
                <Button onClick={saveTest} variant="contained" disabled={saveStatus === 'SAVING'}>{saveStatus === 'SAVING' ? 'Saving...' : 'Save Testing'}</Button>
            }
            {saveStatus === 'ERROR' && <div style={{ marginTop: '8px' }}>There was an error saving the test. Please try again</div>}
          </Box>
        </StyledContainer>) : (

        <StyledContainer margin="1rem auto" padding="1rem">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Make Booking' : 'Next'}
            </Button>
          </Box>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>{message}</div>
        </StyledContainer>
      )}
    </>
  )
}