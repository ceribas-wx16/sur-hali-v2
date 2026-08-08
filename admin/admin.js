console.log("Sur Halı Admin JS yükleniyor...");


/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    /* ======================================================
       GİRİŞ SAYFASI
    ====================================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        console.log("Giriş formu bulundu.");

        /*
         * HTML tarafında zaten:
         *
         * onsubmit="girisYap(event); return false;"
         *
         * olduğu için burada tekrar submit eventi
         * bağlamıyoruz.
         */

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
   GİRİŞ
========================================================== */

async function girisYap(e) {

    e.preventDefault();

    console.log("Giriş butonuna basıldı.");

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
        mesaj.textContent = "";
    }


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


        const result =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        const data = result.data;
        const error = result.error;


        console.log(
            "Supabase cevabı:",
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

    catch (err) {

        console.error(
            "Beklenmeyen hata:",
            err
        );

        if (mesaj) {

            mesaj.textContent =
                err.message ||
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

        const result =
            await supabaseClient.auth.getSession();


        const session =
            result.data.session;


        if (!session) {

            console.warn(
                "Aktif oturum bulunamadı."
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        console.log(
            "Aktif kullanıcı:",
            session.user.email
        );

    }

    catch (error) {

        console.error(
            "Oturum kontrolü başarısız:",
            error
        );

        return;

    }


    /* ======================================================
       MENÜ SİSTEMİ
    ====================================================== */

    const pages =
        document.querySelectorAll(".page");


    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-page]"
        );


    console.log(
        "Menü sayısı:",
        menuItems.length
    );


    /*
     * ÖNEMLİ:
     * Menü olaylarını doğrudan butonlara değil,
     * document seviyesinde yönetiyoruz.
     *
     * Böylece başka bir kod menü butonunu etkilerse
     * bile sistem çalışmaya devam eder.
     */

    document.addEventListener(
        "click",
        function (event) {

            const menuItem =
                event.target.closest(
                    ".menu-item[data-page]"
                );


            if (!menuItem) {
                return;
            }


            event.preventDefault();


            const pageId =
                menuItem.getAttribute(
                    "data-page"
                );


            console.log(
                "Menü tıklandı:",
                pageId
            );


            /* TÜM SAYFALARI GİZLE */

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


            /* HEDEF SAYFAYI GÖSTER */

            targetPage.classList.add(
                "active-page"
            );


            /* TÜM MENÜLERDEN ACTIVE KALDIR */

            menuItems.forEach(
                function (menu) {

                    menu.classList.remove(
                        "active"
                    );

                }
            );


            /* TIKLANAN MENÜYÜ AKTİF YAP */

            menuItem.classList.add(
                "active"
            );

        },
        false
    );


    /* ======================================================
       DASHBOARD HIZLI İŞLEMLER
    ====================================================== */

    const quickButtons =
        document.querySelectorAll(
            "[data-page]"
        );


    quickButtons.forEach(
        function (button) {

            /*
             * Sidebar menülerinin kendi sistemi
             * yukarıdaki delegation tarafından yönetiliyor.
             *
             * Dashboard'daki "Ürün Yönetimi"
             * ve "Resim Yönetimi" butonları için
             * ayrıca delegation kullanıyoruz.
             */

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".gold-button[data-page], .outline-button[data-page]"
                );


            if (!button) {
                return;
            }


            const pageId =
                button.getAttribute(
                    "data-page"
                );


            const targetPage =
                document.getElementById(
                    pageId
                );


            if (!targetPage) {
                return;
            }


            pages.forEach(
                function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                }
            );


            targetPage.classList.add(
                "active-page"
            );


            menuItems.forEach(
                function (menu) {

                    menu.classList.remove(
                        "active"
                    );


                    if (
                        menu.getAttribute(
                            "data-page"
                        ) === pageId
                    ) {

                        menu.classList.add(
                            "active"
                        );

                    }

                }
            );

        },
        false
    );


    /* ======================================================
       YENİ ÜRÜN BUTONU
    ====================================================== */

    const newProductButton =
        document.getElementById(
            "newProductButton"
        );


    if (newProductButton) {

        console.log(
            "Yeni ürün butonu bulundu."
        );


        newProductButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Yeni ürün butonuna basıldı."
                );


                /*
                 * Ürün formu henüz HTML'de yoksa
                 * şimdilik hata vermiyoruz.
                 */

                const productFormBox =
                    document.getElementById(
                        "productFormBox"
                    );


                if (productFormBox) {

                    productFormBox.style.display =
                        "block";


                    newProductButton.style.display =
                        "none";


                    productFormBox.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

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

                    await supabaseClient.auth.signOut();

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
