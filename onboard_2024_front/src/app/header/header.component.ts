import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public isOpen: boolean = false;

  ngOnInit(): void {

  }
  public onMenuClick(): void {
    this.isOpen = !this.isOpen;
  }
}