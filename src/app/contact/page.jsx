// ContactPage.js
import React from 'react';
import styles from './contactPage.module.css';
import Link from 'next/link';
import Image from 'next/image';

const ContactPage = () => {
    return (
        <div className={styles.main}>
            <div className={styles.mainDesc}>
                <ul className={styles.featureListMain}>
                    <li>
                        Danışmanlık ücreti hesabıma geçmeden ne yazık ki
                        randevunuzu kesinleştiremiyorum.
                    </li>
                    <li>
                        Ücreti yatırdığınıza dair dekontu veya bilgiyi bana
                        WhatsApp üzerinden bildirmeniz çalışmamızı
                        hızlandıracaktır.
                    </li>
                    <li>
                        Danışmanlık başlamadan önce size WhatsApp üzerinden
                        Google Meet online görüşme linki göndereceğim.
                    </li>
                    <li>
                        Görüşmeyi kayda alıyorum ve bu kaydı sizinle link olarak
                        paylaşmaktayım. Kaydı 3 gün içerisinde güvenlik
                        nedeniyle silineceği için indirmenizi tavsiye ediyorum.
                    </li>
                    <li>
                        Murat İPEK / VakıfBank / **Valide Sultan Bağlı Şubesi
                    </li>
                    <li>Hesap Numarası: 00158007297829528</li>
                    <li>IBAN: TR940001500158007297829528</li>
                </ul>

                <Link
                    href="https://wa.me/905353377929"
                    className={styles.contactDetail}
                    target="_blank"
                >
                    <Image src="/wp.png" alt="wp" height={40} width={40} />
                    <h4 className={styles.contactWp}>WhatsApp İletişim</h4>
                </Link>
            </div>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>GENEL DANIŞMANLIK</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <ul className={styles.featureList}>
                            <li>
                                Bir yıl boyunca yaşayacağınız önemli
                                zamanlamaları dikkate alarak verdiğim
                                danışmanlıkta; Günümüz, ilerletim ve tutulma
                                haritalarınızı yorumlayıp, yaşam kalitenizi çok
                                daha yukarıya çekmeniz için öngörülerde
                                bulunuyorum.
                            </li>
                            <li>
                                Alacağınız bu danışmanlıkta; sağlık, para,
                                ilişkiler, aile vb. konuları genel olarak
                                yorumlanmaktadır. Sorularınızı haritanızı
                                önceden çalışmam için bilmem, danışmanlık
                                süresini daha verimli bir şekilde kullanmak
                                adına önemli olacaktır.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık içeriği : Bir yıllık genel öngörü.
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 50 dakika
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 950 TL.</h4>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>
                            HORARY veya BİR SORU BİR CEVAP (Soru Astrolojisi)
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <ul className={styles.featureList}>
                            <li>
                                Bu sistem sorunun sorulduğu ana ait gökyüzü
                                haritası çıkartılarak, sorunun cevabını bulmaya
                                yarayan yardımcı bir sistemdir. O nedenle sizin
                                kişisel bilgilerinize ihtiyaç duymamaktayım.
                            </li>
                            <li>
                                Soruyu sorduğunuz anın gökyüzü haritası sorunuzu
                                “evet veya hayır” olarak cevaplarken sorunun
                                içeriğindeki durumun süreci de değerlendirilir.
                            </li>
                            <li>
                                Horary’de sırf sormak için bir soru
                                sorulmayacağını ve aklınızdaki sorunun gerçekten
                                sizin için önemli olup olmadığını bir kere daha
                                kendinizde sorgulamanız gerektiğini bilmenizi
                                isterim.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık içeriği : Kayıp eşyalar, kayıp insanlar,
                            bir davanın sizin lehinize sonuçlanıp
                            sonuçlanmayacağı, sevgilinizle barışıp
                            barışamayacağınız, kavuşup kavuşamayacağınız, hamile
                            kalıp kalamayacağınız, işi alıp alamayacağınız…vb
                            gibi sorular sorabilirsiniz.
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 15 dakika
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 550 TL.</h4>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>
                            İLİŞKİLER ASTROLOJİSİ (Sinastri)
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <ul className={styles.featureList}>
                            <li>
                                İki kişinin arasındaki ilişkiyi temel alan bu
                                astroloji yorumlama biçiminde çiftler arasındaki
                                uyum, uyumsuzluklar incelenip ilişkinin bu
                                haritalar merkezinden bir yıllık süre zarfında
                                ne yönde evrilebileceği konusunda danışan
                                bilgilendirilir.
                            </li>
                            <li>
                                Soruyu sorduğunuz anın gökyüzü haritası sorunuzu
                                “evet veya hayır” olarak cevaplarken sorunun
                                içeriğindeki durumun süreci de değerlendirilir.
                            </li>
                            <li>
                                Bu danışmanlığın çok daha sağlıklı bir sonuç
                                verebilmesi için çiftlerin haritalarından en
                                azından birinin doğum saatinin net bilinilmesi
                                gerekmektedir.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık içeriği : İlişkinin nereden nereye doğru
                            evrildiği, ve daha iyi bir ilişki için uyum
                            çözümleri
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 60 dakika
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 1150 TL.</h4>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>
                            KİŞİSEL GELİŞİM VE KARİYER
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <ul className={styles.featureList}>
                            <li>
                                Kişisel gelişim ve kariyer konusunda, karakter
                                yapılanmanızı, zaaflarınızı, korkularınızı ve
                                bunların nedenleri üzerinde durduğum bu
                                danışmanlığımda hayat kalitenizi yükseltecek
                                önerileri haritanız üzerinden konuşuyor
                                olacağız.
                            </li>
                            <li>
                                Kariyer seçimi veya var olan kariyer alanınızda
                                potansiyelinizin ne olduğunu ve bunu geliştirmek
                                için neler yapabileceğiniz konusunda gökyüzünün
                                size hangi konularda daha dikkatli olmanız
                                gerektiğini anlatacağım.
                            </li>
                            <li>
                                Aynı zamanda bu danışmanlığı ebeveynlere
                                çocuklarının potansiyellerini görüp
                                geliştirmeleri adına detaylı bir şekilde de
                                vermekteyim.
                            </li>
                            <li>
                                Kendinizi daha iyi tanımak ve daha mutlu bir
                                gelecek için kurgulanan bu danışmanlıkta
                                gelişime açık olduğunuz zamanlar üzerinde
                                özellikle durmaktayım.
                            </li>
                            <li>
                                Görüşme bir tek bu konularda kısıtlı kalacağı
                                için öngörüde (Bağlantısı söz konusu değilse)
                                diğer konulara değinmeyeceğimi bilmenizi
                                isterim.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık içeriği : Kişisel gelişim ve kariyer
                            potansiyelinizi anlayıp geliştirmek.
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 60 dakika
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 1150 TL.</h4>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>PARA VE FİNANS</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <ul className={styles.featureList}>
                            <li>
                                Parayı planlamanız, parayla kurmuş olduğunuz
                                ilişki, yatırım zamanlama ve para / finans
                                potansiyeliniz vb. öngörüde bulunduğum bu
                                danışmanlık 1 yıllık süreyi anlatmaktadır.
                            </li>
                            <li>
                                Bu konuda danışmanlık vermeden önce danışanımdan
                                bazı soruları cevaplamasını isteyeceğim.
                            </li>
                            <li>
                                Görüşme bir tek finans ve para alanıyla kısıtlı
                                kalacağı için öngörüde (Bağlantısı söz konusu
                                değilse) diğer konulara değinmeyeceğimi
                                bilmenizi isterim.
                            </li>
                            <li>
                                Zamanlama ve teknik hesaplama çalışması
                                gerektirdiği için bu danışmanlığı alacakların
                                doğum saati ve dakikasından emin olmalarını,
                                bilmiyorlarsa Rektifikasyon yaptırmalarını
                                tavsiye ederim.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık içeriği : Yatırım zamanlama ve şekli
                            gibi daha çok para ile ilgili konular.
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 75 dakika
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 1950 TL.</h4>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>REKTİFİKASYON</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <h1 className={styles.pricingTitle}>
                            Doğum saati ve dakikasının bulunması
                            <small className={styles.textSecondary}></small>
                        </h1>
                        <ul className={styles.featureList}>
                            <li>
                                Doğum saat / dakikasının tam olarak bulunulması
                                için hayatınızda dönüm noktası olan en az 3, en
                                fazla 5 tane iyi - kötü olayların tarihlerine
                                ihtiyaç duymaktayım.
                            </li>
                            <li>
                                Örneğin: Doğum yaptığınız gün, ameliyat
                                tarihiniz , sizin için değerli birinin ölümü -
                                doğumu.
                            </li>
                            <li>
                                Mezuniyet tarihiniz, ilk işe başlama zamanınız,
                                evlendiğiniz tarih, boşandığınız tarih, ülke -
                                şehir değiştirmeniz, aşık olduğunuz zaman,
                                ortaklık kurduğunuz zaman veya ortaklığınızı
                                sonlandırdığınız zaman, ilk ev veya arabanızı
                                aldığınız tarih …vb.
                            </li>
                        </ul>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık süresi : 10 dk.
                        </h4>
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>
                            (3 saatlik zaman aralığı)
                            <p>Fiyatı : 550 TL.</p>
                        </h4>
                        <h4 className={styles.cardDetail}>
                            (3 saatten büyük zaman aralığı)
                            <p>Fiyatı : 1100 TL.</p>
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <h1 className={styles.pricingTitle}>
                            Bir aylık zaman içinde doğum gününün bulunması
                            <small className={styles.textSecondary}></small>
                        </h1>
                        {/* <ul className={styles.featureList}>
                        <li>
                            Eğer doğum gününüzle ilgili olarak bir kuşkunuz
                            varsa bu konuda yapılacak olan çalışmada saat ve
                            dakika bulunmasından çok daha detaylı bir bilgiye
                            ihtiyaç duymaktayım. Bu konuyla ilgili olarak ön
                            görüşme için lütfen iletişime geçiniz.
                        </li>
                    </ul> */}
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 1700 TL.</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <h1 className={styles.pricingTitle}>
                            Doğum ayının bulunması
                            <small className={styles.textSecondary}></small>
                        </h1>
                        {/* <ul className={styles.featureList}>
                        <li>
                            Eğer doğum ayınızla ilgili olarak bir kuşkunuz varsa
                            bu konuda yapılacak olan çalışmada saat ve dakika
                            bulunmasından çok daha detaylı bir bilgiye ihtiyaç
                            duymaktayım. Bu konuyla ilgili olarak ön görüşme
                            için lütfen iletişime geçiniz.
                        </li>
                    </ul> */}
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 2500 TL.</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <h1 className={styles.pricingTitle}>
                            Doğum yılının bulunması
                            <small className={styles.textSecondary}></small>
                        </h1>
                        {/* <ul className={styles.featureList}>
                        <li>
                            Eğer doğum yılınızla ilgili olarak bir kuşkunuz
                            varsa bu konuda yapılacak olan çalışmada saat ve
                            dakika bulunmasından çok daha detaylı bir bilgiye
                            ihtiyaç duymaktayım. Bu konuyla ilgili olarak ön
                            görüşme için lütfen iletişime geçiniz.
                        </li>
                    </ul> */}
                        <h4 className={styles.cardDetail}>
                            Danışmanlık şekli : Online
                        </h4>
                        <h4 className={styles.cardDetail}>Fiyatı : 3500 TL.</h4>
                        <h4 className={styles.cardNote}>
                            NOT: Eğer doğum tarihinizle ilgili olarak bir
                            kuşkunuz varsa bu konuda yapılacak olan çalışmada
                            saat ve dakika bulunmasından çok daha detaylı bir
                            bilgiye ihtiyaç duymaktayım. Bu konuyla ilgili
                            olarak ön görüşme için lütfen iletişime geçiniz.
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
