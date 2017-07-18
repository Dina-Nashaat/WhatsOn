# WhatsOn
A web application that retrieves rss feeds and clusters them into cards, each with similar topics. 

The app uses http://swoogle.umbc.edu/SimService/api.html API to obtain semantic similarity between two phrases, which is used to cluster relevant topics with semantic similarity score higher than 0.34 (determined upon experimentation)
