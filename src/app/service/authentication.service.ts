import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../classes";
import {map} from "rxjs/operators";
import { interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
  private host = environment.apiUrl;
  login(username: string, password: string) {
    return this.http.post<any>(this.host+'/auth', { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('username',username);

        this.userSubject.next(user);
        return user;
      }));
  }
  intervalId = setInterval(() => this.addJWT(), 5*60000);
  addJWT() {
    let username: string = localStorage.getItem('username');
    this.http.post(this.host+'/refreshJWT',{username}).pipe(map(user => {
      localStorage.setItem('user', JSON.stringify(user));

    })).subscribe();
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
