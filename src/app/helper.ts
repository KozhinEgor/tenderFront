import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class helper {
  returnWord(wordStart:string, wordEnd1:string, wordEnd2_4:string, wordEnd5_19:string, number:number ): string {
    if(number === null) {return wordStart + wordEnd5_19;}
    var rem = number% 100;

    if(rem > 0 && (rem<5 || rem>20)){
      rem = rem%10;
      if(rem == 1) return wordStart + wordEnd1;
      else return wordStart + wordEnd2_4;
    }
    else return wordStart + wordEnd5_19;

  }
}
