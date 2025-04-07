import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utilities {
  charaIdMap = new Map();
  charaNameMap = new Map();
  charArray: string[] = [];
  regionIdMap = new Map();

  swap(obj: Map<number, string>) {
    return new Map(Array.from(obj, a => a.reverse() as [number, string]))
  }

  constructor() {
    this.charaIdMap.set(0, 'Paul');
    this.charaIdMap.set(1, 'Law');
    this.charaIdMap.set(2, 'King');
    this.charaIdMap.set(3, 'Yoshimitsu');
    this.charaIdMap.set(4, 'Hworang');
    this.charaIdMap.set(5, 'Xiaoyu');
    this.charaIdMap.set(6, 'Jin');
    this.charaIdMap.set(7, 'Bryan');
    this.charaIdMap.set(8, 'Kazuya');
    this.charaIdMap.set(9, 'Steve');
    this.charaIdMap.set(10, 'Jack-8');
    this.charaIdMap.set(11, 'Asuka');
    this.charaIdMap.set(12, 'Devil Jin');
    this.charaIdMap.set(13, 'Feng');
    this.charaIdMap.set(14, 'Lili');
    this.charaIdMap.set(15, 'Dragunov');
    this.charaIdMap.set(16, 'Leo');
    this.charaIdMap.set(17, 'Lars');
    this.charaIdMap.set(18, 'Alisa');
    this.charaIdMap.set(19, 'Claudio');
    this.charaIdMap.set(20, 'Shaheen');
    this.charaIdMap.set(21, 'Nina');
    this.charaIdMap.set(22, 'Lee');
    this.charaIdMap.set(23, 'Kuma');
    this.charaIdMap.set(24, 'Panda');
    this.charaIdMap.set(28, 'Zafina');
    this.charaIdMap.set(29, 'Leroy');
    this.charaIdMap.set(32, 'Jun');
    this.charaIdMap.set(33, 'Reina');
    this.charaIdMap.set(34, 'Azucena');
    this.charaIdMap.set(35, 'Victor');
    this.charaIdMap.set(36, 'Raven');
    this.charaIdMap.set(38, 'Eddy');
    this.charaIdMap.set(39, 'Lidia');
    this.charaIdMap.set(40, 'Heihachi');
    this.charaIdMap.set(41, 'Clive');
    this.charaIdMap.set(42, 'Anna');

    this.charaNameMap = this.swap(this.charaIdMap)

    this.charArray = ['All', 'Alisa', 'Anna', 'Asuka', 'Azucena', 'Bryan', 'Claudio', 'Clive', 'Devil Jin', 'Dragunov', 'Eddy', 'Feng', 'Heihachi', 'Hworang', 'Jack-8', 'Jin', 'Jun', 'Kazuya', 'King', 'Kuma', 'Lars', 'Law', 'Lee', 'Leo', 'Leroy', 'Lidia', 'Lili', 'Nina', 'Panda', 'Paul', 'Raven', 'Reina', 'Shaheen', 'Steve', 'Victor', 'Xiaoyu', 'Yoshimitsu', 'Zafina']

    this.regionIdMap.set(0, 'Asia');
    this.regionIdMap.set(3, 'America');
  }
}

export const states: { name: string; code: string }[] = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' },
];
