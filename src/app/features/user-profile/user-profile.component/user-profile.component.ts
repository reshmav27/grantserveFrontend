import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-user-profile.component',
  imports: [RouterOutlet,Sidebar,Header],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {}
