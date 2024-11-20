import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { ReactElement } from "react";
import { useMapContext } from '../context/MapContext';
import useFetchData from "../hooks/useFetchData";
import { Campaign } from "../types";

export const ModalCampaign = ({ idCampaign }: { idCampaign: string }): ReactElement => {
  const { setCurrentCampagne } = useMapContext()
  const { data, loading } = useFetchData<Campaign>(`https://api-plastico-prod.azurewebsites.net/v1/campaign//${idCampaign}`);
  if (loading || !data) {
    return (
      <>
        <div className="modal-backdrop fadein"></div>
        <div className="modal-campaign fadein">
          <div className="modal-header mb-3">
            <h3 className="flex-1">Détails de la campagne</h3>
            <button className="btn-close">X</button>
          </div>
          <div className="flex w-full detail-line">
            <strong className="flex-1">Chargement...</strong>
          </div>
        </div>
      </>
    );
  }
  const convertToDate = (dateString: string): Date => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const formattedDateString = `${year}-${month}-${day}T${timePart}Z`;
    return new Date(formattedDateString);
  };

  data.start_date = convertToDate(String(data.start_date));
  data.end_date = convertToDate(String(data.end_date));

  const duration = (data.end_date.getTime() - data.start_date.getTime()) / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const formattedStartDate = format(data.start_date, 'EEEE dd MMMM yyyy', { locale: fr });
  const formattedStartTime = format(data.start_date, 'HH:mm', { locale: fr });
  const formattedEndTime = format(data.end_date, 'HH:mm', { locale: fr });



  return (
    <>
      <div className="modal-backdrop fadein"></div>
      <div className="modal-campaign fadein">
        <div className="modal-header mb-3">
          <h3 className="flex-1">Détails de la campagne</h3>
          <button className="btn-close" onClick={() => setCurrentCampagne(null!)} >X</button>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Date:</strong>
          <span> {formattedStartDate} </span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Heure de début:</strong>
          <span> {formattedStartTime} </span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Heure de fin:</strong>
          <span> {formattedEndTime}</span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Nombre de signalements:</strong>
          <span></span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Durée:</strong>
          <span>
            {hours}h {minutes}m
          </span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Id de la campagne:</strong>
          <span>
            {data?.id}
          </span>
        </div>
        <div className="flex w-full detail-line">
          <strong className="flex-1">Superficie couverte:</strong>
          <span>
            {data?.distance.toFixed(2)} km
          </span>
        </div>

      </div>

    </>
  )
}