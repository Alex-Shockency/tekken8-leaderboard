import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class Utilities {
    charaIdMap = new Map();
    regionIdMap = new Map();
    
    constructor() {
        this.charaIdMap.set(0,'Paul')
        this.charaIdMap.set(1,'Law')
        this.charaIdMap.set(2,'King')
        this.charaIdMap.set(3,'Yoshimitsu')
        this.charaIdMap.set(4,'Hworang')
        this.charaIdMap.set(5,'Xiaoyu')
        this.charaIdMap.set(6,'Jin')
        this.charaIdMap.set(7,'Bryan')
        this.charaIdMap.set(8,'Kazuya')
        this.charaIdMap.set(9,'Steve')
        this.charaIdMap.set(10,'Jack-8')
        this.charaIdMap.set(11,'Asuka')
        this.charaIdMap.set(12,'Devil Jin')
        this.charaIdMap.set(13,'Feng')
        this.charaIdMap.set(14,'Lili')
        this.charaIdMap.set(15,'Dragunov')
        this.charaIdMap.set(16,'Leo')
        this.charaIdMap.set(17,'Lars')
        this.charaIdMap.set(18,'Alisa')
        this.charaIdMap.set(19,'Claudio')
        this.charaIdMap.set(20,'Shaheen')
        this.charaIdMap.set(21,'Nina')
        this.charaIdMap.set(22,'Lee')
        this.charaIdMap.set(23,'Kuma')
        this.charaIdMap.set(24,'Panda')
        this.charaIdMap.set(28,'Zafina')
        this.charaIdMap.set(29,'Leroy')
        this.charaIdMap.set(32,'Jun')
        this.charaIdMap.set(33,'Reina')
        this.charaIdMap.set(34,'Azucena')
        this.charaIdMap.set(35,'Victor')
        this.charaIdMap.set(36,'Raven')
        this.charaIdMap.set(38,'Eddy')
        this.charaIdMap.set(39,'Lidia')
        this.charaIdMap.set(40,'Heihachi')
        this.charaIdMap.set(41,'Clive')

        this.regionIdMap.set(0,'Asia')
        this.regionIdMap.set(3,'America')
    }
}