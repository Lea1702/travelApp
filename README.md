# Travel App Client

Welcome to the Travel App ! Here, you can easily find many options of activities, customized especially for you !
You can choose between answering a small form, or uploading pictures of similar trips that you would like to do.

The application uses Geolocalisation to make sure to recommend activities in your country and next to you !
Make sure to click "Allow" so we can know your position.

Have fun ! :)

## Installation

Install all dependencies with npm

```bash
  npm install
```

If you run the application in VSCode, download the Ionic extension.

Click on sync, then on build, and finally under Run click on Web.

Go to http://localhost:8100/ on your browser, press F12 and select Mobile mode to see how it will look on mobile.

## Tabs

The application has three Tabs

### Questions

http://localhost:8100/questions

In this tab you can answer the form, clicking on submit will call the get trip api, and will redirect to the results tab.

### Pictures

http://localhost:8100/pictures

In this tab you can upload one or more images from your device, clicking on submit will call the post upload_endpoint api, and will redirect to the results tab.

### Speech

http://localhost:8100/speech

In this tab you can record, edit the record and get similar trips of your recorded description, and will redirect to the results tab.

### Results

http://localhost:8100/results

You are redirected to this tab after clicking on submit in questions or pictures tab. You can see clearly the openai propositions to travel, with the address, the time and the description of each activity, each day.

For results from the pictures tab, you will have three options of day trip that are similar to the uploaded picture.

## Analytics

The application uses Firebase to control the analytics.
https://console.firebase.google.com/u/0/project/travelapp-24980/overview
