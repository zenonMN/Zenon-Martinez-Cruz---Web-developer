import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  constructor(private modalService: NgbModal) { }

  openModal(type: string, component: any) {
    if(type === "providers")
    this.modalService.open(component, { centered: true });
    else if(type==="google")
    this.modalService.open(component, { centered: true });
    else if(type==="dropbox") {
      let modalRef = this.modalService.open(component, { centered: true });
      modalRef.componentInstance.provider = "DROPBOX";
    }
    else if(type==="onedrive") {
      let modalRef = this.modalService.open(component, { centered: true });
      modalRef.componentInstance.provider = "ONEDRIVE";
    } else if(type==="box") {
      let modalRef = this.modalService.open(component, { centered: true });
      modalRef.componentInstance.provider = "BOX";
    }
  }
}
