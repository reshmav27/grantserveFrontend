import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer as AppFooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GrantService');
}
