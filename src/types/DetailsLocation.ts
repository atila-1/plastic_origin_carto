export interface DetailsLocation {
    name: string;
    name_preferred: string;
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    place_formatted: string;
    context: LocationContext;
    coordinates: Coordinates;
    bbox: [number, number, number, number];
    language: string;
}

export interface LocationContext {
    country: Country;
    region: Region;
    place: Place;
}

export interface Country {
    id: string;
    name: string;
    country_code: string;
    country_code_alpha_3: string;
}

export interface Place {
    id: string;
    name: string;
}

export interface Region {
    id: string;
    name: string;
    region_code: string;
    region_code_full: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}