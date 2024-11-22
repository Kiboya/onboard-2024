import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ThemeService } from './services/theme.service';
import { LoginComponent } from './login/login.component';
import { LogoComponent } from './logo/logo.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule,
        // Custom components
        LoginComponent,
        LogoComponent,
        // Material modules
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonToggleModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'onboard_2024_front';
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}