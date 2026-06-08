import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PersonService {
   private apiUrl = 'http://localhost:5284/api/Persons';

  constructor(private http: HttpClient) {}

  createPerson(person: any) {
    return this.http.post(this.apiUrl, person);
  }
  checkPersonExists(email: string, phoneNumber: string) {
  return this.http.get<boolean>(
    `${this.apiUrl}/exists?email=${email}&phoneNumber=${phoneNumber}`
  );
}
saveDrawing(drawing: any) {
  return this.http.post(
    'http://localhost:5284/api/MapDrawings',
    drawing
  );
}
getPersons() {
  return this.http.get(
    'http://localhost:5284/api/Persons'
  );
}
}
