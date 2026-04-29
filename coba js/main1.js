let namabarang = "JAM Rolex";
let Harga = "5000";
let Jumlah = "2";
let Total = Harga * Jumlah;
let diskon = 0;

if (Total >= 10000) {
diskon = 0.05 * Total;
}

let bayar = Total - diskon;

console.log("namabarang : " + namabarang)
console.log("Harga      : " + Harga)
console.log("Jumlah     : " + Jumlah)
console.log("Total      : " + Total)
console.log("diskon     : " + diskon)
console.log("bayar      : " + bayar)