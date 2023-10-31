import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [AppComponent, SearchPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSortModule,
    NgFor,
    MatTableModule,
    MatInputModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'inventory-list-application',
        appId: '1:566714010003:web:8beaf956b5242df3f7c066',
        storageBucket: 'inventory-list-application.appspot.com',
        apiKey: 'AIzaSyDbLfzeEeebkK_Qgt2IYTpH5nx9i9D3f4Q',
        authDomain: 'inventory-list-application.firebaseapp.com',
        messagingSenderId: '566714010003',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
