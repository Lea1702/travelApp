import React from 'react';
import { IonCard, IonCardContent, IonItem, IonIcon,IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Photo } from '@capacitor/camera';
import { locationOutline, informationCircleOutline } from 'ionicons/icons';
import './index.css'
interface Activity {
  time: string;
  activity: string;
  address: string;
  description: string;
}
interface ContainerProps {
    day: String;
    data: Activity[];
  }

const DayCard: React.FC<ContainerProps> = ({ day, data }) => {
    return (
    <IonCard>
      <IonCardHeader className='header-results'>
        {day}
      </IonCardHeader>

      <IonCardContent>
        {data.map((item: Activity, i: number) => (
          <IonItem className="activity-container" key={i}>
            <div>
<div className='hour-activity'>{item.time} - {item.activity}</div>
<div className='activity-label'>  <IonIcon className='activity-icon' aria-hidden="true" icon={locationOutline} />{item.address}</div>
<div className='activity-label'>  <IonIcon className='activity-icon' aria-hidden="true" icon={informationCircleOutline} />{item.description}</div>
</div>
</IonItem>

        ))}
      </IonCardContent>
    </IonCard>
  );
}
export default DayCard;