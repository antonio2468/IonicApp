import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import {User} from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
  });

  firebaseSvs = inject(FirebaseService);
  utilsSvc =inject(UtilsService);
  ngOnInit() {
  }

  async submit(){
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvs.sendRecoveryEmail(this.form.value.email).then(res => {
      //console.log(res);
      this.utilsSvc.presentToast({
        message: `Correo Enviado Con Exito a ${this.form.value.email}`,
        duration: 2500,
        color:'primary',
        position:'middle',
        icon:'mail-outline'
      });

      this.utilsSvc.routerLink('/auth');
      this.form.reset
      
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

}
