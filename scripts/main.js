// Enter Salary Section

const enterSalaryLabel = $('<h2 id="enterSalaryLabel">Please enter your annual salary</h2>');
const enterSalaryInput = $('<form><input id="salaryInput" value="£"></form>');
const bonusLabel = $('<h2 id="enterSalaryLabel">Bonus Percentage</h2>');
const bonusSlider = $('<div id="slider"><div id="custom-handle" class="slider ui-slider-handle"></div></div>');
const submitButton = $('<button id="submitButton">Submit</button>')

const resultsSection = $('<div class="container" id="resultsSection"><div class="row"><div class="col-md-6"><div id="chartSection"></div></div><div class="col-md-6"><div class="mx-auto" id="tableSection"><h2>You take home</h2><div id="takeHomeTotal"></div><div id="resultsTable"></div><div id="resultsTableMonthly"></div></div></div></div><div class="row" id="editResults"><div id="editDiv"><img src="img/up-arrow.svg" id="upArrow"><p id="scrollToTopButton">Edit Details</p></div></div></div>');

// Adding landing page elements

$('#inputSection').append(enterSalaryLabel);
$('#inputSection').append(enterSalaryInput);
$('#inputSection').append(bonusLabel);
$('#inputSection').append(bonusSlider);
$('#inputSection').append(submitButton);
    

$( function() {
    var handle = $("#custom-handle");
    //
    $( "#slider" ).slider({
      create: function() {
        handle.text( $( this ).slider( "value" ) + "%" );
      },
      slide: function( event, ui ) {
        handle.text( ui.value + "%");

      }
    });
    

  } );



$('#submitButton').hover(

    function() {
        $(this).css({ "background": "white", "color": "green" })
    },
    function() {
        $(this).css({ "background": "transparent", "color": "white" })
    });

$('#salaryInput').keypress(function (e) {
       var key = e.which;
       if(key == 13)  // the enter key code
       {    
           e.preventDefault();
           $('#submitButton').click();
         }
       });   


// Chart functionality

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "£1,") ); 
    })
}

function createChart() {


    $('body').append(resultsSection);

    $('#myChart').remove();
    // $('#chartSection').append('<canvas id="myChart"></canvas>');
    
    var $userSalary = $('#salaryInput').val();

    $userSalary = $userSalary.replace('£','');
    $userSalary = $userSalary.replace(',','');

    var bonusPercentage = $('#slider').slider("option", "value");

    bonusPercentage = bonusPercentage/100;

    $userSalary = parseInt($userSalary);

    var $totalIncome = $userSalary + ($userSalary * bonusPercentage);



    // Tax Rate If Statement

    var $totalTax = 0;
    const maxBasicRate = 6900;
    const maxHigherRate = 46200;

    if ($totalIncome > 150000) {
        var additionalRate = ($totalIncome - 150000) * 0.45;
        console.log(additionalRate);
        $totalTax = additionalRate + maxBasicRate + maxHigherRate;
    } 
    
    else if ($totalIncome >= 46351 && $totalIncome <= 150000) {
        var higherRate = ($totalIncome - 46350) * 0.4;
        $totalTax =  higherRate + maxBasicRate;
    } 

    else if ($totalIncome >= 11851 && $totalIncome <= 46350) {
        $totalTax = ($totalIncome - 11850) * 0.2;
    }


    // National Insurance If Statement

    var $totalNI = 0;
    var $weeklyIncome = $totalIncome / 52;
    console.log("weekly after " + $weeklyIncome)


    if ($weeklyIncome > 892) {
        var lowerNI = ($weeklyIncome - 892) * 0.02;
        $totalNI = 87.60 + lowerNI;
        console.log($weeklyIncome);
        console.log($totalNI);
    } 

    else if ($weeklyIncome <= 892 && $weeklyIncome > 162) {
        $totalNI = ($weeklyIncome - 162) * 0.12;
    }

    $totalNI = $totalNI * 52;

    // Rounding to 2 decimal places 

    $totalTax = $totalTax.toFixed(2);
    $totalNI = $totalNI.toFixed(2);

    

    
    $takeHome = $totalIncome - $totalTax - $totalNI;

    $takeHome = $takeHome.toFixed(2);

    var $totalTaxFormatted = $totalTax.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var $nationalInsuranceFormatted = $totalNI.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var $takeHomeFormatted = $takeHome.replace(/\B(?=(\d{3})+(?!\d))/g, ",");


    var canvasCreator = $('<canvas id="myChart" width="350" height="250"></canvas>');
    $('#chartSection').append(canvasCreator);

    var ctx = $('#myChart');

    var data = {
        datasets: [{
            data: [$takeHome, $totalTax, $totalNI],
            backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Take Home',
            'Tax',
            'National Insurance'
        ],
    };

    var chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            legend: {
                labels: {
                    fontColor: 'rgb(255, 255, 255)'
                },
                position: 'bottom',
            },
            
            tooltips: {
               enabled: true
            }
                
            
       }
    });

    // Table Section (change basicTax to totalTaxAmount)


    var $takeHomeTotal = "<h1>£" + $takeHomeFormatted + " <span>/year</span></h1>";

    $('#takeHomeTotal').html($takeHomeTotal);

    var $takeHomeYearlyTable = '<table class="resultsTable"><tr><th>Take Home</th><td>£' + $takeHomeFormatted + '</td></tr><tr><th>Tax</th><td>£' + $totalTaxFormatted + '</td></tr><tr><th>National Insurance</th><td>£' + $nationalInsuranceFormatted + '</td></tr></table>';

    var $takeHomeMonthly = ($takeHome / 12).toFixed(2);
    var $totalTaxMonthly = ($totalTax / 12).toFixed(2);
    var $nationalInsuranceMonthly = ($totalNI / 12).toFixed(2);

    $takeHomeMonthly = $takeHomeMonthly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $totalTaxMonthly = $totalTaxMonthly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $nationalInsuranceMonthly = $nationalInsuranceMonthly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");



    var $takeHomeMonthlyTable = '<table class="resultsTable"><tr><th>Take Home</th><td>£' + $takeHomeMonthly + '</td></tr><tr><th>Tax</th><td>£' + $totalTaxMonthly + '</td></tr><tr><th>National Insurance</th><td>£' + $nationalInsuranceMonthly + '</td></tr></table>';

    $('#resultsTable').html('<h3>Yearly</h3>');
    $('#resultsTable').append($takeHomeYearlyTable);
    $('#resultsTable').append('</br>');
    $('#resultsTableMonthly').html('<h3>Monthly</h3>');
    $('#resultsTableMonthly').append($takeHomeMonthlyTable);

    $('#editDiv').ready(
        $('#editDiv').click(function(){
            scrollToTop();
        })
    )

    $('#editDiv').hover(

        function() {
            $('#upArrow').animate( {marginBottom: "15px"}, 200 )
        },
        function() {
            $('#upArrow').animate( {marginBottom: "0px"}, 200 )
        });
    
};


function scrollToResults(){
    $('html, body').animate({
        scrollTop: $("#resultsSection").offset().top
    }, 1000);
 }

function scrollToTop(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
 }

$('#submitButton').click(function() {

    createChart();
    scrollToResults();

});


//tax calculations

// declare variables

// if statement to carry out correct function

// basic Tax funciton