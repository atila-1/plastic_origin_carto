import { ArrowsHorizontal, MapPin } from "@phosphor-icons/react";
import { ReactElement } from "react";
import { useMapContext } from "../context/MapContext";
import useFetchData from "../hooks/useFetchData";
import { Campaign } from "../types";



export const CampagneDetails = ({ idCampaign }: { idCampaign: string }): ReactElement => {
  const { setCurrentCampagne, getTrashByCampagne } = useMapContext()
  const { data, loading } = useFetchData<Campaign>(`${import.meta.env.VITE_PLASTIC_API}/campaign/${idCampaign}`);
  if (loading) return <div className="flex justify-content-between mb-3 align-items-center" >Chargement...</div>
  console.log(data)
  return (
    <>
      <div className="flex justify-content-between mb-3 align-items-center">
        <strong>Campagne N</strong>
        <a className="detail-btn" href="#" onClick={() => {
          setCurrentCampagne(data)
        }}>
          Détails
        </a>
      </div>
      <div className="flex justify-content-between mb-3 px-2">
        <span className="flex align-items-center gap-2 text-sm">
          <ArrowsHorizontal size={18} weight="fill" />
          Rive {data.riverside === "right" ? "droite" : "gauche"}
        </span>
        <span>
          <MapPin size={18} weight="fill" />
        </span>
      </div>
    </>
  )
}