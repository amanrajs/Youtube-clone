const key='AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y';
function search(url) {
  document.querySelector('#homepage').style.display = 'none';
    document.querySelector("#root").innerHTML = '';
    const app = document.getElementById('root');
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    app.appendChild(container);
    var request = new XMLHttpRequest();
    document.getElementById('query').data = document.getElementById('query').value;
    let query = document.getElementById('query').data;

    if(!url){
      currentpage=1;
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video`;
    }

    request.open('GET', url, true);
    request.onload = function () {   // Begin accessing JSON data here
      var data=JSON.parse(this.response);
      console.log(data);
      document.getElementById('query').prevtoken=data.prevPageToken;
      document.getElementById('query').nexttoken=data.nextPageToken;
      for(let page of data.items)
      {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        const title = document.createElement('h4')
        page.snippet.title=page.snippet.title.substring(0,45);
        title.textContent = `${page.snippet.title}...`
        title.style.margin='10px 5px 15px 20px';
        const description = document.createElement('p')
        page.snippet.description = page.snippet.description.substring(0, 50) // Limit to 300 chars
        description.textContent = `${page.snippet.description}...`
        description.style.margin='10px 5px 15px 20px';
        const image = document.createElement('img');
        image.src=`${page.snippet.thumbnails.high.url}`;
        card.addEventListener("click", function(){
              window.open(`https://www.youtube.com/watch?v=${page.id.videoId}`,"_blank");
        });
        container.appendChild(card);// Each card will contain an h1 and a p and thumbmnail
        card.appendChild(title)
        card.appendChild(image)
        card.appendChild(description)
      }

      const pagination= document.createElement('div')//pagin.setAttribute('class', 'container')
      app.appendChild(pagination);
      const prevbtn = document.createElement("button");
      prevbtn.innerHTML = "PREVIOUS";
      prevbtn.setAttribute('id','prev')
      prevbtn.setAttribute('class','prevbtn');
      pagination.appendChild(prevbtn);
      prevbtn.addEventListener("click", function(){
        currentpage--;
          var newurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${data.prevPageToken}`
          search(newurl);
      });
      if(!data.prevPageToken){
        document.getElementById("prev").disabled = true;
      }
      const btn = document.createElement("button");
      btn.innerHTML = "NEXT";
      btn.setAttribute('id','next');  // Insert text
      btn.setAttribute('class','nextbtn');

      pagination.appendChild(btn);
      btn.addEventListener("click", function(){
        currentpage++;
          var newurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${data.nextPageToken}`
          search(newurl);
      });


      const paginateButtons = document.createElement('div');
      paginateButtons.setAttribute('class', 'paginatebuttons');
      //paginateButtons.setAttribute('class', 'paginate');
      app.appendChild(paginateButtons);
      for(var i=1;i<=10;i++){
        var value=i;
        if(currentpage>6){
          value=currentpage-5+i;
        }
        const button = document.createElement('button');
        button.innerHTML = value.toString();
        button.setAttribute('id',value);
        button.setAttribute('class','btn');
        button.addEventListener("click", clicked(this));
        paginateButtons.appendChild(button);
      }
      var butt=document.getElementById(currentpage);
      butt.setAttribute('class','active');
    }
    request.send();
}
var currentpage=1;
function clicked(){
  return clickevent => {
    console.log(clickevent.srcElement.id);
    getquery(clickevent.srcElement.id);
  }
}
function getquery(newpage){
if(currentpage==newpage){
return ;
}
else if(currentpage<newpage){
  var req = new XMLHttpRequest();
  var pagesecond=Number(newpage)-1;
  var nexttoken=document.getElementById('query').nexttoken;
  var query=document.getElementById('query').data;

  for(var page=currentpage;page<pagesecond;page++){
  var pageurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${nexttoken}`;
  req.open('GET', pageurl, false)
  req.onload = function () {
    var data=JSON.parse(this.response);
    nexttoken=data.nextPageToken;
  }
  req.send();
}
currentpage=newpage;
pageurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${nexttoken}`
search(pageurl);
}
else{
  var req = new XMLHttpRequest();
  var pagesecond=Number(newpage)+1;
  var prevtoken=document.getElementById('query').prevtoken;
  var query=document.getElementById('query').data;

  for(var i=currentpage;i>pagesecond;i--){
  var pageurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${prevtoken}`;
  req.open('GET', pageurl, false)
  req.onload = function () {
    var data=JSON.parse(this.response);
    prevtoken=data.prevPageToken;
  }
  req.send();
}
currentpage=newpage;
pageurl=`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${key}&maxResults=10&type=video&pageToken=${prevtoken}`
search(pageurl);
}
}
