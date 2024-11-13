import { Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import UseSearcConfigStore from '@/store/searchConfiguration.store.';

const centerArgentina = { lat: -35.196593198428815, lng: -64.71031145842831 };

type Props = {
    zone?: google.maps.LatLngLiteral[];
    hideControls?: boolean;
    initialCenter?: google.maps.LatLngLiteral;
    branchName: string;
};

const MapRadiusSelection = ({ hideControls = false, initialCenter = centerArgentina, branchName }: Props) => {
    const { setPickUpLocation, pickUpLocation } = UseSearcConfigStore();
    const map = useMap();
    const [radius, setRadius] = useState(pickUpLocation.radius * 1000 || 1000); // Convert to meters for Google Maps API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [center, _] = useState(initialCenter);

    useEffect(() => {
        if (map) {
            let circle: google.maps.Circle | null = null;

            // Function to update zone coordinates based on the circle's bounds
            const updateZoneCoordinates = () => {
                if (circle) {
                    const bounds = circle.getBounds();
                    const circleCenter = circle.getCenter();
                    if (bounds && circleCenter) {
                        // const coordinates: google.maps.LatLngLiteral[] = [];
                        bounds.getNorthEast(); // Add logic to define your zone coordinates
                        setPickUpLocation({
                            ...pickUpLocation,
                            location: {
                                latitude: circleCenter.lat(),
                                longitude: circleCenter.lng(),
                            }
                        });
                    }
                }
            };

            // Create a circle overlay
            circle = new google.maps.Circle({
                map,
                center,
                radius,
                editable: false,
                draggable: false,
                fillColor: "#12b148",
                fillOpacity: 0.40,
                strokeColor: '#12b148',
                strokeOpacity: 1,
                strokeWeight: 3,
            });

            // Fit map bounds to circle
            map.fitBounds(circle.getBounds()!);

            // Update zone coordinates initially and on radius change
            updateZoneCoordinates();

            // Add event listeners for radius or center changes
            google.maps.event.addListener(circle, 'radius_changed', updateZoneCoordinates);
            google.maps.event.addListener(circle, 'center_changed', updateZoneCoordinates);

            return () => {
                google.maps.event.clearInstanceListeners(circle);
                circle.setMap(null);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, radius, center, setPickUpLocation, hideControls]);

    // Update radius state based on slider input
    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRadius = Math.ceil(parseInt(e.target.value) * 1000); // Convert km to meters
        setPickUpLocation({
            ...pickUpLocation,
            radius: Math.ceil(parseInt(e.target.value)),
        });
        setRadius(newRadius);
    };

    return (
        <>
            <Map
                className='w-full h-full m-0 p-0'
                defaultZoom={3}
                defaultCenter={centerArgentina}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
            {hideControls === false && (
                <>
                    <Marker position={center} />
                    <div className='absolute top-20 left-5 text-nowrap rounded-sm bg-white/85 border-secondary-background/50 shadow-lg border p-4 w-fit text-secondary-background'>Sucursal: {branchName}</div>
                    <div className="absolute bottom-[3%] left-1/2 transform -translate-x-1/2 bg-white/80 py-5 rounded shadow-lg z-10 w-fit flex items-center ">
                        <div className='w-full flex flex-col gap-3'>
                            <label className="block text-nowrap text-center w-full px-10">Seleccione el Radio en Kilometros</label>
                            <div className="flex items-center gap-2 w-full pl-[5%] pr-[5%]">
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={radius / 1000}
                                    onChange={handleRadiusChange}
                                    className="w-full"
                                />
                                <span className='text-nowrap'>{radius / 1000} km</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MapRadiusSelection;
