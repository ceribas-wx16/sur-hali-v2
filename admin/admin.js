/* ==========================================================
SUR HALI - ADMIN.JS
========================================================== */

console.clear();

console.log("Sur Halı Admin başlatılıyor...");

document.addEventListener("DOMContentLoaded", function () {

```
console.log("DOM hazır.");


/* ======================================================
   GİRİŞ SAYFASI
====================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    console.log(
        "Giriş formu bulundu."
    );


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
    document.querySelector(
        ".admin-container"
    );


if (adminContainer) {

    console.log(
        "Admin paneli bulundu."
    );

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


console.log(
    "Giriş butonuna basıldı."
);


const emailInput =
    document.getElementById(
        "email"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const mesaj =
    document.getElementById(
        "loginMessage"
    );


const email =
    emailInput.value.trim();


const password =
    passwordInput.value;


mesaj.textContent = "";


console.log(
    "E-posta:",
    email
);


/* SUPABASE */

if (
    typeof supabase ===
    "undefined"
) {

    console.error(
        "supabase bulunamadı."
    );

    mesaj.textContent =
        "Supabase bağlantısı bulunamadı.";

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
        "Giriş başarılı."
    );


    window.location.href =
        "admin.html";

}

catch (error) {

    console.error(
        "Beklenmeyen hata:",
        error
    );


    mesaj.textContent =
        error.message ||
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


if (
    typeof supabase ===
    "undefined"
) {

    console.error(
        "supabase bulunamadı."
    );

    return;
}


const {
    data: {
        session
    }
} =
    await supabase.auth
        .getSession();


if (!session) {

    console.warn(
        "Aktif oturum yok."
    );


    window.location.href =
        "admin-login.html";


    return;
}


console.log(
    "Admin oturumu aktif:",
    session.user.email
);


/* MENÜ */

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


            const target =
                document.getElementById(
                    pageId
                );


            if (target) {

                target.classList.add(
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


/* ÇIKIŞ */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            await supabase.auth
                .signOut();


            window.location.href =
                "admin-login.html";

        }
    );

}
```

}
