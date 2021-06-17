# Veritabanı Projesi

Kütüphane Dashboard'u

## Kurulumu

Aşağıdaki node.js paketlerini klasöre yüklemeniz gerekiyor.

```bash
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "hbs": "^4.1.2",
    "jsonwebtoken": "^8.5.1",
    "mysql": "^2.18.1",
```
Aşağdakileri kendi database'inize göre ayarlayıp .env olarak dosya oluşturmanız gerekmektedir
```env
DATABASE = DatabaseName
DATABASE_HOST = localhost
DATABASE_USER = root
DATABASE_PASSWORD = 
JWT_SECRET = mysupersecretpassword
JWT_EXPIRES_IN = 90d
JWT_COOKIE_EXPIRES = 90d
```


## Çalıştırma

Terminalde bu kodu yazarak çalıştırabilirsiniz.
```js
node app.js
```
Herhangi bir hata durumunda konsol üzerinden hata raporunu görebilirsiniz.

## Özellikler
- Kullanıcı kaydı
- Kütüphane içi kitap arama
- Kullanıcı profili güncelleme 
- Kitap emanet alma
- Yetkili girişi
- Yetkili arayüzü üzerinden emanet kaldırma ve kitap silme



## License
[MIT](https://choosealicense.com/licenses/mit/)
