import { Button } from '@mui/material';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import React, { useMemo, useState } from 'react';
import { TestSite } from '../../model/location/TestSite';

type Location = {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '1000px'
};

/**
 * Map of test sites
 * Uses Google API
 * @returns {JSX.Element} map of test sites
 */
export const TestSiteMap: React.FC<{ sites?: TestSite[] }> = ({ sites }) => {
  const monashUniversityLocation: Location = { lat: -37.910522, lng: 145.136215 }
  const [currentLocation, setCurrentLocation] = useState<Location>()
  const [currentLocationLoading, setCurrentLocationLoading] = useState<boolean>(false)
  const [center, setCenter] = useState<Location>(monashUniversityLocation)
  const [map, setMap] = useState<google.maps.Map>()

  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: Google.key
  // })

  const getCurrentLocation = () => {
    setCurrentLocation(undefined)
    setCurrentLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const cLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // Set currentLocation for marker
        setCurrentLocation(cLoc)
        // Set center to center screen
        setCenter(cLoc)
        setCurrentLocationLoading(false)
      },
        (positionError: GeolocationPositionError) => {
          console.error(positionError)
          setCurrentLocationLoading(false)
        })
    }
  }

  const onLoad = () => setMap(map)

  /**
   * Get markers for test sites
   */
  const siteMarkers = useMemo(() => {
    if (!sites) return
    return sites.map((site, i) => {
      const location: Location = site.getAddress().getLatLng()
      return (
        <InfoWindow key={i} position={location} onLoad={onLoad}>
          <span>
            {site.getName()}
          </span>
        </InfoWindow>
      )
    })
  }, [sites])


  return (
    <div style={{ marginTop: '1rem' }}>
      {currentLocationLoading ? <span>Loading</span> : <Button variant="outlined" onClick={getCurrentLocation}>Current Location</Button>}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
      >
        {siteMarkers}
        {currentLocation &&
          <InfoWindow position={currentLocation}>
            <span>
              Current Location
            </span>
          </InfoWindow>
        }
      </GoogleMap>
    </div>
  )
}


