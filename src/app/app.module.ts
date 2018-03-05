import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }   from './app.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    imports:      [ BrowserModule, FormsModule, HttpClientModule, HttpModule, OrderModule],
    declarations: [ AppComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
export class SortableColumnComponent {}