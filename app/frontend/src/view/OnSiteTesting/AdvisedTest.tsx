import { Box, Typography } from "@mui/material";
import { TestType } from "../../model/test/TestType";
import { StyledContainer } from "../StyledContainer";

/**
 * Props required for display the appropriate test for a patient
 */
type AdvisedTestProps = {
  /**
   * The appropriate test for a patient 
   */
  advisedTest?: TestType | 'NONE';
}

/**
 * AdvisedTestComponent
 * Displays information on the advised test for a patient
 * @returns 
 */
const AdvisedTest: React.FC<AdvisedTestProps> = ({ advisedTest }) => {
  return (
    <>
      <StyledContainer maxWidth='lg' margin='0 auto'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography gutterBottom>Advised Test</Typography>
          <Typography variant="h5" gutterBottom>
            {advisedTest}
          </Typography>
        </Box>
      </StyledContainer>
    </>
  )
}

export { AdvisedTest };
