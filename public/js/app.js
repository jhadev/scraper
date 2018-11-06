function displayResults(articles) {
  $("tbody").empty();

  articles.forEach(function(article) {
    let tr = $("<tr>").append(
      $("<td>").text(article.title),
      $("<td>").text(article.link),
    );

    $("tbody").append(tr);
  });
}

$("#scrape").on("click", function() {
  $.getJSON("/api/all", function(data) {
    displayResults(data);
    console.log("hello")
  });
});

