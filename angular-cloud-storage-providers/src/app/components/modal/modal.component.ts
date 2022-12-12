import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsService } from 'src/app/services/modals.service';
import { ProvidersService } from 'src/app/services/providers.service';

declare var Box;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalContentComponent {

  constructor(public activeModal: NgbActiveModal, private providerService: ProvidersService, private modalsService: ModalsService) { }

  linkWith(provider: string) {
    if(provider === "GOOGLE_DRIVE"){
      this.modalsService.openModal("google", Modal2Content);
      this.providerService.setGoogleBtns();
    } else if(provider === "DROPBOX") {
      this.modalsService.openModal("dropbox", Modal2Content);

    } else if(provider === "ONEDRIVE") {
      this.modalsService.openModal("onedrive", Modal2Content);

    } else if(provider === "BOX") {
      this.modalsService.openModal("box", Modal2Content);

    }
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal2.component.html',
  styleUrls: ['./modal.component.css']
})

export class Modal2Content {
  @Input() provider: string = "GOOGLE_DRIVE";
  constructor(public activeModal: NgbActiveModal, private providerService: ProvidersService) { }

  linkWith(provider: string) {
    if(provider === "GOOGLE_DRIVE"){
      this.providerService.signInGoogleDrive();
    }
  }

  signIn(){
    if(this.provider === "GOOGLE_DRIVE")
    this.providerService.signInGoogleDrive();
    else if(this.provider === "DROPBOX")
    this.providerService.signInDropbox();
    else if(this.provider === "ONEDRIVE")
    this.providerService.signInOneDrive();
    else if(this.provider === "BOX")
    this.providerService.signInBox();
  }

  signOut(){
    if(this.provider === "GOOGLE_DRIVE")
    this.providerService.signOutGoogleDrive();
    else if(this.provider === "DROPBOX")
    this.providerService.signOutDropbox();
    else if(this.provider === "ONEDRIVE")
    this.providerService.signOutOneDrive();
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './boxpicker.component.html',
  styleUrls: ['./modal.component.css']
})

export class BoxPickerModal {
  @Input() accessToken: string;
  constructor(public activeModal: NgbActiveModal, private providerService: ProvidersService) {
    
   }

   ngOnInit() {
    let filePicker = new Box.FilePicker();

    // Attach event listener for when the choose button is pressed
    filePicker.addListener('choose', (items) => {
    // do something with the items array
    console.log(JSON.stringify(items, null, 2));
      this.activeModal.dismiss();

      this.providerService.setSelectedFile(items[0]);
    });

    // Attach event listener for when the cancel button is pressed
    filePicker.addListener('cancel', () => {
      // do something
    });
    filePicker.show("0", this.accessToken, {
      container: ".container", 
      chooseButtonLabel: "Select",
      maxSelectable: 1
    }); 
   }

}