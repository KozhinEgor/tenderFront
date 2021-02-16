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
import { ErrorDialogComponent } from './page-tender-date/page-tender-date.component';

import { WinnerAutocompletComponent } from './winner-autocomplet/winner-autocomplet.component';
import { PageTenderDateComponent } from './page-tender-date/page-tender-date.component';
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
import {RouterModule} from '@angular/router';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageProductComponent } from './page-product/page-product.component';
import { PageTenderComponent } from './page-tender/page-tender.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { PageAddTenderComponent } from './page-add-tender/page-add-tender.component';

const routes = [
  {path: '', component: PageHomeComponent},
  {path: 'product', component: PageProductComponent},
  {path: 'tender', component: PageTenderComponent },
  {path: 'tender-date', component: PageTenderDateComponent},
  {path: 'add-tender', component: PageAddTenderComponent}
];





@NgModule({
  declarations: [
    AppComponent,
    AutocompletTypeComponent,
    CustomAutocompletComponent,
    DataRangeComponent,
    ErrorDialogComponent,
    WinnerAutocompletComponent,
    PageTenderDateComponent,
    PageHomeComponent,
    PageProductComponent,
    PageTenderComponent,
    PageAddTenderComponent
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
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}, {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
