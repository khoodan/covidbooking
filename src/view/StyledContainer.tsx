import { Breakpoint, Container, Paper } from "@mui/material";

/**
 * Styled container
 * @param maxWidth max width allowed
 * @returns {JSX.Element}
 */
export const StyledContainer: React.FC<{ maxWidth?: Breakpoint, margin?: string, padding?: string }> = ({ children, maxWidth, margin, padding }) => (
  <Container component={Paper} maxWidth={maxWidth} sx={{ margin: margin || '2rem auto 1rem' , padding: padding || '2rem' }}>
    {children}
  </Container>
)