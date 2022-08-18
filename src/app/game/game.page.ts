import { Component, OnInit } from '@angular/core';
import { AlertController, isPlatform } from '@ionic/angular';
import { ServiceService } from 'src/app/service/service.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  questions: any = [];
  wrongAnswers: any = [];
  questionTitle: any;
  questionAnswer: any;
  message: any;
  formSendAnswer: FormGroup;
  questionNumber: any;
  questionsLength: any;


  constructor(
    private serviceService: ServiceService,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.formSendAnswer = this.formBuilder.group({
      answer: ["", Validators.required],
    }); 
   
  }

  ngOnInit(){     
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOURTESTDEVICECODE'],
      initializeForTesting: true,
    });
    this.getWrongAnswers();
  }

  ionViewWillEnter() {
    this.questionNumber = localStorage.getItem("questionNumber");
    if(!this.questionNumber){
      this.questionNumber = 0;
    }
    this.getQuestions();
    console.log("QuestionNumber: ",this.questionNumber)
  }  

  getQuestions(){
    this.serviceService.getQuestions().subscribe(
      (res) => {
        console.log("Respuesta1:", res);
        this.questions = res;  
        this.questionsLength = this.questions.length - 1;
        console.log("Quantity of questions: ", this.questionsLength)
        this.questionTitle = this.questions[this.questionNumber].question;
        this.questionAnswer = this.questions[this.questionNumber].answer;
        console.log("queestionTitle: ",this.questionTitle)
        if(!this.questionTitle){
          this.presentAlertWin();          
        }
      }, (err) => {
        console.log("error")  
        this.presentAlertWin();   
        this.router.navigate(["/home"]);                
      }
    );
  }

  getWrongAnswers(){
    this.serviceService.getWrongAnswers().subscribe(
      (res) => {
        console.log("wrongAnswers:", res);
        this.wrongAnswers = res;  
      }, (err) => {
        console.log("error")         
      }
    );
  }

  sendAnswer(){
    let value = this.formSendAnswer.value;
    console.log("Repuesta enviada: ",value.answer)
    if(value.answer == this.questionAnswer){
      console.log("Repuesta correcta")
      this.presentAlertCorrectAnswer();
      this.formSendAnswer.reset()
      
    }else{
      console.log("Repuesta incorrecta")
      this.presentAlertWrongAnswer();
      this.formSendAnswer.reset()
    }
  }


  help(){
    this.showAdsInterstitial();
    this.message = "La respuesta correcta es: " + this.questionAnswer
    this.presentAlert1(this.message)
  }

  async showAdsInterstitial(){
    const options: AdOptions ={
      adId: 'ca-app-pub-3967094906089260/9010826173',
      isTesting: false,
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  showBanner(){
    const adId = isPlatform('ios') ? 'ios-ad-id' : 'android-ad-unit';
    const options: BannerAdOptions ={
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER
    }
  }

  next(){  
    this.showAdsInterstitial();
    if(this.questionNumber < this.questionsLength){
      this.showAdsInterstitial();
      this.questionNumber = ++this.questionNumber;
      localStorage.setItem("questionNumber", JSON.stringify(this.questionNumber));
      console.log("questionNumberNext= ", this.questionNumber)
      this.getQuestions()
    }else{
      this.presentAlertWin();
    }
  }

   getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } 


  async presentAlert1(message) {
    const alert = await this.alertController.create({
      header: "Ayuda",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentAlertCorrectAnswer() {
    const alert = await this.alertController.create({
      header: "Respuesta correcta",
      message: "Bueno, veremos si puedes con la siguiente...",
      buttons: ["OK"],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    this.next();
  }

  async presentAlertWrongAnswer() {
    console.log(this.getRandomInt(0,9))
    var message = this.wrongAnswers[this.getRandomInt(0,9)].answer
    const alert = await this.alertController.create({
      header: "Respuesta incorrecta",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentAlertWin() {
    const alert = await this.alertController.create({
      header: "¡Enhorabuena!",
      message: "Has completado todos los niveles, pronto actualizaremos la app con más niveles.",
      buttons: ["OK"],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

}
