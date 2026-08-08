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
```
