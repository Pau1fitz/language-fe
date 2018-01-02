// src/client.js
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAtykXEEBdSkwvgd61z6S3s_nQ9IClpIvo",
  authDomain: "chat-d8f3d.firebaseapp.com",
  databaseURL: "https://chat-d8f3d.firebaseio.com/",
  storageBucket: "bucket.appspot.com"
};

firebase.initializeApp(config);

export default firebase;
