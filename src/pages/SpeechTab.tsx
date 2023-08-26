import React, { useState, useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonButton } from '@ionic/react';
import './UploadTab.css';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import ReactLoading from "react-loading";
import './SpeechTab.css'

interface ContainerProps {
  latitude: Number;
  longitude: Number;
  setResponse: Function;
}

const SpeechTab: React.FC<ContainerProps>  = ({latitude, longitude, setResponse}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const history = useHistory()

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.onstart = () => {
        console.log('Voice recognition started...');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended.');
      };

      recognition.onerror = (event: any) => {
        console.error('Error occurred in recognition:', event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      console.error('Speech Recognition not supported by this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log('Voice recognition stopped.');
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const sendRequest = async (transcript: String) => {
    setIsLoading(true)
    const generatedQuestion = `Find the country where the latitude is ${latitude} and longitude is ${longitude}.  In this country suggest activities that I can do in a place that looks like this description : ` + transcript
      + '. Please structure the answer as a JavaScript dictionary that takes as keys: "Option 1", "Option 2" and "Option 3", and each option is a day containing an array of activities. The structure should include the following details for each activity: time, activity, address(address of the activity), and description. Do not forget double quotes for each key and each value. Give me only the js dictionary, without any opening phrase or finishing phrase'
      console.log('generatedQuestion : ', generatedQuestion)

      try {
        const trips = await axios.get(`http://localhost:5000/trip/${generatedQuestion}`);
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

  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);

  return (
    <IonPage>
        <IonHeader className='questions_header'>
      <IonTitle>Describe your trip</IonTitle>
      </IonHeader>

      <IonContent className="ion-padding">
      <div className="container-listen">
      <button className="button-listen" onClick={startListening}>Start Listening</button>
      <button className="button-listen" onClick={stopListening}>Stop Listening</button>
      <input
        type="text"
        className="transcript"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
     </IonContent>
    {!!!isLoading ? <IonButton className="upload-button" onClick={() => sendRequest(transcript)}>
          Send request
      </IonButton>:
      <ReactLoading className="upload-loading" type={"spinningBubbles"} color="#0a180db8" /> }



    </IonPage>

);
};

export default SpeechTab;