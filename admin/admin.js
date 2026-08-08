```javascript
console.log("Sur Halı Admin başlatılıyor...");

/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    const loginForm =
        document.getElementById("loginForm");

    /* GİRİŞ SAYFASI */

    if (loginForm) {

        console.log("Giriş sayfası.");

        return;
    }


    /* ADMİN PANELİ */

    const adminContainer =
        document.querySelector(".admin-container");

    if (adminContainer) {

        console.log("Admin paneli bulundu.");

        adminPanelBaslat();

    }

});


/* ==========================================================
   GİRİŞ
========================================================== */

async function girisYap(e) {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const mesaj =
        document.getElementById("loginMessage");


    if (mesaj) {
        mesaj.textContent = "";
    }


    if (typeof supabaseClient === "undefined") {

        if (mesaj) {
            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";
        }

        return;
    }


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });


        if (error) {

            console.error(
                "Giriş hatası:",
                error
            );

            if (mesaj) {
                mesaj.textContent =
                    error.message;
            }

            return;
        }


        console.log(
            "Giriş başarılı:",
            data.user
        );


        window.location.href = "admin.html";

    }

    catch (error) {

        console.error(
            "Beklenmeyen hata:",
            error
        );

        if (mesaj) {

            mesaj.textContent =
                error.message ||
                "Beklenmeyen bir hata oluştu.";

        }

    }

}


/* ==========================================================
   ADMİN PANELİ
========================================================== */

async function adminPanelBaslat() {

    console.log("Admin panel başlatılıyor...");


    /* SUPABASE */

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


    /* OTURUM */

    const { data, error } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Oturum kontrol hatası:",
            error
        );

        return;
    }


    if (!data.session) {

        window.location.href =
            "admin-login.html";

        return;
    }


    console.log(
        "Admin oturumu aktif:",
        data.session.user.email
    );


    /* ======================================================
       MENÜLER
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    const pages =
        document.querySelectorAll(
            ".main-content .page"
        );


    console.log(
        "Bulunan menüler:",
        menuItems.length
    );


    console.log(
        "Bulunan sayfalar:",
        pages.length
    );


    menuItems.forEach(function (menuItem) {

        menuItem.addEventListener(
            "click",
            function (e) {

                e.preventDefault();


                const pageId =
                    menuItem.getAttribute(
                        "data-page"
                    );


                console.log(
                    "Menü seçildi:",
                    pageId
                );


                /* TÜM SAYFALARI KAPAT */

                pages.forEach(function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                });


                /* HEDEF SAYFAYI AÇ */

                const targetPage =
                    document.getElementById(
                        pageId
                    );


                if (!targetPage) {

                    console.error(
                        "Sayfa bulunamadı:",
                        pageId
                    );

                    return;
                }


                targetPage.classList.add(
                    "active-page"
                );


                /* MENÜLERİ TEMİZLE */

                menuItems.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                /* SEÇİLEN MENÜ */

                menuItem.classList.add(
                    "active"
                );

            }
        );

    });


    /* ======================================================
       DASHBOARD HIZLI BUTONLARI
    ====================================================== */

    const quickButtons =
        document.querySelectorAll(
            ".quick-actions [data-page]"
        );


    quickButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const pageId =
                    button.getAttribute(
                        "data-page"
                    );


                pages.forEach(function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                });


                const targetPage =
                    document.getElementById(
                        pageId
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active-page"
                    );

                }


                menuItems.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );


                    if (
                        item.getAttribute(
                            "data-page"
                        ) === pageId
                    ) {

                        item.classList.add(
                            "active"
                        );

                    }

                });

            }
        );

    });


    /* ======================================================
       YENİ ÜRÜN
    ====================================================== */

    const newProductButton =
        document.getElementById(
            "newProductButton"
        );


    const productFormBox =
        document.getElementById(
            "productFormBox"
        );


    if (
        newProductButton &&
        productFormBox
    ) {

        newProductButton.addEventListener(
            "click",
            function () {

                productFormBox.style.display =
                    "block";

                newProductButton.style.display =
                    "none";

                productFormBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* ======================================================
       VAZGEÇ
    ====================================================== */

    const cancelProductButton =
        document.getElementById(
            "cancelProductButton"
        );


    if (
        cancelProductButton &&
        productFormBox &&
        newProductButton
    ) {

        cancelProductButton.addEventListener(
            "click",
            function () {

                productFormBox.style.display =
                    "none";

                newProductButton.style.display =
                    "inline-block";


                const productForm =
                    document.getElementById(
                        "productForm"
                    );


                if (productForm) {

                    productForm.reset();

                }

            }
        );

    }


    /* ======================================================
       ÜRÜN FORMU
    ====================================================== */

    const productForm =
        document.getElementById(
            "productForm"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                await urunKaydet();

            }
        );

    }


    /* ======================================================
       İLK ÜRÜN LİSTESİNİ YÜKLE
    ====================================================== */

    await urunleriYukle();


    /* ======================================================
       ÇIKIŞ
    ====================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                await supabaseClient.auth.signOut();

                window.location.href =
                    "admin-login.html";

            }
        );

    }


    console.log(
        "Sur Halı Admin panel hazır."
    );

}


/* ==========================================================
   ÜRÜN KAYDET
========================================================== */

async function urunKaydet() {

    console.log("Ürün kaydetme işlemi başladı.");


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const size =
        document.getElementById(
            "productSize"
        ).value.trim();


    const priceValue =
        document.getElementById(
            "productPrice"
        ).value;


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    const isActive =
        document.getElementById(
            "productActive"
        ).value === "true";


    /* ZORUNLU ALAN KONTROLÜ */

    if (!name) {

        alert("Lütfen ürün adını giriniz.");

        return;
    }


    if (!category) {

        alert("Lütfen ürün kategorisini seçiniz.");

        return;
    }


    let price = null;

    if (priceValue !== "") {

        price =
            Number(priceValue);

        if (Number.isNaN(price)) {

            alert(
                "Lütfen geçerli bir fiyat giriniz."
            );

            return;
        }

    }


    /* SUPABASE KONTROLÜ */

    if (typeof supabaseClient === "undefined") {

        alert(
            "Supabase bağlantısı kurulamadı."
        );

        return;
    }


    try {

        const { data, error } =
            await supabaseClient
                .from("products")
                .insert([
                    {
                        name: name,
                        category: category,
                        size: size || null,
                        price: price,
                        description: description || null,
                        image_url: null,
                        is_active: isActive
                    }
                ])
                .select()
                .single();


        if (error) {

            console.error(
                "Ürün kayıt hatası:",
                error
            );

            alert(
                "Ürün kaydedilemedi:\n" +
                error.message
            );

            return;
        }


        console.log(
            "Ürün başarıyla kaydedildi:",
            data
        );


        alert(
            "Ürün başarıyla kaydedildi."
        );


        /* FORMU TEMİZLE */

        const productForm =
            document.getElementById(
                "productForm"
            );


        if (productForm) {

            productForm.reset();

        }


        /* FORMU KAPAT */

        const productFormBox =
            document.getElementById(
                "productFormBox"
            );


        const newProductButton =
            document.getElementById(
                "newProductButton"
            );


        if (productFormBox) {

            productFormBox.style.display =
                "none";

        }


        if (newProductButton) {

            newProductButton.style.display =
                "inline-block";

        }


        /* LİSTEYİ YENİLE */

        await urunleriYukle();

    }

    catch (error) {

        console.error(
            "Beklenmeyen ürün kayıt hatası:",
            error
        );

        alert(
            "Ürün kaydedilirken beklenmeyen bir hata oluştu."
        );

    }

}


/* ==========================================================
   ÜRÜNLERİ SUPABASE'DEN ÇEK
========================================================== */

async function urunleriYukle() {

    console.log(
        "Ürünler Supabase'den yükleniyor..."
    );


    if (typeof supabaseClient === "undefined") {

        console.error(
            "Supabase bağlantısı bulunamadı."
        );

        return;
    }


    try {

        const { data, error } =
            await supabaseClient
                .from("products")
                .select(
                    "id, created_at, name, category, size, price, description, image_url, is_active"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Ürünleri getirme hatası:",
                error
            );

            return;
        }


        console.log(
            "Bulunan ürün sayısı:",
            data.length
        );


        urunListesiniGoster(data);

        dashboardUrunSayilariniGuncelle(data);

    }

    catch (error) {

        console.error(
            "Ürün listeleme hatası:",
            error
        );

    }

}


/* ==========================================================
   ÜRÜN LİSTESİNİ GÖSTER
========================================================== */

function urunListesiniGoster(urunler) {

    const productList =
        document.getElementById(
            "productList"
        );


    const productCount =
        document.getElementById(
            "productCount"
        );


    if (!productList) {
        return;
    }


    /* ÜRÜN SAYISI */

    if (productCount) {

        productCount.textContent =
            urunler.length + " ürün";

    }


    /* HİÇ ÜRÜN YOKSA */

    if (urunler.length === 0) {

        productList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▤
                </div>

                <h2>
                    Henüz ürün bulunmuyor
                </h2>

                <p>
                    Yeni Ürün butonunu kullanarak
                    ilk ürününüzü ekleyebilirsiniz.
                </p>

            </div>

        `;

        return;
    }


    /* ÜRÜNLER */

    productList.innerHTML =
        urunler.map(function (urun) {

            const fiyat =
                urun.price !== null &&
                urun.price !== undefined
                    ? Number(urun.price).toLocaleString(
                        "tr-TR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    ) + " TL"
                    : "Fiyat belirtilmedi";


            const durum =
                urun.is_active
                    ? "Aktif"
                    : "Pasif";


            return `

                <div class="product-item">

                    <div class="product-item-info">

                        <h3>
                            ${htmlGuvenli(urun.name)}
                        </h3>

                        <p>
                            <strong>Kategori:</strong>
                            ${htmlGuvenli(urun.category)}
                        </p>

                        ${
                            urun.size
                                ? `
                                    <p>
                                        <strong>Ölçü:</strong>
                                        ${htmlGuvenli(urun.size)}
                                    </p>
                                  `
                                : ""
                        }

                        <p>
                            <strong>Fiyat:</strong>
                            ${fiyat}
                        </p>

                        ${
                            urun.description
                                ? `
                                    <p>
                                        ${htmlGuvenli(
                                            urun.description
                                        )}
                                    </p>
                                  `
                                : ""
                        }

                    </div>


                    <div class="product-item-status">

                        <span>
                            ${durum}
                        </span>

                    </div>

                </div>

            `;

        }).join("");

}


/* ==========================================================
   DASHBOARD ÜRÜN SAYILARI
========================================================== */

function dashboardUrunSayilariniGuncelle(urunler) {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    const activeProducts =
        document.getElementById(
            "activeProducts"
        );


    const aktifUrunler =
        urunler.filter(function (urun) {

            return urun.is_active === true;

        });


    if (totalProducts) {

        totalProducts.textContent =
            urunler.length;

    }


    if (activeProducts) {

        activeProducts.textContent =
            aktifUrunler.length;

    }

}


/* ==========================================================
   HTML GÜVENLİĞİ
========================================================== */

function htmlGuvenli(deger) {

    if (
        deger === null ||
        deger === undefined
    ) {

        return "";

    }


    return String(deger)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
```
