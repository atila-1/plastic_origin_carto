import { ArrowsHorizontal, MapPin } from "@phosphor-icons/react";
import { ReactElement } from "react";
import { useMapContext } from "../context/MapContext";
import useFetchData from "../hooks/useFetchData";
import { Campaign } from "../types";



export const CampagneDetails = ({ idCampaign }: { idCampaign: string }): ReactElement => {
  const { setCurrentCampagne, getTrashByCampagne } = useMapContext()
  const { data, loading } = useFetchData<Campaign>(`${import.meta.env.VITE_PLASTIC_API}/campaign/${idCampaign}`);
  return (
    <>
      <div className="flex justify-content-between mb-3 align-items-center">
        <strong>Campagne N</strong>
        <a href="#" onClick={() => {
          setCurrentCampagne(data)
        }}>
          Détails
        </a>
      </div>
      <div className="flex justify-content-between mb-3">
        <span>
          <ArrowsHorizontal size={22} weight="fill" />
        </span>
        <span>
          <MapPin size={22} weight="fill" />
        </span>
      </div>
    </>
  )
}