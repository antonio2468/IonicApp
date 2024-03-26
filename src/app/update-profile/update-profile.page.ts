import { Component, inject } from '@angular/core';
import { User } from '../models/user.model';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage {

  userData = {
    name: '',
    username: '',
    phone: '',
    birthdate: new Date(), // Inicializa con la fecha actual
    gender: '',
    image: '',
  };
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  constructor() {}

  user(): User {
    return this.utilsSvc.getFormLocalStorage('user');
  }

  guardarCambios() {
    let user = this.user(); // Obtener el usuario actual
    
    // Actualizar los datos del usuario con los datos del formulario
    user.name = this.userData.name;
    user.username = this.userData.username;
    user.phone = this.userData.phone;
    user.gender = this.userData.gender;
    user.image = this.userData.image;

    // Actualizar el documento de usuario en Firebase
    let path = `users/${user.uid}`;
    this.firebaseSvc.updateDocument(path, user).then(() => {
      // Guardar el usuario actualizado en el almacenamiento local
      this.utilsSvc.saveInLocalStorage('user', user);

      console.log('Datos del usuario actualizados:', user);
      this.utilsSvc.presentToast({
        message: 'Perfil actualizado con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

      // Restablecer los valores de userData a vacío
      this.userData = {
        name: '',
        username: '',
        phone: '',
        birthdate: new Date(),
        gender: '',
        image: '',
      };
    }).catch(error => {
      console.error('Error al actualizar el perfil:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el perfil',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    });
  }

  async takeImage() {
    let user = this.user();
  
    let path = `users/${user.uid}`;
  
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;
    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    let imagePath: string = `${user.uid}/profile`;
  
    // Subir la imagen y obtener la URL
    this.firebaseSvc.updloadImage(imagePath, dataUrl).then(async imageUrl => {
      // Asignar la URL de la imagen al usuario
      user.image = imageUrl;
      
      this.userData.image = dataUrl; // Actualiza el campo 'image' en 'userData'
  
      // Actualizar el documento de usuario con la nueva URL de la imagen
      this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {
        // Guardar el usuario en el almacenamiento local
        this.utilsSvc.saveInLocalStorage('user', user);
  
        console.log(user);
  
        this.utilsSvc.presentToast({
          message: 'Imagen Actualizada Exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      loading.dismiss();
    });
  }
  
}
