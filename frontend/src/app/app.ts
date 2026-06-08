import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonService } from './services/person';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  name = '';
  email = '';
  phoneNumber = '';
  message = '';
  messageType = '';
  drawnGeometry = '';
  shapeType = '';
  persons: any[] = [];

  constructor(private personService: PersonService) {}
  loadPersons() {
  this.personService.getPersons()
    .subscribe({
      next: (data: any) => {
        this.persons = data;
      }
    });
}
  ngAfterViewInit(): void {

  const map = L.map('map').setView([10.8505, 76.2711], 7);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(map);

  // Drawing Layer
  const drawnItems = new L.FeatureGroup();

  map.addLayer(drawnItems);

  // Drawing Toolbar
  const drawControl = new L.Control.Draw({
    draw: {
      polygon: {},
      rectangle: {},
      circle: {},
      polyline: false,
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: drawnItems
    }
  });

  map.addControl(drawControl);

  // Capture Shape
  map.on(L.Draw.Event.CREATED, (e: any) => {

    const layer = e.layer;

    drawnItems.addLayer(layer);

    this.shapeType = e.layerType;

    this.drawnGeometry =
      JSON.stringify(layer.toGeoJSON());

    console.log('Shape Type:', this.shapeType);

    console.log('Geometry:', this.drawnGeometry);

  });
this.loadPersons();
}

  submitForm() {

// Form Validation
if (
!this.name.trim() ||
!this.email.trim() ||
!this.phoneNumber.trim()
) {
this.message = 'Please fill all required fields';
this.messageType = 'warning';
return;
}

// Drawing Validation
if (!this.drawnGeometry) {
this.message = 'Please draw a shape on the map';
this.messageType = 'warning';
return;
}

const person = {
name: this.name.trim(),
email: this.email.trim(),
phoneNumber: this.phoneNumber.trim()
};

// Check Duplicate
this.personService
.checkPersonExists(
person.email,
person.phoneNumber
)
.subscribe({

  next: (exists: boolean) => {

    if (exists) {
      this.message =
        'Email or Phone Number already exists';
      this.messageType = 'danger';
      return;
    }

    // Save Person
    this.personService
      .createPerson(person)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Person Saved Successfully',
            response
          );

          const drawing = {
            personId: response.id,
            shapeType: this.shapeType,
            geometryJson: this.drawnGeometry
          };

          // Save Drawing
          this.personService
            .saveDrawing(drawing)
            .subscribe({

              next: (drawingResponse: any) => {

                console.log(
                  'Drawing Saved Successfully',
                  drawingResponse
                );

                this.message =
                  'Person & Drawing Saved Successfully';

                this.messageType =
                  'success';

                // Clear Form
                this.name = '';
                this.email = '';
                this.phoneNumber = '';

                this.drawnGeometry = '';
                this.shapeType = '';

                this.loadPersons();
              },

              error: (error: any) => {

                console.error(
                  'Drawing Save Error',
                  error
                );

                this.message =
                  'Person Saved but Drawing Failed';

                this.messageType =
                  'warning';
              }
            });
        },

        error: (error: any) => {

          console.error(
            'Person Save Error',
            error
          );

          this.message =
            'Failed to Save Person';

          this.messageType =
            'danger';
        }
      });
  },

  error: (error: any) => {

    console.error(error);

    this.message =
      'Error checking existing records';

    this.messageType =
      'danger';
  }
});

}

}
