import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() isDarkTheme: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
