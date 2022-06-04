import { useEffect, useState } from "react";
import { TestSite } from "../../model/location/TestSite";
import { useTestSitePresenter } from "../../presenter/context/TestSitePresenterContext";
import { TestSiteMap } from "./Map";
import { SearchTestSites } from "./SearchTestSites";
import { TestSiteDisplay } from "./TestSiteDisplay";

/**
 * TestSiteComponent
 * Provides functionality to search and view test sites
 * @returns 
 */
const TestSiteComponent = () => {
  const { testSites: testSiteCollection } = useTestSitePresenter()

  const [testSites, setTestSites] = useState<TestSite[]>();

  // At start, get all test sites to display
  useEffect(() => {
    if (testSiteCollection) {
      setTestSites(testSiteCollection?.getTestSites())
    }
  }, [testSiteCollection])

  return (
    <>
      <SearchTestSites setTestSites={setTestSites} />
      <TestSiteDisplay testSites={testSites} />
      <TestSiteMap sites={testSites} />
    </>
  )
}


export { TestSiteComponent };
