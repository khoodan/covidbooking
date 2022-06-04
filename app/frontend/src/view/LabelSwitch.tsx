import { Typography, Switch } from "@mui/material"
import { useMemo } from "react"

/**
 * Props for the LabelSwitch
 */
type LabelSwitchProps = {
  label: string
  switchy: boolean
  setSwitch: (bool: boolean) => void
}

/**
 * LabelSwitch component
 * Gives a label and a switch
 */
export const LabelSwitch: React.FC<LabelSwitchProps> = ({ label, switchy, setSwitch }) => {
  const switchContainer = useMemo(() => ({
    display: 'flex',
    width: '100%',
    alignItems: 'center'
  }), [])

  return (
    <div style={switchContainer}>
      <Typography component="p" variant="body1">
        {label}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <Switch value={switchy} onChange={() => setSwitch(!switchy)} />
    </div>
  )
}