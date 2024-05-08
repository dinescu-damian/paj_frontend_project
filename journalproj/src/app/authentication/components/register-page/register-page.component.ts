import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CredentialsValidators } from '../../helpers/credentials-validators';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  registerForm!: FormGroup;
  successStatusCode = 200;
  registerIsBeingRequested = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { 
    if(this.authenticationService.isAuthenticated) {
      this.navigateToMain();
      return;
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, CredentialsValidators.emailValidator]),
      password: new FormControl<string>('', [Validators.required]),
      confirmPassword: new FormControl<string>('', [Validators.required]),
      name: new FormControl<string>('', [Validators.required]),
      location: new FormControl<string>('', [Validators.required]),
      age: new FormControl<number>(0, [Validators.required])
    }, {
      validators: CredentialsValidators.passwordConfirmationValidator()
    });
  }

  submitForm() {
    const credentials = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      location: this.registerForm.value.location,
      age: this.registerForm.value.age
    }

    this.registerIsBeingRequested = true;
    this.authenticationService.register(credentials).then(
      statusCode => {
        this.registerIsBeingRequested = false;
        if(statusCode === this.successStatusCode) {
          console.log("Successful registration");
          this.navigateToMain();
        }
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToMain() {
    this.router.navigate(['/main']);
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }
  get name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }
  get location(): FormControl {
    return this.registerForm.get('location') as FormControl;
  }
  get age(): FormControl {
    return this.registerForm.get('age') as FormControl;
  }
}
