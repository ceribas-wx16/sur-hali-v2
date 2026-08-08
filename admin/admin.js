console.clear();

console.log("Sur Halı Admin başlatılıyor...");


document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        console.log("Giriş formu bulundu.");

        loginForm.addEventListener(
            "submit",
            girisYap
        );

        return;
    }

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

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const mesaj =
        document.getElementById(
            "loginMessage"
        );

    mesaj.textContent = "";


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        mesaj.textContent =
            "Supabase bağlantısı kurulamadı.";

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
            "Supabase cevabı:",
            data,
            error
        );


        if (error) {

            console.error(
                "Giriş hatası:",
                error
            );

            mesaj.textContent =
                error.message;

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

        mesaj.textContent =
            err.message ||
            "Beklenmeyen bir hata oluştu.";

    }

}


/* ==========================================================
   ADMİN PANELİ
========================================================== */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth
            .getSession();


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


    /* ======================================================
       MENÜLER
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-page]"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    menuItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const pageId =
                    item.dataset.page;


                pages.forEach(
                    function (page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                const targetPage =
                    document.getElementById(
                        pageId
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active-page"
                    );

                }


                menuItems.forEach(
                    function (menu) {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    });


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

                await supabaseClient.auth
                    .signOut();

                window.location.href =
                    "admin-login.html";

            }
        );

    }

}
