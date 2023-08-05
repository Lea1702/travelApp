import React, { useState } from 'react';
import { IonContent,IonImg, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonProgressBar, IonTabBar, IonTabButton, IonLabel, IonAlert } from '@ionic/react';
import { images } from 'ionicons/icons';
import './UploadTab.css';
import PictureCard from '../components/pictureCard';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import ReactLoading from "react-loading";
import {api} from '../config.js'

interface ContainerProps {
  latitude: Number;
  longitude: Number;
  setResponse: Function;
}

const UploadTab: React.FC<ContainerProps>  = ({latitude, longitude, setResponse}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos // opens photo gallery
    });

    setPhotos(prev => [...prev, image]);
  };

  const handleDeletePhoto = (e : Event, i: Number) => {
    const newPhotos = photos.filter((photo, index) => index !== i)
    setPhotos(newPhotos)
  }


  async function uploadImage(photos: Array<Photo>) {
    setIsLoading(true)

    const formData = new FormData();

    // Convert blob to file
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      if (!photo.webPath) {
        console.error('No data URL found in photo object');
        return;
      }
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      const file = new File([blob], `photo${i}.jpg`, { type: blob.type });

      formData.append(`images`, file);
    }

    console.log('formData : ', formData)

    try {
      const response = await axios.post(`${api}upload_endpoint`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data[0]);
      const generatedQuestion = `Find the country where the latitude is ${latitude} and longitude is ${longitude}.  In this country suggest activities that I can do in a place that looks like these descriptions : ` + response.data
      + "Please structure the answer as a JavaScript dictionary that takes as keys: 'Option 1', 'Option 2' and 'Option 3', and each option is a day containing an array of activities. The structure should include the following details for each activity: time, activity, address(address of the activity), and description. Give me only the js dictionary, without any opening phrase or finishing phrase"
      console.log('generatedQuestion : ', generatedQuestion)

      try {
        const trips = await axios.get(`${api}trip/${generatedQuestion}`);
        console.log('trips : ', trips)
        const res=JSON.parse(trips.data)
        console.log('res : ',res)
        setResponse(res)
        setIsLoading(false)
        history.push('/results');
      }catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }






  return (
    <IonPage>
        <IonHeader className='questions_header'>
      <IonTitle>Find trip with pictures</IonTitle>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="full" onClick={takePhoto}>Select Picture</IonButton>
        {photos.map((photo, i) => (

          <PictureCard handleClose={(e: Event) => handleDeletePhoto(e, i)} key={i} picture={photo} />
        ))}
      </IonContent>
      {!!!isLoading ? <IonButton className="upload-button" onClick={() => uploadImage(photos)}>
          Search similar trips
      </IonButton>:
      <ReactLoading className="upload-loading" type={"spinningBubbles"} color="#0a180db8" />

}

    </IonPage>

);
};

export default UploadTab;