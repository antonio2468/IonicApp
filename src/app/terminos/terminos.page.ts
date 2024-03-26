import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
})
export class TerminosPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  accept() {
    // Aquí puedes agregar la lógica para aceptar los términos
    // Por ejemplo, guardar en el almacenamiento local que los términos han sido aceptados
    this.modalController.dismiss({ accepted: true });
  }

  reject() {
    // Aquí puedes agregar la lógica para rechazar los términos
    // Por ejemplo, cerrar la aplicación o redirigir a una página de inicio de sesión
    this.modalController.dismiss({ accepted: false });
  }

}
