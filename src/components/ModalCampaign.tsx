import { X } from "@phosphor-icons/react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import React, { ReactElement } from "react";
import { useMapContext } from '../context/MapContext';
import useFetchData from "../hooks/useFetchData";
import { Campaign } from "../types";

export const ModalCampaign = ({ idCampaign }: { idCampaign: string }): ReactElement => {
  const { setCurrentCampagne, getTrashByCampagne } = useMapContext()
  const { data, loading } = useFetchData<Campaign>(`${import.meta.env.VITE_PLASTIC_API}/campaign/${idCampaign}`);
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

  const renderLigne = (label: string, value: string | number): ReactElement => {
    return (
      <div className="flex w-full detail-line">
        <label className="flex-1">{label}:</label>
        <span> {value} </span>
      </div>
    )
  }

  const trashList = getTrashByCampagne(idCampaign);
  const trashByType = trashList!.reduce((acc, trash) => {
    if (!acc[trash.type_name]) {
      acc[trash.type_name] = 0;
    }
    acc[trash.type_name]++;
    return acc;
  }, {} as { [key: string]: number });
  return (
    <>
      <div className="modal-backdrop fadein"></div>
      <div className="modal-campaign fadein">
        <div className="modal-header mb-4">
          <h3 className="flex-1">Détails de la campagne</h3>
          <span className="btn-close cursor-pointer" onClick={() => setCurrentCampagne(null!)}>
            <X size={24} />
          </span>
        </div>
        {renderLigne('Date', formattedStartDate)}
        {renderLigne('Heure de début', formattedStartTime)}
        {renderLigne('Heure de fin', formattedEndTime)}
        <div className="flex w-full detail-line">
          <strong className="flex-1">Nombre de signalements:</strong>
          <div className="flex align-items-center">
            {trashList?.length} ({
              Object.keys(trashByType).map((key, index) =>
                <React.Fragment key={key}>
                  {index > 0 && <span className="mx-1">/</span>}
                  <span className="flex gap-1 align-items-center">
                    {trashByType[key]} <span className={`trash-type ${key}`}></span>
                  </span>
                </React.Fragment>
              )
            })
          </div>
        </div>
        {renderLigne('Durée', `${hours}h ${minutes}m`)}
        {renderLigne('Id de la campagne', data.id)}
        {renderLigne('Superficie couverte', `${data.distance.toFixed(2)} km`)}
      </div>
    </>
  )
}