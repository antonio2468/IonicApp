import { Inject, Injectable, inject } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth'
import {User} from '../models/user.model'
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc = Inject(UtilsService);

  //===Autentication===
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password );
  }

   //===Register User===
   signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password );
  }

    //===Update User===
    updateUser(displayName: string){
      return updateProfile(getAuth().currentUser,{displayName} );
    }

    //Base de Datos

    setDocument(path:string, data :any){
      return setDoc(doc(getFirestore(),path),data);
    }

    async getDocument(path:string){
      return (await getDoc(doc(getFirestore(),path))).data();
    }
    sendRecoveryEmail(email:string){
      return sendPasswordResetEmail(getAuth(),email);
    }

    getAuth(){
      return getAuth();
    }
    signOut(){
      getAuth().signOut();
      localStorage.removeItem('user');
      this.utilSvc.routerLink('/auth')
    }

}
