import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './ResultsTab.css';
import DayCard from '../components/dayCard';
interface Activity {
  time: string;
  activity: string;
  address: string;
  description: string;
}
interface Response {
  [key: string]: Activity[]; // Assuming Activity is the type for the values in the response dictionary
}

interface ContainerProps {
  response: Response;
}
const ResultsTab: React.FC<ContainerProps>  = ({response}) => {

  return (
    <IonPage>
  <IonHeader className='questions_header'>
      <IonTitle>Suggested trip</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          { response !== null &&
          Object.keys(response).map((day: string, i: number) => (
              <DayCard key={i} day={day} data={response[day]}/>
          ))
           }
    </div>
      </IonContent>
    </IonPage>
  );
};

export default ResultsTab;
