export class ApiService { 
    constructor() {
        window.addEventListener('message', this.onPostMessage, false);
     }

    startOAuthFlow() {
       var options = 'left=100,top=10,width=400,height=500';
       window.open('http://site/connect-auth', options);
    }

    onPostMessage(event) {
      if(event.data.status === "200") {
          // Use an EventEmitter to notify the other components that user logged in
         console.log("Sign in");
      }
    }

}