import { Typography } from "@mui/material"
import { useMemo, useState, useEffect } from "react"
import { StyledContainer } from "../StyledContainer"
import { LabelSwitch } from "../LabelSwitch"
import { TestType } from "../../model/test/TestType"

/**
 * Props required for form to enter patient condition & symptoms
 */
type SymptomsFormProps = {
  /**
   * Set the test type to be undertaken
   */
  setTestType(testType: TestType | 'NONE'): void
}

/**
 * SymptomsForm Component
 * Form to collect information on patients' condition
 * @returns {JSX.Element}
 */
export const SymptomsForm: React.FC<SymptomsFormProps> = ({ setTestType }) => {
  const containerStyles = useMemo(() => ({
    display: 'flex',
    maxWidth: '50rem',
    flexFlow: 'column wrap',
    alignItems: 'center',
    gap: '1rem',
    margin: 'auto'
  }), [])

  /**
   * State for form
   */
  const [hasSevereSymptoms, setHasSevereSymptoms] = useState<boolean>(false)
  const [isCloseContact, setIsCloseContact] = useState<boolean>(false)
  const [wantsConfirmation, setWantsConfirmation] = useState<boolean>(false)

  // Get test recommendation
  useEffect(() => {
    generateRecommendation()
  }, [hasSevereSymptoms, isCloseContact, wantsConfirmation])

  /**
   * Generates a recommendation of what test to take (RAT, PCR, NONE)
   */
  const generateRecommendation = () => {
    // If severe: PCR
    if (hasSevereSymptoms) {
      setTestType(TestType.PCR);
      // Create Booking for PCR
    }
    else if (isCloseContact || wantsConfirmation) {
      // isCloseContact or wantsConfirmation: RAT
      setTestType(TestType.RAT);
    }
    else {
      setTestType('NONE')
    }
  }

  return (
    <>
      <StyledContainer margin="0 auto">
        <form style={containerStyles}>
          <Typography variant="h5">
            Patient Symptoms
          </Typography>
          <LabelSwitch label="Does the patient have severe symptoms?" switchy={hasSevereSymptoms} setSwitch={setHasSevereSymptoms} />
          <LabelSwitch label="Was the patient a close contact?" switchy={isCloseContact} setSwitch={setIsCloseContact} />
          {!hasSevereSymptoms && !isCloseContact && <LabelSwitch label="Does the patient want COVID confirmation anyway?" switchy={wantsConfirmation} setSwitch={setWantsConfirmation} />}
        </form>
      </StyledContainer>
    </>
  )
}