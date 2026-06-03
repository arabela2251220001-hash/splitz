// =====================
// SPLASH
// =====================

setTimeout(() => {

const loginPage =
document.getElementById("loginPage");

if(loginPage){
loginPage.classList.add("active");
}

},2500);

// =====================
// GLOBAL
// =====================

let selectedGroup = null;

// =====================
// AUTH
// =====================

function showRegister(){

document.getElementById("loginPage")
.classList.remove("active");

document.getElementById("registerPage")
.classList.add("active");

}

function showLogin(){

document.getElementById("registerPage")
.classList.remove("active");

document.getElementById("loginPage")
.classList.add("active");

}

function register(){

const name =
document.getElementById("regName").value.trim();

const email =
document.getElementById("regEmail").value.trim();

const password =
document.getElementById("regPassword").value.trim();

if(!name || !email || !password){

alert("Lengkapi semua data");
return;

}

const user = {

name:name,
email:email,
password:password,
points:0

};

localStorage.setItem(
"user",
JSON.stringify(user)
);

alert("Pendaftaran berhasil");

showLogin();

}

function login(){

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user){

alert("Silakan daftar terlebih dahulu");
return;

}

const email =
document.getElementById("loginEmail").value.trim();

const password =
document.getElementById("loginPassword").value.trim();

if(
email === user.email &&
password === user.password
){

document.getElementById("loginPage")
.classList.remove("active");

document.getElementById("appPage")
.classList.add("active");

loadUser();
loadGroups();
loadTransactions();
updateStatistics();
updateDashboard();
loadLeaderboard();

}else{

alert("Email atau password salah");

}

}

// =====================
// USER
// =====================

function loadUser(){

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user) return;

document.getElementById("welcomeText")
.innerHTML =
`Hai ${user.name} 👋`;

document.getElementById("profileName")
.innerText =
user.name;

document.getElementById("profileEmail")
.innerText =
user.email;

document.getElementById("userPoints")
.innerText =
user.points || 0;

}

// =====================
// NAVIGATION
// =====================

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

// =====================
// FORMAT RUPIAH
// =====================

function rupiah(angka){

return new Intl.NumberFormat(
'id-ID',
{
style:'currency',
currency:'IDR',
minimumFractionDigits:0
}
).format(angka);

}
// =====================
// GROUP
// =====================

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
document.getElementById("groupName")
.value.trim();

const memberInputs =
document.querySelectorAll(".memberInput");

let members = [];

memberInputs.forEach(input=>{

const nama =
input.value.trim();

if(nama){

members.push({

nama:nama,
status:false

});

}

});

if(!groupName){

alert("Masukkan nama grup");
return;

}

if(members.length === 0){

alert("Masukkan minimal 1 anggota");
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

document.getElementById("groupName")
.value = "";

document.getElementById("memberContainer")
.innerHTML = `

<input
class="memberInput"
placeholder="Nama Anggota">

`;

alert("Grup berhasil dibuat");

loadGroups();
updateStatistics();

}

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

<button onclick="selectGroup(${index})">
Gunakan Grup
</button>

</div>

`;

});

}

document.getElementById("groupList")
.innerHTML = html;

document.getElementById("groupPreview")
.innerHTML = html;

}

function selectGroup(index){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

selectedGroup =
groups[index];

selectedGroup.groupIndex =
index;

loadMembers();

alert(
"Grup aktif: " +
selectedGroup.name
);

}

// =====================
// STATUS PEMBAYARAN
// =====================

function loadMembers(){

if(!selectedGroup){

document.getElementById("memberList")
.innerHTML =
"Belum pilih grup";

return;

}

let total =
selectedGroup.members.length;

let paid =
selectedGroup.members.filter(
member => member.status === true
).length;

let percent =
total > 0
?
Math.round((paid / total) * 100)
:
0;

let html = `

<div class="group-item">

<h4>Progress Pembayaran</h4>

<p>
${paid}/${total} anggota sudah bayar
</p>

<div style="
height:10px;
background:#333;
border-radius:20px;
overflow:hidden;
margin-top:10px;
">

<div style="
height:100%;
width:${percent}%;
background:#37d67a;
transition:.3s;
">

</div>

</div>

<p style="margin-top:10px">
${percent}%
</p>

</div>

`;

selectedGroup.members.forEach((member,index)=>{

html += `

<div class="member-item">

<div>
<b>${member.nama}</b>
</div>

<div>

<div class="${
member.status
?
'status-paid'
:
'status-unpaid'
}">

${
member.status
?
'🟢 Lunas'
:
'🟡 Belum'
}

</div>

<button
onclick="togglePayment(${index})">

${
member.status
?
'↩ Batal'
:
'✔ Sudah Bayar'
}

</button>

</div>

</div>

`;

});

document.getElementById("memberList")
.innerHTML = html;

}
// =====================
// TOGGLE PEMBAYARAN
// =====================

function togglePayment(index){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

if(
selectedGroup === null ||
selectedGroup.groupIndex === undefined
){
return;
}

let gIndex =
selectedGroup.groupIndex;

groups[gIndex]
.members[index]
.status =
!groups[gIndex]
.members[index]
.status;

localStorage.setItem(
"groups",
JSON.stringify(groups)
);

selectedGroup =
groups[gIndex];

selectedGroup.groupIndex =
gIndex;

loadMembers();
updateStatistics();
loadLeaderboard();

}

// =====================
// REMINDER
// =====================

function remindAll(){

alert(
"🔔 Reminder berhasil dikirim!"
);

}

// =====================
// STATISTIK DASHBOARD
// =====================

function updateStatistics(){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let totalPaid = 0;

groups.forEach(group=>{

group.members.forEach(member=>{

if(member.status){
totalPaid++;
}

});

});

const totalGroupsEl =
document.getElementById("totalGroups");

const totalTransactionsEl =
document.getElementById("totalTransactions");

const paidMembersEl =
document.getElementById("paidMembers");

const activeBillsEl =
document.getElementById("activeBillsCount");

if(totalGroupsEl)
totalGroupsEl.innerText =
groups.length;

if(totalTransactionsEl)
totalTransactionsEl.innerText =
history.length;

if(paidMembersEl)
paidMembersEl.innerText =
totalPaid;

if(activeBillsEl)
activeBillsEl.innerText =
history.length;

}

// =====================
// LEADERBOARD
// =====================

function loadLeaderboard(){

let groups =
JSON.parse(
localStorage.getItem("groups")
) || [];

let scores = {};

groups.forEach(group=>{

group.members.forEach(member=>{

if(!scores[member.nama]){
scores[member.nama] = 0;
}

if(member.status){
scores[member.nama] += 10;
}

});

});

let ranking =
Object.entries(scores)
.sort((a,b)=>b[1]-a[1]);

let html = "";

if(ranking.length === 0){

html = "Belum ada data";

}else{

ranking.forEach((item,index)=>{

html += `

<div class="leader-item">

<span>
${index + 1}. ${item[0]}
</span>

<span>
⭐ ${item[1]}
</span>

</div>

`;

});

}

const leaderboard =
document.getElementById(
"leaderboardList"
);

if(leaderboard){
leaderboard.innerHTML = html;
}

}
// =====================
// SPLIT BILL
// =====================

function calculateBill(){

if(!selectedGroup){

alert(
"Pilih grup terlebih dahulu"
);

return;

}

const billName =
document.getElementById("billName")
.value.trim();

const bill =
parseFloat(
document.getElementById("billAmount").value
) || 0;

const tax =
parseFloat(
document.getElementById("taxAmount").value
) || 0;

const service =
parseFloat(
document.getElementById("serviceAmount").value
) || 0;

if(bill <= 0){

alert(
"Masukkan total tagihan"
);

return;

}

const total =
bill + tax + service;

const people =
selectedGroup.members.length;

const perPerson =
total / people;

document.getElementById("billResult")
.innerHTML = `

<div class="result-card">

<h3>
${billName || "Tagihan"}
</h3>

<br>

<p>
Tagihan: ${rupiah(bill)}
</p>

<p>
Pajak: ${rupiah(tax)}
</p>

<p>
Biaya Layanan: ${rupiah(service)}
</p>

<br>

<h2>
Total: ${rupiah(total)}
</h2>

<br>

<h1>
${rupiah(perPerson)}
</h1>

<p>
per orang
</p>

</div>

`;

saveTransaction(
billName,
total,
perPerson
);

givePoints(10);

}

// =====================
// TRANSAKSI
// =====================

function saveTransaction(
billName,
total,
perPerson
){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

history.unshift({

billName:
billName || "Tagihan",

date:
new Date().toLocaleString(),

total:
total,

perPerson:
perPerson

});

localStorage.setItem(
"history",
JSON.stringify(history)
);

loadTransactions();
updateDashboard();
updateStatistics();

}

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

<h4>
${item.billName}
</h4>

<p>
📅 ${item.date}
</p>

<p>
💰 ${rupiah(item.total)}
</p>

<p>
👤 ${rupiah(item.perPerson)}
 / orang
</p>

</div>

`;

});

}

document.getElementById("historyList")
.innerHTML = html;

loadActiveBills();

}

// =====================
// ACTIVE BILLS
// =====================

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

history.slice(0,5).forEach(item=>{

html += `

<div class="group-item">

<h4>
${item.billName}
</h4>

<p>
${rupiah(item.total)}
</p>

</div>

`;

});

}

const activeBills =
document.getElementById(
"activeBillsList"
);

if(activeBills){
activeBills.innerHTML = html;
}

}

// =====================
// POINTS
// =====================

function givePoints(value){

let user =
JSON.parse(
localStorage.getItem("user")
);

if(!user) return;

user.points =
(user.points || 0)
+ value;

localStorage.setItem(
"user",
JSON.stringify(user)
);

document.getElementById("userPoints")
.innerText =
user.points;

}

// =====================
// DASHBOARD
// =====================

function updateDashboard(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let total = 0;

history.forEach(item=>{

total += item.total;

});

document.getElementById(
"dashboardTotal"
).innerText =
rupiah(total);

}

// =====================
// EXPORT LAPORAN
// =====================

function exportData(){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

let text =
"===== LAPORAN SPLITZ =====\n\n";

history.forEach(item=>{

text +=
item.billName +
" | " +
rupiah(item.total) +
"\n";

});

let blob =
new Blob(
[text],
{type:"text/plain"}
);

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"laporan_splitz.txt";

a.click();

}

// =====================
// LOGOUT
// =====================

function logout(){

if(
confirm("Logout?")
){

location.reload();

}

}

// =====================
// AUTO LOGIN
// =====================

window.onload = ()=>{

const user =
JSON.parse(
localStorage.getItem("user")
);

if(user){

document.getElementById("loginPage")
.classList.remove("active");

document.getElementById("appPage")
.classList.add("active");

loadUser();
loadGroups();
loadTransactions();
updateStatistics();
updateDashboard();
loadLeaderboard();

}

};