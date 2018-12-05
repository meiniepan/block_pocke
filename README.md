## Before
For Linux system:

```
sam@sam-thinkpad:~/Public/trustpocket$ echo fs.inotify.max_user_watches=16384 | sudo tee -a /etc/sysctl.conf
fs.inotify.max_user_watches=16384
sam@sam-thinkpad:~/Public/trustpocket$ sudo sysctl -p
fs.inotify.max_user_watches = 16384

```
## How to use
```
yarn
```


```
react-native link nodejs-mobile-react-native
react-native link react-native-gesture-handler
react-native link react-native-ping
react-native link react-native-camera
or

react-native link
```
```
cd nodejs-assets
cd nodejs-project
yarn

```
```
react-native run-android
```
