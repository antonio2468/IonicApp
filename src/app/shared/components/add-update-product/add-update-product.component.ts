import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import {User} from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {
  @Input () product: Product;

  form = new FormGroup({
    id : new FormControl(''),
    image : new FormControl('',[Validators.required]),
    name : new FormControl('',[Validators.required, Validators.minLength(4)]),
    price : new FormControl(null,[Validators.required, Validators.min(0)]),
    soldUnits : new FormControl(null,[Validators.required, Validators.min(0)]),
    
  });

  firebaseSvs = inject(FirebaseService);
  utilsSvc =inject(UtilsService);

  user = {} as User

  ngOnInit() {
    this.user = this.utilsSvc.getFormLocalStorage('user');
    if(this.product)this.form.setValue(this.product);
  }

  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

submit(){
if (this.form.valid){
  if(this.product) this.updateProduct();
  else this.createProduct();
}
}
 

setNumberInputs(){
  let {soldUnits,price} = this.form.controls;
  if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
  if(price.value) price.setValue(parseFloat(price.value));
  
}
  async createProduct(){
  
    let path = `users/${this.user.uid}/products`;
    
    const loading = await this.utilsSvc.loading();
    await loading.present();


    let dataUrl = this.form.value.image;
    let imagePath: string = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvs.updloadImage(imagePath,dataUrl);
    this.form.controls.image.setValue(imageUrl);  

    console.log(this.form);
    delete this.form.value.id;


    this.firebaseSvs.addDocument(path,this.form.value).then(async res => {

      this.utilsSvc.dismissModal({success: true});
      
      this.utilsSvc.presentToast({
        message:'producto creado exitosamente',
        duration: 1500,
        color:'success',
        position:'middle',
        icon:'checkmark-circle-outline'
      })
      

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


//=====Actualizar Producto======
async updateProduct(){
 
  let path = `users/${this.user.uid}/products/${this.product.id}`;

    
    const loading = await this.utilsSvc.loading();
    await loading.present();

  if(this.form.value.image !== this.product.image){
    let dataUrl = this.form.value.image;
    let imagePath = await this.firebaseSvs.getFilePath(this.product.image);
    let imageUrl = await this.firebaseSvs.updloadImage(imagePath,dataUrl);
    this.form.controls.image.setValue(imageUrl);
  }
      

    delete this.form.value.id;


    this.firebaseSvs.updateDocument(path,this.form.value).then(async res => {

      this.utilsSvc.dismissModal({success: true});
      
      this.utilsSvc.presentToast({
        message:'Producto Actualizado Exitosamente',
        duration: 1500,
        color:'success',
        position:'middle',
        icon:'checkmark-circle-outline'
      })
      

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


