import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export class InfoCardComponent {
@Output() openModal = new EventEmitter<'quote' | 'order'>();
}
