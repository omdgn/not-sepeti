
// ======================= COMPONENTS & SCHEMAS =======================

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       description: MongoDB `User` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         universityId:
 *           type: string
 *           format: objectId
 *           nullable: true
 *         profilePic:
 *           type: string
 *           nullable: true
 *         score:
 *           type: integer
 *         monthlyScore:
 *           type: integer
 *         level:
 *           type: integer
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *         stats:
 *           type: object
 *           properties:
 *             notes:
 *               type: integer
 *             comments:
 *               type: integer
 *             likesReceived:
 *               type: integer
 *         lastMonthlyReset:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         aboutMe:
 *           type: string
 *           nullable: true
 *         department:
 *           type: string
 *           nullable: true
 *         socialLinks:
 *           type: object
 *           properties:
 *             linkedin:
 *               type: string
 *               nullable: true
 *             github:
 *               type: string
 *               nullable: true
 *         notifications:
 *           type: boolean
 *         isVerified:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         verificationToken:
 *           type: string
 *           nullable: true
 *         verificationExpires:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         resetPasswordToken:
 *           type: string
 *           nullable: true
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     University:
 *       type: object
 *       description: MongoDB `University` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         emailDomains:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Course:
 *       type: object
 *       description: MongoDB `Course` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [split, single]
 *         universityId:
 *           type: string
 *           format: objectId
 *         noteCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Note:
 *       type: object
 *       description: MongoDB `Note` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         courseId:
 *           type: string
 *           format: objectId
 *         instructor:
 *           type: string
 *           nullable: true
 *         driveLink:
 *           type: string
 *         year:
 *           type: string
 *           nullable: true
 *         createdBy:
 *           type: string
 *           format: objectId
 *         universityId:
 *           type: string
 *           format: objectId
 *         likes:
 *           type: integer
 *         dislikes:
 *           type: integer
 *         reports:
 *           type: integer
 *         viewCount:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Comment:
 *       type: object
 *       description: MongoDB `Comment` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         noteId:
 *           type: string
 *           format: objectId
 *         userId:
 *           type: string
 *           format: objectId
 *         text:
 *           type: string
 *         likes:
 *           type: integer
 *         dislikes:
 *           type: integer
 *         reports:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     DepartmentCode:
 *       type: object
 *       description: MongoDB `DepartmentCode` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [split, single]
 *         universityId:
 *           type: string
 *           format: objectId
 *         addedBy:
 *           type: string
 *           format: objectId
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Notification:
 *       type: object
 *       description: MongoDB `Notification` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         userId:
 *           type: string
 *           format: objectId
 *         type:
 *           type: string
 *           enum: [like, comment, badge, level_up]
 *         relatedNoteId:
 *           type: string
 *           format: objectId
 *           nullable: true
 *         lastComment:
 *           type: string
 *           nullable: true
 *         badge:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             icon:
 *               type: string
 *         newLevel:
 *           type: integer
 *           nullable: true
 *         count:
 *           type: integer
 *         lastActors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *               name:
 *                 type: string
 *         isRead:
 *           type: boolean
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Reaction:
 *       type: object
 *       description: MongoDB `Reaction` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         userId:
 *           type: string
 *           format: objectId
 *         targetType:
 *           type: string
 *           enum: [notes, comments]
 *         targetId:
 *           type: string
 *           format: objectId
 *         type:
 *           type: string
 *           enum: [like, dislike, report]
 *         description:
 *           type: string
 *           nullable: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserSuggestion:
 *       type: object
 *       description: MongoDB `UserSuggestion` dokümanı.
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         userId:
 *           type: string
 *           format: objectId
 *         status:
 *           type: string
 *           enum: [Beklemede, Görüldü, İnceleniyor, Eklendi, Eklenmedi]
 *         adminNotes:
 *           type: string
 *           nullable: true
 *         adminId:
 *           type: string
 *           format: objectId
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
*/






















// ======================= AUTH ROUTES =======================
// Bu bölüm kullanıcı kayıt ve giriş işlemleri için endpointleri kapsar.

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Kullanıcı kayıt ve giriş işlemleri
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanıcı kaydı
 *     description: |
 *       Yeni bir kullanıcı kaydı oluşturur. 
 *       - Kullanıcının e-posta adresi, seçilen üniversitenin domainlerinden biriyle eşleşmelidir.
 *       - Kullanıcı rolü `user` ise `universityId` ve `slug` alanları zorunludur.
 *       - Opsiyonel `role` alanı `admin` gönderilirse üniversite eşlemesi yapılmaz ve hesap doğrulanmış olarak açılır.
 *       - Şifre aşağıdaki kuralları sağlamalıdır:
 *         * Minimum 6 karakter
 *         * En az 1 büyük harf
 *         * En az 1 küçük harf
 *         * En az 1 rakam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Kullanıcı adı (zorunlu, benzersiz olması gerekmez)"
 *                 example: "Ali Yılmaz"
 *               email:
 *                 type: string
 *                 description: "E-posta adresi (zorunlu, üniversite domaini ile eşleşmeli)"
 *                 example: "ali@boun.edu.tr"
 *               password:
 *                 type: string
 *                 description: "Şifre (zorunlu, güçlü şifre kurallarına uygun olmalı)"
 *                 example: "YeniSifre123"
 *               universityId:
 *                 type: string
 *                 description: "Üniversite ID (kullanıcı rolü 'user' için zorunlu)"
 *                 example: "64fbbf9e12ab34cd56ef7892"
 *               slug:
 *                 type: string
 *                 description: "Üniversite slug değeri (kullanıcı rolü 'user' için zorunlu)"
 *                 example: "bogazici"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: "Varsayılan 'user'. Admin hesabı oluşturmak için 'admin' gönderilebilir."
 *                 example: "user"
 *     responses:
 *       201:
 *         description: "Kayıt başarılı"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kayıt başarılı! Lütfen e-postanızı doğrulayın."
 *       400:
 *         description: "Eksik veya hatalı alan (ör: üniversite ID/slug hatalı, e-posta domaini eşleşmiyor, şifre kurallara uymuyor, kullanıcı zaten var)"
 *       429:
 *         description: "Çok fazla deneme yapıldı (limit: 1 saatte 3 kayıt denemesi)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Çok fazla kayıt denemesi yapıldı. Lütfen 1 saat sonra tekrar deneyin."
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /auth/myProfile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     summary: Kendi profil bilgilerini getir
 *     description: Giriş yapmış kullanıcının profil, oyunlaştırma ve istatistik bilgilerini döndürür.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer {JWT} formatında erişim tokeni"
 *     responses:
 *       200:
 *         description: Profil bilgileri döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                       nullable: true
 *                     department:
 *                       type: string
 *                       nullable: true
 *                     aboutMe:
 *                       type: string
 *                       nullable: true
 *                     socialLinks:
 *                       type: object
 *                       properties:
 *                         linkedin:
 *                           type: string
 *                           nullable: true
 *                         github:
 *                           type: string
 *                           nullable: true
 *                     university:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                 gamification:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                     monthlyScore:
 *                       type: integer
 *                     level:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     badges:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           description:
 *                             type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalNotes:
 *                       type: integer
 *                     totalLikes:
 *                       type: integer
 *                     totalComments:
 *                       type: integer
 *       401:
 *         description: Token eksik veya kullanıcı doğrulanamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /auth/profile:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     summary: Profil bilgilerini güncelle
 *     description: |
 *       Giriş yapmış kullanıcı; ad, profil fotoğrafı, hakkımda alanı, bölüm bilgisi, sosyal linkler veya bildirim tercihini güncelleyebilir.
 *       En az bir alan (name, profilePic, aboutMe, department, socialLinks, notifications) gönderilmelidir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 2-50 karakter aralığında olmalı
 *                 example: "Ali Yılmaz"
 *               profilePic:
 *                 type: string
 *                 nullable: true
 *                 description: Geçerli bir HTTP(S) URL'i veya boş bırakılabilir
 *                 example: "https://example.com/avatar.png"
 *               aboutMe:
 *                 type: string
 *                 nullable: true
 *                 description: Maksimum 500 karakter
 *                 example: "3. sınıf bilgisayar mühendisliği öğrencisi"
 *               department:
 *                 type: string
 *                 nullable: true
 *                 description: Maksimum 100 karakter
 *                 example: "Bilgisayar Mühendisliği"
 *               socialLinks:
 *                 type: object
 *                 description: Sosyal medya bağlantıları (opsiyonel alanlar)
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                     nullable: true
 *                     description: Geçerli bir LinkedIn URL'i
 *                   github:
 *                     type: string
 *                     nullable: true
 *                     description: Geçerli bir GitHub URL'i
 *               notifications:
 *                 type: boolean
 *                 description: Bildirim alma tercihi (varsayılan true)
 *     responses:
 *       200:
 *         description: Profil güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profil başarıyla güncellendi"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                       nullable: true
 *                     aboutMe:
 *                       type: string
 *                       nullable: true
 *                     department:
 *                       type: string
 *                       nullable: true
 *                     socialLinks:
 *                       type: object
 *                       properties:
 *                         linkedin:
 *                           type: string
 *                           nullable: true
 *                         github:
 *                           type: string
 *                           nullable: true
 *                     notifications:
 *                       type: boolean
 *       401:
 *         description: Token eksik veya kullanıcı doğrulanamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hesabınız pasif durumdadır."
 *       400:
 *         description: Geçersiz veri veya hiçbir alan gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Güncellenecek en az bir alan belirtmelisiniz"
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */



/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Kullanıcı girişi
 *     description: |
 *       Kullanıcı giriş yapar. 
 *       - Eğer kullanıcı `isActive = false` ise giriş engellenir.
 *       - Eğer kullanıcı `isVerified = false` ise giriş engellenir.
 *       - Başarılı girişte `lastLogin` güncellenir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: "E-posta adresi"
 *                 example: "ali@boun.edu.tr"
 *               password:
 *                 type: string
 *                 description: "Şifre"
 *                 example: "YeniSifre123"
 *     responses:
 *       200:
 *         description: "Giriş başarılı"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Giriş başarılı"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fbbf9e12ab34cd56ef7890"
 *                     name:
 *                       type: string
 *                       example: "Ali Yılmaz"
 *                     email:
 *                       type: string
 *                       example: "ali@boun.edu.tr"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     university:
 *                       type: object
 *                       nullable: true
 *                       description: Kullanıcının üniversitesi (admin ise null)
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64fbbf9e12ab34cd56ef7892"
 *                         slug:
 *                           type: string
 *                           example: "bogazici"
 *       400:
 *         description: "Eksik parametre veya kullanıcı bulunamadı"
 *       401:
 *         description: "Şifre yanlış"
 *       403:
 *         description: "Kullanıcı pasif veya doğrulanmamış"
 *       429:
 *         description: "Çok fazla başarısız giriş denemesi (limit: 15 dakikada 5 deneme)"
 *       500:
 *         description: "Sunucu hatası"
 */



/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Şifreyi sıfırla
 *     description: |
 *       Şifre sıfırlama bağlantısıyla gelen `token` kullanılarak yeni şifre belirlenir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: jwt.token.string
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword1
 *     responses:
 *       200:
 *         description: Şifre başarıyla değiştirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Şifre başarıyla güncellendi.
 *       400:
 *         description: "Token geçersiz veya süresi dolmuş"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token geçersiz veya süresi dolmuş."
 *       500:
 *         description: "Sunucu hatası"
 */



/**
 * @openapi
 * /auth/profileResetPassword:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     summary: Profil şifresini güncelle
 *     description: |
 *       Giriş yapmış kullanıcı mevcut şifresini doğruladıktan sonra yeni şifre belirler.
 *       - Yeni şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.
 *       - Yeni şifre mevcut şifreyle aynı olamaz.
 *       - Oran sınırlaması: 15 dakikada en fazla 3 şifre değişikliği isteği.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: "Mevcut şifreniz"
 *                 example: "EskiSifre123"
 *               newPassword:
 *                 type: string
 *                 description: "Yeni şifre (güçlü şifre kurallarına uygun olmalı)"
 *                 example: "YeniSifre123"
 *     responses:
 *       200:
 *         description: Şifre güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Şifre başarıyla güncellendi"
 *       400:
 *         description: "Geçersiz veri, eksik alan veya yeni şifre kurallara uymuyor"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yeni şifre eski şifrenizle aynı olamaz"
 *       401:
 *         description: "Mevcut şifre yanlış"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mevcut şifre yanlış"
 *       403:
 *         description: "Token geçersiz veya hesap pasif"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       404:
 *         description: "Kullanıcı bulunamadı"
 *       429:
 *         description: "Çok fazla şifre değiştirme isteği (15 dakikada 3 deneme)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Çok fazla şifre değiştirme isteği. Lütfen 15 dakika bekleyin."
 *       500:
 *         description: "Sunucu hatası"
 */



/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     tags: [Auth]
 *     summary: E-posta doğrulama
 *     description: |
 *       Kullanıcının e-posta adresine gönderilen doğrulama linkindeki token ile hesabı doğrular.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: "E-posta doğrulama tokeni"
 *     responses:
 *       200:
 *         description: "E-posta başarıyla doğrulandı"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-posta başarıyla doğrulandı."
 *       400:
 *         description: "Token geçersiz veya süresi dolmuş"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token geçersiz veya süresi dolmuş."
 *       500:
 *         description: "Sunucu hatası"
 */



/**
 * @openapi
 * /auth/resend-verification-email:
 *   post:
 *     tags: [Auth]
 *     summary: Doğrulama e-postasını yeniden gönder
 *     description: Daha önce kayıt olmuş ancak e-postasını doğrulamamış kullanıcıya yeni doğrulama bağlantısı gönderir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ogrenci@boun.edu.tr
 *     responses:
 *       200:
 *         description: Doğrulama e-postası gönderildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doğrulama e-postası tekrar gönderildi."
 *       400:
 *         description: Hesap zaten doğrulanmış
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hesap zaten doğrulanmış."
 *       404:
 *         description: Kullanıcı bulunamadı
 *       429:
 *         description: "Çok fazla istek (limit: 5 dakikada 3 doğrulama maili)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Çok fazla doğrulama maili isteği. Lütfen 5 dakika bekleyin."
 *       500:
 *         description: Sunucu hatası
 */



/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Şifre sıfırlama bağlantısı gönder
 *     description: |
 *       Kullanıcının e-posta adresine şifre sıfırlama bağlantısı gönderilir.
 *       - Eğer e-posta kayıtlı değilse bile "başarılı" cevabı verilir (güvenlik nedeniyle).
 *       - Linkin geçerlilik süresi 1 saattir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ogrenci@boun.edu.tr
 *     responses:
 *       200:
 *         description: Mail gönderildi (varsa)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Eğer hesap varsa sıfırlama maili gönderildi.
 *       400:
 *         description: Geçersiz e-posta formatı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz email formatı"
 *       429:
 *         description: "Çok fazla istek (limit: 15 dakikada 3 şifre sıfırlama talebi)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Çok fazla şifre sıfırlama isteği. Lütfen 15 dakika bekleyin."
 *       500:
 *         description: Sunucu hatası
 */























// ======================= NOTIFICATION ROUTES =======================
// Bu bölüm bildirim servisinin endpointlerini kapsar.

/**
 * @openapi
 * tags:
 *   - name: Notifications
 *     description: Kullanıcı bildirimlerini listeleme, okuma ve silme işlemleri
 */

/**
 * @openapi
 * /notifications:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Bildirimleri listele
 *     description: Kullanıcının kendi bildirimlerini sayfalı şekilde döndürür.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: İstenen sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         description: Sayfa başına dönecek kayıt sayısı
 *     responses:
 *       200:
 *         description: Bildirimler listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalNotifications:
 *                       type: integer
 *                       example: 72
 *                     unreadCount:
 *                       type: integer
 *                       example: 4
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: Bildirimler getirilemedi
 */

/**
 * @openapi
 * /notifications/unread-count:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Okunmamış bildirim sayısını getir
 *     responses:
 *       200:
 *         description: Okunmamış bildirim sayısı döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unreadCount:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: Sayı getirilemedi
 */

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Tek bildirimi okundu işaretle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bildirim ID'si
 *     responses:
 *       200:
 *         description: Bildirim okundu olarak güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Okundu işaretlendi"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       404:
 *         description: Bildirim bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bildirim bulunamadı"
 *       500:
 *         description: İşlem başarısız
 */

/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Tüm bildirimleri okundu işaretle
 *     responses:
 *       200:
 *         description: Okunmamış tüm bildirimler okundu işaretlendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tüm bildirimler okundu işaretlendi"
 *                 updatedCount:
 *                   type: integer
 *                   example: 12
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: İşlem başarısız
 */

/**
 * @openapi
 * /notifications/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Tek bildirimi sil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bildirim ID'si
 *     responses:
 *       200:
 *         description: Bildirim silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bildirim silindi"
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       404:
 *         description: Bildirim bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bildirim bulunamadı"
 *       500:
 *         description: İşlem başarısız
 */

/**
 * @openapi
 * /notifications/read:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Okunmuş bildirimleri sil
 *     responses:
 *       200:
 *         description: Okunmuş bildirimler silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Okunmuş bildirimler silindi"
 *                 deletedCount:
 *                   type: integer
 *                   example: 8
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: İşlem başarısız
 */

/**
 * @openapi
 * /notifications/all:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     summary: Tüm bildirimleri sil
 *     responses:
 *       200:
 *         description: Tüm bildirimler silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tüm bildirimler silindi"
 *                 deletedCount:
 *                   type: integer
 *                   example: 22
 *       401:
 *         description: Token eksik veya gönderilmedi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya hesap pasif
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: İşlem başarısız
 */





























// ======================= ADMIN ROUTES =======================

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin işlemleri (üniversite, içerik, kullanıcı, öneri, ders ve bölüm kodu yönetimi)
 */

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin girişi yap
 *     description: Sadece admin rolündeki kullanıcılar giriş yapabilir ve JWT alır.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@notkutusu.com
 *               password:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       200:
 *         description: Admin girişi başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin girişi başarılı"
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Eksik email veya şifre
 *       401:
 *         description: Şifre yanlış
 *       403:
 *         description: Admin olmayan kullanıcı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/universities:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Yeni üniversite ekle
 *     description: Sadece admin rolündeki kullanıcılar üniversite ekleyebilir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - emailDomains
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Atılım Üniversitesi"
 *               slug:
 *                 type: string
 *                 example: "atilim"
 *               emailDomains:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["atilim.edu.tr"]
 *     responses:
 *       201:
 *         description: Üniversite eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Üniversite eklendi"
 *                 university:
 *                   $ref: '#/components/schemas/University'
 *       400:
 *         description: Eksik alan veya slug mevcut
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/universities/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Üniversiteyi güncelle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               emailDomains:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Üniversite güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Üniversite güncellendi"
 *                 university:
 *                   $ref: '#/components/schemas/University'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/universities/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Üniversiteyi sil
 *     responses:
 *       200:
 *         description: Üniversite silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Üniversite silindi"
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/notes/reported:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Raporlanan notları listele
 *     responses:
 *       200:
 *         description: Raporlanan notlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/notes/inactive:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Pasif (isActive=false) notları listele
 *     responses:
 *       200:
 *         description: Pasif notlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/notes/{id}/activate:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Notu yeniden aktifleştir
 *     responses:
 *       200:
 *         description: Not aktifleştirildi ve raporları sıfırlandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not aktifleştirildi ve raporlar sıfırlandı"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/comments/reported:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Raporlanan yorumları listele
 *     responses:
 *       200:
 *         description: Raporlanan yorumlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/notes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Notu admin olarak sil
 *     responses:
 *       200:
 *         description: Not silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not admin tarafından silindi"
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Yorumu admin olarak sil
 *     responses:
 *       200:
 *         description: Yorum silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum admin tarafından silindi"
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Yorum bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı listesini getir
 *     description: Arama, durum ve üniversite filtreleriyle kullanıcıları listeler; admin kullanıcılar hariç tutulur.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: İsim veya e-posta içinde arar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: universityId
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Kullanıcı listesi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı detaylarını getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kullanıcı detayları döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 recentNotes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 recentComments:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/users/{id}/status:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı aktif/pasif durumunu güncelle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Kullanıcı durumu güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kullanıcı pasifleştirildi"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: isActive boolean olmalıdır
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir veya admin kullanıcı banlanamaz
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/users/{id}/ban:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcıyı banla (geri uyum)
 *     responses:
 *       200:
 *         description: Kullanıcı banlandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kullanıcı banlandı"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/users/{id}/unban:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı banını kaldır (geri uyum)
 *     responses:
 *       200:
 *         description: Kullanıcı banı kaldırıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kullanıcı banı kaldırıldı"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/suggestions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı önerilerini listele
 *     description: Sayfalama, durum filtresi ve arama desteği sunar.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Beklemede, Görüldü, İnceleniyor, Eklendi, Eklenmedi]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Öneriler listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/suggestions/{id}/status:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Öneri durumunu güncelle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Beklemede, Görüldü, İnceleniyor, Eklendi, Eklenmedi]
 *               adminNotes:
 *                 type: string
 *                 description: Admin notu (opsiyonel)
 *     responses:
 *       200:
 *         description: Öneri güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Geçersiz durum değeri
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Öneri bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/suggestions/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Öneriyi sil
 *     responses:
 *       200:
 *         description: Öneri silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Öneri bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/search-bar:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Admin arama çubuğu ile not ara
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Arama terimi (ders kodu, başlık veya açıklama)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *       - in: query
 *         name: universitySlug
 *         schema:
 *           type: string
 *         description: Belirli bir üniversiteyle sınırla (opsiyonel)
 *     responses:
 *       200:
 *         description: Arama sonuçları getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 pagination:
 *                   type: object
 *       400:
 *         description: Arama terimi gerekli
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca admin erişebilir
 *       404:
 *         description: Üniversite bulunamadı (slug belirtildiğinde)
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/courses:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Yeni ders kodu oluştur
 *     description: Ders kodu admin kullanıcının üniversitesi üzerinde oluşturulur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "COMP101"
 *     responses:
 *       201:
 *         description: Ders oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ders oluşturuldu"
 *                 course:
 *                   type: object
 *       400:
 *         description: Eksik kod veya ders zaten mevcut
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/department-codes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Yeni bölüm kodu ekle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "COMP"
 *     responses:
 *       201:
 *         description: Kod eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kod başarıyla eklendi."
 *                 code:
 *                   type: object
 *       400:
 *         description: Eksik kod veya kod zaten var
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /admin/department-codes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Tüm bölüm kodlarını listele
 *     responses:
 *       200:
 *         description: Kodlar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Kodlar getirilemedi
 */

/**
 * @openapi
 * /admin/department-codes/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Bölüm kodunu güncelle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "COMP"
 *     responses:
 *       200:
 *         description: Kod güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kod güncellendi."
 *                 code:
 *                   type: object
 *       400:
 *         description: Yeni kod belirtilmedi
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       404:
 *         description: Kod bulunamadı
 *       500:
 *         description: Kod güncellenemedi
 */

/**
 * @openapi
 * /admin/department-codes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Bölüm kodunu sil
 *     responses:
 *       200:
 *         description: Kod silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kod silindi."
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       404:
 *         description: Kod bulunamadı
 *       500:
 *         description: Kod silinemedi
 */





























// ======================= COURSES ROUTES =======================
// Bu bölüm herkese açık kurs listesi ve kullanıcı üniversitesi özel kurs erişimlerini kapsar.

/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: Dersleri listeleyen uç noktalar
 */

/**
 * @openapi
 * /courses:
 *   get:
 *     tags: [Courses]
 *     summary: Tüm dersleri listele
 *     description: Herkese açık ders listesi; herhangi bir kimlik doğrulaması gerekmez.
 *     responses:
 *       200:
 *         description: Ders listesi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sunucu hatası"
 */

/**
 * @openapi
 * /courses/my-university:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Courses]
 *     summary: Kullanıcının üniversitesine ait dersleri getir
 *     responses:
 *       200:
 *         description: Kullanıcının üniversitesine ait dersler döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   type:
 *                     type: string
 *                   noteCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Token geçersiz veya süresi dolmuş
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geçersiz veya süresi dolmuş token."
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/courses:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Courses]
 *     summary: Belirli üniversite slug'ına ait dersleri getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri
 *     responses:
 *       200:
 *         description: Ders listesi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   type:
 *                     type: string
 *                   noteCount:
 *                     type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yetkisiz erişim: Token eksik."
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bu üniversiteye erişim izniniz yok."
 *       404:
 *         description: Üniversite bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Üniversite bulunamadı."
 *       500:
 *         description: Sunucu hatası
 */


























// ======================= NOTES ROUTES =======================

/**
 * @openapi
 * tags:
 *   - name: Notes
 *     description: Not yükleme, görüntüleme, arama ve keşif işlemleri
 */

/**
 * @openapi
 * /notes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Yeni not yükle
 *     description: Kullanıcılar Google Drive bağlantısı sağlayarak not yükleyebilir; bağlantı erişilebilirlik kontrolünden geçer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseFormat
 *               - driveLink
 *             properties:
 *               title:
 *                 type: string
 *                 example: Calculus I Vize Notları
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Limit ve türev özetleri
 *               courseFormat:
 *                 type: string
 *                 enum: [split, single]
 *                 example: split
 *               departmentCode:
 *                 type: string
 *                 description: split formatı için bölüm kodu
 *                 example: COMP
 *               courseNumber:
 *                 type: string
 *                 description: split formatı için ders numarası
 *                 example: 101E
 *               fullCourseCode:
 *                 type: string
 *                 description: single formatı için tam ders kodu
 *                 example: 1505001
 *               instructor:
 *                 type: string
 *                 nullable: true
 *                 example: Dr. Ayşe Yılmaz
 *               driveLink:
 *                 type: string
 *                 example: https://drive.google.com/file/d/abc123/view
 *               year:
 *                 type: string
 *                 nullable: true
 *                 example: 2023 Güz
 *               semester:
 *                 type: string
 *                 nullable: true
 *                 example: Güz
 *     responses:
 *       201:
 *         description: Not başarıyla yüklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not başarıyla yüklendi
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *                 course:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     id:
 *                       type: string
 *       400:
 *         description: Alan validasyonları veya erişilemeyen Drive bağlantısı
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz veya süresi dolmuş
 *       409:
 *         description: Ders zaten mevcut (nadir durum)
 *       500:
 *         description: Not yüklenemedi
 */

/**
 * @openapi
 * /notes/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Not detayını getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Not detayları döndürüldü (kullanıcının reaction bilgisi dahil)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 instructor:
 *                   type: string
 *                   nullable: true
 *                 year:
 *                   type: string
 *                   nullable: true
 *                 driveLink:
 *                   type: string
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *                 reports:
 *                   type: integer
 *                 viewCount:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 myReaction:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     type:
 *                       type: string
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Not farklı bir üniversiteye ait
 *       404:
 *         description: Not bulunamadı veya pasif
 *       500:
 *         description: Not getirilemedi
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu güncelle
 *     description: Sadece notu oluşturan kullanıcı ve yalnızca aktif notlar güncellenebilir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               year:
 *                 type: string
 *               semester:
 *                 type: string
 *               driveLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Not güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not başarıyla güncellendi
 *                 note:
 *                   type: object
 *       400:
 *         description: Geçersiz veya eksik alan
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Not size ait değil, üniversite eşleşmiyor veya not pasif
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Not güncellenemedi
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu pasifleştir
 *     description: Not silme işlemi soft-delete olarak gerçekleştirilir; admin panelinde görünür kalır.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Not pasifleştirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not pasifleştirildi (admin panelde görünmeye devam edecek)
 *                 noteId:
 *                   type: string
 *       400:
 *         description: Not zaten pasif
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Not size ait değil veya üniversite eşleşmiyor
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Not silinemedi
 */

/**
 * @openapi
 * /{slug}/notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Üniversite slug'ına göre notları listele
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Not listesi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Notlar listelenemedi
 */

/**
 * @openapi
 * /{slug}/courses/{courseId}/notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Belirli kurs için notları listele
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kursa ait notlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Notlar listelenemedi
 */

/**
 * @openapi
 * /{slug}/top-contributors:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: En çok katkı sağlayan kullanıcıları getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: En fazla not yükleyen kullanıcılar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   profilePic:
 *                     type: string
 *                     nullable: true
 *                   score:
 *                     type: integer
 *                   noteCount:
 *                     type: integer
 *                   totalLikes:
 *                     type: integer
 *                   totalDislikes:
 *                     type: integer
 *                   totalReports:
 *                     type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/top-notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: En çok beğenilen notları getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Popüler notlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   likes:
 *                     type: integer
 *                   dislikes:
 *                     type: integer
 *                   reports:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   course:
 *                     type: object
 *                   uploader:
 *                     type: object
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Notlar getirilemedi
 */

/**
 * @openapi
 * /{slug}/notes/search:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Üniversite içerisinde not ara
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Aranacak anahtar kelime
 *     responses:
 *       200:
 *         description: Arama sonuçları
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       400:
 *         description: Arama terimi gerekli
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Notlar listelenemedi
 */

/**
 * @openapi
 * /{slug}/search-bar:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Arama çubuğu ile not ara (sayfalı)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *     responses:
 *       200:
 *         description: Arama sonuçları ve sayfalama bilgisi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalResults:
 *                       type: integer
 *                     resultsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       400:
 *         description: Arama terimi gerekli
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/notes/latest:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Son eklenen notları getir (keşfet)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Son eklenen notlar döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       courseCode:
 *                         type: string
 *                       courseType:
 *                         type: string
 *                       instructor:
 *                         type: string
 *                         nullable: true
 *                       semester:
 *                         type: string
 *                       uploadDate:
 *                         type: string
 *                         format: date-time
 *                       driveLink:
 *                         type: string
 *                       uploadedBy:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalNotes:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Notlar getirilemedi
 */

































// ======================= UNIVERSITIES ROUTES =======================
// Bu bölüm üniversite işlemlerini kapsar.

/**
 * @openapi
 * tags:
 *   - name: Universities
 *     description: Üniversite listeleme (public)
 */

/**
 * @openapi
 * /universities:
 *   get:
 *     tags: [Universities]
 *     summary: Üniversiteleri listele
 *     responses:
 *       200:
 *         description: "Üniversite listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/University'
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /universities/stats:
 *   get:
 *     summary: "Global istatistikleri getir"
 *     description: "Tüm üniversite, kullanıcı ve not sayılarını döner (giriş gerektirmez)"
 *     tags:
 *       - Universities
 *     responses:
 *       200:
 *         description: "İstatistikler başarıyla getirildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 universityCount:
 *                   type: number
 *                   description: "Toplam üniversite sayısı"
 *                   example: 25
 *                 userCount:
 *                   type: number
 *                   description: "Toplam kullanıcı sayısı"
 *                   example: 1250
 *                 noteCount:
 *                   type: number
 *                   description: "Toplam not sayısı"
 *                   example: 8500
 *                 commentCount:
 *                   type: number
 *                   description: "Toplam yorum sayısı"
 *                   example: 2150
 *                 totalLikes:
 *                   type: number
 *                   description: "Toplam beğeni sayısı"
 *                   example: 12500
 *                 topUniversities:
 *                   type: array
 *                   description: "En çok notu olan 10 üniversite"
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Boğaziçi Üniversitesi"
 *                       slug:
 *                         type: string
 *                         example: "bogazici"
 *                       noteCount:
 *                         type: number
 *                         example: 450
 *                 topCourses:
 *                   type: array
 *                   description: "En çok notu olan 10 ders"
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseName:
 *                         type: string
 *                         example: "Calculus I"
 *                       courseCode:
 *                         type: string
 *                         example: "MATH-101"
 *                       universityName:
 *                         type: string
 *                         example: "Boğaziçi Üniversitesi"
 *                       noteCount:
 *                         type: number
 *                         example: 85
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /universities/{slug}/stats:
 *   get:
 *     summary: "Üniversiteye özgü istatistikleri getir"
 *     description: "Belirtilen üniversiteye ait kullanıcı ve not sayılarını döner (giriş gerekli)"
 *     tags:
 *       - Universities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversite slug değeri"
 *         example: "bogazici"
 *     responses:
 *       200:
 *         description: "Üniversite istatistikleri başarıyla getirildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 university:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: "Üniversite adı"
 *                       example: "Boğaziçi Üniversitesi"
 *                     slug:
 *                       type: string
 *                       description: "Üniversite slug değeri"
 *                       example: "bogazici"
 *                 userCount:
 *                   type: number
 *                   description: "Bu üniversitedeki kullanıcı sayısı"
 *                   example: 150
 *                 noteCount:
 *                   type: number
 *                   description: "Bu üniversitedeki not sayısı"
 *                   example: 780
 *                 courseCount:
 *                   type: number
 *                   description: "Bu üniversitedeki ders sayısı"
 *                   example: 45
 *                 commentCount:
 *                   type: number
 *                   description: "Bu üniversitedeki toplam yorum sayısı"
 *                   example: 320
 *                 totalLikes:
 *                   type: number
 *                   description: "Bu üniversitedeki toplam beğeni sayısı"
 *                   example: 1850
 *                 topCourses:
 *                   type: array
 *                   description: "En çok notu olan 5 ders"
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseName:
 *                         type: string
 *                         example: "Calculus I"
 *                       courseCode:
 *                         type: string
 *                         example: "MATH-101"
 *                       noteCount:
 *                         type: number
 *                         example: 25
 *                 topContributors:
 *                   type: array
 *                   description: "En çok not yükleyen 5 kullanıcı"
 *                   items:
 *                     type: object
 *                     properties:
 *                       userName:
 *                         type: string
 *                         example: "Ali Yılmaz"
 *                       noteCount:
 *                         type: number
 *                         example: 15
 *       404:
 *         description: "Üniversite bulunamadı"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Üniversite bulunamadı"
 *       401:
 *         description: "Token eksik"
 *       403:
 *         description: "Token geçersiz veya süresi dolmuş"
 *       500:
 *         description: "Sunucu hatası"
 */


































// ======================= COMMENTS ROUTES =======================
// Bu bölüm notlara yorum ekleme, listeleme ve silme işlemlerini kapsar.

/**
 * @openapi
 * tags:
 *   - name: Comments
 *     description: Not yorumları ve ilgili işlemler
 */

/**
 * @openapi
 * /notes/{noteId}/comments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Bir nota yorum ekle
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Not ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Yorum metni (maksimum 350 karakter)
 *                 maxLength: 350
 *                 example: Bu not gerçekten çok faydalı oldu, teşekkürler!
 *     responses:
 *       201:
 *         description: Yorum eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Yorum eklendi
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Yorum metni eksik veya limit aşıldı
 *       401:
*         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Bu nota yorum yapma yetkiniz yok
 *       404:
 *         description: Not bulunamadı
 *       429:
 *         description: Çok fazla istek (rate limit)
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /notes/{noteId}/comments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Bir notun yorumlarını listele
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Not ID
 *     responses:
 *       200:
 *         description: Yorum listesi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Bu nota erişim izniniz yok
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Yorumu sil
 *     description: Sadece yorumu ekleyen kullanıcı kendi yorumunu silebilir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Yorum ID
 *     responses:
 *       200:
 *         description: Yorum silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Yorum silindi
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Sadece kendi yorumunuzu silebilirsiniz
 *       404:
 *         description: Yorum bulunamadı
 *       500:
 *         description: Sunucu hatası
 */































// ======================= USERS ROUTES =======================

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Kullanıcı profilleri, şifre güncelleme ve kişisel içerik listeleme
 */

/**
 * @openapi
 * /{slug}/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcı profil bilgilerini getir
 *     description: Sadece aynı üniversiteye ait kullanıcılar diğer kullanıcıların profillerini görebilir.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *                   nullable: true
 *                 score:
 *                   type: integer
 *                 aboutMe:
 *                   type: string
 *                   nullable: true
 *                 department:
 *                   type: string
 *                   nullable: true
 *                 socialLinks:
 *                   type: object
 *                 notifications:
 *                   type: boolean
 *                 noteCount:
 *                   type: integer
 *                 commentCount:
 *                   type: integer
 *                 totalLikes:
 *                   type: integer
 *                 totalDislikes:
 *                   type: integer
 *                 totalReports:
 *                   type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Bu kullanıcıya erişim yetkiniz yok
 *       404:
 *         description: Kullanıcı veya üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/users/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcı profilini güncelle
 *     description: Sadece kullanıcı kendi profilini güncelleyebilir; şifre değiştirirken oldPassword/newPassword/confirmPassword alanları gereklidir.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profilePic:
 *                 type: string
 *               aboutMe:
 *                 type: string
 *               department:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *               notifications:
 *                 type: boolean
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil güncellendi
 *                 user:
 *                   type: object
 *       400:
 *         description: Eksik veya hatalı parametre
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Yalnızca kendi profilinizi güncelleyebilirsiniz
 *       404:
 *         description: Kullanıcı veya üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/users/{id}/notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcının yüklediği notları getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Kullanıcının not listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Bu üniversiteye erişim izniniz yok
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /{slug}/users/{id}/comments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcının yaptığı yorumları getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Kullanıcının yorum listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Bu üniversiteye erişim izniniz yok
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

































// ======================= DEPARTMENT CODE ROUTES =======================

/**
 * @openapi
 * tags:
 *   - name: DepartmentCode
 *     description: Üniversiteye özel bölüm/ders kodlarını listeleme
 */

/**
 * @openapi
 * /{slug}/department-codes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: Slug üzerinden bölüm kodlarını getir
 *     description: Kullanıcının token'ındaki üniversite ile slug eşleşiyorsa ilgili üniversitenin kodları döndürülür.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri
 *     responses:
 *       200:
 *         description: Bölüm kodları listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       type:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token'daki üniversite ile slug uyuşmuyor
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Kodlar getirilemedi
 */




























// ======================= SUGGESTIONS ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Suggestions
 *     description: Kullanıcı önerileri (oluşturma, listeleme, güncelleme, silme)
 */

/**
 * @openapi
 * /suggestions:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Yeni öneri oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Mobil uygulama geliştirin
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: iOS ve Android için native uygulama olsa çok güzel olur.
 *     responses:
 *       201:
 *         description: Öneri oluşturuldu
 *       400:
 *         description: Başlık ve içerik zorunludur
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /suggestions/my:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Kullanıcının kendi önerilerini listele
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Öneriler listelendi
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /suggestions/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneri detayını getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Öneri detayları
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       404:
 *         description: Öneri bulunamadı
 *       500:
 *         description: Sunucu hatası
 *
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneriyi güncelle
 *     description: Kullanıcı sadece "Beklemede" veya "Görüldü" durumundaki önerilerini güncelleyebilir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Öneri güncellendi
 *       400:
 *         description: Geçersiz durum veya alan
 *       404:
 *         description: Öneri bulunamadı
 *       500:
 *         description: Sunucu hatası
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneriyi sil
 *     description: Kullanıcı sadece "Beklemede" veya "Görüldü" durumundaki önerilerini silebilir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Öneri silindi
 *       400:
 *         description: Geçersiz durum
 *       404:
 *         description: Öneri bulunamadı
 *       500:
 *         description: Sunucu hatası
 */



















// ======================= REACTION ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Reactions
 *     description: Notlar ve yorumlar için beğeni, beğenmeme ve raporlama işlemleri
 */

/**
 * @openapi
 * /api/{targetType}/{id}/like:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Reactions]
 *     summary: Hedef içeriği beğen
 *     description: Aynı kullanıcıdan gelen tepkiler toggle mantığı ile yönetilir; mevcut beğeni tekrar gönderilirse kaldırılır.
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [notes, note, comments, comment]
 *         description: "Hedef türü (çoğul ve tekil varyasyonlar desteklenir)."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Not veya yorumun benzersiz kimliği."
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: "İsteğe bağlı açıklama metni. `processDescription` ve `commentDescription` alanlarıyla geriye dönük uyumlu."
 *                 example: "Çok faydalı bir açıklama olmuş."
 *               processDescription:
 *                 type: string
 *                 description: "Geriye dönük desteklenen alternatif alan."
 *               commentDescription:
 *                 type: string
 *                 description: "Geriye dönük desteklenen alternatif alan."
 *     responses:
 *       200:
 *         description: Beğeni başarıyla işlendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Beğeni güncellendi"
 *                 likes:
 *                   type: integer
 *                   description: "Hedef içeriğin güncel beğeni sayısı."
 *       400:
 *         description: Geçersiz targetType
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Hedef içerik bulunamadı
 *       429:
 *         description: Çok fazla işlem yapıldı. Lütfen bir dakika bekleyin.
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/{targetType}/{id}/dislike:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Reactions]
 *     summary: Hedef içeriği beğenmeme
 *     description: Toggle mantığı ile çalışır; mevcut beğenmeme yeniden gönderilirse kaldırılır.
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [notes, note, comments, comment]
 *         description: "Hedef türü (çoğul ve tekil varyasyonlar desteklenir)."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Not veya yorumun benzersiz kimliği."
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Beğenmeme gerekçesi (opsiyonel). `processDescription` ve `commentDescription` alanlarıyla geriye dönük uyumlu."
 *               processDescription:
 *                 type: string
 *               commentDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Beğenmeme başarıyla işlendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Beğenmeme güncellendi"
 *                 dislikes:
 *                   type: integer
 *                   description: "Hedef içeriğin güncel beğenmeme sayısı."
 *       400:
 *         description: Geçersiz targetType
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Hedef içerik bulunamadı
 *       429:
 *         description: Çok fazla işlem yapıldı. Lütfen bir dakika bekleyin.
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/{targetType}/{id}/report:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Reactions]
 *     summary: Hedef içeriği raporla
 *     description: Toggle mantığında çalışır; notlar 15 rapora ulaştığında otomatik olarak pasifleşir.
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [notes, note, comments, comment]
 *         description: "Hedef türü (çoğul ve tekil varyasyonlar desteklenir)."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Not veya yorumun benzersiz kimliği."
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Rapor açıklaması (opsiyonel). Diğer alanlar geriye dönük uyumluluk içindir."
 *               processDescription:
 *                 type: string
 *               commentDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Raporlama işlemi tamamlandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Raporlama işlemi tamamlandı"
 *                 reports:
 *                   type: integer
 *                   description: "Toplam rapor sayısı."
 *                 isActive:
 *                   type: boolean
 *                   description: "Notun aktiflik durumu (yalnızca not hedeflerinde döner)."
 *       400:
 *         description: Geçersiz targetType
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Hedef içerik bulunamadı
 *       429:
 *         description: Çok fazla işlem yapıldı. Lütfen bir dakika bekleyin.
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/{targetType}/{id}/my-reaction:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Reactions]
 *     summary: Kullanıcının mevcut tepkisini görüntüle
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [notes, note, comments, comment]
 *         description: "Hedef türü (çoğul ve tekil varyasyonlar desteklenir)."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Not veya yorumun benzersiz kimliği."
 *     responses:
 *       200:
 *         description: Kullanıcının hedef içerik için tepkisi döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasReaction:
 *                   type: boolean
 *                   description: "Kullanıcının reaksiyonu olup olmadığını belirtir."
 *                 reaction:
 *                   type: object
 *                   nullable: true
 *                   description: "Reaksiyon türü, açıklaması ve zaman damgası. Reaksiyon yoksa null."
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [like, dislike, report]
 *                     description:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Geçersiz targetType
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Hedef içerik bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

























// ======================= SCOREBOARD GAME ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Gamification
 *     description: Kullanıcı puanları, rozetleri ve liderlik tabloları ile ilgili uç noktalar
 */

/**
 * @openapi
 * /api/gamification/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Kullanıcının gamification özetini getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Kullanıcının benzersiz kimliği."
 *     responses:
 *       200:
 *         description: Gamification verileri döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                       nullable: true
 *                       description: "Profil fotoğrafı URL'i."
 *                     university:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         _id:
 *                           type: string
 *                           description: "Üniversite kaydının kimliği."
 *                 gamification:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                     monthlyScore:
 *                       type: integer
 *                     level:
 *                       type: integer
 *                     levelInfo:
 *                       type: object
 *                       description: "Mevcut seviyenin adı ve gereksinimleri."
 *                     badges:
 *                       type: array
 *                       description: "Kullanıcının kazandığı rozetlerin detayları."
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           description:
 *                             type: string
 *                             nullable: true
 *                     stats:
 *                       type: object
 *                       description: "Kullanıcının içerik üretimi ve etkileşim istatistikleri."
 *                     nextLevel:
 *                       type: object
 *                       nullable: true
 *                       description: "Bir sonraki seviyeye ait hedefler (varsa)."
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/gamification/user/{id}/badges:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Kullanıcının rozet durumlarını listele
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rozetler döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 earnedCount:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 badges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       earned:
 *                         type: boolean
 *                       progress:
 *                         type: number
 *                         format: float
 *                         description: "Rozet ilerleme yüzdesi (0-100)."
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/gamification/leaderboard/{slug}/monthly:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Üniversiteye özel aylık liderlik tablosunu getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversitenin benzersiz kısa adı (slug)."
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: "Listelenecek maksimum kullanıcı sayısı."
 *     responses:
 *       200:
 *         description: Liderlik tablosu döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 university:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                 period:
 *                   type: string
 *                   example: "monthly"
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           profilePic:
 *                             type: string
 *                             nullable: true
 *                           level:
 *                             type: integer
 *                           badgeCount:
 *                             type: integer
 *                       score:
 *                         type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/gamification/leaderboard/global:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Global liderlik tablosunu getir
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: "Listelenecek maksimum kullanıcı sayısı."
 *     responses:
 *       200:
 *         description: Global liderlik tablosu döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                   example: "all-time"
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           profilePic:
 *                             type: string
 *                             nullable: true
 *                           level:
 *                             type: integer
 *                           badgeCount:
 *                             type: integer
 *                           university:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               name:
 *                                 type: string
 *                               slug:
 *                                 type: string
 *                       score:
 *                         type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /api/gamification/{slug}/stats:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Üniversite bazlı gamification istatistiklerini getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversitenin benzersiz kısa adı (slug)."
 *     responses:
 *       200:
 *         description: Üniversite istatistikleri döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 university:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     totalScore:
 *                       type: integer
 *                     averageLevel:
 *                       type: number
 *                       format: float
 *                     topUser:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         name:
 *                           type: string
 *                         score:
 *                           type: integer
 *                         level:
 *                           type: integer
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

















// ======================= UPLOAD ROUTES =======================

// Not dosyalarını ZIP'leyip Google Drive'a aktaran tek endpoint için dokümantasyon.

/**
 * @openapi
 * tags:
 *   - name: File Upload
 *     description: PDF ve görsel dosyaları Google Drive'a yükleme servisleri
 */

/**
 * @openapi
 * /api/upload-to-drive:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [File Upload]
 *     summary: Dosyaları Google Drive'a yükle
 *     description: Seçilen PDF veya görsel dosyalarını aynı istek içinde ZIP'leyerek Google Drive'a yükler ve paylaşılabilir bağlantı döndürür.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 description: Yüklenecek dosyalar (PDF, JPEG veya PNG).
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Dosyalar başarıyla ZIP'lenip Drive'a yüklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   description: "Google Drive paylaşım bağlantısı"
 *                   example: https://drive.google.com/file/d/1ABC123xyz/view
 *                 fileName:
 *                   type: string
 *                   description: Oluşturulan ZIP dosyasının adı
 *                   example: dosyalar-1699123456789.zip
 *                 fileCount:
 *                   type: integer
 *                   description: ZIP içine alınan dosya sayısı
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: 3 dosya başarıyla ZIP'lenerek Drive'a yüklendi
 *       400:
 *         description: En az bir dosya seçilmedi veya dosya türü desteklenmiyor
 *       401:
 *         description: "Yetkisiz erişim: Token eksik"
 *       403:
 *         description: Token geçersiz, süresi dolmuş veya kullanıcı pasif
 *       413:
 *         description: Maksimum toplam dosya boyutu (50 MB) aşıldı
 *       500:
 *         description: Dosyalar yüklenirken sunucu hatası oluştu
 */


























// ======================= TEST ROUTES =======================
// Bu bölüm hem public ping endpointini hem de JWT ile korunan protected endpointi kapsar.

/**
 * @openapi
 * tags:
 *   - name: Test
 *     description: Sunucu testi ve JWT doğrulama test endpointleri
 */

/**
 * @openapi
 * /ping:
 *   get:
 *     tags: [Test]
 *     summary: Sunucunun çalıştığını test et (public)
 *     responses:
 *       200:
 *         description: "Sunucu cevap verdi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Cevap mesajı (opsiyonel, sabit değer döner)"
 *                   example: "Correct Request"
 */

/**
 * @openapi
 * /test/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Test]
 *     summary: JWT ile korunan alana erişim testi
 *     responses:
 *       200:
 *         description: "Token geçerli, kullanıcıya erişim izni verildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Mesaj (opsiyonel, sabit değer döner)"
 *                   example: "Korunan alana hoş geldin!"
 *                 user:
 *                   type: object
 *                   description: "JWT’den çözümlenen kullanıcı bilgileri (zorunlu)"
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: "Kullanıcı ID (zorunlu)"
 *                       example: "64fbbf9e12ab34cd56ef7890"
 *                     universityId:
 *                       type: string
 *                       description: "Kullanıcının üniversite ID’si (zorunlu)"
 *                       example: "64fbbf9e12ab34cd56ef7892"
 *                     role:
 *                       type: string
 *                       description: "Kullanıcı rolü (opsiyonel, varsayılan user)"
 *                       example: "user"
 *       401:
 *         description: "Token eksik"
 *       403:
 *         description: "Token geçersiz veya süresi dolmuş"
 */


