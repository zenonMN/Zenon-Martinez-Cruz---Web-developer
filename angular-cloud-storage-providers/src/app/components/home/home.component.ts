import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsService } from 'src/app/services/modals.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { BoxPickerModal, ModalContentComponent } from '../modal/modal.component';

declare var Dropbox;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private modalService: NgbModal,private providerService: ProvidersService, private route: ActivatedRoute, private mService: ModalsService) { 
  }

  ngOnInit(): void {
    this.providerService.getFilesSample();
    this.route.queryParams
      .subscribe(params => {
        console.log("params: ", params); // { order: "popular" }
        if(params.code)
          this.providerService.getBoxAccessToken(params.code);
        
      }
    );
  }

  openProvidersModal() {
    let modalRef = this.modalService.open(ModalContentComponent, { centered: true });
  }

  selectFolder(){
    console.log("Select folder: ", this.providerService.getProvider());
    if(this.providerService.getProvider() === "GOOGLE_DRIVE") {
      console.log("Create picker ============");
      this.providerService.createPicker();
    } else if(this.providerService.getProvider() === "DROPBOX") {
      this.createChooser();
    } else if(this.providerService.getProvider() === "ONEDRIVE") {
      this.providerService.openOneDrivePicker();
    } else if(this.providerService.getProvider() === "BOX") {
      let modalRef = this.modalService.open(BoxPickerModal, {centered: true,  keyboard: false, backdrop:'static', size: "xl"});
        modalRef.componentInstance.accessToken = this.providerService.getAccessToken("box");
    }
    
  }

  createChooser() {
    Dropbox.choose(this.providerService.options);
  }

  createFileData(){
    
    if(this.providerService.getProvider() === "GOOGLE_DRIVE") {
      this.providerService.createFileData();
    } else if(this.providerService.getProvider() === "DROPBOX") {
      this.providerService.dropboxCreateFile();
    } else if(this.providerService.getProvider() === "ONEDRIVE") {
      this.providerService.oneDriveCreateFile();
    }
  }

  createFolder(){
    if(this.providerService.getProvider() === "DROPBOX") {
      this.providerService.dropBoxCreateFolder();
    } else if(this.providerService.getProvider() === "ONEDRIVE") {
      this.providerService.oneDriveCreateFolder();
    } else if(this.providerService.getProvider() === "BOX") {
      this.providerService.boxCreateFolder();
    }
  }

  uploadFileData() {
    this.providerService.uploadFileData();
  }

  downloadFile() {
    if(this.providerService.getProvider() === "GOOGLE_DRIVE") {
      this.providerService.downloadFile();
    } else if(this.providerService.getProvider() === "DROPBOX") {
      this.providerService.dropboxDownloadFile();
    } else if(this.providerService.getProvider() === "ONEDRIVE") {
      this.providerService.oneDriveDownloadFile();
    } else if(this.providerService.getProvider() === "BOX") {
      this.providerService.boxDownloadFile();
    }
    
  }

  changePermissions(action: string) {
    this.providerService.changePermissions(action);
  }

  @HostListener('window:message', ['$event'])
  onPostMessage(event: any) {
    // console.log("EVENT: ", event);
    if(event.data["provider"] === "box") {
        // Use an EventEmitter to noboxtify the other components that user logged in
       console.log("Box code: ", event.data );
       this.providerService.getBoxAccessToken(event.data["code"]);
    }
  }
}
