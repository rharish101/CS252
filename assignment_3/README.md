# demo

- Run ```npm install``` to add the node modules.
- Use ```ionic serve --lab``` to run the project in development mode.
- Use ```ionic cordova platform add android``` to add android platform. Please make sure to have installed Android Studio and   SDK Tools. [Link](https://developer.android.com/studio/intro/update)
- After installing the platform run ```ionic cordova build android``` to generate the apk file. The genereated apk file is present inside platforms/android/app/build/outputs/apk/debug.

If you face any **enviroment changed** errors, please run ```npm rebuild node-sass --force```.

Here is the [link](https://github.com/toddmotto/public-apis) to the list of public APIs.

# Ionic Plugins

- Run ```npm install``` to install newly added node modules.

This project uses three different plugins. Please add them to your project.
Links:
  - [Geolocation Plugin](https://ionicframework.com/docs/native/geolocation/)
  - [Camera Plugin](https://ionicframework.com/docs/native/camera/)
  - [File Plugin](https://ionicframework.com/docs/native/file/)
  
As we use open source maps from leaflet, we simply install the npm package. There is no plugin. 

Usually most of the plugins need native enviroments to run. So do these plugins except geolocation. They don't work when you run ```ionic serve --lab```. So please run this project in your android phones. If you are an iPhone user, you need a Mac with XCode installed to build iOS applications. Refer to **iOS Devices** section in this [link](https://ionicframework.com/docs/intro/deploying/).

Once you install plugins and get your project ready, run ```ionic cordova build android``` to generate the apk file. The genereated apk file is present inside platforms/android/app/build/outputs/apk/debug.

Checkout Coursera [specialization](https://www.coursera.org/specializations/full-stack-mobile-app-development) on full stack development.
