// ===================================================== Reference ===========================================
const isi_detail = document.getElementById('isi_detail');
let edit_data;
let tambahData;

// ===================================================== fetch ===============================================
function getSlug(){
    const queryUrl = window.location.search;
    const urlParams = new URLSearchParams(queryUrl);
    const getSlug = urlParams.get('slug')
    return getSlug;
}

fetch(`https://634be8e9317dc96a308d3518.mockapi.io/ayf/artikel?slug=${getSlug()}`)
    .then(subjek => subjek.json())
    .then(datas => {
        checkUserInWebStorage()
        let detail = datas[0];

        let apakahDiaLike = detail.like_artikel.filter((e) => e.username_user == pengguna_saat_ini.username_user);

        let isi = `<p class="fw-bold text-center text-24px">${detail.judul_artikel}</p>
        <p class="text-12px">${detail.created_at}</p>
        <div class="detail_artikel_nama_icon">
            <p class="text-16px">${detail.nama_penulis}</p>
            <div class="d-flex gap-3">
                <button class="btn" onClick="edit_data('${detail.id_artikel}')" id="untukLike"><i class="fa-solid fa-thumbs-up"></i> <span id="jumlah_likenya">${detail.like_artikel.length}</span></button>
                <button class="btn"><i class="fa-solid fa-share"></i></button>
            </div>
        </div>
        <img src="${detail.gambar_artikel}" class="img-me" alt="">
        <p class="mt-3 px-2" id="isi_isi">
        </p>
        <p class="btn bg-prima text-white" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            Komentar (${detail.komentar.length})
        </p>
        <div class="collapse mt-3" id="collapseExample">
            <div class="card card-body">
                <div class="d-flex flex-column">
                    ${detail.komentar.map((e) =>{
                        return(`
                        <div class="d-flex flex-column">
                        <div class="d-flex gap-2">
                            <p class="fw-bold">${e.username_user}</p>
                            <p class="text-12px"><i>21 Desember 2022</i></p>
                        </div>
                        <p>"${e.isiKomen}"</p>
                    </div>
                    `)
                    })}
                </div>
                <div class="mt-3">
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a comment here" id="fillKomen"></textarea>
                        <label for="fillKomen">Tulis komentar ...</label>
                    </div>
                    <button class="btn bg-prima mt-3 text-white text-end" id="tmb_komen" onClick="tambahData('${detail.id_artikel}')">Kirim</button>
                </div>
            </div>
        </div>`;

        isi_detail.innerHTML=isi
        let isi_isi = document.getElementById('isi_isi');
        isi_isi.innerText = detail.isi

        if(apakahDiaLike.length > 0){
            document.getElementById('untukLike').style.color="yellow"
        } else{
            document.getElementById('untukLike').style.color = "black"
        }
    })


    edit_data = (id) => {
        fetch(`https://634be8e9317dc96a308d3518.mockapi.io/ayf/artikel?id_artikel=${id}`)
            .then(subjek => subjek.json())
            .then(dataArtikel => {
                const checkLikeUser = dataArtikel[0].like_artikel.filter((e) => e.username_user == pengguna_saat_ini.username_user);
                const getDataLikeArtikel = dataArtikel[0].like_artikel.map(e => {
                    return e;
                })
                let encoded = encodeURI(`https://634be8e9317dc96a308d3518.mockapi.io/ayf/artikel/${id}`);
                if(checkLikeUser.length > 0){
                    let sisihkanDataUserYangSudahLike = getDataLikeArtikel.filter(e => e.username_user != pengguna_saat_ini.username_user)
                    let data = {
                        like_artikel:sisihkanDataUserYangSudahLike
                    }
                    fetch(encoded,{
                        method: 'put',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body:JSON.stringify(data)
                    }).then(respon => respon.json())
                    .then(json => {
                        document.getElementById('jumlah_likenya').innerText = json.like_artikel.length;
                        document.getElementById('untukLike').style.color = "black"
                    })
                } else{

                    const dataLikeTerbaru = [...getDataLikeArtikel, { username_user:pengguna_saat_ini.username_user}]

                    let data = {
                        like_artikel:dataLikeTerbaru
                    }

                    fetch(encoded,{
                        method: 'put',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body:JSON.stringify(data)
                    }).then(respon => respon.json())
                    .then(json => {
                        document.getElementById('jumlah_likenya').innerText = json.like_artikel.length
                        document.getElementById('untukLike').style.color="yellow"
                    })
                }
            })
    }

    tambahData = (id) => {
        fetch(`https://634be8e9317dc96a308d3518.mockapi.io/ayf/artikel?id_artikel=${id}`)
            .then(subjek => subjek.json())
            .then(data => {
                const getDataKomentar = data[0].komentar.map(e => {
                    return e;
                })

                let dataKomenBaru = {
                    id_komentar:data[0].komentar.length+1,
                    username_user:pengguna_saat_ini.username_user,
                    isiKomen:document.getElementById('fillKomen').value
                }

                let dataMasuk = [...getDataKomentar,dataKomenBaru];

                let encoded = encodeURI(`https://634be8e9317dc96a308d3518.mockapi.io/ayf/artikel/${id}`);
                fetch(encoded,{
                    method:"put",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify({
                        komentar:dataMasuk
                    })
                })
            })
    }

