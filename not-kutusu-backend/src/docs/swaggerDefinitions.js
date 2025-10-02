
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
 *           description: "Toplam kullanıcı puanı (varsayılan 0)"
 *           example: 520
 *         monthlyScore:
 *           type: number
 *           description: "Aylık kullanıcı puanı (her ay sıfırlanır)"
 *           example: 85
 *         level:
 *           type: number
 *           description: "Kullanıcı seviyesi (1-6 arası)"
 *           example: 3
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *           description: "Kullanıcının kazandığı rozet ID'leri"
 *           example: ["first_note", "contributor", "social"]
 *         stats:
 *           type: object
 *           description: "Kullanıcı istatistikleri"
 *           properties:
 *             notes:
 *               type: number
 *               example: 15
 *             comments:
 *               type: number
 *               example: 42
 *             likesReceived:
 *               type: number
 *               example: 73
 *         lastMonthlyReset:
 *           type: string
 *           format: date-time
 *           description: "Son aylık puan sıfırlama tarihi"
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
 *       required: [code, universityId]
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Ders ID (otomatik)
 *           example: "64fbbf9e12ab34cd56ef7893"
 *         code:
 *           type: string
 *           description: Ders kodu (zorunlu, backend otomatik olarak büyük harfe çevirir ve boşluk/tireleri kaldırır)
 *           example: "COMP101E"
 *         universityId:
 *           type: string
 *           format: objectId
 *           description: Bu dersin bağlı olduğu üniversitenin ID'si
 *           example: "64fbbf9e12ab34cd56ef7892"
 *         noteCount:
 *           type: number
 *           description: Bu derse ait yüklenen toplam not sayısı (opsiyonel, varsayılan 0)
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
 *         viewCount:
 *           type: number
 *           description: Görüntülenme sayısı (varsayılan 0)
 *           example: 125
 *         isActive:
 *           type: boolean
 *           description: Notun aktif olup olmadığı (15+ rapor edilince false olur)
 *           example: true
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
 *     NotificationActor:
 *       type: object
 *       description: Bildirimi tetikleyen kullanıcı bilgisi (en fazla 3 kişi saklanır)
 *       properties:
 *         userId:
 *           type: string
 *           format: objectId
 *           example: "64fbbf9e12ab34cd56ef7890"
 *         name:
 *           type: string
 *           example: "Ayşe Yılmaz"
 *
 *     Notification:
 *       type: object
 *       description: Kullanıcı bildirim dokümanı
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           example: "673c1db7f1d7fd2e8c1a1234"
 *         type:
 *           type: string
 *           enum: [like, comment, badge, level_up]
 *           description: Bildirim türü
 *           example: "like"
 *         relatedNoteId:
 *           type: string
 *           format: objectId
 *           nullable: true
 *           description: Notla ilgili bildirimlerde ilgili not ID'si
 *           example: "64fbbf9e12ab34cd56ef7893"
 *         lastComment:
 *           type: string
 *           nullable: true
 *           description: Yorum bildirimlerinde son yorumun kısa özeti (100 karakter)
 *           example: "Soru 4'ün çözümü şöyle olmalı..."
 *         badge:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "contributor"
 *             name:
 *               type: string
 *               example: "Katkıcı"
 *             icon:
 *               type: string
 *               example: "📚"
 *         newLevel:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 6
 *           description: Seviye bildirimi için ulaşılan yeni seviye
 *           example: 3
 *         count:
 *           type: integer
 *           description: Gruplanmış bildirimlerde toplam olay sayısı
 *           example: 4
 *         lastActors:
 *           type: array
 *           description: Bildirimi tetikleyen son kullanıcılar (en fazla 3 kişi)
 *           items:
 *             $ref: '#/components/schemas/NotificationActor'
 *         isRead:
 *           type: boolean
 *           description: Bildirimin okunup okunmadığı
 *           example: false
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: Bildirimin son güncellenme zamanı
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     NotificationListResponse:
 *       type: object
 *       properties:
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             totalNotifications:
 *               type: integer
 *               example: 87
 *             unreadCount:
 *               type: integer
 *               example: 12
 *             hasNextPage:
 *               type: boolean
 *               example: true
 *
 *     LatestNoteSummary:
 *       type: object
 *       description: Keşfet sayfası için sadeleştirilmiş not bilgisi
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           example: "64fbbf9e12ab34cd56ef7894"
 *         title:
 *           type: string
 *           example: "Veritabanı Finalleri 2023"
 *         courseCode:
 *           type: string
 *           example: "COMP101E"
 *         courseType:
 *           type: string
 *           enum: [split, single]
 *           example: "split"
 *         instructor:
 *           type: string
 *           example: "Dr. Mehmet Demir"
 *         semester:
 *           type: string
 *           example: "2023/2024 Güz"
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-05T12:34:00.000Z"
 *         driveLink:
 *           type: string
 *           format: uri
 *           example: "https://drive.google.com/file/d/1AbCdEf"
 *         uploadedBy:
 *           type: string
 *           description: Notu yükleyen kullanıcının adı
 *           example: "Elif Çelik"
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
 *
 *     UserSuggestion:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - userId
 *       description: >
 *         Kullanıcıların site geliştirme için önerileri bu modelde saklanır.
 *         Admin tarafından görülebilir ve durum güncellenebilir.
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: Önerinin benzersiz ID'si
 *           example: "650e3f9d12ae23b7c7de99b3"
 *         title:
 *           type: string
 *           description: Öneri başlığı (maksimum 200 karakter)
 *           example: "Mobil uygulama geliştirin"
 *         content:
 *           type: string
 *           description: Öneri içeriği (maksimum 1000 karakter)
 *           example: "iOS ve Android için native uygulama olsa çok güzel olur. Push notification ile yeni notlar hakkında bilgilendirme yapılabilir."
 *         userId:
 *           type: string
 *           format: objectId
 *           description: Öneriyi gönderen kullanıcının ID'si
 *           example: "64fbbf9e12ab34cd56ef7888"
 *         status:
 *           type: string
 *           enum: [Beklemede, Görüldü, İnceleniyor, Eklendi, Eklenmedi]
 *           description: Önerinin durumu
 *           example: "Beklemede"
 *         adminNotes:
 *           type: string
 *           description: Admin tarafından eklenen notlar (opsiyonel, maksimum 500 karakter)
 *           example: "Harika öneri! Teknik ekiple değerlendiriliyor."
 *         adminId:
 *           type: string
 *           format: objectId
 *           description: Son işlemi yapan admin ID'si (opsiyonel)
 *           example: "64fbbf9e12ab34cd56ef7999"
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



/**
 * @openapi
 * /admin/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Kullanıcı listesini getir
 *     description: |
 *       Admin kullanıcılar; sayfalama, arama ve filtreleme parametreleriyle kullanıcı listesini çekebilir.
 *       - Admin hesaplar listeye dahil edilmez.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Sayfa başına kullanıcı sayısı
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: İsim veya e-posta içerisinde arama yapar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Kullanıcı aktif/pasif filtresi
 *       - in: query
 *         name: universityId
 *         schema:
 *           type: string
 *         description: Belirli bir üniversiteye göre filtreleme
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       role:
 *                         type: string
 *                       universityId:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     usersPerPage:
 *                       type: integer
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
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı detayları döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Kullanıcı temel bilgileri
 *                 recentNotes:
 *                   type: array
 *                   description: Kullanıcının son 10 aktif notu
 *                   items:
 *                     type: object
 *                 recentComments:
 *                   type: array
 *                   description: Kullanıcının son 10 yorumu
 *                   items:
 *                     type: object
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
 *     description: Admin kullanıcılar, normal kullanıcıları aktifleştirebilir veya pasifleştirebilir. Admin hesaplar pasifleştirilemez.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
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
 *                 description: Kullanıcının yeni durumu (true = aktif, false = pasif)
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
 *         description: Gönderilen isActive değeri geçersiz
 *       403:
 *         description: Yalnızca admin erişebilir veya admin kullanıcı banlanamaz
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *       429:
 *         description: "Çok fazla deneme yapıldı (limit: 1 saatte 3 kayıt denemesi)"
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
 *       Kullanıcı isim, şifre, profil fotoğrafı, bölüm vb. alanlarını güncelleyebilir. En az bir alan gönderilmelidir.
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
 *               password:
 *                 type: string
 *                 description: En az 6 karakter; en az 1 büyük harf, 1 küçük harf ve 1 rakam içermeli
 *               profilePic:
 *                 type: string
 *                 description: Geçerli bir URL
 *               aboutMe:
 *                 type: string
 *                 description: Maksimum 500 karakter
 *               department:
 *                 type: string
 *                 description: Maksimum 100 karakter
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                     description: Geçerli bir LinkedIn URL'i
 *                   github:
 *                     type: string
 *                     description: Geçerli bir GitHub URL'i
 *               notifications:
 *                 type: boolean
 *                 description: Bildirim alma tercihi
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
 *       400:
 *         description: Geçersiz veri veya hiçbir alan gönderilmedi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *       429:
 *         description: "Çok fazla istek (limit: 15 dakikada 3 şifre sıfırlama denemesi)"
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
 *       404:
 *         description: Kullanıcı bulunamadı
 *       429:
 *         description: "Çok fazla istek (limit: 5 dakikada 3 doğrulama maili)"
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
 *       429:
 *         description: "Çok fazla istek (limit: 15 dakikada 3 şifre sıfırlama talebi)"
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
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Sayfa başına sonuç sayısı
 *     responses:
 *       200:
 *         description: Bildirimler listelendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       500:
 *         description: Sunucu hatası
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
 *       500:
 *         description: Sunucu hatası
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
 *       404:
 *         description: Bildirim bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *       500:
 *         description: Sunucu hatası
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
 *       404:
 *         description: Bildirim bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *       500:
 *         description: Sunucu hatası
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




















// ======================= ADMIN ROUTES =======================
/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin işlemleri (üniversite yönetimi, raporlanan içerikler, kullanıcı yönetimi, öneri yönetimi)
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
 *     description: reports > 0 olan tüm notları listeler (aktif ve pasif dahil)
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
 * /admin/notes/inactive:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Pasifleştirilmiş notları listele
 *     description: isActive = false olan notları listeler (15+ rapor nedeniyle otomatik pasifleştirilmiş)
 *     responses:
 *       200:
 *         description: "Pasif not listesi"
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
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/notes/{id}/activate:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Pasif notu yeniden aktifleştir
 *     description: |
 *       Pasifleştirilmiş (isActive = false) bir notu yeniden aktif hale getirir.
 *       - isActive = true yapılır
 *       - reports = 0 sıfırlanır
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     responses:
 *       200:
 *         description: "Not aktifleştirildi"
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
 *       403:
 *         description: "Yalnızca admin erişebilir"
 *       404:
 *         description: "Not bulunamadı"
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: "Sunucu hatası"
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

/**
 * @openapi
 * /admin/suggestions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Tüm önerileri listele
 *     description: |
 *       Admin tüm kullanıcı önerilerini listeleyebilir.
 *       Sayfalama, durum filtresi ve arama desteği mevcuttur.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına gösterilecek öneri sayısı
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Beklemede, Görüldü, İnceleniyor, Eklendi, Eklenmedi]
 *         description: Durum filtresi
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Başlık ve içerikte arama
 *     responses:
 *       200:
 *         description: "Öneri listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserSuggestion'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       403:
 *         description: "Yalnızca admin erişebilir"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/suggestions/{id}/status:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Öneri durumunu güncelle
 *     description: Admin öneri durumunu değiştirebilir ve not ekleyebilir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Öneri ID
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
 *                 example: "İnceleniyor"
 *               adminNotes:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Harika öneri! Teknik ekiple değerlendiriliyor."
 *     responses:
 *       200:
 *         description: "Öneri durumu güncellendi"
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
 *                   example: "Öneri durumu başarıyla güncellendi."
 *                 data:
 *                   $ref: '#/components/schemas/UserSuggestion'
 *       400:
 *         description: "Geçersiz durum değeri"
 *       404:
 *         description: "Öneri bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/suggestions/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Öneriyi sil
 *     description: Admin herhangi bir öneriyi tamamen silebilir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Öneri ID
 *     responses:
 *       200:
 *         description: "Öneri silindi"
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
 *                   example: "Öneri başarıyla silindi."
 *       404:
 *         description: "Öneri bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /admin/search-bar:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     summary: Admin - Search Bar ile not arama (Pagination)
 *     description: |
 *       Admin paneli için tasarlanmış arama endpoint'i.
 *       - Sadece title, description ve course code alanlarında arama yapar
 *       - Pagination desteği vardır (default: 15 sonuç/sayfa)
 *       - Admin tüm üniversitelerde arama yapabilir
 *       - Opsiyonel olarak universitySlug parametresi ile tek bir üniversitede arama yapılabilir
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Arama terimi
 *         example: "algorithm"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Sayfa başına sonuç sayısı
 *       - in: query
 *         name: universitySlug
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri (opsiyonel, belirtilmezse tüm üniversitelerde arama yapar)
 *         example: "bogazici"
 *     responses:
 *       200:
 *         description: Arama sonuçları başarıyla getirildi
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
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalResults:
 *                       type: integer
 *                       example: 67
 *                     resultsPerPage:
 *                       type: integer
 *                       example: 15
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Arama terimi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Arama terimi gerekli."
 *       403:
 *         description: Yalnızca admin erişebilir
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yalnızca admin erişebilir"
 *       404:
 *         description: Üniversite bulunamadı (universitySlug belirtildiğinde)
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
 *     description: Belirtilen üniversitedeki en yeni notları sayfalı şekilde döner.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri
 *         example: "itu"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Sayfa başına sonuç sayısı
 *     responses:
 *       200:
 *         description: Son eklenen notlar listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LatestNoteSummary'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 7
 *                     totalNotes:
 *                       type: integer
 *                       example: 132
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *       403:
 *         description: Kullanıcının üniversitesi slug ile uyuşmazsa erişim reddedilir
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Ders kodu (zorunlu, otomatik olarak COMP101E formatına normalize edilir)"
 *                 example: "COMP101E"
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
*                   example: "Ders kodu zorunludur"
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
 *               - driveLink
 *               - courseFormat
 *             properties:
 *               title:
 *                 type: string
 *                 description: Not başlığı (zorunlu)
 *                 example: "Veritabanı final notları"
 *               description:
 *                 type: string
 *                 description: Not açıklaması (opsiyonel)
 *                 example: "Final sınavında çıkabilecek konuların özeti"
 *               courseFormat:
 *                 type: string
 *                 enum: ["split", "single"]
 *                 description: "Ders kodu formatı. split = bölüm kodu + ders numarası, single = tek parça kod"
 *                 example: "split"
 *               departmentCode:
 *                 type: string
 *                 description: "courseFormat=split için bölüm kodu (örn. COMP). Büyük-küçük harfe duyarsız, backend büyük harfe çevirir"
 *                 example: "COMP"
 *               courseNumber:
 *                 type: string
 *                 description: "courseFormat=split için ders numarası (örn. 101E). Boşluk/tire otomatik temizlenir"
 *                 example: "101E"
 *               fullCourseCode:
 *                 type: string
 *                 description: "courseFormat=single için tam ders kodu (örn. 1505001). Boşluk/tire otomatik temizlenir"
 *                 example: "1505001"
 *               instructor:
 *                 type: string
 *                 description: Dersi veren öğretim üyesi (opsiyonel)
 *                 example: "Prof. Dr. Ayşe Yılmaz"
 *               driveLink:
 *                 type: string
 *                 format: uri
 *                 description: Google Drive / bulut linki (zorunlu)
 *                 example: "https://drive.google.com/file/abc123"
 *               year:
 *                 type: string
 *                 description: Akademik yıl bilgisi (opsiyonel, front-end free text)
 *                 example: "2024/2025"
 *               semester:
 *                 type: string
 *                 description: Dönem bilgisi (opsiyonel, Güz/Bahar vb.)
 *                 example: "Güz"
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
 *                 course:
 *                   type: object
 *                   description: Notun bağlandığı ders özeti
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fbbf9e12ab34cd56ef7893"
 *                     code:
 *                       type: string
 *                       example: "COMP101E"
 *       400:
 *         description: Eksik veya hatalı alan
 *       409:
 *         description: Aynı ders kodu için yarışan istek (duplicate key)
 *       500:
 *         description: Not yüklenemedi
 */

/**
 * @openapi
 * /{slug}/notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Bir üniversitenin tüm aktif notlarını listele
 *     description: |
 *       Verilen `slug` değerine sahip üniversiteye ait tüm aktif notları döndürür.
 *       İçeride ders ID'si parametre olarak iletilmez; belirli bir ders için not almak isterseniz `/{slug}/courses/{courseId}/notes` endpointini kullanın.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri (örn. `itu`)
 *     responses:
 *       200:
 *         description: Notlar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       403:
 *         description: Token'daki üniversite slug ile uyuşmazsa erişim reddedilir
 *       404:
 *         description: Üniversite bulunamadı
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
 *
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu güncelle
 *     description: Sadece notu oluşturan kullanıcı kendi notunu güncelleyebilir. En az bir alan gönderilmelidir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek not ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 3-100 karakter arasında olmalıdır
 *               description:
 *                 type: string
 *                 description: Not açıklaması (opsiyonel)
 *               instructor:
 *                 type: string
 *                 description: Öğretim görevlisi bilgisi
 *               year:
 *                 type: string
 *                 description: Yıl bilgisi (örn. 2023/2024)
 *               semester:
 *                 type: string
 *                 description: Dönem bilgisi (örn. Güz)
 *               driveLink:
 *                 type: string
 *                 description: "Geçerli bir Google Drive linki (https://drive.google.com/ ile başlamalı)"
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
 *                   example: "Not başarıyla güncellendi"
 *                 note:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     instructor:
 *                       type: string
 *                     year:
 *                       type: string
 *                     driveLink:
 *                       type: string
 *       400:
 *         description: Gönderilen veriler geçersiz veya hiçbir alan sağlanmadı
 *       403:
 *         description: Kullanıcının bu notu güncelleme yetkisi yok veya not pasif
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Sunucu hatası
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu sil (pasifleştir)
 *     description: Not sahibi notunu pasif hâle getirir. İşlem soft-delete olarak gerçekleşir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek not ID'si
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
 *                   example: "Not pasifleştirildi (admin panelde görünmeye devam edecek)"
 *                 noteId:
 *                   type: string
 *       400:
 *         description: Not zaten pasif durumda
 *       403:
 *         description: Kullanıcının bu notu silme yetkisi yok
 *       404:
 *         description: Not bulunamadı
 *       500:
 *         description: Sunucu hatası
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
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
 *       404:
 *         description: Not bulunamadı
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: İşlem başarısız
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
 *       404:
 *         description: Not bulunamadı
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: İşlem başarısız
 */

/**
 * @openapi
 * /notes/{id}/report:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Notu raporla
 *     description: |
 *       Notu raporlar. Eğer toplam rapor sayısı 15 veya daha fazla olursa not otomatik olarak pasifleştirilir (isActive = false).
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Raporlama işlemi tamamlandı"
 *                 reports:
 *                   type: number
 *                   example: 10
 *                 isActive:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Not bulunamadı
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: İşlem başarısız
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

/**
 * @openapi
 * /{slug}/search-bar:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Notes]
 *     summary: Search Bar ile not arama (Pagination)
 *     description: |
 *       Frontend search bar'ından kullanılmak üzere tasarlanmış arama endpoint'i.
 *       - Sadece title, description ve course code alanlarında arama yapar
 *       - Pagination desteği vardır (default: 15 sonuç/sayfa)
 *       - Kullanıcı sadece kendi üniversitesindeki notları arayabilir
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug değeri
 *         example: "bogazici"
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Arama terimi
 *         example: "algorithm"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Sayfa başına sonuç sayısı
 *     responses:
 *       200:
 *         description: Arama sonuçları başarıyla getirildi
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
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalResults:
 *                       type: integer
 *                       example: 67
 *                     resultsPerPage:
 *                       type: integer
 *                       example: 15
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Arama terimi gerekli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Arama terimi gerekli."
 *       403:
 *         description: Üniversiteye erişim izni yok
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
 *       500:
 *         description: Sunucu hatası
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
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: "İşlem başarısız"
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
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: "İşlem başarısız"
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
 *       429:
 *         description: "Çok fazla istek (limit: 1 dakikada 20 etkileşim)"
 *       500:
 *         description: "İşlem başarısız"
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
 *     security:
 *       - bearerAuth: []
 *     tags: [DepartmentCode]
 *     summary: "Slug ile ders kodlarını getir (giriş yapmış kullanıcı)"
 *     description: |
 *       Belirtilen üniversite `slug` değerine göre o üniversiteye ait tüm ders kodlarını döndürür.
 *       - Token gereklidir ve token'daki üniversite ile slug uyuşmalıdır.
 *       - Not yükleme ekranında dropdown listesi için kullanılabilir.
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
 *       403:
 *         description: "Token'daki üniversite ile slug uyuşmazsa erişim reddedilir"
 *       404:
 *         description: "Üniversite bulunamadı"
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




























// ======================= SUGGESTIONS ROUTES =======================
// Bu bölüm kullanıcı önerileri işlemlerini kapsar.
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
 *     description: Giriş yapmış kullanıcı yeni öneri gönderebilir
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
 *                 example: "Mobil uygulama geliştirin"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "iOS ve Android için native uygulama olsa çok güzel olur."
 *     responses:
 *       201:
 *         description: "Öneri başarıyla gönderildi"
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
 *                   example: "Öneriniz başarıyla gönderildi."
 *                 data:
 *                   $ref: '#/components/schemas/UserSuggestion'
 *       400:
 *         description: "Başlık ve içerik zorunludur"
 *       401:
 *         description: "Token eksik"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /suggestions/my:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Kendi önerilerini getir
 *     description: Giriş yapmış kullanıcının kendi önerilerini sayfalama ile getirir
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına gösterilecek öneri sayısı
 *     responses:
 *       200:
 *         description: "Öneri listesi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserSuggestion'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     pages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: "Token eksik"
 *       500:
 *         description: "Sunucu hatası"
 */

/**
 * @openapi
 * /suggestions/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneri detayını getir
 *     description: Kullanıcı sadece kendi önerisinin detayını görebilir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Öneri ID
 *     responses:
 *       200:
 *         description: "Öneri detayı"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserSuggestion'
 *       404:
 *         description: "Öneri bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 *
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneriyi güncelle
 *     description: Kullanıcı sadece "Beklemede" ve "Görüldü" durumundaki kendi önerilerini güncelleyebilir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Öneri ID
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
 *                 example: "Mobil uygulama ve web PWA"
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Hem mobil uygulama hem de Progressive Web App olarak geliştirilebilir."
 *     responses:
 *       200:
 *         description: "Öneri güncellendi"
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
 *                   example: "Öneri başarıyla güncellendi."
 *                 data:
 *                   $ref: '#/components/schemas/UserSuggestion'
 *       400:
 *         description: "Bu durumdaki öneri güncellenemez"
 *       404:
 *         description: "Öneri bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Suggestions]
 *     summary: Öneriyi sil
 *     description: Kullanıcı sadece "Beklemede" ve "Görüldü" durumundaki kendi önerilerini silebilir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Öneri ID
 *     responses:
 *       200:
 *         description: "Öneri silindi"
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
 *                   example: "Öneri başarıyla silindi."
 *       400:
 *         description: "Bu durumdaki öneri silinemez"
 *       404:
 *         description: "Öneri bulunamadı"
 *       500:
 *         description: "Sunucu hatası"
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





/**
 * @swagger
 * /api/upload-to-drive:
 *   post:
 *     summary: "Dosyaları Google Drive'a yükle"
 *     description: "Seçilen dosyaları ZIP'leyerek Google Drive'a yükler ve paylaşılabilir link döndürür"
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Yüklenecek dosyalar (PDF ve görsel dosyaları, toplamda max 50MB)"
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: "Dosyalar başarıyla yüklendi"
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
 *                   example: "https://drive.google.com/file/d/1ABC123xyz/view"
 *                   description: "Google Drive paylaşım linki"
 *                 fileName:
 *                   type: string
 *                   example: "dosyalar-1699123456789.zip"
 *                   description: "Oluşturulan ZIP dosyasının adı"
 *                 fileCount:
 *                   type: integer
 *                   example: 5
 *                   description: "ZIP'lenen dosya sayısı"
 *                 message:
 *                   type: string
 *                   example: "5 dosya başarıyla ZIP'lenerek Drive'a yüklendi"
 *       400:
 *         description: "Geçersiz istek"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "En az bir dosya seçmelisiniz"
 *       401:
 *         description: "Token eksik"
 *       403:
 *         description: "Token geçersiz"
 *       413:
 *         description: "Dosya boyutu çok büyük (max 50MB toplam)"
 *       500:
 *         description: "Sunucu hatası"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dosya yükleme hatası: Drive API connection failed"
 */

/**
 * @openapi
 * /gamification/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Kullanıcının oyunlaştırma bilgilerini getir
 *     description: Kullanıcının puan, seviye, rozet ve istatistik bilgilerini döner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Başarılı
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
 *                     university:
 *                       type: object
 *                 gamification:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                     monthlyScore:
 *                       type: number
 *                     level:
 *                       type: number
 *                     levelInfo:
 *                       type: object
 *                     badges:
 *                       type: array
 *                       items:
 *                         type: object
 *                     stats:
 *                       type: object
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /gamification/user/{id}/badges:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Kullanıcının rozetlerini getir
 *     description: Kullanıcının kazandığı ve henüz kazanmadığı tüm rozetleri döner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /gamification/leaderboard/{slug}/monthly:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Üniversite aylık liderlik tablosu
 *     description: Belirtilen üniversitenin aylık puan sıralaması (Top 50)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *         description: Kaç kullanıcı gösterilecek
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /gamification/leaderboard/global:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Global liderlik tablosu
 *     description: Tüm kullanıcıların toplam puan sıralaması (Top 50)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *         description: Kaç kullanıcı gösterilecek
 *     responses:
 *       200:
 *         description: Başarılı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @openapi
 * /gamification/{slug}/stats:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Gamification]
 *     summary: Üniversite istatistikleri
 *     description: Belirtilen üniversitenin oyunlaştırma istatistikleri
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Üniversite slug
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Üniversite bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
