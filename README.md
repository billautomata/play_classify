# who is out of place in shakespeare?

* build a classifier for each play
* for each character in each play
  * test against every classifier
  * aggregate the classification score for each line
  * normalize the scores for each character by dividing by line count
  * rank the affinity for each play

```javascript
{
  character_name: "Ophelia",
  appears_in: "Hamlet",
  scores: [
    { name: 'Cymbeline', true: 0.1, false: 0.3 },
    { name: 'Hamlet', true: 0.9, false: 0.01 },
  ]
}
```


* force directed graph with manual links ( https://gist.github.com/billautomata/0788baa94835dcb4e930e3d3910a1f5c )
