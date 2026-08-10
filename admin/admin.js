// =====================================================
// SUR HALI - ADMIN PANEL
// =====================================================

console.log("Sur Halı Admin başlatılıyor...");

// -----------------------------------------------------
// SUPABASE
// -----------------------------------------------------

const SUPABASE_URL = "https://lhltolrtgnfkbwfkpaex.supabase.co";

// BURAYA MEVCUT SUPABASE PUBLISHABLE KEY'İNİ KOY.
// Eski admin.js dosyandaki SUPABASE_KEY değerini aynen kullan.
const SUPABASE_KEY = "BURAYA_MEVCUT_PUBLISHABLE_KEY";

let supabaseClient = null;


// -----------------------------------------------------
// SUPABASE BAŞLAT
// -----------------------------------------------------

function supabaseBaslat() {

    if (!window.supabase) {
        console.error("Supabase kütüphanesi yüklenemedi.");
        return false;
    }

    if (!SUPABASE_KEY || SUPABASE_KEY === "BURAYA_MEVCUT_PUBLISHABLE_KEY") {
        console.error("Supabase publishable key tanımlanmamış.");
        return false;
    }

    try {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        // Diğer kodların da erişebilmesi için
        window.supabaseClient = supabaseClient;

        console.log("Supabase bağlantısı hazır.");

        return true;

    } catch (error) {

        console.error("Supabase başlatma hatası:", error);

        return false;
    }
}


// -----------------------------------------------------
// DOM HAZIR
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    // Supabase'i oluştur
    if (!supabaseBaslat()) {
        console.error("Supabase başlatılamadı.");
        return;
    }

    const adminPanel = document.querySelector(".admin-panel");

    if (!adminPanel) {
        console.error("Admin paneli bulunamadı.");
        return;
    }

    console.log("Admin paneli bulundu.");

    adminPanelBaslat();

});


// -----------------------------------------------------
// ADMIN PANEL BAŞLAT
// -----------------------------------------------------

function adminPanelBaslat() {

    console.log("Admin panel başlatılıyor...");

    menuSisteminiBaslat();
    urunSisteminiBaslat();
    resimSisteminiBaslat();
    dashboardBaslat();
    cikisSisteminiBaslat();

    console.log("Sur Halı Admin panel hazır.");

}


// =====================================================
// MENÜ
// =====================================================

function menuSisteminiBaslat() {

    const menuButonlari = document.querySelectorAll(
        "[data-section], .menu-item, nav button"
    );

    menuButonlari.forEach(function (buton) {

        buton.addEventListener("click", function (e) {

            const hedef =
                this.dataset.section ||
                this.getAttribute("data-target");

            if (!hedef) return;

            document.querySelectorAll(
                ".section, .admin-section, [id^='section-']"
            ).forEach(function (alan) {
                alan.style.display = "none";
            });

            const hedefAlan =
                document.getElementById(hedef) ||
                document.querySelector("." + hedef);

            if (hedefAlan) {
                hedefAlan.style.display = "block";
            }

        });

    });

}


// =====================================================
// ÜRÜN SİSTEMİ
// =====================================================

function urunSisteminiBaslat() {

    console.log("Ürün sistemi başlatılıyor...");

    const yeniUrunButonu =
        document.querySelector("#yeniUrunBtn") ||
        document.querySelector("[data-action='new-product']") ||
        Array.from(document.querySelectorAll("button"))
            .find(b => b.textContent.includes("Yeni Ürün"));

    const urunFormu =
        document.querySelector("#urunForm") ||
        document.querySelector("form");

    if (yeniUrunButonu) {

        yeniUrunButonu.addEventListener("click", function () {

            const formAlan =
                document.querySelector("#yeniUrunForm") ||
                document.querySelector(".product-form");

            if (formAlan) {
                formAlan.style.display = "block";
            }

        });

    }

    if (!urunFormu) {
        console.warn("Ürün formu bulunamadı.");
        return;
    }

    urunFormu.addEventListener("submit", async function (e) {

        e.preventDefault();

        console.log("Ürün kaydetme başladı.");

        const formData = new FormData(this);

        const urun = {

            name:
                formData.get("name") ||
                formData.get("urun_adi") ||
                document.querySelector("#urunAdi")?.value ||
                "",

            category_id:
                formData.get("category_id") ||
                formData.get("category") ||
                document.querySelector("#kategori")?.value ||
                null,

            size:
                formData.get("size") ||
                formData.get("olcu") ||
                document.querySelector("#olcu")?.value ||
                "",

            price:
                Number(
                    formData.get("price") ||
                    formData.get("fiyat") ||
                    document.querySelector("#fiyat")?.value ||
                    0
                ),

            description:
                formData.get("description") ||
                formData.get("aciklama") ||
                document.querySelector("#aciklama")?.value ||
                "",

            active:
                formData.get("active") !== "false"

        };

        console.log("Kaydedilecek ürün:", urun);

        if (!urun.name) {
            alert("Lütfen ürün adını girin.");
            return;
        }

        if (!urun.price) {
            alert("Lütfen ürün fiyatını girin.");
            return;
        }

        try {

            const { data, error } =
                await window.supabaseClient
                    .from("products")
                    .insert([urun])
                    .select();

            if (error) {

                console.error("Ürün kayıt hatası:", error);

                alert(
                    "Ürün kaydedilemedi:\n\n" +
                    error.message
                );

                return;
            }

            console.log("Ürün başarıyla kaydedildi:", data);

            alert("Ürün başarıyla eklendi.");

            this.reset();

            if (typeof urunleriGetir === "function") {
                urunleriGetir();
            }

            if (typeof dashboardVerileriniGetir === "function") {
                dashboardVerileriniGetir();
            }

        } catch (error) {

            console.error("Ürün kayıt hatası:", error);

            alert("Ürün kaydedilirken hata oluştu.");

        }

    });

}


// =====================================================
// RESİM SİSTEMİ
// =====================================================

function resimSisteminiBaslat() {

    console.log("Resim sistemi başlatılıyor...");

    const resimButonu =
        document.querySelector("[data-action='upload-image']") ||
        Array.from(document.querySelectorAll("button"))
            .find(b => b.textContent.includes("Resmi Yükle"));

    if (!resimButonu) {
        console.warn("Resim yükleme butonu bulunamadı.");
        return;
    }

    resimButonu.addEventListener("click", async function () {

        const dosyaInput =
            document.querySelector("#resimDosyasi") ||
            document.querySelector("input[type='file']");

        if (!dosyaInput || !dosyaInput.files.length) {

            alert("Lütfen bir resim seçin.");

            return;
        }

        const dosya = dosyaInput.files[0];

        console.log("Resim yükleniyor:", dosya.name);

        try {

            const dosyaAdi =
                Date.now() + "_" +
                dosya.name.replace(/\s+/g, "-");

            const { error } =
                await window.supabaseClient
                    .storage
                    .from("category-images")
                    .upload(dosyaAdi, dosya);

            if (error) {

                console.error("Resim yükleme hatası:", error);

                alert(
                    "Resim yüklenemedi:\n\n" +
                    error.message
                );

                return;
            }

            alert("Resim başarıyla yüklendi.");

            dosyaInput.value = "";

        } catch (error) {

            console.error(error);

            alert("Resim yüklenirken hata oluştu.");

        }

    });

}


// =====================================================
// DASHBOARD
// =====================================================

async function dashboardBaslat() {

    try {

        const { count: toplamUrun } =
            await window.supabaseClient
                .from("products")
                .select("*", {
                    count: "exact",
                    head: true
                });

        const toplamUrunElement =
            document.querySelector("#toplamUrun");

        if (toplamUrunElement) {
            toplamUrunElement.textContent =
                toplamUrun ?? 0;
        }

    } catch (error) {

        console.error(
            "Dashboard verileri alınamadı:",
            error
        );

    }

}


// =====================================================
// ÇIKIŞ
// =====================================================

function cikisSisteminiBaslat() {

    const cikisButonu =
        document.querySelector("#cikisBtn") ||
        Array.from(document.querySelectorAll("button"))
            .find(b => b.textContent.includes("Çıkış Yap"));

    if (!cikisButonu) return;

    cikisButonu.addEventListener("click", async function () {

        try {

            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }

        } catch (error) {

            console.error("Çıkış hatası:", error);

        }

        window.location.href = "login.html";

    });

}


// =====================================================
// GLOBAL FONKSİYONLAR
// =====================================================

window.adminPanelBaslat = adminPanelBaslat;
window.supabaseBaslat = supabaseBaslat;

console.log("admin.js yüklendi.");
