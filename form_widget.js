/* 
Jive - Form Widget Builder

Copyright (c) 2015 Fidelity Investments
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


FILE DESCRIPTION
This is the Javascript library that drives the form widget entry screens.

WIDGET DESCRIPTION
This Jive HTML widget allows users to build forms via a drag & drop interface.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';
var parentWindow = window.parent.document;
var parentIframe = $j("iframe",parentWindow);
var person_selector_search_timeoutID = -1;
var debounce_period = 250;
var active_person_selector;

var attachmentCount = 0;
var attachmentsAvailable = false;
var doc_body = '';
var email_body = '';
var newline = '\r\n';
var searchRequest = null;

/*
 * Jive AJAX return packets will all have a first line that makes it an invalid JSON packet.  This must be stripped off.
 */
jQuery.ajaxSetup({
	dataFilter: function(data, type) {
		return type === 'json' ? jQuery.trim(data.replace(/^throw [^;]*;/, '')) : data;
	}
});

/*
 * Scroll the parent window to the top of the specified element.
 */
(function($j) {
	$j.fn.goTo = function() {
		var newTop = 0;
		// Loop through all <iframe> tags on the parent doc
		$j('iframe',parentWindow).each( function(index) {
			// If this is our iframe
			if (this.contentWindow == window) {
				// Set the top to the top of the iframe
				newTop =  parseInt($j(this).offset().top);
				return;
			}
		});
		// Add the top offset of the element
		newTop +=  parseInt($j(this).offset().top);
		// Scroll to the new top
		$j('html, body', parentWindow).animate({
			scrollTop: newTop + 'px'
		}, 'fast');
		// Set the focus to the element to ease user editing
		$j(this).focus();
		// Return the element for chaining
		return this;
	}
})($j);

/*
 * string numeric pad function to make formatting time easier.
 */
function pad (str, max) { 
	str = str.toString(); 
	return str.length < max ? pad("0" + str, max) : str; 
}

/*
 * format function for input string parameters
 */
function format(str) {
	str = str.replace(/'/g, "\\'");
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/\n/g, "");
	str = str.replace(/\r/g, "");
	return str;
}

/*
 * Displays the Jive alert box near the bottom of the parent page.  Valid styles are success, error, and info.  Uptime is the number of milliseconds the message will be displayed before fading away
 */
function messageIn(msg, style, uptime) {
	$j('.j-alert-container', parentWindow).html('<div class="j-alert j-rc5 j-alert-' + style + ' clearfix j-alert-withbutton" style="bottom: 0px; display: block; opacity: 1; font-size: 16px;"><p>' + msg + '</p></div>').fadeIn(500);
	setTimeout(messageOut, uptime);
}

/*
 * Fades out the message, and refreshes the form if displaying a success message.
 */
function messageOut() {
	$j('.j-alert-container', parentWindow).fadeOut(3000).hide();
	if ($j('.j-alert', parentWindow).hasClass('j-alert-success')) {
		window.location.reload();
	}
}

/*
 * Check the required form fields and add the _form_fromelem_error class to any that are not set.
 */
function checkFormFields() { 
	/*
	 * clean up any previous errors.
	 */
	$j('#_form_error').remove();
	$j('._form_formelem_error').each( function(index) {
		$j(this).removeClass('_form_formelem_error');
	});

	/*
	 * Loop through all form fields.
	 */
	var ret = true;
	$j("._form_formelem").each( function(index) { 
		if ( $j('#tool_required_checkbox', this).attr('checked') ) {
			temp = $j(this).attr("id"); 
			if (temp == "tool_personselector") {
				if ( $j('#tool_personselector_id_value', this).text() == '-') {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_input"){ 
				if ( $j('#tool_input_input', this).val() == '') {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_textarea"){ 
				if ( $j('#tool_textarea_textarea', this).val() == '') {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_radio"){ 
				if (  ! $j('input:radio:checked',this).length ) {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_checkbox"){ 
				if (  ! $j('#tool_checkbox_options input:checkbox:checked',this).length ) {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
	 		} else if (temp == "tool_singleselect") {
				if (  ! $j('#tool_singleselect_options :selected',this).length ) {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_multiselect") { 
				if (  ! $j('option:selected',this).length ) {
					$j(this).addClass('_form_formelem_error');
					ret = false;
				}
			} else if (temp == "tool_date"){ 
				if ( $j('#tool_date_type', this).text() == 'entry' ) {
					if ( $j('.tool_date_input', this).val() == '') {
						$j(this).addClass('_form_formelem_error');
						ret = false;
					}
				}
	 		} else if (temp == "tool_attachment") {
	 			// check for at least one attachment if required
	 			if($j('#tool_attachment_input')[0].files.length == 0) {
	 				$j(this).addClass('_form_formelem_error');
	 				ret = false;
	 			}

			}
		} 
	}); 
	return ret; 
} 

/*
 * Determine the label styling based on the user's selected color scheme.
 */
function getLabelStyle() {
	if ( $j('#_form_color_scheme').text() == "_form_color_scheme_basic" ) {
		return "border-collapse: collapse; border-spacing: 0px; padding: 10px; border: 0px; color: rgb(130,130,160); font-weight: bold;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_orange" ) {
		return "border-collapse: collapse; border-spacing: 0px; padding: 10px; border: 1px solid #F7901E; background-color: #f7cb9a;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_green" ) {
		return "border-collapse: collapse; border-spacing: 0px; padding: 10px; border: 1px solid #7e8879; background-color: #c4e1b5;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_blue" ) {
		return "border-collapse: collapse; border-spacing: 0px; padding: 10px; border: 1px solid #85e1ff; background-color: #ebfaff;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_gray" ) {
		return "border-collapse: collapse; border-spacing: 0; background-color: #dddddd; padding: 10px; border: 1px solid #808080;";
	}
}

/*
 * Determine the value styling based on the user's selected color scheme.
 */
function getValueStyle() {
	if ( $j('#_form_color_scheme').text() == "_form_color_scheme_basic" ) {
		return "border-collapse: collapse; border-spacing: 0; padding: 10px; border: 0px";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_orange" ) {
		return "border-collapse: collapse; border-spacing: 0; padding: 10px; border: 1px solid #F7901E;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_green" ) {
		return "border-collapse: collapse; border-spacing: 0; padding: 10px; border: 1px solid #7e8879";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_blue" ) {
		return "border-collapse: collapse; border-spacing: 0; padding: 10px; border: 1px solid #85e1ff;";
	} else if ( $j('#_form_color_scheme').text() == "_form_color_scheme_gray" ) {
		return "border-collapse: collapse; border-spacing: 0; padding: 10px; border: 1px solid #808080;";
	}
}

/*
 * Format the Submitter element
 */
function getFormBodySubmitter(submitter) { 
	if ( $j('#tool_label', submitter).text() != '') {
		doc_body += '<tr><td colspan="2" class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',submitter).text()) + '</td></tr>';
		email_body += format($j('#tool_label',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_id_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_id_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',submitter).text() + '-id">' + format($j('#tool_submitter_id_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_id_label',submitter).text()) + ': ' + format($j('#tool_submitter_id_value',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_name_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_name_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',submitter).text() + '-name">' + format($j('#tool_submitter_name_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_name_label',submitter).text()) + ': ' + format($j('#tool_submitter_name_value',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_title_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_title_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' +$j('#tool_id',submitter).text() + '-title">' + format($j('#tool_submitter_title_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_title_label',submitter).text()) + ': ' + format($j('#tool_submitter_title_value',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_bu_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_bu_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',submitter).text() + '-bu">' + format($j('#tool_submitter_bu_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_bu_label',submitter).text()) + ': ' + format($j('#tool_submitter_bu_value',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_email_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_email_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',submitter).text() + '-email">' + format($j('#tool_submitter_email_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_email_label',submitter).text()) + ': ' + format($j('#tool_submitter_email_value',submitter).text()) + newline;
	}
	if ( $j('#tool_submitter_phone_value', submitter).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_submitter_phone_label',submitter).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',submitter).text() + '-phone">' + format($j('#tool_submitter_phone_value',submitter).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_submitter_phone_label',submitter).text()) + ': ' + format($j('#tool_submitter_phone_value',submitter).text()) + newline;
	}
}

/*
 * Format the Person Selector element
 */
function getFormBodyPersonSelector(person) { 
	if ( $j('#tool_personselector_heading_label', person).text() != '') {
		doc_body += '<tr><td colspan="2" class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_heading_label',person).text()) + '</td></tr>'; 
		email_body += format($j('#tool_personselector_heading_label',person).text()) + newline;
	}
	if ( $j('#tool_personselector_id_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_id_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-id">' + format($j('#tool_personselector_id_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_id_label',person).text()) + ': ' + format($j('#tool_personselector_id_value',person).text()) + newline;
	}
	if ( $j('#tool_personselector_name_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_name_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-name">' + format($j('#tool_personselector_name_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_name_label',person).text()) + ': ' + format($j('#tool_personselector_name_value',person).text()) + newline;
	}
	if ( $j('#tool_personselector_title_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_title_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-title">' + format($j('#tool_personselector_title_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_title_label',person).text()) + ': ' + format($j('#tool_personselector_title_value',person).text()) + newline;
	}
	if ( $j('#tool_personselector_bu_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_bu_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-bu">' + format($j('#tool_personselector_bu_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_bu_label',person).text()) + ': ' + format($j('#tool_personselector_bu_value',person).text()) + newline;
	}
	if ( $j('#tool_personselector_email_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_email_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-email">' + format($j('#tool_personselector_email_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_email_label',person).text()) + ': ' + format($j('#tool_personselector_email_value',person).text()) + newline;
	}
	if ( $j('#tool_personselector_phone_value', person).text() != '') {
		doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_personselector_phone_label',person).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',person).text() + '-phone">' + format($j('#tool_personselector_phone_value',person).text()) + '</p></td></tr>';
		email_body += '\t' + format($j('#tool_personselector_phone_label',person).text()) + ': ' + format($j('#tool_personselector_phone_value',person).text()) + newline;
	}
}

/*
 * Format the Text Block element
 */
function getFormBodyTextBlock(textblock) { 
	if ( $j('#tool_textblock_include', textblock).text() != 'Yes') {
		return true;
	} else {
		//doc_body += '<tr><td colspan="2" class="gwd-td-mafh" style="' + getLabelStyle() + '">' + $j('#tool_label',textblock).html().replace(/https:\/\/site.company.com\//g, "\/") + '</td></tr>';
		doc_body += '<tr><td colspan="2" class="gwd-td-mafh" style="' + getLabelStyle() + '">' + $j('#tool_label',textblock).html().replace(new RegExp(baseURL, 'g'), "") + '</td></tr>';
		email_body += format($j('#tool_label',textblock).text()) + newline;
	}
}

/*
 * Format the Date element
 */
function getFormBodyDate(date) { 
	doc_body += '<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',date).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',date).text() + '">';
	email_body += format($j('#tool_label',date).text()) + ': ';
	if ($j('#tool_date_type',date).text() == 'entry') {
		doc_body += format($j('.tool_date_input',date).val());
		email_body += format($j('.tool_date_input',date).val());
	} else {
		doc_body += format($j('#tool_date_current',date).text());
		email_body += format($j('#tool_date_current',date).text());
	}
	doc_body += '</p></td></tr>';
	email_body += newline;
}

/*
 * Format the Heading element
 */
function getFormBodyHeading(heading) { 
	doc_body += '<tr><td colspan="2" class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',heading).text()) + '</td></tr>'; 
	email_body += format($j('#tool_label',heading).text()) + newline;
}

/*
 * Format the Text Input element
 */
function getFormBodyInput(input) { 
	doc_body +=	'<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',input).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><p class="' + $j('#tool_id',input).text() + '">'
		 +	format($j('#tool_input_input',input).val()) 
		 +	'</p></td></tr>'; 
	email_body += format($j('#tool_label',input).text()) + ': ' + format($j('#tool_input_input',input).val()) + newline;
}

/*
 * Format the Text Area element
 */
function getFormBodyTextArea(textarea) { 
	doc_body +=	'<tr><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',textarea).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable"><span class="' + $j('#tool_id',textarea).text() + '">';
	var opt_list = $j('#tool_textarea_textarea',textarea).val().split('\n'); 
	$j.each(opt_list, function( index, value ) { 
		doc_body += '<p>' + format(value) + '</p>'; 
	}); 
	doc_body += '</td></tr>'; 
	email_body += format($j('#tool_label',textarea).text()) + ': ' + $j('#tool_textarea_textarea',textarea).val().replace(/\n/g, " ") + newline;
}

/*
 * Format the Radio element
 */
function getFormBodyRadio(radio) { 
	doc_body +=	'<tr class="__score"><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',radio).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable _form_tallyable">';
	email_body += format($j('#tool_label',radio).text()) + ': ';
	$j('input:radio:checked', radio).each(function(index, opt){
		doc_body +=	'<p class="' + $j(this).attr("id") + '">' + format($j(this).val()) + '</p>';
		email_body += format($j(this).val());
	});
	doc_body +=	'</td></tr>';
	email_body += newline;
}

/*
 * Format the Checkbox element
 */
function getFormBodyCheckbox(checkbox) { 
	doc_body +=	'<tr class="__score"><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',checkbox).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable _form_tallyable">';
	email_body += format($j('#tool_label',checkbox).text()) + ': ';
	var first = 1;
	$j('input:checkbox:checked', checkbox).each(function(index, opt){
		if ($j(this).attr('id') != 'tool_required_checkbox') {
			doc_body += '<p class="' + $j(this).attr("id") + '">' + format($j(this).val()) + '</p>';
			if (first != 1) {
				email_body += ', ';
			}
			first = 0;
			email_body += format($j(this).val());
		}
	}); 
	doc_body += '</td></tr>'; 
	email_body += newline;
}

/*
 * Format the Single Select element
 */
function getFormBodySingleSelect(singleselect) { 
	doc_body +=	'<tr class="__score"><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',singleselect).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable _form_tallyable">';
		email_body += format($j('#tool_label',singleselect).text()) + ': ';
	$j('option:selected', singleselect).each(function(index, opt){ 
		doc_body += '<p class="' + $j(this).attr("id") + '">' + format($j(this).val()) + '</p>';
		email_body += format($j(this).val());
	}); 
	doc_body += '</td></tr>';
	email_body += newline;
}

/*
 * Format the Multi Select element
 */
function getFormBodyMultiSelect(multiselect) { 
	doc_body +=	'<tr class="__score"><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',multiselect).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable _form_tallyable">';
	email_body += format($j('#tool_label',multiselect).text()) + ': ';
	var first = 1;
	$j('option:selected', multiselect).each(function(index, opt){ 
		doc_body += '<p class="' + $j(this).attr("id") + '">' + format($j(this).val()) + '</p>'; 
		if (first != 1) {
			email_body += ', ';
		}
		first = 0;
		email_body += format($j(this).val());
	}); 
	doc_body += '</td></tr>'; 
	email_body += newline;
}

/*
 * Format the Attachment element
 */
function getFormBodyAttachment(attachment) { 
	// Display in the table 'None' if there aren't any attachments else display the file names attached on this element
	var att = "";
	$j('input[type=file]', attachment).each(function() {
		for(var i = 0; i < this.files.length; i++) {
			if (att.length > 0) {
				att += '<br>';
			}
			att += this.files[i].name;
		}
	});
	if(att == "") {
		att = "None";
	}
	doc_body +=	'<tr class="__score"><td class="gwd-td-mafh" style="' + getLabelStyle() + '">' + format($j('#tool_label',attachment).text()) + '</td><td style="' + getValueStyle() + '" class="_form_reportable _form_tallyable">' + att + '</td></tr>'; 
}

/*
 * Read through the form fields and generate an HTML body for the document to be posted.
 */
function getFormBody() { 
	var temp = ""; 
	doc_body = "<table>"; 
	$j("._form_formelem").each( function(index) { 
		temp = $j(this).attr("id"); 
		if (temp == "tool_submitter"){
			getFormBodySubmitter(this);
		} else if (temp == "tool_personselector"){ 
			getFormBodyPersonSelector(this);
		} else if (temp == "tool_textblock"){ 
			getFormBodyTextBlock(this);
		} else if (temp == "tool_date"){ 
			getFormBodyDate(this);
		} else if (temp == "tool_heading"){ 
			getFormBodyHeading(this);
		} else if (temp == "tool_input"){ 
			getFormBodyInput(this);
		} else if (temp == "tool_textarea"){
			getFormBodyTextArea(this);
		} else if (temp == "tool_radio"){
			getFormBodyRadio(this);
		} else if (temp == "tool_checkbox"){
			getFormBodyCheckbox(this);
		} else if (temp == "tool_singleselect") {
			getFormBodySingleSelect(this);
 		} else if (temp == "tool_multiselect") {
 			getFormBodyMultiSelect(this);
 		} else if (temp == "tool_attachment") {
 			getFormBodyAttachment(this);
		} 
	}); 
 	doc_body += '</table>'; 
} 

/*
 * Format the Document Name
 */
function _form_getDocumentName() {
	var docName = "";
	// If the form name is set as the title, use it
	if ( $j('#_form_formname_title #tool_set_as_title_checkbox') == undefined ||
		 $j('#_form_formname_title #tool_set_as_title_checkbox').attr('checked') ){
		docName = format( $j('#_form_formname_text').text() );
	} else {
		// Loop through all elements on the form
		$j("._form_formelem").each( function(index) { 
			// Get the type of element
			type = $j(this).attr("id"); 
			if ( type == "tool_input" &&
				 $j('#tool_set_as_title_checkbox', this).attr('checked') ) {
				docName = format($j('#tool_input_input',this).val());
			} else if ( type == "tool_radio" &&
						$j('#tool_set_as_title_checkbox', this).attr('checked') ) {
				$j('input:radio:checked', this).each(function(index, opt){
					docName = format($j(this).val());
				});
			} else if ( type == "tool_singleselect" && 
						$j('#tool_set_as_title_checkbox', this).attr('checked') ) {
				$j('option:selected', this).each(function(index, opt){ 
					docName = format($j(this).val()); 
				});
			}
		});
	}
	if (docName == "") {
		docName = format( $j('#_form_formname_text').text() );
	}

	var currentdate = new Date(); 
	docName = docName.replace(/^\s+|\s+$/g, '') + '-' + currentdate.getFullYear() + pad((currentdate.getMonth()+1),2) + pad(currentdate.getDate(),2) + pad(currentdate.getHours(),2) + pad(currentdate.getMinutes(),2) + pad(currentdate.getSeconds(),2);
	return docName
}

/*
 * User has clicked submit.  Determine what to submit, format it, and submit it.
 */
function _form_submitForm() { 
	// Check the required fields.  If any are not filled in, display an error and quit.
	if ( ! checkFormFields() ) {
		var errorDiv =	'<div id="_form_error" class="form-group _form_error_message">'
					 +	'	<label class="col-xs-3"></label>'
					 +	'	<h3 class="col-xs-9 _form_error_message">ERROR!  The fields colored red are required.</h3>'
					 +	'</div>';
		$j(errorDiv).insertBefore('#_form_submit')
		setTimeout(resizeMe, 100);
		return false;
	}

	// Disable submit.
	$j('#_form_formdestination_submit').attr('disabled', true);

	// Let's do error checking for attachments before getFormBody because of dependencies
	if(attachmentsAvailable) {
		_form_submitForm_attachment();
	}

	// Generate the document data packet to submit.
	var document_name = _form_getDocumentName(); 
	getFormBody();

	
	// If a document is being submitted, always call that first, and wait for completion to determine whether or not to send an email.
	if ($j('#_form_formdestination_submitURL').text() != 'N') {
		_form_submitForm_URL(document_name);
	} else if ($j('#_form_formdestination_submitemail').text() == 'Y') {
		_form_submitForm_Email(document_name);
	}
} 

/*
 * Attach the attachments to the document.
 */
function _form_submitForm_attachment() {
	var errorAttachmentCountFound = false;
	var errorsFileFound = false;
	var errorFilesList = '';
	var errorMessage = '';
	attachmentCount = 0;

	// do each file input in case there's more than one on the form and count attachments
	$j('input[type=file]').each(function() {
		attachmentCount += this.files.length;
		$j(this).attr('disabled', true);
	});

	if(attachmentCount > 3) {
		errorMessage += 'You can only attach up to 3 files per form.';
		$j('_form_formelem[id="tool_attachment"]').addClass('_form_formelem_error');
		$j('#_form_formdestination_submit').attr('disabled', false);
		errorAttachmentCountFound = true;
	}

	$j('input[type=file]').each(function() {
		for(var i = 0; i < this.files.length; i++) {
			if(this.files[i].size > 8375000) {
				errorsFileFound = true;
				errorFilesList += this.files[i].name + '\n';
			}
		}
	});

	if(errorsFileFound || errorAttachmentCountFound) {
		if(errorsFileFound) {
			if(errorAttachmentCountFound) {
				errorMessage += ' Also, the following files are over the 8 MB limit.\n\n' + errorFilesList;
			} else {
				errorMessage += 'The following files are over the 8 MB limit.\n\n' + errorFilesList;
			}
			errorMessage += '\nPlease check these files and try again.';
		}

		messageIn(errorMessage, 'error', 10000);

		$j('_form_formelem[id="tool_attachment"]').addClass('_form_formelem_error');
		$j('#_form_formdestination_submit').attr('disabled', false);
		$j('input[type=file]').each(function() {
			$j(this).attr('disabled', false);
		});
		return;
	}
}

/*
 * Format and submit a document.
 */
function _form_submitForm_URL(name) {
	var data = "{ 'content': { 'type':'text/html', 'text':'" + doc_body + "' }," 
			 + " 'subject':'" +  name + "'," 
			 + " 'parent':'/api/core/v3/places/" + $j('#_form_formdestination_ID').text().replace(/\'/g,'') + "',";
	var category = "";
	if ( $j('#_form_formcategory_type').text() == 'set') {
		category = $j('#_form_formcategory_category').text();
	} else if ( $j('#_form_formcategory_type').text() == 'single' || $j('#_form_formcategory_type').text() == 'multiple') {
		$j('#_form_formcategory_options option:selected').each(function(index, opt){ 
			if (category != "") category += ",";
			category += $j(this).val(); 
		}); 
	}
	if ( category != "" ) {
		data +=" 'categories':[" + category + "],";
	}
	if ( $j('#_form_tags').text() != "" ) {
		var tag_list = $j('#_form_tags').text().split(',');
		var tags = ""
		var first = true;
		$j.each(tag_list, function( index, tag ) {
			if ( ! first )
				tags += ",";
			else
				first = false;
  			tags += "'" + tag + "'";
		});
		data +=" 'tags':[" + tags + "],";
	}
	data +=" 'type':'document'"
		 + "}"; 
	
	// Post the document to the destination.
	$j.ajax({ 
		type: 'POST', 
		headers: {'Content-Type':'application/json'}, 
		url: '/api/core/v3/contents', 
		dataType: 'json', 
		data: data, 
		success: function (data) { 
			var doc_link = data.resources.html.ref;
			
			// Have to upload attachments after creating the document
			if(attachmentsAvailable && attachmentCount > 0) {

				email_body += newline + 'Attachments can be found in the document link below.';

				var contentID = data.contentID;
				var formData = new FormData();

				$j('input[type=file]').each(function() {
					for(var i = 0; i < this.files.length; i++) {
						formData.append(this.name, this.files[i]);
					}
				});

				$j.ajax({
					url: '/api/core/v3/attachments/contents/' + contentID,
					type: 'POST',
					data: formData,
					processData: false,
					contentType: false,
					success: function(data) {
						/*
						$j('<p />', window.parent).html(document_name + ' has been saved with the attachments specified').message({style: 'success', dismissIn: 20000});
						if ( $j('_form_formdestination_submitrefresh').text() == 'Yes') {
							window.location.reload();
						}
						*/
						messageIn('<bold><a href="' + doc_link + '">' + name + '</a></bold> has been saved with the attachments specified',
						          'success',
						          5000);
						          //$j('_form_formdestination_submitrefresh').text() == 'Y');
					}
				});


			} else {
				messageIn('<bold><a href="' + doc_link + '">' + name + '</a></bold> has been saved',
				          'success',
				          5000);
				//$j('_form_formdestination_submitrefresh').text() == 'Y');
			}

			if ($j('#_form_formdestination_submitemail').text() == 'Y') {
				email_body += newline + 'Document URL: ' + doc_link;
				_form_submitForm_Email(name);
			}
		}, 
		error: function (xhr, ajaxOptions, thrownError){ 
			var err = 'ERROR: ' + thrownError + '\n';
			if ( thrownError == 'Forbidden' ) {
				err += 'You do not have permission to post to the destination of this form.';
			} else {
				err += 'data:\n' + data;
			}
			messageIn('submit error: ' + err + '\n\nYou will need to talk to the administrator of this form about this.  Look in the People tab for the owners.',
			          'error',
			          10000);
			alert(); 
		},	
		complete: function(){
			//window.location.reload();
		} 
	}); 
}

/*
 * Format an email and open in the defalt email client.
 */
function _form_submitForm_Email(subject) {
	var email = "mailto:" + $j('#_form_formdestination_email').text() + "?subject=" + subject + "&body=" + encodeURIComponent(email_body);
	window.location = email;
}

/*
 * Look up the selected person's information.
 */
function person_selector_selection(id) {
	$j.ajax({
		type: "GET",
		url: '/api/core/v3/people/' + id,
		dataType: "json",
		success: function (data) {
			$j('#tool_personselector_search_results', active_person_selector).hide();
			$j('#tool_personselector_id_value', active_person_selector).text( data.jive.username );
			$j('#tool_personselector_name_value', active_person_selector).text( data.displayName );
			for (ndx = 0; ndx < data.jive.profile.length; ndx++ ) {
				if (data.jive.profile[ndx].jive_label == 'Title') {
					$j('#tool_personselector_title_value', active_person_selector).text( data.jive.profile[ndx].value );
				} else if (data.jive.profile[ndx].jive_label == 'Business Unit') {
					$j('#tool_personselector_bu_value', active_person_selector).text( data.jive.profile[ndx].value );
				}
			}
			$j('#tool_personselector_email_value', active_person_selector).text( data.emails[0].value );
			$j('#tool_personselector_phone_value', active_person_selector).text( data.phoneNumbers[0].value );
			$j('#tool_personselector_search_input', active_person_selector).goTo();
			active_person_selector = null;
		},
		error: function (xhr, ajaxOptions, thrownError){
			messageIn('person_selector_selection error: ' + thrownError,
			          'error',
			          10000);
		},
		complete: function(){
		}
	});
}

/*
 * Search for people based on the search terms entered.
 */
function person_selector_search_exec(search_term) {
	person_selector_search_timeoutID = -1;
	if (search_term == '') {
		if (active_person_selector) $j('#tool_personselector_search_results', active_person_selector).hide();
		return false;
	}
	// If a previous ajax call was made, abort it
    if(searchRequest) {
        searchRequest.abort();
        searchRequest = null
    }
    //set the search variable so that only its return is used and all previous returns are ignored
    searchRequest = $j.ajax({
		type: "GET",
		url: '/api/core/v3/people?filter=search(' + search_term + ')',
		dataType: "json",
		success: function (data) {
			var person_list = ""
			$j(data.list).each(function(index, opt){ 
				person_list += "<div id='" + data.list[index].id + "' class='person_selector_entry'>";
				person_list += "<label>" + data.list[index].jive.username + " - " + data.list[index].displayName + "</label>";
				person_list += "<label id='jiveid' style='display:none;'>" + data.list[index].id + "</label>";
				person_list += "</div>";
			});
			$j('#tool_personselector_search_results', active_person_selector).html(person_list).show();
			$j('.person_selector_entry', active_person_selector).click(function(e){
				person_selector_selection( $j('#jiveid',this).text() );
			});
			setTimeout(resizeMe, 100);
			$j('#tool_personselector_search_input', active_person_selector).goTo();
		},
		error: function (xhr, ajaxOptions, thrownError){
			console.log('person_selector_search_exec error: ' + thrownError);
		},
		complete: function(){
			searchRequest = null;
		}
	});
}

/*
 * Make sure the user has stopped typing for the specified timeout before kicking off a new search.
 */
function person_selector_search_debounce(elem) {
	// If there is currently a timer counting, then clear it
	if (person_selector_search_timeoutID > -1) {
		clearTimeout(person_selector_search_timeoutID);
		person_selector_search_timeoutID = -1;
	}
	// There can be multiple person selectors on a form, so set the active one to this one being typed in
	active_person_selector = $j(elem).closest('#tool_personselector');
	// Set a new timer to kick off a search after the debounce period
	person_selector_search_timeoutID = setTimeout( function() { person_selector_search_exec( $j(elem).val().toLowerCase() ); }, debounce_period);
}

/*
 * This function just resizes the form whenever the date input gets focus so that
 * the form window is big enough to display the calendar.
 */
function onFocusDate() {
	setTimeout(resizeMe, 100);
}

/*
 * The document is loaded, so perform all processing to display the document information and get it ready
 */
$j(document).ready(function() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	IEVersion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)));

	baseURL = window.parent._jive_base_absolute_url.replace(/.*?:\/\//g, "");

	// Bind the Person Selector input box to the person search function.
	if ($j('input, textarea') != null) {
		if(IEVersion <= 8){	
			if ($j('input, textarea').placeholder) {
				$j('input, textarea').placeholder();
			}
		}
	}

	if ($j('._form_person_selector') != null) {
		if(IEVersion <= 8){	
			$j('._form_person_selector').attr('onpropertychange', 'person_selector_search_debounce($j(this))');
		} else {
			$j('._form_person_selector').bind('input', function() { 
				person_selector_search_debounce($j(this));
			});
		}
	}

	$j('.tool_date_input').each(function() {
		// Set the date picker on each input date field
		$j(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true
		});
		// Set an event listener for all date input fields to resize in the calendar
		$j(this).on("onfocus", onFocusDate);
		$j(this).on("onblur", onFocusDate);
		/*
		if(IEVersion <= 8){
			document.getElementById('tool_date_input').attachEvent("onfocus", onFocusDate);
			document.getElementById('tool_date_input').attachEvent("onblur", onFocusDate);
		} else {
			document.getElementById('tool_date_input').addEventListener("focus", onFocusDate, true);
			document.getElementById('tool_date_input').addEventListener("blur", onFocusDate, true);
		}
		*/
	});

	// [AB] check to see if we have attachments on this form to enable attachment restrictions
	$j('._form_formelem').each(function() {
		var id = $j(this).attr('id');
		if(id == "tool_attachment") {
			attachmentsAvailable = true;
		}
	});

	// Pre-process the submitter elements to make sure the form is ready for display.
	var temp;
	$j("._form_formelem").each( function(index) { 
		var formelem = $j(this); 
		if ($j(formelem).attr("id") == "tool_submitter") {
			$j.ajax({
				type: "GET",
				url: '/api/core/v3/people/@me',
				dataType: "json",
				success: function (data) {
					$j('#tool_submitter_id_value', formelem).text( data.jive.username );
					$j('#tool_submitter_name_value', formelem).text( data.displayName );
					$j('#tool_submitter_title_value', formelem).text( data.jive.profile[0].value );
					$j('#tool_submitter_bu_value', formelem).text( data.jive.profile[4].value );
					$j('#tool_submitter_email_value', formelem).text( data.emails[0].value );
					$j('#tool_submitter_phone_value', formelem).text( data.phoneNumbers[0].value );
				},
				error: function (xhr, ajaxOptions, thrownError){
					alert( 'error: ' + thrownError);
				},
				complete: function(){
				}
			});
		} else if ($j(formelem).attr("id") == "tool_date") {
			if ($j('#tool_date_type', formelem).text() == "current") {
				var currentdate = new Date(); 
				$j('#tool_date_current', formelem).text(pad((currentdate.getMonth()+1),2) + '/' + pad(currentdate.getDate(),2) + '/' + currentdate.getFullYear());
			}
		}
	});

	// There will only be one category section at the bottom of the form.
	// This checks if the form is set up for selection of categories at submit time.  If it is then
	// this code will look up the current categories and create the proper select element.
	if ( $j('#_form_formcategory_type').text() == 'single' || $j('#_form_formcategory_type').text() == 'multiple') {
		var categoryURL = '/api/core/v3/places/' + $j('#_form_formdestination_ID').text() + '/categories';
		$j.ajax({
			type: "GET",
			url: categoryURL,
			dataType: "json",
			success: function (data) {
				var opts = '	<label id="_form_formcategory_label" class="col-xs-3 control-label">Select Category</label>'
						 + '	<div class="col-xs-9">'
						 + '		<select id="_form_formcategory_options" name="category_options" class="input-xlarge form-control"';
				if ( $j('#_form_formcategory_type').text() == 'multiple' ) opts += ' multiple="multiple"';
				opts += '>';
				if(data.list.length){
					$j(data.list).each(function(index, opt){ 
						opts += '<option>' + data.list[index].name + '</option>';
					});
				}
				opts 	+= '		</select>'
						 + '	</div>';
				$j('#_form_category').html(opts);
				setTimeout(resizeMe, 100);
			},
			error: function (xhr, ajaxOptions, thrownError){
				alert('init error: ' + thrownError);
			},
			complete: function(){
			}
		});
	}
});