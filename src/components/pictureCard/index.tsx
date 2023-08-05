import React from 'react';
import { IonCard, IonCardContent, IonImg, IonIcon,IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Photo } from '@capacitor/camera';
import { closeOutline } from 'ionicons/icons';
import './index.css'

interface ContainerProps {
    picture: Photo;
    handleClose: Function;
  }

const PictureCard: React.FC<ContainerProps> = ({ picture, handleClose }) => {
    return (
    <IonCard>
      <IonCardHeader>
      <IonIcon onClick={() => handleClose()} className='close-icon' icon={closeOutline}></IonIcon>

      </IonCardHeader>

      <IonCardContent><IonImg  src={picture.webPath} /></IonCardContent>
    </IonCard>
  );
}
export default PictureCard;