# discord-moderation-bot
 Advanced moderation designed for Discord Turkish servers.

 En iyi şekilde geliştirilmiş bir moderasyon botu Discord'da Türk sunucuların severek kullanabileceği bir bot.
 
- [Discord Moderation Bot](#discord-moderation-bot)
    - [İçerikler](#içerikler)
    - [Kurulum](#kurulum) ya da [Kurulum Videosu](https://youtu.be/xau_vBwhqAI)
    - [Kullanım](#kullanım)
    - [FAQ](#faq)
    
    
# Neden Yayınlandı?
 Sunucuda takılırken can sıkıntısından arkadaşlarıma bunu yapacağımı söyledim ve eğer bir ara kullanmak istemezsem yayınlayacağımı dile getirdim ve söz verdiğim gibi ne eklemek istediysem ekledim. Şimdi sana bu aptallık gibi geliyor olabilir ama ben kendi sunucumda arkadaşlarım için yaptığım ve boş zamanında geliştirdiğim bu botu sadece ben değil, herkesin kullanmasını istiyorum ve bunu burada yayınlamak istiyorum. **Boşu boşuna orada burada kendini övenlere para vermeyin, aptallık edersiniz.**
    
# Içerikler
 Buradan botun içerisinde olan tüm özellikleri görebilirsiniz. Buradaki özelliklerin yanında tik olanlar kullanılabilir durumda olanlar, olmayanlar ise yakın gelecekte gelecek olanlardır.
 - [x] Davet Sayacı (invite-manager)
   * Sunucuya davet ettiğiniz tüm kullanıcıları gösterir ya da bunun için size bilgi verir.
     * `me`
 - [x] İstatistik Sistemi (stat-system)
   * Ses ve Mesaj istatistiğini gün gün saymak ve bunu hem yazı hemde tablo hâlinde yansıtır.
     * `!resetstats`, `!stats`, `!topvoices`, `!topmessages`, `!message` ve `!voice` komutlarını kullanabilirsiniz.
 - [x] Envanter Sistemi (market/inventory-system)
   * Owo bot gibi maden kazıp, kazdığın madeni sattıktan sonra para kazanıp bunu kumara yatırabilirsin ve bunları kullanarak güzel şeyler yapabilirsin.
     * `!coin`, `!coinflip`, `!dailycoin`, `!dailycrate`, `!opencrate`, `!inventory`, `!market`, `!mine`, `!rolecreate`, `!topcoin` ve `!transfer` komutlarını kullanarak görebilirsin.
 - [x] Kayıt Sistemi (register)
   * Sunucuya giren bir kişiyi **erkek/kız** olarak kaydedebilirsin.
     * `!erkek`, `!kız` ve `!kayıtsız` komutlarını deneyerek görebilirsin.
 - [x] Görev Sistemi (task-system)
   * Sunucuda bir rolün üstüne istediğiniz gibi görev oluşturabilirsin. Belirttiğiniz rol için belli bir süre veriyorsunuz ve belirttiğiniz mesaj ve ses aktifliğini o süre tamamlanana kadar o rolde olan herkes gerçekleştirmeye çalışıyor.
     * `!task`, `!task create`, `!task update`, `!task add`, `!task remove`, `!task delete` ve `!task all` komutlarını kullanarak görebilirsin.
 - [x] Özel Oda Sistemi (private-voice-channel)
   * Belirttiğiniz bir kanala girdiğinizde onun altına bir oda açar ve o odayı sizin yönetebileceğiniz şekilde ayarlar.
 - [x] Cezalandırma Sistemi (penal-system)
   * Tamamen kusursuz ve size oldukça detaylı bir bilgi veren bu sistem kullanışlı ve güzeldir :D
     * `!sicil`, `!jail`, `!tempjail`, `!mute`, `!tempmute`, `!voicemute`, `!tempvoicemute`, `!warn`, `!ban`, `!unmute`, `!unmuteall`, `!unmvoicemute`, `!unvoicemuteall` ve `!kick` komutlarını kullanarak görebilirsin.
 - [x] Odalara İzinli Giriş
 - [x] Arkadaşlık Sistemi (friend-system)
   * Sunucuda her kim ile vakit geçiriyorsan sana bunun için bot belli bir puan veriyor. Bu kazandığın puanlar hiçbir işe yaramıyor ancak bu botu alıp kullanacak kişi onu istediği gibi düzenleyebilir.
     * `!friends` komutunu dene gör :D
 - [x] Eğlence İşleri
 - [x] Bilgilendirme Komutları
   * Kısacası help komutu, tüm komutların nasıl kullanıldığını rahatça oradan görebilirsin.


# Kurulum
Sana burada en ama en basit şekilde kurulumu anlatacağım eğer anlamadım diyorsan Discord sunucusundan bir mesaj at ve cevap vermemi bekle.

* İlk adım olarak [Node JS](https://nodejs.org/en/) indir.
  * Bu kurulumu yaparken sana bazı paketlerin farklı yüklemeleri ihtiyaç duyduğunu soracaktır. O kısımdaki boşluğu tikle ve devam et yoksa baya uğraşırsın dostum, demedi deme :D
* Kendine git ve bir adet MongoDB hesabı kur, nasıl kuracağını bilmiyorsan bunun için internette tonlarca video var.
* Bu projenin tüm dosyalarını zip şeklinde bilgisayarına indir.
* Proje dosyalarını bilgisayarında herhangi bir yerde klasör oluştur ve içerisine koy.
* Proje klasörünün içerisine gir ve `src/Configuration` klasörüne kadar git, ardından ilk olarak oradaki `Config.json` dosyasını aç ve içerisini doldur.
  * `Token` kısmı senin Discord'da açmış olduğun aplikasyondaki botun tokeni, bunu unutma. :D
  * `Prefix` komutlarının hangi prefix ile çalışacağını belirt.
  * `DatabaseUrl` buranın ismin- her neyse, buraya MongoDB'den almış olduğun bağlantı adresi yani `CONNECTION_STRING`'i koyacaksın.
  * `DatabaseName` buraya istediğin gibi veri tabanının ismini yaz.
* Bittiğini mi sanıyorsun? Hayır, yanılıyorsun şimdi geldik `src/Configuration` klasörünün içerisinde olan `Settings.json` dosyasına. Bu dosya sunucudaki ayarlayı yapman için önemli bir etkene sahip. Dolayısıyla, buradaki ayarları atlama ve hepsini doğru yaptığından emin ol.
  * Bunun için bir açıklama yapmayacağım sadece bilmen gereken püf noktalar `[]` arasında bir şey varsa bu demektir ki oraya birden fazla değer girebiliyorsun, örneğin `["ben", "birden", "fazla", "değerim"]` bunu bil yeterli sonrasını ufacık bir İngilizcen varsa bile yaparsın.
* Oh be!? dur lan dur daha bitmedi, daha botu çalıştırmayı öğreneceksin.
* `Powershell` ya da `CMD` kullanarak projenin konumuna gir.
* Hiçbir modülün yüklü değilse `npm install` veya `yarn` kullanıyorsan `yarn install` yaz.
* Artık botu çalıştırma vakti `npm start`, `node Index.js` ya da `node .` yazıp projeyi çalıştır.
* Botun çalışıyor artık götüne kına yakarsın, hayırlı olsun :D

**İndirmeyi başaramadın mı? [Videoyu İzlemeyi Dene](https://youtu.be/xau_vBwhqAI)**

# Kullanım
Botun kullanımıyla alakalı bilgilere buradan erişebilirsin.

## Komut/Command Ekleme
`Commands` klasörünün içerisinde herhangi bir klasör aç ya da varolan bir klasörün içerisine bir dosya aç, ardından bunun içerisine `dosyanınIsmi.js` diye bir `js` dosyası aç ardından rastgele bir komutun içeriğini kopyalayıp içine yapıştır, hayırlı olsun artık kod yazabileceğin bir ekranın var.

## Etkinlik/Event Ekleme
`Events` klasörünün içerisinde herhangi bir klasör aç ya da varolan bir klasörün içerisine bir dosya aç, ardından bunun içerisine `dosyanınIsmi.js` diye bir `js` dosyası aç ardından rastgele bir etkinlik/event içeriğini kopyalayıp içine yapıştır. Bu dosyayı kendi istediğin gibi düzenle ve `Bot.js` dosyasına git ve `EM.addEvent("dosyanınIsmi.js")` yaz ve artık bu da tamam.

## Komutlar Hakkında Bilgi Edinme
**Help** diye bir komut var, bu komutu kullanarak hangi kategoride hangi komutun olduğunu ve nasıl kullanılacağını görebilirsin.

# FAQ
Sıkça sorulan sorulara buradan ulaşabilirsin.

**Q:** Bot geliştirilmeye devam edilecek mi?<br />
**A:** Eğer bir şeyler eklersem dolaylı yoldan burayada ekleyeceğim.

**Q:** İstek herhangi bir şey ekliyor musun?<br />
**A:** Eğer istediğin şey hoşuma giderse ve yapmaktan zevk alacaksam eklerim.

**Q:** Hatalarla ilgileniyor musun?<br />
**A:** Proje içindeki hatalarla ilgileniyorum.


