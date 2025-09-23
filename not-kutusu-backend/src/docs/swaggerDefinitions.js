
//Components (Schemas + Security) 

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
 *       required: [name, email, password, universityId]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: "Kullanıcı ID (otomatik)"
 *           example: "64fbbf9e12ab34cd56ef7890"
 *         name:
 *           type: string
 *           description: "Kullanıcı adı (zorunlu)"
 *           example: "Ali Yılmaz"
 *         email:
 *           type: string
 *           description: "Kullanıcı e-posta adresi (zorunlu)"
 *           example: "ali@boun.edu.tr"
 *         password:
 *           type: string
 *           description: "Şifre (zorunlu)"
 *           example: "YeniSifre123"
 *         universityId:
 *           type: string
 *           format: objectId
 *           description: "Kullanıcının bağlı olduğu üniversite ID (zorunlu)"
 *           example: "64fbbf9e12ab34cd56ef7891"
 *         profilePic:
 *           type: string
 *           description: "Profil fotoğrafı (opsiyonel)"
 *           example: "https://example.com/avatar.png"
 *         score:
 *           type: number
 *           description: "Kullanıcı puanı (varsayılan 0)"
 *           example: 120
 *         aboutMe:
 *           type: string
 *           description: "Kullanıcı hakkında kısa bilgi (opsiyonel)"
 *           example: "3. sınıf bilgisayar mühendisliği öğrencisi"
 *         department:
 *           type: string
 *           description: "Kullanıcının bölümü (opsiyonel)"
 *           example: "Bilgisayar Mühendisliği"
 *         socialLinks:
 *           type: object
 *           description: "Sosyal medya bağlantıları"
 *           properties:
 *             linkedin:
 *               type: string
 *               example: "https://linkedin.com/in/kullanici"
 *             github:
 *               type: string
 *               example: "https://github.com/kullanici"
 *         notifications:
 *           type: boolean
 *           description: "Bildirim tercihi (varsayılan true)"
 *           example: true
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: "Kullanıcı rolü (varsayılan user)"
 *           example: "user"
 *         isVerified:
 *             type: boolean
 *             description: "Kullanıcının e-posta doğrulama durumu (varsayılan false)"
 *             example: false
 *         verificationToken:
 *             type: string
 *             description: "E-posta doğrulama tokeni (opsiyonel, sadece backend için)"
 *             example: "eyJhbGciOiJIUzI1NiIs..."
 *         verificationExpires:
 *             type: string
 *             format: date-time
 *             description: "Doğrulama tokeninin geçerlilik süresi"
 *         isActive:
 *             type: boolean
 *             description: "Kullanıcı aktif mi (ban/pasif kontrolü için)"
 *             example: true
 *         resetPasswordToken:
 *           type: string
 *           description: Şifre sıfırlama tokeni (opsiyonel, sadece backend için)
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           description: Şifre sıfırlama tokeninin geçerlilik süresi
 *           example: "2025-09-02T18:00:00.000Z"
 * 
 *
 *     University:
 *       type: object
 *       required: [name, slug, emailDomains]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Üniversite ID (otomatik)
 *           example: "64fbbf9e12ab34cd56ef7892"
 *         name:
 *           type: string
 *           description: Üniversite adı (zorunlu)
 *           example: "Boğaziçi Üniversitesi"
 *         slug:
 *           type: string
 *           description: Üniversite slug değeri (zorunlu, URL için kullanılır)
 *           example: "bogazici"
 *         emailDomains:
 *           type: array
 *           description: Geçerli e-posta domain listesi
 *           items:
 *             type: string
 *           example: ["boun.edu.tr", "alumni.boun.edu.tr"]
 *
 *
 *     Course:
 *       type: object
 *       required: [code, name, universityId]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Ders ID (otomatik)
 *           example: "64fbbf9e12ab34cd56ef7893"
 *         code:
 *           type: string
 *           description: Ders kodu (zorunlu)
 *           example: "BLG-231E"
 *         name:
 *           type: string
 *           description: Ders adı (zorunlu)
 *           example: "Veritabanı Sistemleri"
 *         universityId:
 *           type: string
 *           format: objectId
 *           description: Bu dersin bağlı olduğu üniversitenin ID'si
 *           example: "64fbbf9e12ab34cd56ef7892"
 *         noteCount:
 *           type: number
 *           description: Bu derse ait yüklenen toplam not sayısı (opsiyonel, default 0)
 *           example: 5
 *
 *     Note:
 *       type: object
 *       required: [title, courseId, driveLink, createdBy, universityId]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Not ID (otomatik)
 *           example: "64fbbf9e12ab34cd56ef7894"
 *         title:
 *           type: string
 *           description: Not başlığı (zorunlu)
 *           example: "Veritabanı Final Notları"
 *         description:
 *           type: string
 *           description: Not açıklaması (opsiyonel)
 *           example: "Sınavda çıkması muhtemel konuların özeti"
 *         courseId:
 *           type: string
 *           format: objectId
 *           description: Notun ait olduğu ders ID'si
 *           example: "64fbbf9e12ab34cd56ef7893"
 *         instructor:
 *           type: string
 *           description: Dersi veren öğretim üyesi (opsiyonel)
 *           example: "Prof. Dr. Ayşe Yılmaz"
 *         driveLink:
 *           type: string
 *           description: Notun Google Drive linki (zorunlu)
 *           example: "https://drive.google.com/file/abc123"
 *         year:
 *           type: string
 *           description: Notun yılı (opsiyonel)
 *           example: "2024"
 *         createdBy:
 *           type: string
 *           format: objectId
 *           description: Notu yükleyen kullanıcı ID'si
 *           example: "64fbbf9e12ab34cd56ef7890"
 *         universityId:
 *           type: string
 *           format: objectId
 *           description: Notun ait olduğu üniversite ID'si
 *           example: "64fbbf9e12ab34cd56ef7892"
 *         likes:
 *           type: number
 *           description: Beğeni sayısı (varsayılan 0)
 *           example: 14
 *         dislikes:
 *           type: number
 *           description: Beğenmeme sayısı (varsayılan 0)
 *           example: 2
 *         reports:
 *           type: number
 *           description: Rapor sayısı (varsayılan 0)
 *           example: 1
 *         reactions:
 *           type: array
 *           description: Notla ilgili kullanıcı reaksiyonları (beğeni, beğenmeme, rapor) ve açıklamaları
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *                 description: Tepki veren kullanıcı ID'si
 *                 example: "64fbbf9e12ab34cd56ef7890"
 *               type:
 *                 type: string
 *                 enum: [like, dislike, report]
 *                 description: Tepki türü
 *                 example: "like"
 *               processDescription:
 *                 type: string
 *                 description: Tepki açıklaması, max 200 karakter (opsiyonel)
 *                 example: "İçerik eksik veya yanıltıcı"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Tepki zamanı
 *                 example: "2025-09-05T12:30:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Comment:
 *       type: object
 *       required: [noteId, userId, text]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Yorum ID (otomatik)
 *           example: "64fbbf9e12ab34cd56ef7895"
 *         noteId:
 *           type: string
 *           format: objectId
 *           description: Yorumun ait olduğu notun ID'si (zorunlu)
 *           example: "64fbbf9e12ab34cd56ef7894"
 *         userId:
 *           type: string
 *           format: objectId
 *           description: Yorumu yazan kullanıcı ID'si (zorunlu)
 *           example: "64fbbf9e12ab34cd56ef7890"
 *         text:
 *           type: string
 *           description: Yorum metni (zorunlu)
 *           example: "Bu not çok faydalı oldu, teşekkür ederim!"
 *         likes:
 *           type: number
 *           description: Beğeni sayısı (varsayılan 0)
 *           example: 5
 *         dislikes:
 *           type: number
 *           description: Beğenmeme sayısı (varsayılan 0)
 *           example: 1
 *         reports:
 *           type: number
 *           description: Rapor sayısı (varsayılan 0)
 *           example: 0
 *         reactions:
 *           type: array
 *           description: Yorumla ilgili kullanıcı reaksiyonları (beğeni, beğenmeme, rapor) ve açıklamaları
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *                 description: Tepki veren kullanıcı ID'si
 *                 example: "64fbbf9e12ab34cd56ef7890"
 *               type:
 *                 type: string
 *                 enum: [like, dislike, report]
 *                 description: Tepki türü
 *                 example: "like"
 *               commentDescription:
 *                 type: string
 *                 description: Tepki açıklaması max 200 karakter (opsiyonel)
 *                 example: "Yorum çok faydalı"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Tepki zamanı
 *                 example: "2025-09-05T12:30:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma zamanı (otomatik)
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme zamanı (otomatik)
 * 
 *     DepartmentCode:
 *       type: object
 *       required:
 *         - code
 *         - universityId
 *         - addedBy
 *       description: >
 *         Üniversitelere ait ders branş kodları bu modelde saklanır.
 *         Her bir kod bir üniversiteye bağlıdır.
 *         Kim tarafından eklendiği `addedBy` alanında tutulur.
 *         Kullanıcılar ya da adminler kod ekleyebilir.
 *         Aynı üniversitede aynı kod tekrar edemez (unique).
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Kodun benzersiz ID’si
 *           example: "650e3f9d12ae23b7c7de99b2"
 *         code:
 *           type: string
 *           description: >
 *             Ders branş kodu örneğin: BLG, ENG, BIO. Kod büyük harfli olmalı ve 10 karakteri geçmemeli.
 *           example: "BLG"
 *         universityId:
 *           type: string
 *           format: objectId
 *           description: Kodun ait olduğu üniversite ID'si
 *           example: "64fbbf9e12ab34cd56ef7891"
 *         addedBy:
 *           type: string
 *           format: objectId
 *           description: Kodu ekleyen kullanıcının ID'si
 *           example: "64fbbf9e12ab34cd56ef7888"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma zamanı
 *           example: "2025-09-08T09:58:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Son güncellenme zamanı
 *           example: "2025-09-08T10:10:00.000Z"
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
 *                 description: "Kullanıcı adı (zorunlu)"
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
 *                 description: "Üniversite ID (zorunlu)"
 *                 example: "64fbbf9e12ab34cd56ef7892"
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
 *         description: "Eksik veya hatalı alan (ör: e-posta üniversite domainine ait değil, şifre kurallara uymuyor, kullanıcı zaten var)"
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
 *                     universityId:
 *                       type: string
 *                       example: "64fbbf9e12ab34cd56ef7892"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: "Eksik parametre veya kullanıcı bulunamadı"
 *       401:
 *         description: "Şifre yanlış"
 *       403:
 *         description: "Kullanıcı pasif veya doğrulanmamış"
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




















// ======================= ADMIN ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin işlemleri (üniversite yönetimi, raporlanan içerikler, kullanıcı yönetimi)
 */

/**
 * @openapi
 * /auth/admin-login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     description: Sadece admin kullanıcılar giriş yapabilir.
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
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "Admin123"
 *     responses:
 *       200:
 *         description: Giriş başarılı
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
 *     summary: Yeni üniversite ekle (sadece admin)
 *     description: |
 *       - JWT gerekir.
 *       - Sadece admin rolündeki kullanıcılar bu işlemi yapabilir.
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
 *         description: "Üniversite eklendi"
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
 *         description: "Eksik alan veya slug mevcut"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tüm alanlar zorunludur."
 *       403:
 *         description: "Yalnızca admin erişebilir"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yalnızca admin erişebilir"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/universities/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Üniversiteyi güncelle (sadece admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversite ID"
 *     responses:
*       200:
*         description: "Üniversite güncellendi"
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
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Üniversiteyi sil (sadece admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
*       200:
*         description: "Üniversite güncellendi"
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
*         description: "Raporlanan not listesi"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 notes:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Note'
 *       403:
 *         description: "Yalnızca admin erişebilir"
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
*         description: "Raporlanan yorum listesi"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 comments:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Comment'
 *       403:
 *         description: "Yalnızca admin erişebilir"
 */


/**
 * @openapi
 * /admin/notes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Not sil (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
*       200:
*         description: "Not silindi"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Not admin tarafından silindi"
*       404:
*         description: "Not bulunamadı"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Not bulunamadı"
 */


/**
 * @openapi
 * /admin/comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Yorum sil (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
*       200:
*         description: "Not silindi"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Not admin tarafından silindi"
*       404:
*         description: "Not bulunamadı"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Not bulunamadı"
 */


/**
 * @openapi
 * /admin/users/{id}/ban:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcıyı banla
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
*       200:
*         description: "Kullanıcı banlandı"
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
*
*       404:
*         description: "Kullanıcı bulunamadı"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Kullanıcı bulunamadı"
 */


 /**
 * @openapi
 * /admin/users/{id}/unban:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı banını kaldır
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Kullanıcı banı kaldırıldı"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */





















// ======================= COURSES ROUTES =======================
// Bu bölüm ders ekleme ve listeleme işlemlerini kapsar.
/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: Ders yönetimi (oluşturma, listeleme, slug üzerinden erişim)
 */

/**
 * @openapi
 * /courses:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Courses]
 *     summary: Yeni ders ekle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Ders kodu (zorunlu)"
 *                 example: "BLG-231E"
 *               name:
 *                 type: string
 *                 description: "Ders adı (zorunlu)"
 *                 example: "Veritabanı Sistemleri"
 *     responses:
*       201:
*         description: "Ders oluşturuldu"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Ders oluşturuldu"
*                 course:
*                   $ref: '#/components/schemas/Course'
*       400:
*         description: "Eksik veya hatalı alan"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Kod ve isim zorunludur."
*       500:
*         description: "Sunucu hatası"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Sunucu hatası"
 *
 *   get:
 *     tags: [Courses]
 *     summary: Tüm dersleri listele (herkes erişebilir)
 *     responses:
 *       200:
 *         description: "Ders listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
*         description: "Sunucu hatası"
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
 *         description: "Ders listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
*       403:
*         description: "Yetkisiz erişim"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Yetkisiz erişim"
*       500:
*         description: "Sunucu hatası"
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
 * /{slug}/courses:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Courses]
 *     summary: Slug ile üniversiteye ait dersleri getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversite slug (zorunlu)"
 *     responses:
 *       200:
 *         description: "Ders listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
*       403:
*         description: "Erişim izni yok"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Bu üniversiteye erişim izniniz yok."
*       404:
*         description: "Üniversite bulunamadı"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Üniversite bulunamadı."
*       500:
*         description: "Sunucu hatası"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Sunucu hatası"
 */





















// ======================= NOTES ROUTES =======================
// Bu bölüm not yükleme, listeleme, detay görüntüleme, slug ile filtreleme
// ve beğeni/dislike/rapor/top-contributors/top-notes endpointlerini kapsar.
/**
 * @openapi
 * tags:
 *   - name: Notes
 *     description: Not yükleme, listeleme, arama ve kullanıcı etkileşim işlemleri
 */

/**
 * @openapi
 * /notes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Yeni not yükle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *               - driveLink
 *             properties:
 *               title:
 *                 type: string
 *                 description: Not başlığı (zorunlu)
 *                 example: "Veritabanı final notları"
 *               description:
 *                 type: string
 *                 description: Not açıklaması (opsiyonel)
 *                 example: "Final sınavında çıkabilecek konuların özeti"
 *               courseId:
 *                 type: string
 *                 description: Ders ID (zorunlu)
 *                 example: "64fbbf9e12ab34cd56ef7893"
 *               instructor:
 *                 type: string
 *                 description: Dersi veren öğretim üyesi (opsiyonel)
 *                 example: "Prof. Dr. Ayşe Yılmaz"
 *               driveLink:
 *                 type: string
 *                 format: uri
 *                 description: Google Drive linki (zorunlu)
 *                 example: "https://drive.google.com/file/abc123"
 *               year:
 *                 type: string
 *                 description: Notun yılı (opsiyonel)
 *                 example: "2024"
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
 *                   example: "Not başarıyla yüklendi"
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Eksik veya hatalı alan
 *       500:
 *         description: Not yüklenemedi
 */

/**
 * @openapi
 * /notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notları listele (ders filtresiyle opsiyonel)
 *     parameters:
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         required: false
 *         description: Ders ID (opsiyonel)
 *     responses:
 *       200:
 *         description: Notlar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
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
 *         description: Not ID (zorunlu)
 *     responses:
 *       200:
 *         description: Not bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       403:
 *         description: Yetki yok
 *       404:
 *         description: Not bulunamadı
 */

/**
 * @openapi
 * /{slug}/courses/{courseId}/notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Belirli üniversite ve ders için notları getir
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
 *         description: Not listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 */

/**
 * @openapi
 * /notes/{id}/like:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu beğen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processDescription:
 *                 type: string
 *                 example: "Çok faydalı not"
 *     responses:
 *       200:
 *         description: Beğeni eklendi
 */

/**
 * @openapi
 * /notes/{id}/dislike:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu beğenme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processDescription:
 *                 type: string
 *                 example: "Yanıltıcı içerik"
 *     responses:
 *       200:
 *         description: Beğenmeme eklendi
 */

/**
 * @openapi
 * /notes/{id}/report:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu raporla
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processDescription:
 *                 type: string
 *                 example: "Uygunsuz içerik"
 *     responses:
 *       200:
 *         description: Rapor eklendi
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
 *         description: Liste başarıyla getirildi
 */

/**
 * @openapi
 * /{slug}/top-notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: En popüler notları getir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste başarıyla getirildi
 */

/**
 * @openapi
 * /{slug}/notes/search:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Not arama işlemi
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Arama kelimesi
 *     responses:
 *       200:
 *         description: Arama sonuçları
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
 * /university/stats:
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
 * /university/{slug}/stats:
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
// Bu bölüm notlara yorum ekleme, listeleme ve yorumlara etkileşim işlemlerini kapsar.
/**
 * @openapi
 * tags:
 *   - name: Comments
 *     description: Notlara yapılan yorumlar ve yorum etkileşimleri
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
 *         description: "Not ID (zorunlu)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                   type: string
 *                   maxLength: 350
 *                   example: "Bu not gerçekten çok faydalı oldu, teşekkürler!"
 *                   description: "Yorum metni (maksimum 350 karakter)"
 *                   required: true
 *     responses:
 *       201:
 *         description: "Yorum başarıyla eklendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum eklendi"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: "En fazla 350 karakter olabilir"
 *       403:
 *         description: "Bu nota yorum yapma yetkiniz yok"
 *       404:
 *         description: "Not bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 *
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Bir notun tüm yorumlarını getir
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Not ID (zorunlu)"
 *     responses:
 *       200:
 *         description: "Yorum listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       403:
 *         description: "Bu nota erişim izniniz yok"
 *       404:
 *         description: "Not bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Yorumu sil
 *     description: "Sadece yorumu ekleyen kullanıcı (veya ileride admin) kendi yorumunu silebilir."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Silinecek yorumun ID'si"
 *     responses:
 *       200:
 *         description: "Yorum başarıyla silindi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum silindi"
 *       403:
 *         description: "Bu yorumu silme yetkiniz yok"
 *       404:
 *         description: "Yorum bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /comments/{id}/like:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Yorumu beğen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Yorum ID (zorunlu)"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentDescription:
 *                 type: string
 *                 example: "Gerçekten faydalı bir yorum"
 *     responses:
 *       200:
 *         description: "Beğeni eklendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum beğenildi"
 *                 likes:
 *                   type: number
 *                   example: 4
 *       400:
 *         description: "Zaten beğenilmiş"
 *       403:
 *         description: "Bu yoruma erişim yetkiniz yok"
 *       404:
 *         description: "Yorum bulunamadı"
 */

/**
 * @openapi
 * /comments/{id}/dislike:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Yorumu beğenmeme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Yorum ID (zorunlu)"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentDescription:
 *                 type: string
 *                 example: "Bilgi eksik veya yanıltıcı"
 *     responses:
 *       200:
 *         description: "Beğenmeme eklendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum beğenilmedi"
 *                 dislikes:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: "Zaten beğenmeme yapılmış"
 *       403:
 *         description: "Bu yoruma erişim yetkiniz yok"
 *       404:
 *         description: "Yorum bulunamadı"
 */

/**
 * @openapi
 * /comments/{id}/report:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     summary: Yorumu raporla
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Yorum ID (zorunlu)"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentDescription:
 *                 type: string
 *                 example: "Uygunsuz içerik"
 *     responses:
 *       200:
 *         description: "Rapor eklendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yorum raporlandı"
 *                 reports:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: "Zaten raporlanmış"
 *       403:
 *         description: "Bu yoruma erişim yetkiniz yok"
 *       404:
 *         description: "Yorum bulunamadı"
 */


















// ======================= USERS ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Kullanıcı profilleri ve istatistikleri
 */

/**
 * @openapi
 * /{slug}/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcı profil bilgilerini getir
 *     description: "Sadece aynı üniversiteye ait kullanıcılar profillere erişebilir."
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversitenin slug değeri (örnek: bogazici)"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: "Kullanıcı ID (zorunlu)"
 *     responses:
 *       200:
 *         description: "Kullanıcı profili bilgileri"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Ömer"
 *                 profilePic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../avatar.jpg"
 *                 score:
 *                   type: number
 *                   example: 42
 *                 aboutMe:
 *                   type: string
 *                   example: "3. sınıf bilgisayar mühendisliği öğrencisi"
 *                 department:
 *                   type: string
 *                   example: "Bilgisayar Mühendisliği"
 *                 socialLinks:
 *                   type: object
 *                   properties:
 *                     linkedin:
 *                       type: string
 *                       example: "https://linkedin.com/in/kullanici"
 *                     github:
 *                       type: string
 *                       example: "https://github.com/kullanici"
 *                 notifications:
 *                   type: boolean
 *                   example: true
 *                 noteCount:
 *                   type: number
 *                   example: 5
 *                 commentCount:
 *                   type: number
 *                   example: 12
 *                 totalLikes:
 *                   type: number
 *                   example: 34
 *                 totalDislikes:
 *                   type: number
 *                   example: 2
 *                 totalReports:
 *                   type: number
 *                   example: 1
 *       403:
 *         description: "Bu üniversiteye erişim izniniz yok"
 *       404:
 *         description: "Kullanıcı veya üniversite bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /{slug}/users/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     summary: Kullanıcı profilini güncelle
 *     description: "Sadece kullanıcı kendi profilini güncelleyebilir. Şifre değiştirmek için oldPassword, newPassword ve confirmPassword alanları gerekir. Ayrıca şifre Minimum 6 karakter En az 1 büyük harf En az 1 küçük harf En az 1 rakam"
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
 *                 example: "YeniKullaniciAdi"
 *               profilePic:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *               aboutMe:
 *                 type: string
 *                 example: "3. sınıf yazılım mühendisliği öğrencisiyim"
 *               department:
 *                 type: string
 *                 example: "Bilgisayar Mühendisliği"
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                     example: "https://linkedin.com/in/kullanici"
 *                   github:
 *                     type: string
 *                     example: "https://github.com/kullanici"
 *               notifications:
 *                 type: boolean
 *                 example: true
 *               oldPassword:
 *                 type: string
 *                 example: "EskiSifre123"
 *               newPassword:
 *                 type: string
 *                 example: "YeniSifre123"
 *               confirmPassword:
 *                 type: string
 *                 example: "YeniSifre123"
 *     responses:
 *       200:
 *         description: "Profil başarıyla güncellendi"
 *       400:
 *         description: "Eksik veya hatalı parametre"
 *       403:
 *         description: "Yetkisiz işlem"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
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
 *         description: "Kullanıcının not listesi"
 *       403:
 *         description: "Yetkisiz işlem"
 *       404:
 *         description: "Kullanıcı veya üniversite bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
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
 *         description: "Kullanıcının yorum listesi"
 *       403:
 *         description: "Yetkisiz işlem"
 *       404:
 *         description: "Kullanıcı veya üniversite bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

























// ======================= DEPARTMENT CODE ROUTES =======================
// Bu bölüm üniversite bazlı ders kodu işlemleri için endpointleri kapsar.

/**
 * @openapi
 * tags:
 *   - name: DepartmentCode
 *     description: "Üniversiteye özel ders kodu işlemleri (giriş yapan kullanıcılar ve adminler için)"
 */

/**
 * @openapi
 * /{slug}/department-codes:
 *   get:
 *     tags: [DepartmentCode]
 *     summary: "Slug ile ders kodlarını getir (public)"
 *     description: |
 *       Belirtilen üniversite `slug` değerine göre o üniversiteye ait tüm ders kodlarını döndürür.
 *       - Token gerekmez.
 *       - Frontend'de not yükleme ekranında dropdown listesi için kullanılabilir.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Üniversite slug değeri (örn: 'yasar')"
 *     responses:
 *       200:
 *         description: "Kodlar başarıyla getirildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/DepartmentCode"
 *       404:
 *         description: "Üniversite bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /department-codes/my-university:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Giriş yapan kullanıcının üniversitesine ait kodları getir"
 *     responses:
 *       200:
 *         description: "Kodlar getirildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/DepartmentCode"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /department-codes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Yeni ders kodu ekle (kullanıcı ve admin erişimi)"
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
 *                 description: "Eklenecek ders kodu"
 *                 example: "COMP"
 *     responses:
 *       201:
 *         description: "Kod başarıyla eklendi"
 *       400:
 *         description: "Kod eksik veya zaten mevcut"
 *       500:
 *         description: "Kod eklenemedi"
 */

/**
 * @openapi
 * /admin/department-codes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Tüm kodları listele (admin erişimi)"
 *     responses:
 *       200:
 *         description: "Kodlar listelendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/DepartmentCode"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/department-codes/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Kod güncelle (admin erişimi)"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Güncellenecek kodun ID'si"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "ENGR"
 *     responses:
 *       200:
 *         description: "Kod güncellendi"
 *       404:
 *         description: "Kod bulunamadı"
 *       500:
 *         description: "Güncelleme hatası"
 */

/**
 * @openapi
 * /admin/department-codes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Kod sil (admin erişimi)"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Silinecek kodun ID'si"
 *     responses:
 *       200:
 *         description: "Kod silindi"
 *       404:
 *         description: "Kod bulunamadı"
 *       500:
 *         description: "Silme hatası"
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



