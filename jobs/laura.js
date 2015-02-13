console.log('parsing for Laura')

openHealthJob.innerHTML='<h3 style="color:green"> <i style="color:navy">Parsing for Laura</h3>Laura, this is a simple tool to parse your text documents with blocks of lines into rows of columns. This is a rough little draft I wrote to help Ivan learn how he can port in spreadsheet code into an autonomous web app. When using it please check the length in the last column to see if some cells may have been parsed out of the range found in the first block of lines. When you find a discrepancy just go to the text you have in the text area and edit it - the table is automatically updated as you edit. Enough disclaiming, just throw some text into textarea below and you can collect the Excell spreadsheet by clicking the button at the very bottom of the table.</i>'
openHealthJob.innerHTML+='<textarea id="txtInput"></textarea><div id="parsedTable"></div>'
txtInput.style.color="blue"
txtInput.style.width="100%"
txtInput.style.height="400px"
txtInput.onkeyup=function(evt){
  //if(evt.keyCode==13){
  if(true){
    var txt = txtInput.value;
    var y=txt.split(/\n{2,}/).map(function(t){
      return t.split(/\n/)
    })
    parsedTable.innerHTML=""
    parsedTable.appendChild(openHealth.crossdoc2html(y))
  }
}
