import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  questionNumber: any;

  constructor(
    public alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  
  }

  start(){
    this.questionNumber = localStorage.getItem("questionNumber");
    if(!this.questionNumber){
      this.router.navigate(["/game"]);
    }else{
      this.presentAlertStart()
    }    
  }

  formQuizz() {
    window.open("https://www.randyvarela.es/quizzappform/", '_system', 'location=yes');
  }


  async presentAlertStart() {
    const alert = await this.alertController.create({
      header: "¿Desea comenzar de 0?",
      message: "¿Está seguro que desea comenzar de 0? Todo su progreso se perderá",
      buttons: [
        {
          text: "SI",
          handler: () => {
            localStorage.setItem("questionNumber", "0");
            this.router.navigate(["/game"]);
          }
        },
        {
          text: "NO",
          handler: () => {
          }
        }
      ],
    });
    await alert.present();
  }

}
