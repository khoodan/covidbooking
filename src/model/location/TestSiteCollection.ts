import { APIStatus } from "../client/APIStatus";
import { Address } from "./Address";
import { TestSite } from "./TestSite";
import { TestSiteType } from "./TestSiteType";
import { WalkDriveFacility } from "./WalkDriveFacility";

/**
 * TestSiteCollection
 * Contains test sites and methods to search/retrieve/filter test sites
 */
class TestSiteCollection {
    /**
     * Storage of test sites
     */
    private testSites: TestSite[]

    /**
     * Initialises test sites
     */
    constructor(testSites: TestSite[]) {
        this.testSites = testSites
    }

    /**
     * Gets test sites 
     * @returns {TestSite[]} list of testsites
     */
    getTestSites(): TestSite[] {
        return this.testSites;
    }

    /**
     * Computes the distance between two locations specified by a longitude and latitude value.
     * Reference: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
     * @param {number} lat1 latitude of the first location
     * @param {number} lon1 longitude of the first location
     * @param {number} lat2 latitude of the second location
     * @param {number} lon2 longitude of the second location
     * @return {number} the distance between two points
     */
    private getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    /**
     * Retrieves test sites within some radius of a given location.
     * @param {Address} location location to find nearby testing sites
     * @param {number} radius radius range to find testing sites in
     * @return {TestSite[]} an array of nearby test sites
     */
    async getNearbyTestSites(location: Address, radius: number): Promise<TestSite[]> {
        // Get test sites if we do not have them yet
        let nearbyTestSites: TestSite[] = []
        this.testSites.forEach(testSite => {
            // If same suburb, add
            if (location.getSuburb().toLowerCase() === testSite.getAddress().getSuburb().toLowerCase()) {
                nearbyTestSites.push(testSite);
                return;
            }

            // Get the distance between test site and location
            let distance = this.getDistance(location.lat, location.lon, testSite.getAddress().lat, testSite.getAddress().lon)
            // Check that test site is within the radius of (user's) location
            if (distance <= radius) {
                nearbyTestSites.push(testSite)
            }
        });
        return nearbyTestSites;
    }

    /**
     * Gets a test site by ID
     * @returns {TestSite} promise to return a TestSite
     */
    async getTestSiteById(id: string): Promise<TestSite> {
        // Find site
        const sites = this.testSites.filter(site => site.getId() === id);

        // Throw error if not found
        if (!sites.length) throw new Error(APIStatus.NOTFOUND)
        return sites[0]
    }

    /**
     * Searches for Test Sites around the suburb if suburb is given
     * If a site has any of the facility/type given, it will be returned in the search
     * @param suburb search suburb
     * @param walkDriveFacilities facility to walk and/or drive
     * @param testSitesTypes type of facility
     * @return {Promise<TestSite[]>} test sites found
     */
    async searchTestSites(suburb: string, walkDriveFacilities: Set<WalkDriveFacility>, testSitesTypes: Set<TestSiteType>): Promise<TestSite[]> {
        // Get test sites
        let testSites: TestSite[];

        // Check if a suburb was given
        if (suburb.length) {
            // Get nearby
            const address: Address = new Address()
            address.setSuburb(suburb)
            await address.setLatLng()
            testSites = await this.getNearbyTestSites(address, 10)
        } else {
            // Otherwise get all
            testSites = this.testSites
        }

        // If no facilities and types, just return all
        if (!walkDriveFacilities.size && !testSitesTypes.size) return testSites;

        // Check for facilities and types
        return testSites.filter(site => {
            // Check facilities
            for (const facility of Array.from(walkDriveFacilities)) {
                if (site.hasFacility(facility)) {
                    return true;
                }
            }

            // Check type
            for (const type of Array.from(testSitesTypes)) {
                if (site.hasType(type)) {
                    return true;
                }
            }
        })
    }
}

export { TestSiteCollection };
