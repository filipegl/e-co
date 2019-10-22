/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 22.719387982030867, "KoPercent": 77.28061201796913};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.015478361428634969, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04355400696864112, 500, 1500, "Partido"], "isController": false}, {"data": [1.6233766233766234E-4, 500, 1500, "Login"], "isController": false}, {"data": [0.007953039197121757, 500, 1500, "Page Returning 404"], "isController": false}, {"data": [0.012077294685990338, 500, 1500, "Pessoa"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22483, 17375, 77.28061201796913, 7932.511453097904, 42, 33283, 16007.600000000006, 25431.9, 31043.0, 109.92626926386608, 229.78323490548973, 9.835579320129762], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Partido", 5453, 4088, 74.96790757381258, 6507.398679625887, 42, 33283, 10979.0, 15962.0, 31061.46, 27.848424493131095, 55.405216831686324, 2.6549872165619735], "isController": false}, {"data": ["Login", 6160, 4613, 74.88636363636364, 12173.661201298684, 365, 33171, 30029.0, 33044.9, 33074.0, 30.118125635609793, 61.109699069320584, 3.2278922002733124], "isController": false}, {"data": ["Page Returning 404", 5281, 3930, 74.41772391592501, 6071.3397083885675, 247, 33076, 11068.8, 15440.9, 25449.18, 28.86612589369657, 57.743061083272295, 2.790864113368279], "isController": false}, {"data": ["Pessoa", 5589, 4744, 84.88101628198247, 6407.105385578808, 97, 33048, 10915.0, 15822.5, 31042.1, 28.814773951733063, 67.46435088457592, 1.654959845756665], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 51, 0.2935251798561151, 0.2268380554196504], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 16286, 93.73237410071943, 72.43695236400836], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1038, 5.97410071942446, 4.61682159854112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22483, 17375, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 16286, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1038, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 51, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Partido", 5453, 4088, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 3883, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 185, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 20, null, null, null, null], "isController": false}, {"data": ["Login", 6160, 4613, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 3882, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 706, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 25, null, null, null, null], "isController": false}, {"data": ["Page Returning 404", 5281, 3930, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 3915, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 13, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Pessoa", 5589, 4744, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to localhost:3333 [localhost\\\/127.0.0.1] failed: connect timed out", 4606, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 134, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
