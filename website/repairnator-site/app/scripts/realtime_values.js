/*Vue.component('inspector-line', {
  props: ['inspector'],
  template: '<tr><td>{{inspector.buildId}}</td></tr>'
})


var appInspectors = new Vue({
  el: '#app-inspectors',
  data: {
    inspectors: [
      { buildId: 0, text: 'Vegetables' },
      { buildId: 1, text: 'Cheese' },
      { buildId: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})*/

let lastBuild;

const updateInspectors = function(){
  apiGet('/inspectors/', function (datas) {
    var htmlElement = $('#tablerealtime');
    htmlElement.html('')

    var fieldNames = [
      {id:'buildFinishedDate', readable: 'Original date'},
      {id: 'buildReproductionDate', readable: 'Date of the reproduction'},
      {id: 'buildId', readable: 'Build ID'},
      {id: 'repositoryName', readable: 'Github Repository'},
      {id: 'status', readable: 'Status'},
      {id: 'prNumber', readable: 'Pull Request ID'},
      {id: 'travisURL', readable: 'URL of Travis build'},
      {id: 'typeOfFailures', readable: 'Type of failures'},
      {id: 'branchURL', readable: 'URL of the branch'}
    ];

    var headersDisplayed = false;
    // appInspectors.inspectors = datas;
    if (lastBuild){
      if (datas[0].buildId != lastBuild){
        lastBuild = datas[0].buildId;
        notify(`New build found ${datas[0].status}`)
      }
    } else {
      lastBuild = datas[0].buildId;
    }
    datas.forEach(function (data) {
      var row = $('<tr></tr>');
      htmlElement.append(row);

      if (!headersDisplayed) {
        fieldNames.forEach(function (fieldName) {
          var th = $('<th></th>');
          th.text(fieldName.readable);

          row.append(th);
        });

        row = $('<tr></tr>');
        htmlElement.append(row);
        headersDisplayed = true;
      }

      fieldNames.forEach(function (column) {
        var fieldName = column.id;
        var td = $('<td></td>');

        var dataValue = data[fieldName];

        if (fieldName == 'buildFinishedDate') {
          dataValue = moment(dataValue).subtract(2, 'hours').fromNow();
        }

        if (fieldName == 'buildReproductionDate') {
          dataValue = moment(dataValue).subtract(2, 'hours').fromNow();
        }

        if (fieldName == 'status') {
          if (data[fieldName] == 'PATCHED') {
            row.addClass('success');
          } else if (data[fieldName] == 'test failure' || data[fieldName] == 'test errors') {
            row.addClass('warning');
          }
        }

        if (fieldName == 'prNumber') {
          if (dataValue != 0) {
            dataValue = '<a href="https://github.com/'+data['repositoryName']+'/pull/'+data[fieldName]+'"><img src="images/github-logo.svg" style="width: 40px; height: 40px" alt="'+dataValue+'" /></a>';
          } else {
            dataValue = '';
          }
        }

        if (fieldName == 'typeOfFailures' && dataValue != null) {
          dataValue = dataValue.split(',').join(' ');
        }

        if (fieldName == 'travisURL') {
          dataValue = '<a href="'+dataValue+'"><img src="images/travis-ci.png" style="width: 40px; height: 40px" alt="'+dataValue+'" /></a>';
        }

        if (fieldName == 'branchURL') {
          if (dataValue != undefined && dataValue != null) {
            dataValue = '<a href="'+dataValue+'"><img src="images/github-logo.svg" style="width: 40px; height: 40px" alt="Go to branch" /></a>';
          } else {
            dataValue = 'N/A';
          }

        }

        td.html(dataValue);

        row.append(td);
      });
    });
  });
}
setInterval(updateInspectors, 30000)
updateInspectors();
