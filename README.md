## LetMeSport mobile app
Ionic Angular2

npm install -g ionic cordova
### How to start
* npm install
* ionic serve

Чтобы собрать:
* ionic cordova build ios --release --prod
* ionic cordova build android --release --prod

Если сборка не проходит, то есть вот такой баг с манки патчингом node_modules https://github.com/ionic-team/ionic/issues/12628
Ключ для подписи андройд версии в файле weev_ks.jks пароль weevweev

Подписывать через apkisgner https://developer.android.com/studio/command-line/apksigner.html
