import { ArrowsOut, Compass, Minus, Plus } from "@phosphor-icons/react";

const MapToolbar = () => {
    return (
        <>
            <div className="map-toolbar">
                {/* Full screen button */}
                <div className="map-toolbar-actions">
                    <button className="map-toolbar-button">
                        <ArrowsOut size={28} />
                    </button>
                </div>
                <div className="map-toolbar-actions">
                    <button className="map-toolbar-button">
                        <Plus size={28} />
                    </button>
                    <button className="map-toolbar-button">
                        <Minus size={28} />
                    </button>
                    <button className="map-toolbar-button">
                        <Compass size={28} />
                    </button>
                </div>
            </div>

        </>
    );
}

export default MapToolbar;