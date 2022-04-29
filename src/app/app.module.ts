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
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';

import { WinnerAutocompletComponent } from './winner-autocomplet/winner-autocomplet.component';
import { PageTenderDateComponent } from './page-tender-date/page-tender-date.component';
// MODULE
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { PageHomeComponent } from './page-home/page-home.component';
import {
  ChangeCategoryComponent,
  AddProductComponent,
  CreateCategoryComponent,
  ProductComponent,
  ChangeProductFileComponent
} from './page-product/product/product.component';
import { PageTenderComponent } from './page-tender/page-tender.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {
  AddDublicateDialogComponent,
  PageAddTenderComponent,
  PlanDialogComponent
} from './page-add-tender/page-add-tender.component';
import { PageReportComponent } from './page-report/page-report.component';
import { ProductCategoryAutocompletComponent } from './product-category-autocomplet/product-category-autocomplet.component';
import { VendorCodeAutocompleatComponent } from './vendor-code-autocompleat/vendor-code-autocompleat.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {
  TenderTableComponent,
  TenderDialogComponent,
  DeleteProductComponent,
  AddDialogTenderComponent, DeleteTenderComponent
} from './tender-table/tender-table.component';
import { PageTenderWithoutOrdersComponent } from './page-tender-without-orders/page-tender-without-orders.component';
import { VendorAutocompletComponent } from './vendor-autocomplet/vendor-autocomplet.component';
import { ContryAutocompletComponent } from './contry-autocomplet/contry-autocomplet.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PageLoginComponent } from './page-login/page-login.component';
import {AuthGuard} from "./_helper/auth.guard";
import {JwtInterceptor} from "./_helper/jwt.interceptor";
import { PageRegistrationComponent } from './page-registration/page-registration.component';
import {ErrorInterceptor} from "./_helper/ErrorInterceptor";
import { PageUsersComponent } from './page-users/page-users.component';
import {MatSelectModule} from "@angular/material/select";
import {ChangeCompanyComponent, PageCompanyComponent} from './page-company/page-company.component';
import { SynonymsComponent } from './page-product/synonyms/synonyms.component';
import { BigCategoryComponent } from './page-product/big-category/big-category.component';
import {PageProductComponent} from "./page-product/page-product.component";
import { BigcategoryAutocompletComponent } from './bigcategory-autocomplet/bigcategory-autocomplet.component';
import { ProductReportComponent } from './page-report/product-report/product-report.component';
import { CompanyReportComponent } from './page-report/company-report/company-report.component';
import { UserAutocompletComponent } from './user-autocomplet/user-autocomplet.component';
import { CategoryProductComponent } from './category-product/category-product.component';
import { SubcategoryAutocompletComponent } from './subcategory-autocomplet/subcategory-autocomplet.component';
import { OptionsComponent } from './options/options.component';
import { ProductCategoryCheckboxComponent } from './product-category-checkbox/product-category-checkbox.component';
import { SubcategoryCheckboxComponent } from './subcategory-checkbox/subcategory-checkbox.component';
import { VendorCheckboxComponent } from './vendor-checkbox/vendor-checkbox.component';
import { VendorCodeCheckboxComponent } from './vendor-code-checkbox/vendor-code-checkbox.component';
import { TypeProductOrderComponent } from './type-product-order/type-product-order.component';
import { SaveParametrsComponent,DeleteSearchComponent } from './save-parametrs/save-parametrs.component';
import { RegionSelectedComponent } from './region-selected/region-selected.component';
import { DistrictSelectedComponent } from './district-selected/district-selected.component';
import { PageSetWinnerComponent } from './page-set-winner/page-set-winner.component';
import {MatCardModule} from '@angular/material/card';
import {ReportEmailComponent, SafeHtmlPipe} from './report-email/report-email.component';
import {MatStepperModule} from '@angular/material/stepper';
import {GOOGLE_CHARTS_LAZY_CONFIG, GoogleChartsModule} from 'angular-google-charts';
import {CustomMatPaginatorIntl} from "./CustomMatPaginatorIntl";
import {DublicateDialogComponent} from "./dublicate-dialog/dublicate-dialog.component";

// export const googleChartsConfigSubject = new ReplaySubject<GoogleChartsConfig>(1);
//
// // Call this from anywhere you want
// googleChartsConfigSubject.next(config);

const routes = [
  {path:'login', component: PageLoginComponent},
  {path:'registration', component: PageRegistrationComponent},
  {path: 'home', component: PageHomeComponent, canActivate: [AuthGuard]},
  {path: 'users', component: PageUsersComponent, canActivate: [AuthGuard]},
  {path: 'product', component: PageProductComponent, canActivate: [AuthGuard]},
  {path: 'tender/:id', component: PageTenderComponent, canActivate: [AuthGuard] },
  {path: 'tender-date', component: PageTenderDateComponent, canActivate: [AuthGuard]},
  {path: 'report', component: PageReportComponent, canActivate: [AuthGuard]},
  {path: 'company', component: PageCompanyComponent, canActivate: [AuthGuard]},
  {path: 'add-tender', component: PageAddTenderComponent, canActivate: [AuthGuard]},
  {path: 'tender-without-orders', component: PageTenderWithoutOrdersComponent, canActivate: [AuthGuard]},
  {path: 'report/product-report', component: ProductReportComponent, canActivate: [AuthGuard]},
  {path: 'report/company-report', component: CompanyReportComponent, canActivate: [AuthGuard]},
  {path: 'product/product', component: ProductComponent, canActivate: [AuthGuard]},
  {path: 'product/synonyms', component: SynonymsComponent, canActivate: [AuthGuard]},
  {path: 'setWinner', component: PageSetWinnerComponent, canActivate: [AuthGuard]},
  {path: 'report-email', component: ReportEmailComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo:'home'}
];





@NgModule({
  declarations: [
    SafeHtmlPipe,
    AppComponent,
    AutocompletTypeComponent,
    CustomAutocompletComponent,
    DataRangeComponent,
    ErrorDialogComponent,
    WinnerAutocompletComponent,
    PageTenderDateComponent,
    PageHomeComponent,
    PageProductComponent,
    CreateCategoryComponent,
    PageTenderComponent,
    PageAddTenderComponent,
    PageReportComponent,
    TenderDialogComponent,
    ProductCategoryAutocompletComponent,
    VendorCodeAutocompleatComponent,
    DeleteProductComponent,
    TenderTableComponent,
    PageTenderWithoutOrdersComponent,
    AddDialogTenderComponent,
    ChangeCategoryComponent,
    AddProductComponent,
    VendorAutocompletComponent,
    DeleteTenderComponent,
    ContryAutocompletComponent,
    PageLoginComponent,
    PageRegistrationComponent,
    PageUsersComponent,
    PageCompanyComponent,
    ChangeCompanyComponent,
    ProductComponent,
    SynonymsComponent,
    BigCategoryComponent,
    BigcategoryAutocompletComponent,
    ProductReportComponent,
    CompanyReportComponent,
    UserAutocompletComponent,
    CategoryProductComponent,
    SubcategoryAutocompletComponent,
    OptionsComponent,
    ChangeProductFileComponent,
    ProductCategoryCheckboxComponent,
    SubcategoryCheckboxComponent,
    VendorCheckboxComponent,
    VendorCodeCheckboxComponent,
    TypeProductOrderComponent,
    SaveParametrsComponent,
    DeleteSearchComponent,
    RegionSelectedComponent,
    DistrictSelectedComponent,
    PageSetWinnerComponent,
    PlanDialogComponent,
    AddDublicateDialogComponent,
    ReportEmailComponent,
    DublicateDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatGridListModule,
    DragDropModule,
    FormsModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
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
    MatProgressBarModule,
    MatSidenavModule,
    MatSortModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatTabsModule,
    RouterModule.forRoot(routes),
    HttpClientModule, MatSelectModule, MatStepperModule,
    GoogleChartsModule
  ],
  providers: [{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}, {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },{provide: MatPaginatorIntl, useClass:CustomMatPaginatorIntl}],
  bootstrap: [AppComponent]
})
export class AppModule { }
