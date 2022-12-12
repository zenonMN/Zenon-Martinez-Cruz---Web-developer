import { HostListener, Injectable } from '@angular/core';
import { User } from '../models/user';
import { ProfileService } from './profile.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Dropbox, DropboxAuth } from "dropbox";
import { Utils } from '../commons/utils';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { BrowserCacheLocation, EventMessage, EventType, InteractionStatus, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { Client, ImplicitMSALAuthenticationProvider, MSALAuthenticationProviderOptions } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as Msal from "msal";
import SimpleAuthProvider from '../commons/simple-auth-provider';
import { environment } from 'src/environments/environment';
declare var google;
declare var OneDrive;

const CREDENTIALS = environment.credentials.google;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// If modifying these scopes, delete token.json.
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ['https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.install'];
const TOKEN_PATH = "somewhere in DB";
const GOOGLE_DRIVE_ROOT = "root";
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const CLIENT_ID = "t6xh3v644ed7ley";

//MS
const MS_DATA = environment.credentials.microsoft;

const odPickerOpts = {
  clientId: MS_DATA.clientId,
  action: "query",
  viewType: "all",
  advanced: {
    redirectUri: "http://localhost:4200/home",
  }
}

const odDownloadPickerOpts = {
  clientId: MS_DATA.clientId,
  action: "query",
  viewType: "files",
  advanced: {
    redirectUri: "http://localhost:4200/home",
  }
}

//Box
const box_DATA = environment.credentials.box;

const AUTENTICATION_URL = 'https://api.box.com/oauth2/token';
const CREATE_FOLDER = "https://api.box.com/2.0/folders/";
const COLLABORATION = "https://api.box.com/2.0/collaborations/";
const FILE = "https://api.box.com/2.0/files/";
@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private user: User = new User();
  private pickerApiLoaded: boolean = false;
  private oauthToken: string;
  private parentFolderId: string = GOOGLE_DRIVE_ROOT;
  private selectedFolder: any;
  private selectedFile: any;
  private permissionId: string;
  private dbx: DropboxAuth;
  private dbx_: Dropbox;
  private accessToken: string;
  private provider: string;
  public options: any = {};
  private linkTypeDropbox: string = "preview";
  private sharedFolderId: string;
  private loginDisplay: boolean = false;
  private authenticated : boolean = false;
  private msGraphClient: Client = null;
  private msAccessToken: string;
  private permissions: any;
  private boxClient: any;
  private boxAccessToken: string;
  msalInstance: IPublicClientApplication | undefined = undefined;
  constructor(private profileService: ProfileService, private http: HttpClient, private router: Router, private msAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService) {
    this.options = {
      success: (files) => this.dropboxFileSelect(files),
      cancel: () => this.dropboxCancelSelection(),
      linkType: this.linkTypeDropbox,
      multiselect: false,
      folderselect: true
    };
   }

  /**
  *  On load, called to load the auth2 library and API client library.
  */
  private handleClientLoad() {
    gapi.load('client:auth2', () => this.initClient());
  }
  /**
  *  Initializes the API client library and sets up sign-in state
  *  listeners.
  */
  private initClient() {
    const {client_secret, api_key, client_id, redirect_uris} = CREDENTIALS;
    gapi.client.init({
      apiKey: api_key,
      clientId: client_id,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES[0] + " " + SCOPES[1] + " " + SCOPES[2]
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn: boolean) => this.updateSigninStatus(isSignedIn));
      gapi.auth2.getAuthInstance().currentUser.listen((googleUser: gapi.auth2.GoogleUser) => this.getClientInformation(googleUser));
      // Handle the initial sign-in state.
      console.log("isSignedIn", gapi.auth2.getAuthInstance().isSignedIn.get());
      this.initSignInstatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      this.loadPicker();
    }).catch(error => {
      console.log("init error: ", error);
    });
  }

  /**
  *  Called when the signed in status changes, to update the UI
  *  appropriately. After a sign-in, the API is called.
  */
  updateSigninStatus(isSignedIn: boolean) {
    let authorizeButton = document.getElementById("authorizeGoogleBtn");
    let signoutButton = document.getElementById("signOutGoogleBtn");
    let selectBtn = document.getElementById("selectFolder");
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      // selectBtn.style.display = 'initial';
      this.listFiles();
      this.getClientInformation(gapi.auth2.getAuthInstance().currentUser.get());
      this.getRootId();
      this.oauthToken = gapi.client.getToken().access_token;
      this.provider = "GOOGLE_DRIVE";
    } else {
      // authorizeButton.style.display = 'block';
      // signoutButton.style.display = 'none';
      // selectBtn.style.display = 'none';
      this.profileService.setUser(new User());
    }
  }

  /**
   *
   */
  initSignInstatus(isSignedIn: boolean) {
    let selectBtn = document.getElementById("selectFolder");
    if (isSignedIn) {
      selectBtn.style.display = 'initial';
      this.listFiles();
      this.getClientInformation(gapi.auth2.getAuthInstance().currentUser.get());
      this.getRootId();
      this.oauthToken = gapi.client.getToken().access_token;
    } else {
      // selectBtn.style.display = 'none';
    }
  }

  /*
   */
  getRootId() {
    // gapi.client.drive.files.get({fileId: "root"}).then(() => {

    // });
  }
  /**
   *
   */
  setGoogleBtns() {
    // Handle the initial sign-in state.
    console.log("isSignedIn", gapi.auth2.getAuthInstance().isSignedIn.get());
    let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    let authorizeButton = document.getElementById("authorizeGoogleBtn");
    let signoutButton = document.getElementById("signOutGoogleBtn");
    let selectBtn = document.getElementById("selectFolder");
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      selectBtn.style.display = 'initial';
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
      // selectBtn.style.display = 'none';
    }
  }

  /**
  *  Sign in the user upon button click.
  */
  signInGoogleDrive() {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   * Sign in
   */
   signInDropbox() {
    this.dbx.getAuthenticationUrl("http://localhost:4200/home").then((authUrl) => {
      console.log("Dropbox: ", authUrl);
      window.open(authUrl.toString(), "_blank");
    });
   }

   signInOneDrive() {
    this.msAuthService.loginPopup({
      scopes:MS_DATA.scopes
    }).subscribe({
      next: (result) => {
        console.log(result);
        this.getMSClientInformation(result.account);
        this.getMSAccessToken();
      },
      error: (error) => console.log(error)
    })
   }

   setLoginDisplay() {
    this.loginDisplay = this.msAuthService.instance.getAllAccounts().length > 0;
    console.log("loginDisplay: ", this.loginDisplay);
  }

    private getMSClientInformation(acount: any){
      this.setLoginDisplay();
      this.user.name = acount["name"];
      this.user.email = acount["username"];
      this.profileService.setUser(this.user);
    }
  /**
  *  Sign out the user upon button click.
  */
   signOutGoogleDrive() {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Sign out
   */
   signOutDropbox() {
    this.dbx_.authTokenRevoke().then(response => {
      console.log("Sign out: ", response);
    });
   }

   signOutOneDrive() {
    this.msAuthService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/home'
    });
   }

   signInBox(){
    let baseUrl = "https://account.box.com/api/oauth2/authorize";
    let authorizationUrl = `${baseUrl}?client_id=${box_DATA.clientId}&response_type=code`;
    console.log("authorize_url: ", authorizationUrl);
    // window.addEventListener("message", (evt) => this.postMessageHandler(evt), false);
    window.open(authorizationUrl, "_blank");
    // window.location.href = authorizationUrl;
   }

   postMessageHandler(event: any) {
    console.log("We've got a message!");
    console.log("* Message:", event.data);
    console.log("* Origin:", event.origin);
    console.log("* Source:", event.source);
   }

  /**
  * Print files.
  */
   listFiles() {
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
      console.log('Files:');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file.name + ' (' + file.id + ')');
        }
      } else {
        console.log('No files found.');
      }
    });
  }

  private getClientInformation(googleUser: gapi.auth2.GoogleUser) {
    console.log("User Information:", googleUser.getBasicProfile().getName());
    this.user.name = googleUser.getBasicProfile().getName();
    this.user.email = googleUser.getBasicProfile().getEmail();
    this.profileService.setUser(this.user);
  }

  public getFilesSample() {
    // Authorize a client with credentials, then call the Google Drive API.
    this.handleClientLoad();
    //Dropbox
    this.dropboxInit();
    //Microsoft
    this.msAuthInit();
    //box
    this.boxAuthInit();
  }

  private boxAuthInit(){
    this.boxAccessToken = localStorage.getItem('boxAccessToken');
    console.log("boxAccessToken", this.boxAccessToken);
    if(!this.boxAccessToken)
      return;

    this.boxGetUser();
  }

  private boxGetUser() {
    let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken, "Content-Type": "application/json" });
      this.http.get("https://api.box.com/2.0/users/me/", {headers:headers}).subscribe((res : any)=>{
        console.log("Response: ", res);
        this.user.email = res.login;
        this.user.name = res.name;
        this.profileService.setUser(this.user);
        this.provider = "BOX";
      });
  }

  private msAuthInit() {
    console.log("MS init");
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    //-------------------
    this.getMSAccessToken().then((accessToken) => {
      if(!accessToken)
        return;
      console.log("AccessToken: ", accessToken);
      this.msAccessToken = accessToken;
      this.msGraphClient = Client.initWithMiddleware({
        // Initialize the Graph client with an auth
        // provider that requests the token from the
        // auth service
        authProvider: new SimpleAuthProvider(accessToken)
      });
      this.getUser();
    });

  }

  getUser() {
    this.msGraphClient
    .api('/me')
    .select('displayName,mail,userPrincipalName')
    .get().then((response: MicrosoftGraph.User) => {
      console.log("USER: ", response);
      this.user.name = response.displayName;
      this.user.email = response.userPrincipalName;
      this.profileService.setUser(this.user);
      this.provider = "ONEDRIVE";
    })
  }

  getMSAccessToken(): Promise<string> {
    console.log("Get access token");
    return new Promise<string>((resolve, reject) => {
      this.msAuthService
      .acquireTokenSilent({
        account: this.msAuthService.instance.getAllAccounts()[0],
        scopes: MS_DATA.scopes
      })
      .toPromise().then(response => {
        console.log('Get Token Response: ', response);
        resolve(response.accessToken);
      })
      .catch((reason) => {
        console.log('Get token failed', JSON.stringify(reason, null, 2));
        resolve("");
      });
    });
  //  let result =
  }

  getBoxAccessToken(code: string) {
    let request = JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: box_DATA.clientId,
      client_secret: box_DATA.clientSecret
    });
    this.http.post(AUTENTICATION_URL, request).subscribe((response:any) => {
      console.log("Response", response);
      this.boxAccessToken = response.access_token;
      localStorage.setItem('boxAccessToken', response.access_token);
      console.log("boxAccessToken", this.boxAccessToken);
      this.boxGetUser();
    });
  }

  MSALInstanceFactory(): IPublicClientApplication {
    this.msalInstance = this.msalInstance ?? new PublicClientApplication({
      auth: {
        clientId: MS_DATA.clientId,
        redirectUri: MS_DATA.redirectUri,
        postLogoutRedirectUri: MS_DATA.redirectUri
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
      }
    });

    return this.msalInstance;
  }

  private dropboxInit() {
    this.dbx = new DropboxAuth({clientId: CLIENT_ID});
    this.accessToken = this.getAccessTokenFromUrl();
    if(this.accessToken) {
      this.provider = "DROPBOX";
      this.initDropboxSignInstatus();
      let selectBtn = document.getElementById("selectFolder");
    }
  }

  private initDropboxSignInstatus() {
    this.dbx_ = new Dropbox({ accessToken: this.accessToken });
    this.getDropboxClientInformation();
      this.dbx_.filesListFolder({path: ''})
        .then(response => {
          this.renderItems(response.result.entries);
        })
        .catch(error => {
          console.error(error);
        });
  }

  private getDropboxClientInformation(){
    this.dbx_.usersGetCurrentAccount()
    .then(response => {
      console.log("User Information from dropbox:", response["result"]);
    this.user.name = response["result"].name.display_name;
    this.user.email = response["result"].email;
    this.profileService.setUser(this.user);
    })
    .catch(error => {
      console.error(error);
    });
  }

  private renderItems(items: any[]) {
    items.forEach(item => {
      console.log("ITEM: ", item);
    });
  }

  getAccessTokenFromUrl() {
    return Utils.getQueryStringParam(window.location.hash, "access_token");
   }

  getBoxAccessTokenFromUrl() {
    console.log("location: ", window.location.hash);
    return Utils.getQueryStringParam(window.location.hash, "code");
  }


  /**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
   getAccessToken(provider: string) {
     if(provider === "box")
     return this.boxAccessToken;
  }


  //
  // Use the Google API Loader script to load the google.picker script.
  loadPicker() {
    // gapi.load('auth', () => this.onAuthApiLoad());
    gapi.load('picker', () => this.onPickerApiLoad());
  }

  onAuthApiLoad() {
    gapi.auth.authorize(
        {
          'client_id': CREDENTIALS.client_id,
          'scope': SCOPES[1],
          'immediate': false
        },
        (token: GoogleApiOAuth2TokenObject) => this.handleAuthResult(token));
  }

  onPickerApiLoad() {
    this.pickerApiLoaded = true;
    // this.createPicker();
  }

  handleAuthResult(authResult: GoogleApiOAuth2TokenObject) {
    console.log("Auth result: ", authResult);
    if (authResult && !authResult.error) {
      this.oauthToken = authResult.access_token;
      // this.createPicker();
    }
  }

  // Create and render a Picker object for searching images.
  createPicker() {
    // console.log(this.pickerApiLoaded, this.oauthToken);
    if (this.pickerApiLoaded && this.oauthToken) {
      let sharedFoldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
      sharedFoldersView.setEnableDrives(true);
      sharedFoldersView.setSelectFolderEnabled(true);
      let foldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
      foldersView.setSelectFolderEnabled(true);
      let docView = new google.picker.DocsUploadView();
      let picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
          .setAppId(CREDENTIALS.appId)
          .setOAuthToken(this.oauthToken)
          .addView(foldersView)
          .addView(new google.picker.View(google.picker.ViewId.DOCS))
          .addView(sharedFoldersView)
          .addView(docView)
          .setLocale('es')
          .setDeveloperKey(CREDENTIALS.api_key)
          .setCallback((data) => this.pickerCallback(data))
          .build();
       picker.setVisible(true);
    }
  }

  // A simple callback implementation.
  pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
      let doc = data.docs[0];
      let fileId = data.docs[0].id;
      alert('The user selected: ' + fileId);
      console.log("the user selected: ", doc);
      // gapi.client.drive.files.get({
      //   fileId: fileId,
      //   fields: "*"
      // }).then((response) => {
      //   console.log("FILE METADATA: ", response);
      // });
      if (doc.mimeType === FOLDER_MIME_TYPE) {
        console.log("Selected Folder: ", doc);
        this.selectedFolder = doc;
      } else {
        this.selectedFile=doc;
      }
    }
  }

  //For folder: application/vnd.google-apps.folder
  createFileData(){
    let fileMetadata = {
      'name' : 'New text file',
      'mimeType' : 'text/plain',
      'parents': ["root"]
    };
    gapi.client.drive.files.create({
      resource: fileMetadata
    }).then(function(response) {
      switch(response.status){
        case 200:
          let file = response.result;
          console.log('Created Folder Id: ', file.id);
          break;
        default:
          console.log('Error creating the file, '+response);
          break;
        }
    });
  }

  dropboxCreateFile() {
    this.dbx_.filesUpload({
      path: "/FOLDEREXAMPLE/NewFile.txt",
      mode: {
        ".tag": "add"
      },
      autorename: true
    }).then(response => {
      console.log("File created: ", response);
    }).catch(error => console.log("File create error: ", error));
  }

  dropBoxCreateFolder(){
    this.dbx_.filesCreateFolderV2({
      path: "/FOLDEREXAMPLE",
      "autorename": true
    }).then(response => {
      console.log("File created: ", response);
    }).catch(error => console.log("File create error: ", error));
  }

  uploadFileData() {

  }

  //ALL FIELDS: fields: "*"
  downloadFile() {
    gapi.client.drive.files.get({
      fileId: this.selectedFile.id,
      alt: "media"
    }).then((response) => {
      console.log("response : ", response);
    //   let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.oauthToken });
    //   this.http.get(response.result["webContentLink"], {headers}).subscribe((res : any)=>{
    //   // let blob = new Blob([res], {type: this.selectedFile.mimeType});
    //   // console.log("BLOB: ", blob);
    //   // saveAs(blob, attachment.filename);
    // });
    }).catch((err) => {
      console.log("Error in download file: ", err);
    });
  }

  changePermissions(type: string) {
    // this.getPermissionsInfo();
    if(type === "view"){
      this.getPermissionsInfo();
    }else if(type === "add") {
      this.addMemberToSharingList();
    } else if(type == "remove") {
      this.removeMemberPermission();
    }
  }

  removeMemberPermission() {
    if(this.provider === "GOOGLE_DRIVE") {
      gapi.client.drive.permissions.delete({
        fileId: this.selectedFile.id,
        permissionId: this.permissionId
      }).then((res:any) => {
        console.log('Permission delete response: ', res);
      }).catch(err => console.log(err));
    } else if(this.provider === "DROPBOX") {
      if(this.selectedFile["isDir"]) { //Carpeta
        this.dbx_.sharingRemoveFolderMember({
          shared_folder_id: this.sharedFolderId,
          member: {
            ".tag": "email",
            "email": "zenon.mn.23@gmail.com"
          },
          leave_a_copy: false
        }).then(response => {
          console.log("Response removing file member: ", response);
        }).catch(error => {
          console.log("Error: ", error);
        });
      } else{
        this.dbx_.sharingRemoveFileMember2({
          file: this.selectedFile.id,
          member: {
            ".tag": "email",
            "email": "zenon.mn.23@gmail.com"
          }
        }).then(response => {
          console.log("Response removing file member: ", response);
        }).catch(error => {
          console.log("Error: ", error);
        });
      }
    } else if(this.provider === "ONEDRIVE") {
      let user;
      let permissionId: string;
      console.log("Permission: ", this.permissions.value[0]);
      let values: any[] = this.permissions.value;
      for(let i = 0; i < values.length; i++) {
        console.log("Permission: ", this.permissions.value[i]);
        user = this.permissions.value[i]["invitation"];
        if(user["email"] === "notdraw@outlook.com") {
          permissionId = this.permissions.value[i]["id"];
          let parentReference = this.selectedFile["parentReference"];
          this.msGraphClient.api(`/drives/${parentReference["driveId"]}/items/${parentReference["id"]}/permissions/${permissionId}`).delete().then(response => {
            console.log("Delete permission: ", response);
          });
        }
      }
    } else if(this.provider === "BOX") {
      let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken, "Content-Type": "application/json" });

      this.http.get(FILE+this.selectedFile.id+"/collaborations", {headers:headers}).subscribe((res : any)=>{
        console.log("Response: ", res);
        let user;
        let collaborationId: string;
        console.log("Permission: ", res.entries);
        let values: any[] = res.entries;
        for(let i = 0; i < values.length; i++) {
          console.log("Permission: ", values[i]);
          user = values[i].invite_email;
          if(user === "zenon.mn.23@gmail.com") {
            collaborationId = values[i]["id"];
            this.http.delete(COLLABORATION+collaborationId, {headers:headers}).subscribe((res : any)=>{
              console.log("Response: ", res);
            });
          }
        }
      });
    }
  }
  getPermissionsInfo() {
    if(this.provider === "GOOGLE_DRIVE") {
      gapi.client.drive.files.get({
        fileId: this.selectedFile.id,
        fields: "capabilities, permissionIds, permissions"
      }).then((response) => {
        console.log("response : ", response);
      });
    } else if(this.provider === "DROPBOX") {
      if(!this.selectedFile["isDir"]) {
        this.dbx_.sharingListFileMembers({file: this.selectedFile.id}).then(response => {
          console.log("response sharing list : ", response);
        }).catch(error => {
          console.log("Error : ", error);
        });
      } else {
        // this.dbx_.sharingListFolderMembers({shared_folder_id: response.result["shared_folder_id"]}).then(response2 => {
        //   console.log("response sharing list : ", response2);
        // }).catch(error => {
        //   console.log("Error : ", error);
        // });

      }
    } else if(this.provider === "ONEDRIVE") {
      let parentReference = this.selectedFile["parentReference"];
      this.msGraphClient.api(`/drives/${parentReference["driveId"]}/items/${parentReference["id"]}/permissions`).get().then(response => {
        console.log("Get permission: ", response);
        this.permissions = response;
      });
    } else if(this.provider === "BOX") {
      let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken, "Content-Type": "application/json" });
      this.http.get(FILE+this.selectedFile.id+"/collaborations", {headers:headers}).subscribe((res : any)=>{
        console.log("Response: ", res);
      });
    }
  }

  addMemberToSharingList() {
    if(this.provider === "GOOGLE_DRIVE") {
      /**
       * Cuando intentas crear un permiso, se requiere de dos campos importantes: type, role.
       * si el tipo es user o group se debe proporcionar un correo electrónico.
       */
       let permissions = {
        type: "user",
        role: "reader",
        emailAddress: "zenon.mn.23@gmail.com"
      };
      gapi.client.drive.permissions.create({
        fileId: this.selectedFile.id,
        resource: permissions,
        fields: "id"
      }).then((res:any) => {
        console.log('Permission ID: ', res);
        this.permissionId = res.result.id;
      }).catch(err => console.log(err));
    } else if(this.provider === "DROPBOX") {
      if(!this.selectedFile["isDir"]){
        //Se necesita dar permiso primero a la carpeta padre
        this.dbx_.sharingAddFileMember({
          file: this.selectedFile.id,
          members: [
            {
              ".tag": "email",
              "email": "zenon.mn.23@gmail.com"
            }
          ],
          "custom_message": "This is a custom message about ACME.doc",
          "access_level": {'.tag': 'editor'}
        }).then(response => {
          console.log("response add member sharing list : ", response);
        }).catch(error => {
          console.log("Error : ", error, this.selectedFile);
        });
      } else {
        //Compartir carpeta
        this.dbx_.sharingShareFolder({
          path:"/FOLDEREXAMPLE",
          acl_update_policy: {'.tag': 'owner'}
        }).then(response => {
          console.log("response sharing Folder : ", response);
          this.dbx_.sharingAddFolderMember({
            shared_folder_id: response.result["shared_folder_id"],
            members: [
              {
                "member": {
                    ".tag": "email",
                    "email": "zenon.mn.23@gmail.com"
                },
                "access_level": {'.tag': 'editor'}
              }
            ],
            "custom_message": "Documentation for launch day"
          })
          .then(response => {
            console.log("response add member sharing list : ", response);
          }).catch(error => {
            console.log("Error : ", error, this.selectedFile);
          });
        }).catch(error => {
          console.log("Error : ", error);
        });
      }
    } else if(this.provider === "ONEDRIVE") {
      //Drives with a driveType of personal (OneDrive personal) cannot create or modify permissions on the root DriveItem
      let request = {
        "recipients": [
          {
            "email": "notdraw@outlook.com"
          }
        ],
        "message": "Here's the file that we're collaborating on.",
        "requireSignIn": true,
        "sendInvitation": true,
        "roles": [ "write" ]
      };
      let parentReference = this.selectedFile["parentReference"];
      this.msGraphClient.api(`/drives/${parentReference["driveId"]}/items/${parentReference["id"]}/invite`).post(request).then(response => {
        console.log("Add permission: ", response);
      });
    } else if(this.provider === "BOX") {
      let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken, "Content-Type": "application/json" });
      let request = JSON.stringify({
        "item": {
          "type": this.selectedFile.type,
          "id": this.selectedFile.id
        },
        "accessible_by": {
          "type": "user",
          "login": "zenon.mn.23@gmail.com"
        },
        "role": "editor"
      });
      this.http.post(COLLABORATION, request, {headers: headers}).subscribe((response:any) => {
        console.log("Response", response);

      });
    }
  }

  getProvider() {
    return this.provider;
  }

  dropboxFileSelect(files) {
    console.log("dropbox file selected: ", files[0]);
    this.selectedFile = files[0];
    this.dbx_.filesGetMetadata({
      path: files[0].id
    }).then(response => {
      console.log("metadata: ", response.result);
      this.sharedFolderId = response.result["shared_folder_id"] ? response.result["shared_folder_id"]  : null;
    }).catch(error => {
      console.log("metadata error: ", error);
    });
  }

  dropboxCancelSelection() {
    console.log("dropbox file selection cancel: ");
  }
  //

  setLinkType(type: string) {
    this.linkTypeDropbox = type;
  }

  dropboxDownloadFile() {
    this.dbx_.filesDownload({path: this.selectedFile.id}).then(response2 => {
      console.log("Response 2: ", response2.result);
      saveAs(response2.result["fileBlob"], response2.result.name);
    });
  }


  //MS
  openOneDrivePicker() {
    let options = {
      success: (files) => this.oneDriveFileSelect(files),
      cancel: () => this.oneDriveCancelSelection(),
      error: () => this.oneDriveErrorSelection()
    };
    console.log("ONEDRIVE options: ", Object.assign(options, odPickerOpts));
    OneDrive.open(Object.assign(options, odPickerOpts));
  }

  oneDriveFileSelect(files){
    console.log("oneDrive file selected: ", files);
    this.selectedFile = files;
    this.oneDriveGetFile(files);
  }

  oneDriveGetFile(files) {
    //webUrl es para visualizar el archivo
    let file = files["value"][0];
    this.msGraphClient.api(`/drives/${file["parentReference"]["driveId"]}/items/${file["id"]}`).get().then(response => {
      console.log("Get File: ", response);
      this.selectedFile = response;
    });
  }

  oneDriveCancelSelection() {

  }

  oneDriveErrorSelection() {

  }

  oneDriveCreateFile() {

  }

  oneDriveDownloadFile() {
    if(this.selectedFile["folder"])
      return;
    // let parentReference = this.selectedFile["parentReference"];
    // this.msGraphClient.api(`/drives/${parentReference["driveId"]}/items/${parentReference["id"]}/content`).get().then(response => {
    //   console.log("Get File content: ", response);
    // });

    let downloadUrl: string = "@microsoft.graph.downloadUrl";
    this.http.get(this.selectedFile[downloadUrl], {responseType: 'blob'}).subscribe((res)=>{
      let blob = new Blob([res], {type: this.selectedFile["file"]["mimeType"]});
      saveAs(blob, this.selectedFile["name"]);
    });
  }

  oneDriveCreateFolder() {
    let request = {
      "name": "EXAMPLE-ND-2",
      "folder": { },
      "@microsoft.graph.conflictBehavior": "rename"
    };
    this.msGraphClient.api(`/me/drive/items/root/children`).post(request).then(response => {
      console.log("Create Folder: ", response);
      //If successful, this method returns the newly created folder as a DriveItem resource
    });
  }

  boxCreateFolder() {
    let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken, "Content-Type": "application/json" });
    let request = JSON.stringify({
      name: "NEW FOLDER - ND",
      "parent": {
        "id": "0"
      }
    });
    this.http.post(CREATE_FOLDER, request, {headers: headers}).subscribe((response:any) => {
      console.log("Response", response);
      this.selectedFile = response;
    });
  }

  setSelectedFile(file: any) {
    this.selectedFile = file;
    console.log("Selected file: ", file);
  }

  boxDownloadFile() {
    if(this.selectedFile.type !== "file")
      return;

    let headers = new HttpHeaders({'Authorization':  'Bearer ' + this.boxAccessToken});
    this.http.get(FILE+this.selectedFile.id+"/content", {headers:headers, responseType: 'blob'}).subscribe((res : any)=>{
      console.log("Response: ", res);
      let blob = new Blob([res], {type: this.selectedFile.extension});
      saveAs(blob, this.selectedFile["name"]);
    });
  }


}
