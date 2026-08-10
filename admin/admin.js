console.log("Sur Halı Admin JS yükleniyor...");


/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");


    /* ======================================================
       GİRİŞ SAYFASI
    ====================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        console.log("Giriş sayfası bulundu.");


        loginForm.addEventListener(
            "submit",
            girisYap
        );


        console.log(
            "Giriş formu submit eventi bağlandı."
        );


        return;
    }


    /* ======================================================
       ADMİN PANELİ
    ====================================================== */

    const adminContainer =
        document.querySelector(
            ".admin-container"
        );


    if (adminContainer) {

        console.log(
            "Admin paneli bulundu."
        );


        adminPanelBaslat();

    }

});


/* ==========================================================
   GİRİŞ
========================================================== */

async function girisYap(e) {

    e.preventDefault();


    console.log(
        "Giriş butonuna basıldı."
    );


    const emailElement =
        document.getElementById("email");


    const passwordElement =
        document.getElementById("password");


    const mesaj =
        document.getElementById(
            "loginMessage"
        );


    if (
        !emailElement ||
        !passwordElement
    ) {

        console.error(
            "E-posta veya şifre alanı bulunamadı."
        );


        if (mesaj) {

            mesaj.textContent =
                "Giriş alanları bulunamadı.";

        }


        return;
    }


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value;


    if (mesaj) {

        mesaj.textContent = "";

    }


    /* ======================================================
       SUPABASE KONTROLÜ
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


    try {

        console.log(
            "Supabase giriş deneniyor..."
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        console.log(
            "Supabase giriş cevabı:",
            data,
            error
        );


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


        window.location.href =
            "admin.html";

    }

    catch (error) {

        console.error(
            "Beklenmeyen giriş hatası:",
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

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* ======================================================
       SUPABASE KONTROLÜ
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
            await supabaseClient.auth
                .getSession();


        if (error) {

            console.error(
                "Oturum kontrol hatası:",
                error
            );

            return;
        }


        if (!data.session) {

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
            "Oturum kontrolünde beklenmeyen hata:",
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
       SOL MENÜ TIKLAMA
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

                pages.forEach(
                    function (page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                /* HEDEF SAYFAYI BUL */

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


                /* HEDEF SAYFAYI AÇ */

                targetPage.classList.add(
                    "active-page"
                );


                /* TÜM MENÜLERİ PASİF YAP */

                menuItems.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /* SEÇİLEN MENÜYÜ AKTİF YAP */

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


    quickButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    const pageId =
                        button.getAttribute(
                            "data-page"
                        );


                    console.log(
                        "Hızlı işlem:",
                        pageId
                    );


                    /* TÜM SAYFALARI KAPAT */

                    pages.forEach(
                        function (page) {

                            page.classList.remove(
                                "active-page"
                            );

                        }
                    );


                    /* HEDEF SAYFAYI BUL */

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


                    /* HEDEF SAYFAYI AÇ */

                    targetPage.classList.add(
                        "active-page"
                    );


                    /* SIDEBAR AKTİF MENÜ */

                    menuItems.forEach(
                        function (item) {

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

                        }
                    );

                }
            );

        }
    );


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
            "Yeni Ürün butonu bulundu."
        );


        newProductButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Yeni Ürün butonuna basıldı."
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
       VAZGEÇ BUTONU
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

        console.log(
            "Vazgeç butonu bulundu."
        );


        cancelProductButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Ürün formu kapatılıyor."
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

                    await supabaseClient.auth
                        .signOut();

                }

                catch (error) {

                    console.error(
                        "Çıkış hatası:",
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
