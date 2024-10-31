import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonLabel, IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
    dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern(/^[0-9]+$/)]),
    photo: new FormControl('', [Validators.required])
  }, { validators: this.PasswordsMatchValidator() });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.patchValue({ photo: input.files[0] });
      this.form.get('photo')?.setErrors(null);
    } else {
      this.form.get('photo')?.setErrors({ required: true }); 
    }
  }

  PasswordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const passwordConfirm = control.get('passwordConfirm')?.value;
  
      if (password && passwordConfirm && password !== passwordConfirm) {
        return { mismatch: true };
      }
      return null;
    };
  }
}
