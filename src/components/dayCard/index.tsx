import React, {useState, useEffect} from 'react';
import { IonCard, IonCardContent, IonItem, IonIcon,IonCardHeader } from '@ionic/react';
import { locationOutline, informationCircleOutline } from 'ionicons/icons';
import axios from 'axios';
import { refresh} from 'ionicons/icons';
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
  const [isLoading, setIsLoading] = useState(false);
  const [newData, setNewData] = useState(data);

useEffect(() => {
  setNewData(data)
}, [data])

  const handleRefresh = async () => {
    setIsLoading(true)

    const generatedQuestion = `Find a different day trip in the same country of this one : ${data}. Please structure the answer as a JavaScript array of activities.
     The structure should include the following details for each activity object: time, activity, address(address of the activity), and description.
     Do not forget double quotes for each key and
    each value, and '[' and ']'. Give me only the js array, without any opening phrase or finishing phrase`
    console.log('generatedQuestion : ', generatedQuestion)
    try {
      const trips = await axios.get(`http://localhost:5000/trip/${generatedQuestion}`);
      console.log('trips : ', trips)
      console.log('trips.data : ', trips.data)
      const res=JSON.parse('[' + trips.data + ']')
      console.log('res : ',res)
      setNewData(res)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error);
    }
  };

  return (
    <IonCard>
      <IonCardHeader className='header-results'>
        {day}
        {isLoading ? <div>Loading...</div>:
       <IonIcon aria-hidden="true" icon={refresh} onClick={handleRefresh}/>
}
      </IonCardHeader>

      <IonCardContent>

        {newData.map((item: Activity, i: number) => (
          <IonItem className="activity-container" key={i}>
            <div>

<div className='hour-activity'>{item.time} - {item.activity}</div>
<div className='activity-label'>
 <IonIcon className='activity-icon' aria-hidden="true" icon={locationOutline} />{item.address}</div>
<div className='activity-label'>  <IonIcon className='activity-icon' aria-hidden="true" icon={informationCircleOutline} />{item.description}</div>
</div>
</IonItem>

        ))}
      </IonCardContent>
    </IonCard>
  );
}
export default DayCard;