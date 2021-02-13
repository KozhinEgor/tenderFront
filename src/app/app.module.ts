import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu, 'ru');
import { MAT_DATE_LOCALE } from '@angular/material/core';

// COMPONENT
import { AppComponent } from './app.component';
import { AutocompletTypeComponent } from './autocomplet-type/autocomplet-type.component';
import { CustomAutocompletComponent } from './custom-autocomplet/custom-autocomplet.component';
import { DataRangeComponent } from './data-range/data-range.component';
import { ErrorDialogComponent } from './posts/posts.component';
import { PostsComponent } from './posts/posts.component';
import { WinnerAutocompletComponent } from './winner-autocomplet/winner-autocomplet.component';
// MODULE
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule } from '@angular/material/table';

import {HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    AppComponent,
    AutocompletTypeComponent,
    CustomAutocompletComponent,
    DataRangeComponent,
    ErrorDialogComponent,
    PostsComponent,
    WinnerAutocompletComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FormsModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}, {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
