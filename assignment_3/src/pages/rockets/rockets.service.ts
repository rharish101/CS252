import { Injectable } from "@angular/core";
import { HTTPService } from "../../app/httpservice.service";

@Injectable()
export class RocketService{
    constructor(private httpService: HTTPService){

    }
    
    getData(){
        return this.httpService.sendGETRequest("https://api.spacexdata.com/v3/rockets")
    }
}