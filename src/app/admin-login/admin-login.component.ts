import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  loginData = { username: '', password: '' };

async onLogin(form: any) {
  if (!form.valid) return;

  try {
    // Fetch the 'admin' node
    const response = await fetch('https://online-store-596d8-default-rtdb.firebaseio.com/admin.json');
    const admins = await response.json();

    if (!admins) {
      alert('⚠️ No admin data found!');
      return;
    }

    let validLogin = false;

    // Loop through all admin children (admin1, admin2, etc.)
    for (const key in admins) {
      if (
        admins[key].username === this.loginData.username &&
        admins[key].password === this.loginData.password
      ) {
        validLogin = true;
        break;
      }
    }

    if (validLogin) {
      this.loginSuccess.emit();
      alert('✅ Logged in as admin!');
      const modalEl = document.getElementById('loginModal');
      if (modalEl) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      }
    } else {
      alert('❌ Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('⚠️ Could not log in. Try again.');
  }
}



}
