// ======================
// SPLASH SCREEN
// ======================

setTimeout(() => {

const splash =
document.getElementById("splash");

if(splash){
splash.style.display = "none";
}

},2500);

// ======================
// GLOBAL
// ======================

let selectedGroup = null;
const SHEET_URL =
"https://script.google.com/macros/s/AKfycbzZmp-YZNZ9gk131E8aFozE9EQqNUrQDaFtauQkA40wRJbCsHb8RNbz-aJvJ1uF1q8/exec";

// ======================
// AUTH
// ======================

function showRegister(){

document
.getElementById("loginPage")
.classList.remove("active");

document
.getElementById("registerPage")
.classList.add("active");

}

function showLogin(){

document
.getElementById("registerPage")
.classList.remove("active");

document
.getElementById("loginPage")
.classList.add("active");

}

// ======================
// REGISTER
// ======================

function register(){

const name =
document.getElementById("regName").value.trim();

const email =
document.getElementById("regEmail").value.trim();

if(!name || !email){

alert("Lengkapi data");
return;

}

const user = {

name,
email,
points:0

};

localStorage.setItem(
"user",
JSON.stringify(user)
);

alert("Pendaftaran berhasil");

showLogin();

}

// ======================
// LOGIN
// ======================

function login(){

const savedUser =
JSON.parse(
localStorage.getItem("user")
);

if(!savedUser){

alert("Silakan daftar terlebih dahulu");
return;

}

const name =
document.getElementById("loginName").value.trim();

const email =
document.getElementById("loginEmail").value.trim();

if(

name === savedUser.name &&
email === savedUser.email

){

// simpan login terakhir

localStorage.setItem(
"currentUser",
JSON.stringify(savedUser)
);

// kirim ke spreadsheet
fetch(SHEET_URL,{
    method:"POST",
    body:JSON.stringify({
        nama:savedUser.name,
        email:savedUser.email,
        waktu:new Date().toLocaleString()
    })
})
.then(res=>res.text())
.then(data=>console.log("Login tercatat:",data))
.catch(err=>console.log(err));


document
.getElementById("loginPage")
.classList.remove("active");

document
.getElementById("registerPage")
.classList.remove("active");

document
.getElementById("appPage")
.classList.add("active");

loadUser();

}else{

alert("Nama atau email salah");

}

}

// ======================
// USER
// ======================

function loadUser(){

const user =
JSON.parse(
localStorage.getItem("currentUser")
);

if(!user) return;

const welcome =
document.getElementById("welcomeText");

if(welcome){

welcome.innerHTML =
`Hai ${user.name} 👋`;

}

const profileName =
document.getElementById("profileName");

if(profileName){

profileName.innerText =
user.name;

}

const profileEmail =
document.getElementById("profileEmail");

if(profileEmail){

profileEmail.innerText =
user.email;

}

const points =
document.getElementById("userPoints");

if(points){

points.innerText =
user.points || 0;

}

const pointsProfile =
document.getElementById("userPointsProfile");

if(pointsProfile){

pointsProfile.innerText =
user.points || 0;

}

}

// ======================
// TAB
// ======================

function openTab(tabId){

document
.querySelectorAll(".tab")
.forEach(tab=>{

tab.classList.remove("active-tab");

});

document
.getElementById(tabId)
.classList.add("active-tab");

}

// ======================
// FORMAT RUPIAH
// ======================

function rupiah(angka){

return new Intl.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR",
minimumFractionDigits:0
}
).format(angka);

}
// ======================
// GROUP
// ======================

function addMember(){

const input =
document.createElement("input");

input.className =
"memberInput";

input.placeholder =
"Nama Anggota";

document
.getElementById("memberContainer")
.appendChild(input);

}

function createGroup(){

const groupName =
document
.getElementById("groupName")
.value
.trim();

if(!groupName){

alert("Masukkan nama grup");
return;

}

const members = [];

document
.querySelectorAll(".memberInput")
.forEach(input=>{

const nama =
input.value.trim();

if(nama){

members.push({

nama:nama,
status:false,
bukti:"",
pesanan:[],
totalPesanan:0

});

}

});

if(members.length === 0){

alert("Minimal 1 anggota");
return;

}

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

groups.push({

name:groupName,
members:members

});

localStorage.setItem(
"groups",
JSON.stringify(groups)
);

alert("Grup berhasil dibuat");

document
.getElementById("groupName")
.value = "";

document
.getElementById("memberContainer")
.innerHTML = `

<input
class="memberInput"
placeholder="Nama Anggota">

`;

loadGroups();
updateStatistics();

}

// ======================
// LOAD GROUP
// ======================

function loadGroups(){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let html = "";

if(groups.length === 0){

html =
"Belum ada grup";

}else{

groups.forEach((group,index)=>{

html += `

<div class="group-item">

<h4>${group.name}</h4>

<p>
👥 ${group.members.length} anggota
</p>

<button
onclick="selectGroup(${index})">

Gunakan Grup

</button>

</div>

`;

});

}

const groupList =
document.getElementById("groupList");

if(groupList){

groupList.innerHTML =
html;

}

const preview =
document.getElementById("groupPreview");

if(preview){

preview.innerHTML =
html;

}

}

// ======================
// PILIH GROUP
// ======================

function selectGroup(index){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

selectedGroup =
groups[index];

selectedGroup.groupIndex =
index;

alert(
"Grup aktif : " +
selectedGroup.name
);

loadMembers();

}

// ======================
// STATUS PEMBAYARAN
// ======================

function loadMembers(){

if(!selectedGroup){

document
.getElementById("memberList")
.innerHTML =
"Belum pilih grup";

return;

}

let html = "";

selectedGroup.members.forEach((member,index)=>{

html += `

<div class="member-item">

<div>

<b>${member.nama}</b>

<br>

${
member.status
?
"🟢 Lunas"
:
"🟡 Belum Bayar"
}

</div>

<div>

<button
onclick="togglePayment(${index})">

${
member.status
?
"Batalkan"
:
"Lunas"
}

</button>

</div>

</div>

`;

});

document
.getElementById("memberList")
.innerHTML =
html;

}

// ======================
// TOGGLE BAYAR
// ======================

function togglePayment(index){

if(!selectedGroup) return;

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let g =
selectedGroup.groupIndex;

groups[g]
.members[index]
.status =
!groups[g]
.members[index]
.status;

localStorage.setItem(
"groups",
JSON.stringify(groups)
);

selectedGroup =
groups[g];

selectedGroup.groupIndex =
g;

loadMembers();
updateStatistics();
loadLeaderboard();

}

// ======================
// DASHBOARD
// ======================

function updateDashboard(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let total = 0;

history.forEach(item=>{

total += item.total;

});

const totalEl =
document.getElementById(
"dashboardTotal"
);

if(totalEl){

totalEl.innerText =
rupiah(total);

}

}

// ======================
// STATISTIK
// ======================

function updateStatistics(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];
let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];
let paid = 0;

groups.forEach(group => {

    if(!Array.isArray(group.members)){
        return;
    }

    group.members.forEach(member => {

        if(member.status){
            paid++;
        }

    });

});


const totalGroups =
document.getElementById(
"totalGroups"
);

if(totalGroups){

totalGroups.innerText =
groups.length;

}

const totalTransactions =
document.getElementById(
"totalTransactions"
);

if(totalTransactions){

totalTransactions.innerText =
history.length;

}

const paidMembers =
document.getElementById(
"paidMembers"
);

if(paidMembers){

paidMembers.innerText =
paid;

}

const activeBills =
document.getElementById(
"activeBillsCount"
);

if(activeBills){

activeBills.innerText =
history.length;

}

}
// ======================
// FORM PESANAN
// ======================

function loadOrderForm(){

if(!selectedGroup){

alert("Pilih grup terlebih dahulu");
return;

}

let html = "";

selectedGroup.members.forEach((member,index)=>{

html += `

<div class="group-item">

<h4>${member.nama}</h4>

<input
type="text"
id="menu${index}"
placeholder="Nama Menu">

<input
type="number"
id="harga${index}"
placeholder="Harga Menu">

</div>

`;

});

document
.getElementById("orderForm")
.innerHTML =
html;

}

// ======================
// HITUNG SPLIT BILL
// ======================

function calculateBill(){

if(!selectedGroup){

alert("Pilih grup terlebih dahulu");
return;

}

const billName =
document
.getElementById("billName")
.value
.trim();

const tax =
parseFloat(
document
.getElementById("taxAmount")
.value
) || 0;

const service =
parseFloat(
document
.getElementById("serviceAmount")
.value
) || 0;

let totalPesanan = 0;

selectedGroup.members.forEach((member,index)=>{

const menu =
document
.getElementById(`menu${index}`)
?.value || "";

const harga =
parseFloat(
document
.getElementById(`harga${index}`)
?.value
) || 0;

member.pesanan = [

{
menu:menu,
harga:harga
}

];

member.totalPesanan =
harga;

totalPesanan += harga;

});

const total =
totalPesanan +
tax +
service;

selectedGroup.members.forEach(member=>{

const proporsi =
member.totalPesanan /
totalPesanan;

member.tagihan =
Math.round(
member.totalPesanan +
(tax * proporsi) +
(service * proporsi)
);

});

let result = `

<div class="result-card">

<h3>
${billName || "Tagihan"}
</h3>

<p>
Total Pesanan :
${rupiah(totalPesanan)}
</p>

<p>
Pajak :
${rupiah(tax)}
</p>

<p>
Service :
${rupiah(service)}
</p>

<h2>
Total :
${rupiah(total)}
</h2>

<hr>

`;

selectedGroup.members.forEach(member=>{

result += `

<p>

${member.nama}

=
<b>

${rupiah(member.tagihan)}

</b>

</p>

`;

});

result += `</div>`;

document
.getElementById("billResult")
.innerHTML =
result;

saveTransaction(
billName,
total
);

saveGroupData();

loadMembers();

}

// ======================
// SIMPAN GROUP
// ======================

function saveGroupData(){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

groups[
selectedGroup.groupIndex
] =
selectedGroup;

localStorage.setItem(
"groups",
JSON.stringify(groups)
);

}

// ======================
// UPLOAD BUKTI
// ======================

function uploadProof(index){

const input =
document.createElement("input");

input.type = "file";

input.accept =
"image/*";

input.onchange =
function(e){

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(){

selectedGroup
.members[index]
.bukti =
reader.result;

selectedGroup
.members[index]
.status =
true;

saveGroupData();

loadMembers();

updateStatistics();

loadLeaderboard();

alert(
"✅ Bukti berhasil diupload dan status otomatis lunas"
);

};

reader.readAsDataURL(file);

};

input.click();

}

// ======================
// REMINDER
// ======================

function remindAll(){

if(!selectedGroup){

alert("Pilih grup dulu");
return;

}

let belumBayar =
selectedGroup.members
.filter(
m => !m.status
);

if(belumBayar.length === 0){

alert(
"Semua anggota sudah bayar"
);

return;

}

let nama =
belumBayar
.map(m=>m.nama)
.join(", ");

alert(
"🔔 Reminder dikirim ke:\n\n" +
nama
);

}

// ======================
// SIMPAN TRANSAKSI
// ======================

function saveTransaction(
billName,
total
){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

history.unshift({

nama:
billName || "Tagihan",

tanggal:
new Date().toLocaleString(),

total:
total,

group:
selectedGroup
?
selectedGroup.name
:
"-"

});

localStorage.setItem(
"history",
JSON.stringify(history)
);

loadTransactions();
updateDashboard();
updateStatistics();

}

// ======================
// LOAD TRANSAKSI
// ======================

function loadTransactions(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let html = "";

if(history.length === 0){

html =
"Belum ada transaksi";

}else{

history.forEach(item=>{

html += `

<div class="group-item">

<h4>${item.nama}</h4>

<p>📅 ${item.tanggal}</p>

<p>👥 ${item.group}</p>

<p>💰 ${rupiah(item.total)}</p>

</div>

`;

});

}

const list =
document.getElementById(
"historyList"
);

if(list){

list.innerHTML =
html;

}

loadActiveBills();

}

// ======================
// ACTIVE BILLS
// ======================

function loadActiveBills(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let html = "";

if(history.length === 0){

html =
"Belum ada tagihan aktif";

}else{

history
.slice(0,5)
.forEach(item=>{

html += `

<div class="group-item">

<h4>${item.nama}</h4>

<p>${rupiah(item.total)}</p>

</div>

`;

});

}

const target =
document.getElementById(
"activeBillsList"
);

if(target){

target.innerHTML =
html;

}

}

// ======================
// EXPORT LAPORAN FULL
// ======================

function exportData(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let laporan = "";

laporan +=
"===== LAPORAN SPLITZ =====\n\n";

laporan +=
"RIWAYAT TRANSAKSI\n\n";

history.forEach(item=>{

laporan +=
"Nama : " +
item.nama +
"\n";

laporan +=
"Tanggal : " +
item.tanggal +
"\n";

laporan +=
"Grup : " +
item.group +
"\n";

laporan +=
"Total : " +
rupiah(item.total) +
"\n";

laporan +=
"--------------------\n";

});

laporan +=
"\n\nDATA GROUP\n\n";

groups.forEach(group=>{

laporan +=
"\nGRUP : " +
group.name +
"\n";

group.members.forEach(member=>{

laporan +=
"- " +
member.nama +
"\n";

if(member.tagihan){

laporan +=
"  Tagihan : " +
rupiah(member.tagihan)
+
"\n";

}

laporan +=
"  Status : "
+
(
member.status
?
"Lunas"
:
"Belum Bayar"
)
+
"\n";

});

});

const blob =
new Blob(
[laporan],
{
type:"text/plain"
}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"Laporan_Splitz.txt";

a.click();

}

// ======================
// LEADERBOARD
// ======================

function loadLeaderboard(){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let score = {};

groups.forEach(group => {

    if(!Array.isArray(group.members)){
        return;
    }

    group.members.forEach(member => {

        if(!score[member.nama]){
            score[member.nama] = 0;
        }

        if(member.status){
            score[member.nama] += 10;
        }

    });

});

const ranking =
Object.entries(score)
.sort(
(a,b)=>
b[1]-a[1]
);

let html = "";

if(ranking.length === 0){

html =
"Belum ada data";

}else{

ranking.forEach(
(item,index)=>{

html += `

<div class="leader-item">

<span>

${index+1}.
${item[0]}

</span>

<span>

⭐ ${item[1]}

</span>

</div>

`;

});

}

const board =
document.getElementById(
"leaderboardList"
);

if(board){

board.innerHTML =
html;

}

}

// ======================
// PROFIL
// ======================

function saveProfile(){

const bio =
document
.getElementById("profileBio")
.value;

localStorage.setItem(
"profileBio",
bio
);

const file =
document
.getElementById("profilePhoto")
.files[0];

if(file){

const reader =
new FileReader();

reader.onload =
function(){

localStorage.setItem(
"profilePhoto",
reader.result
);

showProfilePhoto();

};

reader.readAsDataURL(file);

}

alert(
"Profil berhasil disimpan"
);

}

function showProfilePhoto(){

const img =
localStorage.getItem(
"profilePhoto"
);

const preview =
document.getElementById(
"profilePreview"
);

if(
img &&
preview
){

preview.src =
img;

preview.style.display =
"block";

}

}

function loadProfile(){

const bio =
localStorage.getItem(
"profileBio"
);

if(bio){

document
.getElementById("profileBio")
.value =
bio;

}

showProfilePhoto();

}

// ======================
// LOGOUT
// ======================

function logout(){

localStorage.removeItem(
"currentUser"
);

location.reload();

}

// ======================
// AUTO LOGIN
// ======================

window.onload = ()=>{

loadProfile();

const currentUser =
JSON.parse(
localStorage.getItem(
"currentUser"
)
);

if(currentUser){

document
.getElementById("loginPage")
.classList.remove("active");

document
.getElementById("appPage")
.classList.add("active");

loadUser();
loadGroups();
loadTransactions();
updateDashboard();
updateStatistics();
loadLeaderboard();

}

};
