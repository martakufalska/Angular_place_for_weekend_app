import { Component, OnInit, Input} from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, HttpModule} from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Component({
   selector: 'place-for-weekend-app',
   template: require('./table.html')
})
export class AppComponent implements OnInit{ 
    public display: SafeStyle;
    public displayNone: SafeStyle;
    public displayBlock: SafeStyle;
    cities = ['Tirana', 'Andorra la Vella', 'Yerevan', 'Vienna', 'Baku', 'Minsk', 'Brussels', 'Sarajevo', 'Sofia', 'Zagreb', 'Prague', 'Copenhagen', 'Tallinn', 'Helsinki', 'Paris', 'Cyprus', 'Tbilisi', 'Berlin', 'Athens', 'Budapest', 'Reykjavik', 'Dublin', 'Rome', 'Astana', 'Kosovo', 'Riga', 'Vaduz', 'Vilnius', 'Luxembourg', 'Skopje', 'Valletta', 'Chisinau', 'Monaco', 'Podgorica', 'Amsterdam', 'Oslo', 'Warsaw', 'Lisbon', 'Bucharest', 'Moscow', 'San Marino', 'Belgrade', 'Bratislava', 'Ljubljana', 'Madrid', 'Stockholm', 'Bern', 'Ankara', 'Kyiv', 'London', 'Vatican City'];
    citiesParam: any = null;

    constructor(private sanitizer: DomSanitizer, private http:Http) {}

    ngOnInit() {
       this.citiesParam = this.buildTable(this.cities);
       this.saveInLocalStor();
       this.displayNone = this.sanitizer.bypassSecurityTrustStyle('none');
       this.displayBlock = this.sanitizer.bypassSecurityTrustStyle('block');
    }

    //sorting
    reverse:boolean = false;
    order:string = "temperature";
    reverseOrder(column:string) {
        this.order = column;
        (this.reverse == false) ? this.reverse = true : this.reverse = false;
    }


    //table building
    oneRowBuild = function (response:any, goingToVisite:String, visited:String){
        console.log("in onerowbuild", name, response);
        let oneRow = {name: response.name,
            temperature: response.main.temp,
            condition: response.weather[0].description,
            goingToVisite: goingToVisite,
            visited: visited
        };
        return oneRow;
    }

    buildTable (cities:any) { 
        let oneRowBuild = function (response:any, goingToVisite:String, visited:String){
            let oneRow = {name: response.name,
                temperature: response.main.temp,
                condition: response.weather[0].description,
                goingToVisite: goingToVisite,
                visited: visited
            };
            return oneRow;
        }
        let result:any = [];
        if (localStorage.getItem('citiesObj') != "[]" && localStorage.getItem('citiesObj') != null) {
            let storedData = JSON.parse(localStorage.getItem('citiesObj'));
            storedData.forEach ((city:any) => {this.http.get("http://api.openweathermap.org/data/2.5/weather?q="+(city.name).replace(' ', '+')+"&units=metric&APPID=7d4a513295ab7cdbda0f5e3b9c6adea5").toPromise()
                .then(function(res: Response) { 
                    result.push(oneRowBuild (res.json(), city.goingToVisite, city.visited));
                })
                .catch(function(e:any){
                    console.log("API doesn't work for stored data!", e);
                })
            }); 
        }
        else {
            cities.forEach ((city:any) => {this.http.get("http://api.openweathermap.org/data/2.5/weather?q="+(city).replace(' ', '+')+"&units=metric&APPID=7d4a513295ab7cdbda0f5e3b9c6adea5").toPromise()
                .then(function(res:any) { 
                    result.push(oneRowBuild(res.json(), "", ""));
                })
                .catch(function(e:any){
                    console.log("API doesn't work!", e);
                });
            });  
        }   
        return result;
    }

    // refresh table to default
    refreshTable () {
        let len = this.citiesParam.length;
        for (let i = 0; i < len; i++) {
            var item = document.getElementById(`${this.citiesParam[i].name}`);
            var parent = document.getElementsByTagName("tbody");
            item.parentElement.removeChild(item);
        }
       localStorage.removeItem('citiesObj');
       this.citiesParam = this.buildTable(this.cities);
    }

    // saving in th local storage
    saveInLocalStor = function () {
        console.log("Save in Local start");
        let citiesObjects = this.citiesParam.map((x:any) =>({name:x.name, goingToVisite:x.goingToVisite, visited:x.visited}));
        localStorage.setItem('citiesObj', JSON.stringify(citiesObjects));
        console.log("Save in Local", localStorage.getItem('citiesObj'));
    }

    //adding new city
    message = "";
    messageColor = "#fd4e4e";   
    modalBoxAdd = async function (newCity:string) {
        if (newCity === "") {
            this.messageColor = "#fd4e4e";
            this.message = "Please enter city.";
        }
        else {
            let res = this.http.get("http://api.openweathermap.org/data/2.5/weather?q="+(newCity).replace(' ', '+')+"&units=metric&APPID=7d4a513295ab7cdbda0f5e3b9c6adea5").toPromise()
            .then(function(response: Response) { 
                let parsesResponse = response.json();
                let oneRow = {name: parsesResponse.name,
                    temperature: parsesResponse.main.temp,
                    condition: parsesResponse.weather[0].description,
                    goingToVisite: "",
                    visited: ""
                };
                return oneRow;
            })
            .catch(function(e:any) {
                return 0;
            })
            
            if (await res === 0) {
                this.messageColor = "#fd4e4e";
                this.message = "City name is invalide. Please try again.";
            }
            else {
                this.citiesParam.push(await res);
                this.saveInLocalStor();
                this.message = "Successfully added.";
                this.messageColor = "#50af94";
            }
        }
    }

    // delete city
    deleteCity = function (city:any) {
            let index = this.citiesParam.findIndex((x:any) => x.name === city.path[3].id);
            this.citiesParam.splice(index, 1);
            this.saveInLocalStor();  
        }  
  
    //background-images
    slides = [
        'url("/src/img/1.jpg")',
        'url("/src/img/2.jpg")',
        'url("/src/img/3.jpg")',
        'url("/src/img/4.jpg")',
        'url("/src/img/5.jpg")'
    ];
    currentImg = this.slides[0];    
    t = Observable.interval(10000).subscribe(x => this.slideImg());
    flag = 0;
    slideImg () {
        if(this.currentImg === this.slides[4]) {
            this.currentImg  = this.slides[0];
            this.flag = 0;
        }
        else {
            this.currentImg = this.slides[this.flag+1];
            this.flag++;
        }
    }

    //min and max temperature bg
    minMaxTempBackground () {
        let len = this.citiesParam.length;
        let min = this.citiesParam[0];
        let max = this.citiesParam[0];
        for(let i = 0; i < len; i++)
        {   let rowBgColor = document.getElementById(this.citiesParam[i].name).style.background;
            if(this.citiesParam[i].goingToVisite != "checked" || this.citiesParam[i].visited != "checked")
                {document.getElementById(this.citiesParam[i].name).style.background = "none";}
            if(Number(this.citiesParam[i].temperature) < Number(min.temperature))
                {min = this.citiesParam[i];}
            else {
                if(Number(this.citiesParam[i].temperature) > Number(max.temperature))
                max = this.citiesParam[i];
            }
        }
        document.getElementById(min.name).style.background = "#0000ff80";
        document.getElementById(max.name).style.background = "#ff0000ab";
    }

     //changing visited and going to visite value, row colors
     checkBoxChange(elem:any){
        let city = elem.path[0].id;
        let len = this.citiesParam.length;
        for (let i = 0; i < len; i++){
            if (this.citiesParam[i].name === city){
                if(elem.target.checked === true){
                    this.citiesParam[i][elem.target.name] = "checked";
                    break;
                }
                else {
                    this.citiesParam[i][elem.target.name] = "";
                    break;
                }
            }
        }
        if(elem.target.name === "visited") this.greyColor(elem);
        else this.purpColor(elem);
        this.saveInLocalStor();
    }

    purpColor = function (elem:any) {
        let city = elem.path[0].id;
        let refToCity = this.citiesParam.find((x:any) => x.name === city);
        if(elem.target.checked === true && refToCity.visited === ""){
            document.getElementById(city).style.background = '#800080bf';
           } 
        else {
            if(refToCity.visited === "checked"){
                document.getElementById(city).style.background = '#808080c9';
            }
            else document.getElementById(city).style.background = 'none';
        }
    }

    greyColor = function(elem:any) {
        let city = elem.path[0].id;
        let refToCity = this.citiesParam.find((x:any) => x.name === city);
        if(elem.target.checked === true){
            document.getElementById(city).style.background = '#808080c9';
        } 
        else {
            if (refToCity.goingToVisite === "checked") {
                document.getElementById(city).style.background = '#800080bf';
            }
            else document.getElementById(city).style.background = 'none';
        }
    }
}

