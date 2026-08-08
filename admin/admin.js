console.clear();

console.log("Sur Hali Admin başlatılıyor...");

/* ==========================================================
SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

```
console.log("DOM hazır.");

const loginForm =
    document.getElementById("loginForm");


/* ======================================================
   GİRİŞ SAYFASI
====================================================== */

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
```

});

/* ==========================================================
GİRİŞ
========================================================== */

async function girisYap(e) {

```
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
    document.getElementById("loginMessage");


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


    const result =
        await supabaseClient.auth
            .signInWithPassword({

                email: email,

                password: password

            });


    console.log(
        "Supabase cevabı:",
        result
    );


    if (result.error) {

        console.error(
            "Giriş hatası:",
            result.error
        );

        mesaj.textContent =
            result.error.message;

        return;
    }


    console.log(
        "Giriş başarılı:",
        result.data.user
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
```

}

/* ==========================================================
ADMİN PANELİ
========================================================== */

async function adminPanelBaslat() {

```
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

const sessionResult =
    await supabaseClient.auth
        .getSession();


const session =
    sessionResult.data.session;


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


console.log(
    "Menü sayısı:",
    menuItems.length
);


console.log(
    "Sayfa sayısı:",
    pages.length
);


menuItems.forEach(function (item) {

    item.addEventListener(
        "click",
        function () {

            console.log(
                "Menü tıklandı:",
                item.dataset.page
            );


            const pageId =
                item.dataset.page;


            /* TÜM SAYFALARI GİZLE */

            pages.forEach(
                function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                }
            );


            /* SEÇİLEN SAYFAYI BUL */

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


            /* SEÇİLEN SAYFAYI GÖSTER */

            targetPage.classList.add(
                "active-page"
            );


            /* AKTİF MENÜ */

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

            console.log(
                "Çıkış yapılıyor..."
            );


            await supabaseClient.auth
                .signOut();


            window.location.href =
                "admin-login.html";

        }
    );

}
```

}
