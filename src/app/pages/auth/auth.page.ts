import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import {User} from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required])
  });

  firebaseSvs = inject(FirebaseService);
  utilsSvc =inject(UtilsService);
  ngOnInit() {
  }

  async submit(){
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvs.signIn(this.form.value as User).then(res => {
      //console.log(res);
      this.getUserInfo(res.user.uid);
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message:error.message,
        duration: 2500,
        color:'primary',
        position:'middle',
        icon:'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }


  async getUserInfo(uid:string){
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let path = 'users/${uid}';
    this.firebaseSvs.getDocument(path).then((user: User) => {
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.routerLink('/main/home');
      this.form.reset();
      this.utilsSvc.presentToast({
        message: `Te Damos la Bienvenida ${user.name}`,
        duration: 1500,
        color:'primary',
        position:'middle',
        icon:'person-circle-outline'
      })

    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: `Verifica Tus Credenciales`,
        duration: 2500,
        color:'primary',
        position:'middle',
        icon:'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }
}
