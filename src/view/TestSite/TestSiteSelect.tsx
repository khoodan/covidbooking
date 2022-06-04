import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { useEffect, useMemo, useState } from "react";
import { TestSite } from "../../model/location/TestSite";
import { useTestSitePresenter } from "../../presenter/context/TestSitePresenterContext";

/**
 * Provides a selector for a TestSite
 * @returns { JSX.Element }
 */
export const TestSiteSelect: React.FC<{
  setTestSite: (site: TestSite | undefined) => void,
  selectedIndex?: number
}> = ({ setTestSite, selectedIndex }) => {
  const { testSites: testSiteCollection } = useTestSitePresenter()
  const [testSites, setTestSites] = useState<TestSite[]>();
  const [selectedTestSiteIndex, setSelectedTestSiteIndex] = useState<number>();

  useEffect(() => {
    // Get all test sites
    if (testSiteCollection) {
      setTestSites(testSiteCollection?.getTestSites())
    }
  }, [testSiteCollection])

  useEffect(() => {
    // Select index
    if (!selectedIndex) return
    setSelectedTestSiteIndex(selectedIndex)
  }, [selectedIndex])

  /**
   * Handles Test Site Handle Change Event
   * @param e change event
   * @post sets the test site
   */
  const testSiteChange = (e: any) => {
    const testSiteIndex = e.target.value as number;
    // Get testsite based on id
    setTestSite(testSites?.[testSiteIndex - 1])
    setSelectedTestSiteIndex(testSiteIndex)
  }

  // Set test site options
  const options = useMemo(() => testSites && testSites.map((site, i) => <MenuItem key={i} value={i + 1}>{site.summary}</MenuItem>), [testSites])

  if (!testSites) return <div>Loading...</div>

  return (
    <FormControl fullWidth>
      <InputLabel>Test Site</InputLabel>
      <Select name="selectTestSite" id="selectTestSite"
        required
        value={selectedTestSiteIndex || ''}
        onChange={testSiteChange}
        label="Test Site"
      >
        {options}
      </Select>
    </FormControl>
  )
}