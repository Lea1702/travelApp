import { Redirect, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { Geolocation } from '@capacitor/geolocation';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import TravelTab from './pages/TravelTab';
import UploadTab from './pages/UploadTab';
import ResultsTab from './pages/ResultsTab';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [response, setResponse] = useState({});

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

    const getLocation = async () => {
    await Geolocation.checkPermissions();
    const position = await Geolocation.getCurrentPosition();
    return position
};



  useEffect(() => {
    const getLoc = async () => {
      const location = await getLocation()
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)
    }
    getLoc()
  }, [])

  return(
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/questions">
            <TravelTab setResponse={setResponse} latitude={latitude} longitude={longitude} />
          </Route>
          <Route exact path="/pictures">
            <UploadTab setResponse={setResponse} latitude={latitude} longitude={longitude} />
          </Route>
          <Route path="/results">
            <ResultsTab response={response}/>
          </Route>
          <Route exact path="/">
            <Redirect to="/questions" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="questions" href="/questions">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Questions</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pictures" href="/pictures">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Pictures</IonLabel>
          </IonTabButton>
          <IonTabButton tab="results" href="/results">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Results</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)};

export default App;
