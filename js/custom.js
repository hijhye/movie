//movie
let APIKey = "10f974a2eddec8dc4c2a71f15af77591";

let listType = document.querySelector("#listType");

let currentPage = 1;
let currentList = "now_playing";
let currentKeyword = "";
let totalPage = "";
let currentMovies = [];
let currentModalRank = 0;
const titleMap = {
  now_playing: "현재 상영 중",
  popular: "인기",
  top_rated: "평점 좋은",
  upcoming: "곧 개봉하는",
};
async function movie(lists, page = 1) {
  currentPage = page;
  currentList = lists;
  currentKeyword = "";
  listType.innerText = `${titleMap[lists]} 영화 목록` || "영화 목록";
  let url = `https://api.themoviedb.org/3/movie/${lists}?api_key=${APIKey}&language=ko-KR&page=${currentPage}`;

  let response = await fetch(url);
  let data = await response.json();
  let movieList = data.results;
  totalPage = data.total_pages;
  console.log(movieList);
  console.log(totalPage);

  render(movieList);
}
let wrap = document.querySelector(".wrap");
let list = document.querySelector(".list");
let movieBoard = document.querySelector("#movieBoard");
let bottomBtn = document.querySelector("#bottomBtn");

function render(movieList) {
  let result = "";
  currentMovies = movieList;

  movieList.forEach((movie, rank) => {
    // console.log(i + 1);
    // console.log(movie.backdrop_path);
    // console.log(movie.title);
    // console.log(movie.release_date);
    globalRank = (currentPage - 1) * 20 + (rank + 1);
    let imgSrc = movie.backdrop_path
      ? `https://media.themoviedb.org/t/p/w355_and_h200_multi_faces${movie.backdrop_path}`
      : "https://placehold.co/355x200/555/FFF?text=No..";
    result += `
          <li class="movie" onclick="detailView(${rank})">
            <div class="imgWrap">
              <div class="num">${globalRank}</div>
              <img src="${imgSrc}" alt="${movie.title}">
            </div>
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
          </li>
    `;
  });

  wrap.style.marginTop = "-100vh";
  list.style.display = "flex";
  bottomBtn.style.display = "flex";
  movieBoard.innerHTML = result;
}

let homeBtn = document.querySelector("#home");
homeBtn.addEventListener("click", function () {
  totalPage = 1;
  wrap.style.marginTop = "0vh";
});

let searchInput = document.querySelector(".searchWrap #user");
let searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
  currentList = "";
  currentPage = 1;
  keyword = searchInput.value.trim();
  currentKeyword = keyword;
  //   console.log(keyword);
  listType.innerText = `${currentKeyword} 관련 영화목록`;

  if (currentKeyword == "") {
    alert("검색어를 입력하세요~");
    return;
  }

  searchInput.value = "";
  //api 호출
  search(currentKeyword, currentPage);
});

async function search(currentKeyword, currentPage) {
  let url = `https://api.themoviedb.org/3/search/movie?query=${currentKeyword}&api_key=${APIKey}&language=ko-KR&page=${currentPage}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);
  let movieList = data.results;
  totalPage = data.total_pages;
  //   console.log(movieList);.
  render(movieList);
}
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBtn.click(); // "검색 버튼을 대신 눌러줘!"
  }
});
//더보기
let more = document.querySelector("#nextBtn");
let pageNum = document.querySelector("#pageNum");
pageNum.innerText = currentPage;
more.addEventListener("click", moreview);
function moreview() {
  if (currentPage == totalPage) {
    alert("더이상 영화 없음");
    return;
  } else {
    currentPage++;
    pageNum.innerText = currentPage;
  }
  console.log(currentList, currentPage, currentKeyword);
  if (currentKeyword == "") {
    movie(currentList, currentPage);
  } else if (currentList == "") {
    search(currentKeyword, currentPage);
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

let prev = document.querySelector("#prevBtn");

prev.addEventListener("click", preview);
function preview() {
  if (currentPage == 1) {
    alert("더이상 앞으로 갈 수 없음");
    return;
  } else {
    currentPage--;
    pageNum.innerText = currentPage;
  }

  console.log(currentList, currentPage, currentKeyword);
  if (currentKeyword == "") {
    movie(currentList, currentPage);
  } else if (currentList == "") {
    search(currentKeyword, currentPage);
  }
  movieBoard.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
let detail = document.querySelector("#detail");
let listBtn = document.querySelector("#list");
listBtn.addEventListener("click", function () {
  detail.classList.remove("on");
});

let detailTitle = document.querySelector("#detailTitle");
let detailPoster = document.querySelector("#detailPoster");
let detailPoint = document.querySelector("#detailPoint");
let detailOverview = document.querySelector("#detailOverview");

function detailView(rank) {
  currentModalRank = rank;
  detail.classList.add("on");
  let movie = currentMovies[rank];

  detailTitle.innerText = movie.title;
  detailPoint.innerText = movie.vote_average.toFixed(1);
  detailOverview.innerText = movie.overview
    ? movie.overview
    : "상세 줄거리 정보가 없습니다.";

  if (movie.poster_path) {
    detailPoster.src = `https://media.themoviedb.org/t/p/original${movie.poster_path}`;
  } else {
    detailPoster.src = "https://placehold.co/500x750/000/FFF?text=No+Poster";
  }
}

function nextMovie() {
  currentModalRank++;

  if (currentModalRank >= currentMovies.length) {
    currentModalRank = 0;
  }

  detailView(currentModalRank);
}

function prevMovie() {
  currentModalRank--;

  if (currentModalRank < 0) {
    currentModalRank = currentMovies.length - 1;
  }

  detailView(currentModalRank);
}
