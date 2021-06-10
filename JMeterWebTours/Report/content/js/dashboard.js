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

    var data = {"OkPercent": 94.9501246882793, "KoPercent": 5.049875311720698};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8623517947052136, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9991935483870967, 500, 1500, "FindFlight-90"], "isController": false}, {"data": [1.0, 500, 1500, "FindFlightContinue-98"], "isController": false}, {"data": [1.0, 500, 1500, "RndOrderContinue-118-0"], "isController": false}, {"data": [0.5, 500, 1500, "FindFlight"], "isController": true}, {"data": [0.3360655737704918, 500, 1500, "PaymentDetailsContinue-119"], "isController": false}, {"data": [1.0, 500, 1500, "FindFlight-91"], "isController": false}, {"data": [0.9971311475409836, 500, 1500, "RndOrderContinue"], "isController": true}, {"data": [0.9822580645161291, 500, 1500, "ClickLogin-83"], "isController": false}, {"data": [0.9942622950819672, 500, 1500, "RndOrderContinue-106"], "isController": false}, {"data": [1.0, 500, 1500, "FindFlightContinue"], "isController": true}, {"data": [0.5, 500, 1500, "ClickLogin"], "isController": true}, {"data": [0.3360655737704918, 500, 1500, "PaymentDetailsContinue"], "isController": true}, {"data": [0.9991935483870967, 500, 1500, "OpenPage-75"], "isController": false}, {"data": [0.9870967741935484, 500, 1500, "OpenPage-76"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLogin-85"], "isController": false}, {"data": [0.6201612903225806, 500, 1500, "OpenPage"], "isController": true}, {"data": [0.9975806451612903, 500, 1500, "ClickLogin-84"], "isController": false}, {"data": [1.0, 500, 1500, "RndOrderContinue-118"], "isController": false}, {"data": [0.9983870967741936, 500, 1500, "FindFlight-89"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8020, 405, 5.049875311720698, 258.5411471321704, 0, 2369, 259.0, 367.0, 433.0, 494.0, 13.36439471956434, 478.4526165057149, 8.508447769608333], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["FindFlight-90", 620, 0, 0.0, 270.84516129032255, 211, 525, 254.0, 368.0, 443.94999999999993, 489.47999999999956, 1.035999304877886, 1.749260545052602, 0.6761638230295961], "isController": false}, {"data": ["FindFlightContinue-98", 610, 0, 0.0, 282.5737704918031, 210, 443, 266.0, 368.0, 401.89999999999986, 428.0, 1.0295480284155254, 2.628841712053982, 1.0121526488498598], "isController": false}, {"data": ["RndOrderContinue-118-0", 610, 0, 0.0, 0.13278688524590168, 0, 1, 0.0, 1.0, 1.0, 1.0, 1.0297444208109658, 2.615642158010905, 0.0], "isController": false}, {"data": ["FindFlight", 620, 0, 0.0, 812.5032258064516, 642, 1281, 777.0, 973.0, 1104.7499999999995, 1176.4299999999994, 1.035189773660765, 6.974388914536736, 2.024884548164709], "isController": true}, {"data": ["PaymentDetailsContinue-119", 610, 405, 66.39344262295081, 302.5065573770496, 212, 525, 287.5, 384.69999999999993, 412.3499999999998, 477.3399999999999, 1.0292318724427385, 2.8161595863036237, 1.0788990988948413], "isController": false}, {"data": ["FindFlight-91", 620, 0, 0.0, 263.74677419354816, 205, 463, 248.0, 346.0, 437.94999999999993, 457.0, 1.036671415290569, 4.489880592591478, 0.6776148625657952], "isController": false}, {"data": ["RndOrderContinue", 1220, 0, 0.0, 249.3122950819673, 104, 2369, 243.0, 349.9000000000001, 393.95000000000005, 453.15999999999985, 2.057804053199295, 461.250891460324, 1.21520438622199], "isController": true}, {"data": ["ClickLogin-83", 620, 0, 0.0, 311.13387096774176, 214, 541, 295.0, 453.69999999999993, 482.0, 541.0, 1.036593419638095, 0.8263717255351413, 0.7485047636274416], "isController": false}, {"data": ["RndOrderContinue-106", 610, 0, 0.0, 211.9573770491805, 104, 2369, 195.0, 312.9, 351.89999999999986, 542.1999999999989, 1.0293968746835869, 455.81774032620064, 0.3136443602551554], "isController": false}, {"data": ["FindFlightContinue", 614, 0, 0.0, 280.7328990228011, 0, 443, 265.0, 368.0, 401.5, 428.0, 1.0291014469434514, 2.610582837638296, 1.0051226447152959], "isController": true}, {"data": ["ClickLogin", 620, 0, 0.0, 878.8467741935488, 653, 1351, 866.0, 1099.3999999999999, 1130.0, 1296.0099999999993, 1.0356739564749666, 3.7293691294408697, 2.0602991797921635], "isController": true}, {"data": ["PaymentDetailsContinue", 610, 405, 66.39344262295081, 302.5065573770497, 212, 525, 287.5, 384.69999999999993, 412.3499999999998, 477.3399999999999, 1.0291485230031565, 2.8159315275643095, 1.0788117272950435], "isController": true}, {"data": ["OpenPage-75", 620, 0, 0.0, 279.8790322580643, 210, 758, 263.0, 362.0, 406.8499999999998, 433.78999999999996, 1.0367944989690583, 1.0286945419458626, 0.6227887117326676], "isController": false}, {"data": ["OpenPage-76", 620, 0, 0.0, 297.63387096774187, 208, 541, 276.0, 421.2999999999996, 480.0, 517.0, 1.036742488215415, 3.0424998709297406, 0.5284956824691861], "isController": false}, {"data": ["ClickLogin-85", 620, 0, 0.0, 289.0677419354835, 213, 500, 275.0, 363.0, 455.0, 494.0, 1.0364911764509206, 1.155930589362257, 0.6542164868549514], "isController": false}, {"data": ["OpenPage", 620, 0, 0.0, 577.5129032258066, 431, 1299, 557.0, 718.0, 779.0, 836.0, 1.0361759092443605, 4.068917932047751, 1.1506239930709914], "isController": true}, {"data": ["ClickLogin-84", 620, 0, 0.0, 278.6451612903225, 210, 541, 258.0, 380.5999999999997, 450.8499999999998, 490.9499999999998, 1.0364495917725962, 1.7500208439207217, 0.6592510283000889], "isController": false}, {"data": ["RndOrderContinue-118", 610, 0, 0.0, 286.66721311475413, 208, 463, 270.0, 375.9, 412.0, 440.89, 1.029344762997587, 5.65470242338975, 0.9020988060233542], "isController": false}, {"data": ["FindFlight-89", 620, 0, 0.0, 277.8919354838709, 197, 526, 252.5, 424.4999999999999, 451.0, 492.0, 1.0360460472336734, 0.7436463327312012, 0.6731590391257777], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /  &lt;b&gt; $2190 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $503 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $544 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $737 &lt;/b&gt;/", 6, 1.4814814814814814, 0.07481296758104738], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2037 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1068 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1060 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1406 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $775 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $276 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $234 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1292 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $508 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1871 &lt;/b&gt;/", 6, 1.4814814814814814, 0.07481296758104738], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $730 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1524 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1906 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1101 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2306 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1219 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1830 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $5304 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $462 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $421 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3742 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1106 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2109 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1602 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $6111 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1632 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1220 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2238 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1761 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $4324 &lt;/b&gt;/", 6, 1.4814814814814814, 0.07481296758104738], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $398 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1263 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $852 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $789 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $746 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1638 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $344 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $60 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $703 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $92 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1604 &lt;/b&gt;/", 6, 1.4814814814814814, 0.07481296758104738], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1768 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $534 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1704 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $553 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2832 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $6861 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $842 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1575 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $246 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1863 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2859 &lt;/b&gt;/", 7, 1.728395061728395, 0.08728179551122195], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $202 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2601 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $802 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $867 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1672 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1578 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3657 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1492 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $147 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $944 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1888 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3459 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $610 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $101 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $49 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1802 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1474 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $901 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3536 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3006 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2010 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $184 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $120 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $142 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $5613 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $924 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1497 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $164 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2076 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2172 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1550 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $670 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $577 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1002 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $565 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1086 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $180 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2367 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1088 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2556 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $214 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1734 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3495 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $796 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $213 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3180 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2325 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1006 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $750 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $339 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $688 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $5016 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1165 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $646 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $106 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1125 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1695 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $6486 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $4725 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $4074 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2287 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2211 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3258 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2703 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1509 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1731 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $226 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1242 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2202 &lt;/b&gt;/", 6, 1.4814814814814814, 0.07481296758104738], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $375 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $82 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1659 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $71 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2330 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $321 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3344 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1032 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1340 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3150 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2120 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $303 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $53 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $3114 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1386 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $98 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1130 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1174 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1016 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1038 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $57 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1154 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $4574 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $78 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1460 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $159 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2457 &lt;/b&gt;/", 3, 0.7407407407407407, 0.03740648379052369], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $953 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $156 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $114 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1194 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $621 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $819 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $998 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $174 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1447 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $171 &lt;/b&gt;/", 4, 0.9876543209876543, 0.04987531172069826], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2162 &lt;/b&gt;/", 2, 0.49382716049382713, 0.02493765586034913], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2438 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $2004 &lt;/b&gt;/", 1, 0.24691358024691357, 0.012468827930174564], "isController": false}, {"data": ["Test failed: text expected to contain /  &lt;b&gt; $1996 &lt;/b&gt;/", 5, 1.2345679012345678, 0.06234413965087282], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8020, 405, "Test failed: text expected to contain /  &lt;b&gt; $2859 &lt;/b&gt;/", 7, "Test failed: text expected to contain /  &lt;b&gt; $737 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $1871 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $4324 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $1604 &lt;/b&gt;/", 6], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PaymentDetailsContinue-119", 610, 405, "Test failed: text expected to contain /  &lt;b&gt; $2859 &lt;/b&gt;/", 7, "Test failed: text expected to contain /  &lt;b&gt; $737 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $1871 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $4324 &lt;/b&gt;/", 6, "Test failed: text expected to contain /  &lt;b&gt; $1604 &lt;/b&gt;/", 6], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
