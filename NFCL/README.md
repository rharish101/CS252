# No Frills Cab Locator

1. Run `npm install` to add the node modules.
2. Use `ionic serve --lab` to run the project in development mode.
3. Use `ionic cordova platform add android` to add android platform. Please make sure to have installed Android Studio and   SDK Tools. [Link](https://developer.android.com/studio/intro/update)
4. In the file `./platforms/android/build.gradle`, change the line:
  ```
  classpath 'com.android.tools.build:gradle:3.0.1'
  ```
  to:
  ```
  classpath 'com.android.tools.build:gradle:3.2.0'
  ```
5. Add the following line to your bashrc (or equivalent file for other shells):
  ```
  export CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL="https\://services.gradle.org/distributions/gradle-4.7-all.zip"
  ```
6. Copy the file `google-services.json` to `./platforms/android/app/`.
7. After installing the platform run `ionic cordova build android` to generate the apk file. The genereated apk file is present inside platforms/android/app/build/outputs/apk/debug.

If you face any **enviroment changed** errors, please run ```npm rebuild node-sass --force```.

## Testing Customers
For testing driver details for customers:
1. Move `drivers.php` to a location accessible by the Apache HTTP Server.
2. Open `src/pages/customer/customer.ts`.
3. Replace the server location with the url of your copy of `drivers.php`:
  ```
  private server: string = "http://localhost/~rharish/drivers.php";
  ```

## Testing Drivers
For testing driver details updation for drivers:
1. Move `update.php` to a location accessible by the Apache HTTP Server.
2. Open `src/pages/driver/driver.ts`.
3. Replace the server location with the url of your copy of `update.php`:
  ```
  private server: string = "http://localhost/~rharish/update.php";
  ```

## Testing Storage
For deleting local storage in Google Chrome while testing (eg. tutorial slides only work on first start):
1. Open Chrome developer tools.
2. Select the *Application* tab.
3. Select *IndexedDB* from *Storage* in the left toolbar.
4. Delete the storage.
