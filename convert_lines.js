module.exports = function convert_line(line){
  var l = line.split('\t')
  return {
    idx: l[0],
    play: l[1],
    sec1: l[2],
    sec2: l[3],
    who: l[4],
    text: l[5]
  }
}
