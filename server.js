var express = require('express');
const async = require('async');
const request = require('request');
var feed = require('feed-read');  // require the feed-read module


var app = express();
app.use(express.static(__dirname + "/public"));
server = app.listen(3000);


function https_post(phrases, callback) {
    
    sentence1 = phrases.sentence1.title;
    sentence2 = phrases.sentence2.title;

    var options = {
        url: 'http://swoogle.umbc.edu/StsService/GetStsSim',
        method: 'GET',
        qs: {
            'operation': 'api',
            'phrase1': sentence1,
            'phrase2': sentence2,
        }
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            result = {
                sentence1: phrases.sentence1,
                sentence2: phrases.sentence2, 
                similarity: body
            }
            callback(null, result);
}});}


function compareArticles(list, callback) {
    list_len = list.length;
    
    var calls = [];
    for (j = 0; j <= list.length; j++) {
        for (i = 1; i < list.length; i++) {
            phrases = {
                sentence1 : list[0],
                sentence2 : list[i], 
                inner : i, 
                list_len: list.length,
            }
            calls.push(phrases);
        }
        list.splice(0,1);
    }
    async.map(calls, https_post, function(err, results){
        clusterNews(results, list_len, function(result){
            callback(result);
        });
        //server.close();
    });

}

function clusterNews(news_objects, list_len, callback)
{
    clusters = [];
    console.log(list_len);

    for(i = 0; i<= list_len; i++)
    {
        clusters[i] = [];
        clusters[i].push(news_objects[0].sentence1);
        for(j = 0; j< list_len - 1; j++)
        {
            if(news_objects[0].similarity > 0.35){
                clusters[i].push(news_objects[0].sentence2) 
                news_objects.splice(0,1);
            }else
                news_objects.splice(0,1);               
        }
        
        list_len = list_len - 1;
    }
    callback(clusters);
    /*
    for(i=0;i<clusters.length;i++)
    {
        console.log(clusters[i]);
    }
    */
}

app.get('/feedTitles', function (req, res) {

    urls = [
        "http://feeds.bbci.co.uk/news/world/rss.xml?edition=uk",
        "http://rss.cnn.com/rss/edition.rss",
        "http://feeds.reuters.com/reuters/topNews",
        //"http://www.foxnews.com/about/rss/"
    ];

    sources = [
        {
            name: "BBC",
            url: urls[0]
        },
        {
            name: "CNN",
            url: urls[1]
        },
        {
            name: "Reuters",
            url: urls[2]
        }];

    var articles = []; // Articles per URL
    var addresses = [];
    var completed = 0;
    var counter = 0;
    var sourceCount = 0;
    for (var j = 0; j < urls.length; j++) {

        console.log("completed: " + completed);

        feed(sources[j].url, function (err, url_articles) {
            
            for (var i = 0; i < url_articles.length; i++) {
           //     console.log(sourceCount);
                articles.push({
                    title: url_articles[i].title,
                    author: url_articles[i].author,
                    link: url_articles[i].link,
                    content: url_articles[i].content,
                    published: url_articles[i].published,
                    feed: url_articles[i].feed,
                    image: "/img/bbc.jpg",
                    source: sources[sourceCount].name,
                    id: counter
                });
                counter ++;
            }
            sourceCount ++;
            addresses.push(articles);
            articles = [];

            completed++;
            if (completed == j) {
                completed = 0;

                var List = [];
                List = addresses[0].splice(0,10);
                List2 = addresses[1].splice(0,10);
                
                List.push.apply(List, List2);
                
                
                compareArticles(List, function(result){
                    res.json(result);
                    res.end();
                });
                
                addresses = [];
                console.log('Completed');
            }
        });
    }
});