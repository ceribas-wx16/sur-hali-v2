console.log("Sur Halı Admin JS yükleniyor...");


/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    /* ======================================================
       GİRİŞ FORMU
    ====================================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        console.log("Giriş formu bulundu.");

        loginForm.addEventListener(
            "submit",
            girisYap
        );

        return;
    }


    /* ======================================================
       ADMİN PANELİ
    ====================================================== */

    const adminContainer =
        document.querySelector(".admin-container");

    if (adminContainer) {

        console.log("Admin paneli bulundu.");

        adminPanelBaslat();

    }

});


/* ==========================================================
   GİRİŞ YAP
========================================================== */

async function girisYap(e) {

    e.preventDefault();

    console.log("Giriş deneniyor...");


    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const mesaj =
        document.getElementById("loginMessage");


    if (!emailElement || !passwordElement) {

        console.error(
            "E-posta veya şifre alanı bulunamadı."
        );

        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (mesaj) {

        mesaj.textContent =
            "Giriş yapılıyor...";

    }


    /* ======================================================
       SUPABASE KONTROL
    ====================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        if (mesaj) {

            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";

        }

        return;
    }


    /* ======================================================
       SUPABASE GİRİŞ
    ====================================================== */

    try {

        console.log(
            "Supabase signInWithPassword çalışıyor..."
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        console.log(
            "Supabase sonucu:",
            data,
            error
        );


        /* ==================================================
           HATA
        ================================================== */

        if (error) {

            console.error(
                "Giriş hatası:",
                error
            );

            if (mesaj) {

                mesaj.textContent =
                    error.message ||
                    "E-posta veya şifre hatalı.";

            }

            return;
        }


        /* ==================================================
           BAŞARILI
        ================================================== */

        if (
            data &&
            data.user
        ) {

            console.log(
                "Giriş başarılı:",
                data.user.email
            );


            if (mesaj) {

                mesaj.textContent =
                    "Giriş başarılı. Panel açılıyor...";

            }


            window.location.href =
                "admin.html";

        }

    }

    catch (error) {

        console.error(
            "Beklenmeyen giriş hatası:",
            error
        );


        if (mesaj) {

            mesaj.textContent =
                error.message ||
                "Giriş sırasında bir hata oluştu.";

        }

    }

}


/* ==========================================================
   ADMİN PANELİ BAŞLAT
========================================================== */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* ======================================================
       SUPABASE KONTROL
    ====================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


    /* ======================================================
       OTURUM KONTROLÜ
    ====================================================== */

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Oturum kontrol hatası:",
                error
            );

            return;
        }


        if (
            !data ||
            !data.session
        ) {

            console.warn(
                "Aktif oturum bulunamadı."
            );


            window.location.href =
                "admin-login.html";

            return;
        }


        console.log(
            "Admin oturumu aktif:",
            data.session.user.email
        );

    }

    catch (error) {

        console.error(
            "Oturum kontrolünde hata:",
            error
        );

        return;
    }


    /* ======================================================
       SAYFALAR
    ====================================================== */

    const pages =
        document.querySelectorAll(
            ".main-content .page"
        );


    /* ======================================================
       SOL MENÜ
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    console.log(
        "Bulunan menüler:",
        menuItems.length
    );


    console.log(
        "Bulunan sayfalar:",
        pages.length
    );


    /* ======================================================
       MENÜ TIKLAMA
    ====================================================== */

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


                /* HEDEF SAYFA */

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


                /* TÜM MENÜLERİ PASİF YAP */

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
       DASHBOARD HIZLI İŞLEMLER
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


                console.log(
                    "Hızlı işlem:",
                    pageId
                );


                /* TÜM SAYFALARI KAPAT */

                pages.forEach(function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                });


                /* HEDEF SAYFA */

                const targetPage =
                    document.getElementById(
                        pageId
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active-page"
                    );

                }


                /* MENÜLERİ GÜNCELLE */

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
       YENİ ÜRÜN BUTONU
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

        console.log(
            "Yeni ürün sistemi hazır."
        );


        newProductButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Yeni Ürün tıklandı."
                );


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

                console.log(
                    "Ürün ekleme iptal edildi."
                );


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

                console.log(
                    "Çıkış yapılıyor..."
                );


                try {

                    const {
                        error
                    } =
                        await supabaseClient.auth.signOut();


                    if (error) {

                        console.error(
                            "Çıkış hatası:",
                            error
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "Çıkış sırasında hata:",
                        error
                    );

                }


                window.location.href =
                    "admin-login.html";

            }
        );

    }


    console.log(
        "Sur Halı Admin panel hazır."
    );

}
