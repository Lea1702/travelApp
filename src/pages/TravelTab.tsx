import React, { useState, useEffect } from 'react';
import { IonContent,   IonPage,  IonInput,  IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonDatetime, IonButton, IonItem, IonLabel, IonModal, IonToolbar, IonTitle, IonButtons, IonHeader, IonImg } from '@ionic/react';
import axios from 'axios';
import './TravelTab.css';
import { IonRange } from "@ionic/react";
import { walk, locationOutline } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import ReactLoading from "react-loading";
import TreeImage from './tree.jpg'
import {api} from '../config.js'

interface ContainerProps {
  latitude: Number;
  longitude: Number;
  setResponse: Function;
}

const TravelTab: React.FC<ContainerProps>  = ({latitude, longitude, setResponse}) => {
  let now = new Date();
  let now2 = new Date();

  now.setDate(now.getDate() + 1);
  now2.setDate(now.getDate() + 3);
  const getFormattedDate = (now: Date) => {
    return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + 'T' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
  }
  const history = useHistory();
  const [date, setDate] = useState(getFormattedDate(now));
  const [returnDate, setReturnDate] = useState(getFormattedDate(now2));
  const [isLoading, setIsLoading] = useState(false);

  const [kind, setKind] = useState('');
  const [sport, setSport] = useState('');

  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [walkPreference, setWalkPreference] = useState(0);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [distance, setDistance] = useState(70);

  const handleDistanceChange = (event: CustomEvent) => {
    setDistance(event.detail.value as number);
  };

  const handleWalkPreferenceChange = (event: CustomEvent) => {
    setWalkPreference(event.detail.value as number);
  };
  const handleDateChange = (event: CustomEvent) => {
    setDate(event.detail.value);
  };

  const handleReturnDateChange = (event: CustomEvent) => {
    setReturnDate(event.detail.value);
  };

  const handleKindChange = (event: CustomEvent) => {
    setKind(event.detail.value);
  };

  const handleSportChange = (event: CustomEvent) => {
    setSport(event.detail.value);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true)

    const question = `Plan a ${kind} trip within ${distance} kilometers from the current location. The current location's latitude is ${latitude} and longitude is ${longitude}. We would like to walk about ${walkPreference} kilometers.
     Date of travel: ${date}. Return Date: ${returnDate}. Possible sport activities you can suggest: ${sport}.
     Our eating preferences : ${foodPreferences}.`     + "Please structure the answer as a JavaScript dictionary, with each day containing an array of activities. The structure should include the following details for each activity: time, activity, address(address of the activity), and description. Give me only the js dictionary, without any opening phrase or finishing phrase"
     ;
    // Make API request to GPT-4 endpoint
    console.log('question : ', question)

    try {
      const trips = await axios.get(`http://localhost:5000/trip/${question}`);
      console.log('trips : ', trips)
      console.log('trips.data : ', trips.data)
      const res=JSON.parse(trips.data)
      console.log('res : ',res)
      setResponse(res)
      setIsLoading(false)
      history.push('/results');
    }catch (error) {
      console.error(error);
    }
  };



  return (
    <IonPage>
      <IonHeader className='questions_header'>
      <IonTitle>Find trip with questions</IonTitle>
      </IonHeader>

    <IonContent className="ion-padding">
      <IonItem lines="none">
        <IonLabel>Date of Travel:</IonLabel>
        <IonButton fill="clear" onClick={() => setShowArrivalCalendar(true)}>
          {date ? new Date(date).toLocaleDateString() : 'Choose Arrival Date'}
        </IonButton>
      </IonItem>

      <IonModal isOpen={showArrivalCalendar}>
        <IonToolbar>
          <IonTitle>Select Arrival Date</IonTitle>
        </IonToolbar>
        <IonDatetime
          value={date}
          onIonChange={handleDateChange}
        />
        <div className="ok-button-container">
          <IonButton onClick={() => setShowArrivalCalendar(false)}>OK</IonButton>
        </div>
      </IonModal>

      <IonItem >
        <IonLabel>Return Date:</IonLabel>
        <IonButton fill="clear" onClick={() => setShowReturnCalendar(true)}>
          {returnDate ? new Date(returnDate).toLocaleDateString() : 'Choose Return Date'}
        </IonButton>
      </IonItem>

      <IonModal isOpen={showReturnCalendar}>
        <IonToolbar>
          <IonTitle>Select Return Date</IonTitle>
        </IonToolbar>
        <IonDatetime
          value={returnDate}
          onIonChange={handleReturnDateChange}
        />
        <div className="ok-button-container">
          <IonButton onClick={() => setShowReturnCalendar(false)}>OK</IonButton>
        </div>
      </IonModal>
      <IonItem>
        <IonLabel>With who:</IonLabel>
        <IonSelect value={kind} placeholder="Select Kind" onIonChange={handleKindChange}>
          <IonSelectOption value="family">Family</IonSelectOption>
          <IonSelectOption value="friends">Friends</IonSelectOption>
          <IonSelectOption value="romantic">Romantic</IonSelectOption>
          <IonSelectOption value="alone">Alone</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem  lines="none">
    <IonLabel>How far from you ?</IonLabel>
    </IonItem>
<IonItem>
    <IonRange min={10} max={200} step={10} snaps={true} color="primary" value={distance} onIonChange={handleDistanceChange}>
      <img slot="start" src={locationOutline} style={{width: '20px', height: '20px'}}/>
      <IonLabel slot="end">{distance < 200 ? `${distance} km` : '200+ km'}</IonLabel>
    </IonRange>
  </IonItem>

      <IonItem  lines="none">
    <IonLabel>How much walk ?</IonLabel>
    </IonItem>
<IonItem>
    <IonRange min={0} max={15} step={0.5} snaps={true} color="primary" value={walkPreference} onIonChange={handleWalkPreferenceChange}>
      <img slot="start" src={walk} style={{width: '20px', height: '20px'}}/>
      <IonLabel slot="end">{walkPreference < 15 ? `${walkPreference} km` : '15+ km'}</IonLabel>
    </IonRange>
  </IonItem>
  <IonItem>
        <IonLabel>Add sport activities ?</IonLabel>
        <IonSelect value={sport} placeholder="Select Sport" onIonChange={handleSportChange}>
          <IonSelectOption value="no_sport">כמה שפחות לזוז</IonSelectOption>
          <IonSelectOption value="walk">הליכה בלבד</IonSelectOption>
          <IonSelectOption value="bicycle">אופניים</IonSelectOption>
          <IonSelectOption value="extreme">אקסטרים</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem>
  <IonLabel>Eating preferences</IonLabel>
  <IonSelect multiple={true} value={foodPreferences} onIonChange={e => setFoodPreferences(e.detail.value)}>
    <IonSelectOption value="cooking ourselves">לבשל בעצמנו</IonSelectOption>
    <IonSelectOption value="picnic">פיקניק</IonSelectOption>
    <IonSelectOption value="restaurant">מסעדה</IonSelectOption>
    <IonSelectOption value="buying a sandwich">לקנות כריך</IonSelectOption>
    <IonSelectOption value="vegetalian">טבעוני</IonSelectOption>
    <IonSelectOption value="vegetarian">צמחוני</IonSelectOption>
    <IonSelectOption value="kosher">כשר</IonSelectOption>
  </IonSelect>
</IonItem>
        <IonButton expand="full" onClick={handleFormSubmit}>
        Submit
      </IonButton>
      {isLoading &&<ReactLoading height={44} width={44} className="travel-loading" type={"spinningBubbles"} color="#f09175" />}
     <IonImg
      className='tree-image'
      src={TreeImage}
      alt="tree"
    ></IonImg>
    </IonContent>
    </IonPage>
  );
};

export default TravelTab;
