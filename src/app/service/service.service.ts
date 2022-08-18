import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private http: HttpClient
  ) { }


  getQuestions() {
    return this.http.get('../../assets/files/questions.json').pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  getWrongAnswers() {
    return this.http.get('../../assets/files/wrongAnswers.json').pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

}
