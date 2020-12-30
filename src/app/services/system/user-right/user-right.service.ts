import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserRightService {
  private listRight: string[] = [];
  private listRole: string[] = [];

  constructor() { }

  // Right
  add(right: string) {
    this.listRight.push(right);
  }

  addMany(rights: [string]) {
    this.listRight = this.listRight.concat(rights);
  }

  change(rights: [string]) {
    this.listRight = Object.assign({}, rights);
  }

  check(right: string): boolean {
    return this.listRight.indexOf(right) > -1;
  }

  getAll(): string[] {
    return this.listRight;
  }

  deleteAll() {
    this.listRight = [];
    return true;
  }

  // Role
  addRole(role: string) {
    this.listRole.push(role);
  }

  addManyRole(roles: [string]) {
    this.listRole = this.listRole.concat(roles);
  }

  changeRole(roles: [string]) {
    this.listRole = Object.assign({}, roles);
  }

  checkRole(role: string): boolean {
    return this.listRole.indexOf(role) > -1;
  }

  getAllRole(): string[] {
    return this.listRole;
  }

  deleteAllRole() {
    this.listRole = [];
    return true;
  }

}
