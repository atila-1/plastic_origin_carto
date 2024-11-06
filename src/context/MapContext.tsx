import { createContext, ReactNode, useContext, useState } from 'react';

type Coordinates = { lat: number; lng: number };

interface MapContextProps {
	bounds: [number, number, number, number] | null;
	setBounds: (bounds: [number, number, number, number]) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);
export const MapProvider = ({ children }: { children: ReactNode }) => {
	const [bounds, setBounds] = useState<[number, number, number, number] | null>([-1.5, 40.0, 1.2, 50.0]);
	return (
		<MapContext.Provider value={{ bounds, setBounds }}>
			{children}
		</MapContext.Provider>
	);
};

export const useMapContext = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error('useMapContext debe usarse dentro de MapProvider');
	}
	return context;
};