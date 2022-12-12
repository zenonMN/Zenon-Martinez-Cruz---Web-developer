import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private user: User = new User();
  userChange : EventEmitter<User> = new EventEmitter<User>();
  constructor() { }

  setUser(user: User) {
    this.user = user;
    this.userChange.emit(user);
  }

  getUser(): User{
    return this.user;
  }
}
