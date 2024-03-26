import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import {User} from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc =inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFormLocalStorage('user');
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
