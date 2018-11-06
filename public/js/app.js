const displayResults = (articles) => {
  $("tbody").empty();

  articles.forEach((article) => {
    let tr = $("<tr>").append(
      $("<td>").text(article.title),
      $("<td>").html(article.link)
    );

    $("tbody").append(tr);
  });
}

$("#scrape").on("click",() => {
  $.getJSON("/api/all",(data) => {
    displayResults(data);
    console.log("hello")
  });
});

