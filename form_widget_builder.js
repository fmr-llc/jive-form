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

DESCRIPTION
This Jive HTML widget allows users to build forms via a drag & drop interface.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';
var parentWindow = window.parent.document;
var parentIframe = $j("iframe",parentWindow);
var formname = "Form name";
var formNameSet = false;
var formdestination = "";
var formdestinationText = "";
var formDestinationSet = false;
var baseURL = '';
var searchString = 'jive.global.containerBrowseId = ';
var titleString = '<title>';
var IEVersion;
var editelem;
var blankelem;
var blankAtEnd = true;
var editX, editY;
var origToolHeight;
var siblingElem = null;
var changesMade = false;

// Put the initialized form in a variable, so it can be reset easily.
var blankDesign = "<div id='_form_formname' class='_form_formheader _form_element_notset'>"
				+ "	<div id='_form_formname_title'>"
				+ "		<div class='form-group'>"
				+ "			<legend id='_form_formname_text' class='col-xs-12'>Form name</legend><br/>"
				+ "		</div>"
				+ "		<div class='tool_set_as_title form-group' style='display:none;'>"
				+ "			<label class='col-xs-3 control-label'></label>"
				+ "			<label class='col-xs-9'>Set as title&nbsp;<input id='tool_set_as_title_checkbox' type='checkbox' value='Yes' checked></label>"
				+ "		</div>"
				+ "	</div>"
				+ "</div>"
				+ "<div id='_form_form_fields'>"
				+ "	<div id='_form_blank' class='_form_blank _form_formelem_remove'>Drag Toolbox Element Here</div>"
				+ "	<div id='_form_form_fields_end'>"
				+ "		<span id='_elemcount_submitter' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_personselector' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_textblock' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_input' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_textarea' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_radio' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_checkbox' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_singleselect' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_multiselect' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_date' style='display: none;'>0</span>"
				+ "		<span id='_elemcount_attachment' style='display: none;'>0</span>"
				+ "	</div>"
				+ "</div>"
				+ "<div id='_form_submit' class='_form_formfooter _form_element_notset'>"
   				+ "	<div id='_form_category' class='form-group'></div>"
				+ "	<div id='_form_formdestination' class='form-group'>"
				+ "		<div class='col-xs-3'></div>"
				+ "		<div class='col-xs-2'>"
				+ "			<button id='_form_formdestination_submit' name='_form_formdestination_submit' class='btn btn-default' onclick='_form_submitForm()' disabled>Submit</button>"
				+ "		</div>"
				+ "		<div class='col-xs-6'>"
				+ "			<label id='_form_formdestination_location_label' class='_form_formelem_remove control-label'>Destination: </label>"
				+ "			<span id='_form_formdestination_location' class='_form_formelem_remove'>Click to set form destination</span><br/>"
				+ "			<label id='_form_formdestination_category_label' class='_form_formelem_remove control-label'>Category: </label>"
				+ "			<span id='_form_formdestination_category' class='_form_formelem_remove'>-</span><br/>"
				+ "			<label id='_form_formdestination_tags_label' class='_form_formelem_remove control-label'>Tags: </label>"
				+ "			<span id='_form_formdestination_tags' class='_form_formelem_remove'>-</span>"
				+ "			<span id='_form_formdestination_submitURL' style='display: none;'>Y</span>"
				+ "			<span id='_form_formdestination_URL' style='display: none;'></span>"
				+ "			<span id='_form_formdestination_ID' style='display: none;'></span>"
				+ "			<span id='_form_formdestination_submitemail' style='display: none;'>N</span>"
				+ "			<span id='_form_formdestination_email' style='display: none;'></span>"
				+ "		</div>"
				+ "	</div>"
				+ "	<div id='_form_form_URL_info' style='display:none;'>"
				+ "		<div id='_form_formcategory' class='form-group'>"
				+ "			<label id='_form_formcategory_label' class='col-xs-3 control-label _form_formelem_remove'>Category:</label>"
				+ "			<label id='_form_formcategory_value' class='col-xs-9 _form_formelem_remove'>Not Set</label>"
				+ "			<label id='_form_formcategory_type' style='display:none;'></label>"
				+ "			<label id='_form_formcategory_category' style='display:none;'></label>"
				+ "			<label id='_form_email_label' class='col-xs-3 control-label _form_formelem_remove'>Email:</label>"
				+ "			<label id='_form_email_value' class='col-xs-9'></label>"
				+ "		</div>"
				+ "		<div id='_form_formtags' class='form-group'>"
				+ "			<label id='_form_tags_label' class='col-xs-3 control-label _form_formelem_remove'>Tags:</label>"
				+ "			<label id='_form_tags_value' class='col-xs-9 _form_formelem_remove'>Not Set</label>"
				+ "			<label id='_form_tags' style='display:none;'></label>"
				+ "		</div>"
				+ "	</div>"
				+ "	<label id='_form_color_scheme' style='display:none;'></label>"
				+ "</div>"
				+ "<div class='_form_formcontrols'>"
				+ "	<button id='_form_formcontrols_save' name='_form_formcontrols_save' class='btn btn-default _form_formcontrols_button' onclick='_form_saveCode();'>Save Form</button>"
				+ "	<button id='_form_formcontrols_load' name='_form_formcontrols_load' class='btn btn-default _form_formcontrols_button' onclick='_form_load_designs();'>Load Form</button>"
				+ "	<button id='_form_formcontrols_showcode' name='_form_formcontrols_showcode' class='btn btn-default _form_formcontrols_button' onclick='_form_select_color();' disabled>Show Code</button>"
				+ "	<button id='_form_formcontrols_startover' name='_form_formcontrols_startover' class='btn btn-default _form_formcontrols_button' onclick='_form_startOver();'>Start Over</button>"
				+ "</div>";

var toolRequired= "	<div class='tool_required form-group' style='display:none;'>"
				+ "		<label class='col-xs-3 control-label'></label>"
				+ "		<label class='col-xs-9'>Required&nbsp;<input id='tool_required_checkbox' type='checkbox' value='Required'></label>"
				+ "	</div>";

var toolSetAsTitle= " <div class='tool_set_as_title form-group' style='display:none;'>"
				+ "		<label class='col-xs-3 control-label'></label>"
				+ "		<label class='col-xs-9'>Set as title&nbsp;<input id='tool_set_as_title_checkbox' type='checkbox' value='Yes'></label>"
				+ "		<span title='All documents must have a unique name. When your form is posted, it will use this as the name of the form and append the timestamp it was created to make the name unique.'>?</span>"
				+ "	</div>";

var designIndex = 0;
var designCount = 0;
var designMax = 10;

/*
 * Jive AJAX JSON return packets will all have a first line that makes it an invalid.  This must be stripped off.
 */
jQuery.ajaxSetup({
	dataFilter: function(data, type) {
		return type === 'json' ? jQuery.trim(data.replace(/^throw [^;]*;/, '')) : data;
	}
});

/*
 * Large forms can cause the screen to return to the top of the screen on a resize.  This causes a lot of confusion.
 * This function controls the resize and returns the screen position to where it was.
 */
function resizeForm() {
		var scrolltop = $j(parentWindow).scrollTop();
	resizeMe();
	$j(parentWindow).scrollTop(scrolltop);
}


function messageIn(msg, style) {
	$j('.j-alert-container', parentWindow).html('<div class="j-alert j-rc5 j-alert-' + style + ' clearfix j-alert-withbutton" style="bottom: 0px; display: block; opacity: 1; font-size: 16px;"><p>' + msg + '</p></div>').fadeIn(500);
	setTimeout(messageOut, 5000);
}

function messageOut() {
	$j('.j-alert-container', parentWindow).fadeOut(3000);
}

function formError(error_text) {
	$j('#_form_error_dialog_message').text(error_text);
	$j('#_form_error_dialog').show();
	resizeForm();
}

function _form_error_dismiss() {
	$j('#_form_error_dialog').hide();
}

/*
 * Hide all edit frames.
 */
function formEditHideAll() {
	$j('#editbox_formname').hide();
	$j('#editbox_destination').hide();
	$j('#editbox_person').hide();
	$j('#editbox_textblock').hide();
	$j('#editbox_input').hide();
	$j('#editbox_options').hide();
	$j('#editbox_date').hide();
	$j('#editbox_category').hide();
}

















/*
 * Copy the name information into the formname edit frame and display it.
 */
function formNameEdit() {
	$j('#editbox_title').text('Edit Form Name');
	if ( $j('#_form_formname_text', editelem).text() != 'Form name' ) {
		$j('#editbox_formname_input').val( $j('#_form_formname_text',editelem).text() );
	} else {
		$j('#editbox_formname_input').val('');
	}
	if ( $j('#tool_set_as_title_checkbox', editelem).prop('checked') ) {
		clearSetAsTitle();
		$j('#editbox_formname_set_as_title_checkbox').prop('checked', true);
		$j('#editbox_formname_set_as_title_checkbox').prop('disabled',true);
	} else {
		$j('#editbox_formname_set_as_title_checkbox').prop('checked', false);
		$j('#editbox_formname_set_as_title_checkbox').prop('disabled',false);
	}
	$j('#editbox_formname').show();
	$j('#editbox_formname_input').keydown( function(e){
		if (e.which === 222) return false;
		return true;
	});
	$j('#editbox_formname_input').focus();
}

/*
 * Copy the submitter tool information into the submitter edit frame and display it.
 */
function formSubmitterEdit() {
	$j('#editbox_title').text('Edit Submitter Information');
	//$j('#editbox_person_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_person_heading').val( $j('#tool_label',editelem).text() );
	if ( $j('#tool_submitter_id_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_id').prop('checked', true);
	} else {
		$j('#editbox_person_options_id').prop('checked', false);
	}
	if ( $j('#tool_submitter_name_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_name').prop('checked', true);
	} else {
		$j('#editbox_person_options_name').prop('checked', false);
	}
	if ( $j('#tool_submitter_title_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_title').prop('checked', true);
	} else {
		$j('#editbox_person_options_title').prop('checked', false);
	}
	if ( $j('#tool_submitter_bu_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_bu').prop('checked', true);
	} else {
		$j('#editbox_person_options_bu').prop('checked', false);
	}
	if ( $j('#tool_submitter_email_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_email').prop('checked', true);
	} else {
		$j('#editbox_person_options_email').prop('checked', false);
	}
	if ( $j('#tool_submitter_phone_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_phone').prop('checked', true);
	} else {
		$j('#editbox_person_options_phone').prop('checked', false);
	}
	$j('#editbox_person_required').hide();
	$j('#editbox_person_options').show();
	$j('#editbox_person_submitter').show();
	$j('#editbox_person_selector').hide();
	$j('#editbox_person').show();
}

/*
 * Copy the person selector tool information into the person selector edit frame and display it.
 */
function formPersonSelectorEdit() {
	$j('#editbox_title').text('Edit Person Selector Information');
	//$j('#editbox_person_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_person_selector_label').val( $j('#tool_personselector_search_label',editelem).text() );
	$j('#editbox_person_selector_placeholder').val( $j('#tool_personselector_search_input',editelem).attr('placeholder') );
	$j('#editbox_person_heading').val( $j('#tool_personselector_heading_label', editelem).text() );
	if ( $j('#tool_personselector_id_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_id').prop('checked', true);
	} else {
		$j('#editbox_person_options_id').prop('checked', false);
	}
	if ( $j('#tool_personselector_name_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_name').prop('checked', true);
	} else {
		$j('#editbox_person_options_name').prop('checked', false);
	}
	if ( $j('#tool_personselector_title_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_title').prop('checked', true);
	} else {
		$j('#editbox_person_options_title').prop('checked', false);
	}
	if ( $j('#tool_personselector_bu_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_bu').prop('checked', true);
	} else {
		$j('#editbox_person_options_bu').prop('checked', false);
	}
	if ( $j('#tool_personselector_email_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_email').prop('checked', true);
	} else {
		$j('#editbox_person_options_email').prop('checked', false);
	}
	if ( $j('#tool_personselector_phone_enable', editelem).text() == 'Yes' ) {
		$j('#editbox_person_options_phone').prop('checked', true);
	} else {
		$j('#editbox_person_options_phone').prop('checked', false);
	}
	$j('#editbox_person_required').show();
	if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
		$j('#editbox_person_required_checkbox').prop('checked', true);
	} else {
		$j('#editbox_person_required_checkbox').prop('checked', false);
	}
	$j('#editbox_person_options').show();
	$j('#editbox_person_submitter').hide();
	$j('#editbox_person_selector').show();
	$j('#editbox_person').show();
	$j('#editbox_person_selector_label').focus();
}

/*
 * Copy the textblock tool information into the textblock edit frame and display it.
 */
function formTextBlockEdit() {
	$j('#editbox_title').text('Edit Text Block');
	$j('#editbox_textblock_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_textblock_URL').val( $j('#tool_textblock_URL',editelem).text() );
	if ( $j('#tool_textblock_include',editelem).text() == 'Yes') {
		$j('#editbox_textblock_include').prop('checked', true);
	} else {
		$j('#editbox_textblock_include').prop('checked', false);
	}
	$j('#editbox_textblock').show();
	$j('#editbox_textblock_label').focus();
}

/*
 * Copy the input tool information into the input edit frame and display it.
 */
function formInputEdit() {
	$j('#editbox_title').text('Edit Text Input');
	//$j('#editbox_input_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_input_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_input_placeholder').val( $j('#tool_input_input',editelem).attr('placeholder') );
	if ( $j('#tool_set_as_title_checkbox', editelem).prop('checked') ) {
		$j('#editbox_input_set_as_title_checkbox').prop('checked', true);
		$j('#editbox_input_set_as_title_checkbox').prop('disabled',true);
		$j('#editbox_input_required_checkbox').prop('checked', true);
		$j('#editbox_input_required_checkbox').prop('disabled',true);
	} else {
		$j('#editbox_input_set_as_title_checkbox').prop('checked', false);
		$j('#editbox_input_set_as_title_checkbox').prop('disabled',false);
		$j('#editbox_input_required_checkbox').prop('disabled',false);
		if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
			$j('#editbox_input_required_checkbox').prop('checked', true);
		} else {
			$j('#editbox_input_required_checkbox').prop('checked', false);
		}
	}
	$j('#editbox_input_set_as_title').show();
	$j('#editbox_input').show();
	$j('#editbox_input_label').focus();
}

/*
 * Copy the textarea tool information into the input edit frame and display it.
 */
function formTextAreaEdit() {
	$j('#editbox_title').text('Edit Text Area');
	//$j('#editbox_input_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_input_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_input_placeholder').val( $j('#tool_textarea_textarea',editelem).attr('placeholder') );
	if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
		$j('#editbox_input_required_checkbox').prop('checked', true);
	} else {
		$j('#editbox_input_required_checkbox').prop('checked', false);
	}
	$j('#editbox_input_set_as_title').hide();
	$j('#editbox_input').show();
	$j('#editbox_input_label').focus();
}

/*
 * Copy the radio tool information into the options edit frame and display it.
 */
function formRadioEdit() {
	$j('#editbox_title').text('Edit Radio Buttons');
	//$j('#editbox_options_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_options_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_options_options').val( $j('#tool_radio_option_text',editelem).text() );
 	$j('#editbox_options_optionlist').show();
	if ( $j('#tool_set_as_title_checkbox', editelem).prop('checked') ) {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', true);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',true);
		$j('#editbox_options_required_checkbox').prop('checked', true);
		$j('#editbox_options_required_checkbox').prop('disabled',true);
	} else {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', false);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',false);
		$j('#editbox_options_required_checkbox').prop('disabled',false);
		if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
			$j('#editbox_options_required_checkbox').prop('checked', true);
		} else {
			$j('#editbox_options_required_checkbox').prop('checked', false);
		}
	}
	$j('#editbox_options_set_as_title').show();
	$j('#editbox_options').show();
	$j('#editbox_options_label').focus();
}

/*
 * Copy the checkbox tool information into the options edit frame and display it.
 */
function formCheckboxEdit() {
	$j('#editbox_title').text('Edit Checkboxes');
	//$j('#editbox_options_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_options_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_options_options').val( $j('#tool_checkbox_option_text',editelem).text() );
 	$j('#editbox_options_optionlist').show();
	if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
		$j('#editbox_options_required_checkbox').prop('checked', true);
	} else {
		$j('#editbox_options_required_checkbox').prop('checked', false);
	}
	$j('#editbox_options_set_as_title').hide();
	$j('#editbox_options').show();
	$j('#editbox_options_label').focus();
}

/*
 * Copy the single select tool information into the options edit frame and display it.
 */
function formSingleSelectEdit() {
	$j('#editbox_title').text('Edit Single Select');
	//$j('#editbox_options_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_options_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_options_options').val( $j('#tool_singleselect_option_text',editelem).text() );
 	$j('#editbox_options_optionlist').show();
	if ( $j('#tool_set_as_title_checkbox', editelem).prop('checked') ) {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', true);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',true);
		$j('#editbox_options_required_checkbox').prop('checked', true);
		$j('#editbox_options_required_checkbox').prop('disabled',true);
	} else {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', false);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',false);
		$j('#editbox_options_required_checkbox').prop('disabled',false);
		if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
			$j('#editbox_options_required_checkbox').prop('checked', true);
		} else {
			$j('#editbox_options_required_checkbox').prop('checked', false);
		}
	}
	$j('#editbox_options_set_as_title').show();
	$j('#editbox_options').show();
	$j('#editbox_options_label').focus();
}

/*
 * Copy the multi-select tool information into the options edit frame and display it.
 */
function formMultiSelectEdit() {
	$j('#editbox_title').text('Edit Multi Select');
	//$j('#editbox_options_id').val( $j('#tool_id',editelem).text() );
	$j('#editbox_options_label').val( $j('#tool_label',editelem).text() );
	$j('#editbox_options_options').val( $j('#tool_multiselect_option_text',editelem).text() );
 	$j('#editbox_options_optionlist').show();
	if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
		$j('#editbox_options_required_checkbox').prop('checked', true);
	} else {
		$j('#editbox_options_required_checkbox').prop('checked', false);
	}
	$j('#editbox_options_set_as_title').hide();
	$j('#editbox_options').show();
	$j('#editbox_options_label').focus();
}

/*
 * Copy the date tool information into the date edit frame and display it.
 */
function formDateEdit() {
	$j('#editbox_title').text('Edit date');
	//$j('#editbox_date_id_input').val( $j('#tool_id',editelem).text() );
	$j('#editbox_date_label_input').val( $j('#tool_label',editelem).text() );
	if ( $j('#tool_date_type', editelem).text() == 'current' ) {
		$j('#editbox_date_option_current').prop('checked', true);
		$j('#editbox_date_required').hide();
	} else {
		$j('#editbox_date_option_entry').prop('checked', true);
		$j('#editbox_date_required').show();
	}
	if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
		$j('#editbox_date_required_checkbox').prop('checked', true);
	} else {
		$j('#editbox_date_required_checkbox').prop('checked', false);
	}

	$j('#editbox_date_option_current').change( function(e){
		if ($j('#editbox_date_option_current').prop('checked')) {
			$j('#editbox_date_required').hide();
		} else {
			$j('#editbox_date_required').show();
		}
		formEditReposition();
	});
	$j('#editbox_date_option_entry').change( function(e){
		if ($j('#editbox_date_option_current').prop('checked')) {
			$j('#editbox_date_required').hide();
		} else {
			$j('#editbox_date_required').show();
		}
		formEditReposition();
	});

	$j('#editbox_date').show();
	$j('#editbox_date_label_input').focus();
}

/* 
 * Copy the name from the edit frame info into the attach tool
 * [ab]
 */
 function formAttachmentEdit() {
 	$j('#editbox_title').text('Edit Attachment');
 	$j('#editbox_options_id').val( $j('#tool_id',editelem).text() );
 	$j('#editbox_options_label').val( $j('#tool_label',editelem).text() );
 	$j('#editbox_options_optionlist').hide();
	if ( $j('#tool_set_as_title_checkbox', editelem).prop('checked') ) {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', true);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',true);
		$j('#editbox_options_required_checkbox').prop('checked', true);
		$j('#editbox_options_required_checkbox').prop('disabled',true);
	} else {
		$j('#editbox_options_set_as_title_checkbox').prop('checked', false);
		$j('#editbox_options_set_as_title_checkbox').prop('disabled',false);
		if ( $j('#tool_required_checkbox', editelem).prop('checked') ) {
			$j('#editbox_options_required_checkbox').prop('checked', true);
		} else {
			$j('#editbox_options_required_checkbox').prop('checked', false);
		}
		$j('#editbox_options_required_checkbox').prop('disabled',false);
	}
 	$j('#editbox_options').show();
 	$j('#editbox_options_id').focus();
 }

/*
 * Copy the destination information into the destination edit frame and display it.
 */
function formDestinationEdit() {
	$j('#editbox_title').text('Enter Form Destination');
	$j('#editbox_destination_input').val( $j('#_form_formdestination_URL',editelem).text() );
	$j('#editbox_destination').show();

	if ( $j('#_form_formdestination_submitURL').text() != 'Y' ) {
		$j('#editbox_destination_URL_chk').prop('checked', false);
		$j('#editbox_destination_URL_frame').hide();
	} else {
		$j('#editbox_destination_URL_chk').prop('checked', true);
		$j('#editbox_destination_URL_frame').show();
		toggleFormDestinationOKButton();
		$j('#editbox_destination_input').focus();
	}
	$j('#editbox_destination_URL_chk').change( function(e){
		if ($j('#editbox_destination_URL_chk').prop('checked')) {
			$j('#editbox_destination_URL_frame').show();
		} else {
			$j('#editbox_destination_URL_frame').hide();
		}
		formEditReposition();
	});

	if ( $j('#_form_formdestination_submitemail').text() != 'Y' ) {
		$j('#editbox_destination_email_chk').prop('checked', false);
		$j('#editbox_destination_email_frame').hide();
	} else {
		$j('#editbox_destination_email_chk').prop('checked', true);
		$j('#editbox_destination_email_frame').show();
		toggleFormDestinationOKButton();
	}
	$j('#editbox_destination_email_chk').change( function(e){
		if ($j('#editbox_destination_email_chk').prop('checked')) {
			$j('#editbox_destination_email_frame').show();
		} else {
			$j('#editbox_destination_email_frame').hide();
		}
		formEditReposition();
	});

	/*
	if ( $j('#_form_formdestination_submitrefresh', editelem).text() == 'Y' ) {
		$j('#editbox_destination_submitrefresh').prop('checked', true);
	} else {
		$j('#editbox_destination_submitrefresh').prop('checked', false);
	}
	*/
	formEditReposition();
}

/*
 * User has clicked in a form element.  Perform the edit function on it.
 */
function formEdit(elem) {
	// Save the element into editelem for later use.
	editelem = elem;

	// Hide all edit frames.
	formEditHideAll();
	$j( "#editbox_editframe" ).show();

	// Make the toolbox fade.
	$j('#_form_toolbox').addClass('toolbox_background');

	// Display the edit frame and call the function to handle the type of field clicked.
	$j('#_form_editbox').show();
	$j('#editbox_OK').prop('disabled', false);
	var elem_type = $j(editelem).attr("id");
	if (elem_type == "_form_formname"){
		formNameEdit();
	} else if (elem_type == "_form_submit"){
		formDestinationEdit();
	} else if (elem_type == "tool_submitter"){
		formSubmitterEdit();
	} else if (elem_type == "tool_personselector"){
		formPersonSelectorEdit();
	} else if (elem_type == "tool_textblock"){
		formTextBlockEdit();
	} else if (elem_type == "tool_input"){
		formInputEdit();
	} else if (elem_type == "tool_textarea"){
		formTextAreaEdit();
	} else if (elem_type == "tool_radio"){
		formRadioEdit();
	} else if (elem_type == "tool_checkbox"){
		formCheckboxEdit();
	} else if (elem_type == "tool_singleselect"){
		formSingleSelectEdit();
	} else if (elem_type == "tool_multiselect"){
		formMultiSelectEdit();
	} else if (elem_type == "tool_date"){
		formDateEdit();
	} else if (elem_type == "tool_attachment") {
		formAttachmentEdit();
	}
	// Once the edit box is opened and positioned, activate the resize.
	formEditReposition();
}

/*
 * Position the edit box (and left pointer) elements beside element being edited.
 */
function formEditReposition() {
	var editTop = $j(editelem).position().top + ($j(editelem).height() / 2) - ($j('#_form_editbox').height() / 2);
	var editDiff = 0;
	if (editTop < 0) {
		editDiff = -editTop;
		editTop = 0;
	}
	$j('#_form_editbox').css({ 'top': editTop })
						.show();
	var pos = $j('.editbox_frame').position();
	$j('.editbox_pointer').css({ 'left': pos.left - 20 })
						  .css({ 'top': ($j('.editbox_frame').height() / 2) - editDiff });
	resizeForm();
}



















/*
 * Copy the name edit frame information into the name tool.
 */
function formNameUpdate() {
	var temp = $j('#editbox_formname_input').val().trim();
	if (temp.length > 0){
		formname = temp;
		$j('#_form_formname').removeClass('_form_element_notset');
	}else{
		formname = "Form name";
		$j('#_form_formname').removeClass('_form_element_notset');
		$j('#_form_formname').addClass('_form_element_notset');
	}
	$j('#_form_formname_text').text(formname);
	if ( $j('#editbox_formname_set_as_title_checkbox').prop('checked') ) {
		clearSetAsTitle();
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', false);
	}
}

/*
 * Copy the submitter edit frame information into the submitter tool.
 */
function formSubmitterUpdate() {
	// If none of the fields are selected, display message to user and exit.
	if ( ! $j('#editbox_person_options_id').prop('checked') &&
		 ! $j('#editbox_person_options_name').prop('checked') &&
		 ! $j('#editbox_person_options_title').prop('checked') &&
		 ! $j('#editbox_person_options_bu').prop('checked') &&
		 ! $j('#editbox_person_options_email').prop('checked') &&
		 ! $j('#editbox_person_options_phone').prop('checked') ) {
		alert('You must select at least one of the submitter\'s fields to display.');
		return false;
	}

	$j('#tool_label',editelem).text( $j('#editbox_person_heading').val() );
	if ( $j('#editbox_person_heading').val() != '' ) {
		$j('#tool_label', editelem).show();
		$j('#tool_label', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_label', editelem).hide();
		$j('#tool_label', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_id').prop('checked') ) {
		$j('#tool_submitter_id_enable', editelem).text('Yes');
		$j('#tool_submitter_id', editelem).show();
		$j('#tool_submitter_id', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_id_enable', editelem).text('No');
		$j('#tool_submitter_id', editelem).hide();
		$j('#tool_submitter_id', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_name').prop('checked') ) {
		$j('#tool_submitter_name_enable', editelem).text('Yes');
		$j('#tool_submitter_name', editelem).show();
		$j('#tool_submitter_name', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_name_enable', editelem).text('No');
		$j('#tool_submitter_name', editelem).hide();
		$j('#tool_submitter_name', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_title').prop('checked') ) {
		$j('#tool_submitter_title_enable', editelem).text('Yes');
		$j('#tool_submitter_title', editelem).show();
		$j('#tool_submitter_title', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_title_enable', editelem).text('No');
		$j('#tool_submitter_title', editelem).hide();
		$j('#tool_submitter_title', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_bu').prop('checked') ) {
		$j('#tool_submitter_bu_enable', editelem).text('Yes');
		$j('#tool_submitter_bu', editelem).show();
		$j('#tool_submitter_bu', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_bu_enable', editelem).text('No');
		$j('#tool_submitter_bu', editelem).hide();
		$j('#tool_submitter_bu', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_email').prop('checked') ) {
		$j('#tool_submitter_email_enable', editelem).text('Yes');
		$j('#tool_submitter_email', editelem).show();
		$j('#tool_submitter_email', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_email_enable', editelem).text('No');
		$j('#tool_submitter_email', editelem).hide();
		$j('#tool_submitter_email', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_phone').prop('checked') ) {
		$j('#tool_submitter_phone_enable', editelem).text('Yes');
		$j('#tool_submitter_phone', editelem).show();
		$j('#tool_submitter_phone', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_phone_enable', editelem).text('No');
		$j('#tool_submitter_phone', editelem).hide();
		$j('#tool_submitter_phone', editelem).addClass('_form_formelem_remove');
	}
	$j(editelem).removeClass('_form_element_notset');
	return true;
}

/*
 * Copy the person selector edit frame information into the person selector tool.
 */
function formPersonSelectorUpdate() {
	// If none of the fields are selected, display message to user and exit.
	if ( ! $j('#editbox_person_options_id').prop('checked') &&
		 ! $j('#editbox_person_options_name').prop('checked') &&
		 ! $j('#editbox_person_options_title').prop('checked') &&
		 ! $j('#editbox_person_options_bu').prop('checked') &&
		 ! $j('#editbox_person_options_email').prop('checked') &&
		 ! $j('#editbox_person_options_phone').prop('checked') ) {
		alert('You must select at least one of the person\'s fields to display.');
		return false;
	}

	//$j('#tool_id',editelem).text( $j('#editbox_person_selector_id').val() );
	$j('#tool_personselector_search_label',editelem).text( $j('#editbox_person_selector_label').val() );
	$j('#tool_personselector_search_input',editelem).attr('placeholder', $j('#editbox_person_selector_placeholder').val() );
	$j('#tool_personselector_heading_label', editelem).text( $j('#editbox_person_heading').val() );
	if ( $j('#editbox_person_heading').val() != '' ) {
		$j('#tool_personselector_heading', editelem).show();
		$j('#tool_personselector_heading', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_heading', editelem).hide();
		$j('#tool_personselector_heading', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_id').prop('checked') ) {
		$j('#tool_personselector_id_enable', editelem).text('Yes');
		$j('#tool_personselector_id', editelem).show();
		$j('#tool_personselector_id', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_id_enable', editelem).text('No');
		$j('#tool_personselector_id', editelem).hide();
		$j('#tool_personselector_id', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_name').prop('checked') ) {
		$j('#tool_personselector_name_enable', editelem).text('Yes');
		$j('#tool_personselector_name', editelem).show();
		$j('#tool_personselector_name', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_name_enable', editelem).text('No');
		$j('#tool_personselector_name', editelem).hide();
		$j('#tool_personselector_name', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_title').prop('checked') ) {
		$j('#tool_personselector_title_enable', editelem).text('Yes');
		$j('#tool_personselector_title', editelem).show();
		$j('#tool_personselector_title', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_title_enable', editelem).text('No');
		$j('#tool_personselector_title', editelem).hide();
		$j('#tool_personselector_title', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_bu').prop('checked') ) {
		$j('#tool_personselector_bu_enable', editelem).text('Yes');
		$j('#tool_personselector_bu', editelem).show();
		$j('#tool_personselector_bu', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_bu_enable', editelem).text('No');
		$j('#tool_personselector_bu', editelem).hide();
		$j('#tool_personselector_bu', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_email').prop('checked') ) {
		$j('#tool_personselector_email_enable', editelem).text('Yes');
		$j('#tool_personselector_email', editelem).show();
		$j('#tool_personselector_email', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_email_enable', editelem).text('No');
		$j('#tool_personselector_email', editelem).hide();
		$j('#tool_personselector_email', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_options_phone').prop('checked') ) {
		$j('#tool_personselector_phone_enable', editelem).text('Yes');
		$j('#tool_personselector_phone', editelem).show();
		$j('#tool_personselector_phone', editelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_phone_enable', editelem).text('No');
		$j('#tool_personselector_phone', editelem).hide();
		$j('#tool_personselector_phone', editelem).addClass('_form_formelem_remove');
	}
	if ( $j('#editbox_person_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
	return true;
}

/*
 * Copy the text block edit frame information into the text block tool.
 */
function formTextBlockUpdate() {
	if ( $j('#editbox_textblock_URL').val().replace(/^\s+|\s+$/g, '') == "" ) {
		$j('#tool_label',editelem).text( $j('#editbox_textblock_label').val() );
	} else {
		$j('#tool_label',editelem).html( '<a href=\"' + $j('#editbox_textblock_URL').val() + '\">' + $j('#editbox_textblock_label').val() + '</a>');
	}
	$j('#tool_textblock_URL',editelem).text( $j('#editbox_textblock_URL').val() );
	if ( $j('#editbox_textblock_include').prop('checked') ) {	
		$j('#tool_textblock_include',editelem).text( 'Yes' );
	} else {
		$j('#tool_textblock_include',editelem).text( 'No' );
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the input edit frame information into the input tool.
 */
function formInputUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_input_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_input_label').val() );
	$j('#tool_input_input',editelem).attr('placeholder', $j('#editbox_input_placeholder').val() );
	if ( $j('#editbox_input_set_as_title_checkbox').prop('checked') ) {
		clearSetAsTitle();
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', false);
	}
	if ( $j('#editbox_input_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the text area edit frame information into the text area tool.
 */
function formTextAreaUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_input_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_input_label').val() );
	$j('#tool_textarea_textarea',editelem).attr('placeholder', $j('#editbox_input_placeholder').val() );
	if ( $j('#editbox_input_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the radio button edit frame information into the radio button tool.
 */
function formRadioUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_options_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_options_label').val() );
	$j('#tool_radio_option_text',editelem).text( $j('#editbox_options_options').val() );
	var opts = "";
	var opt_list = $j('#editbox_options_options').val().split('\n');
	$j.each(opt_list, function( index, value ) {
			opts += '<label class="radio-inline" for="' + $j('#tool_id',editelem).text() + '"><input type="radio" name="' + $j('#tool_id',editelem).text() + '" id="' + $j('#tool_id',editelem).text() + '-' + index + '" value="' + value + '">' + value + '</label>';
	});
	$j('#tool_radio_options',editelem).html(opts);
	if ( $j('#editbox_options_set_as_title_checkbox').prop('checked') ) {
		clearSetAsTitle();
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', false);
	}
	if ( $j('#editbox_options_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the checkbox edit frame information into the checkbox tool.
 */
function formCheckboxUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_options_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_options_label').val() );
	$j('#tool_checkbox_option_text',editelem).text( $j('#editbox_options_options').val() );
	var opts = "";
	var opt_list = $j('#editbox_options_options').val().split('\n');
	$j.each(opt_list, function( index, value ) {
			opts += '<label class="checkbox-inline" for="' + $j('#tool_id',editelem).text() + '"><input type="checkbox" name="' + $j('#tool_id',editelem).text() + '" id="' + $j('#tool_id',editelem).text() + '-' + index + '" value="' + value + '">' + value + '</label>';
	});
	$j('#tool_checkbox_options',editelem).html(opts);
	if ( $j('#editbox_options_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the single-select edit frame information into the single-select tool.
 */
function formSingleSelectUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_options_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_options_label').val() );
	$j('#tool_singleselect_option_text',editelem).text( $j('#editbox_options_options').val() );
	var opts = "";
	var opt_list = $j('#editbox_options_options').val().split('\n');
	$j.each(opt_list, function( index, value ) {
			opts += '<option id="' + $j('#tool_id',editelem).text() + '-' + index + '">' + value + '</option>';
	});
	$j('#tool_singleselect_options',editelem).html(opts);
	if ( $j('#editbox_options_set_as_title_checkbox').prop('checked') ) {
		clearSetAsTitle();
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', false);
	}
	if ( $j('#editbox_options_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the multi-select edit frame information into the multi-select tool.
 */
function formMultiSelectUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_options_id').val() );
	$j('#tool_label',editelem).text( $j('#editbox_options_label').val() );
	$j('#tool_multiselect_option_text',editelem).text( $j('#editbox_options_options').val() );
	var opts = "";
	var opt_list = $j('#editbox_options_options').val().split('\n');
	$j.each(opt_list, function( index, value ) {
			opts += '<option id="' + $j('#tool_id',editelem).text() + '-' + index + '">' + value + '</option>';
	});
	$j('#tool_multiselect_options',editelem).html(opts);
	if ( $j('#editbox_options_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the date edit frame information into the date tool.
 */
function formDateUpdate() {
	//$j('#tool_id',editelem).text( $j('#editbox_date_id_input').val() );
	$j('#tool_label',editelem).text( $j('#editbox_date_label_input').val() );
	if ( $j('#editbox_date_option_current').prop('checked') ) {
		$j('#tool_date_type', editelem).text('current');
		$j('.tool_date_input', editelem).addClass('tool_data');
		$j('#tool_date_current', editelem).removeClass('tool_data');
	} else if ( $j('#editbox_date_option_entry').prop('checked') ) {
		$j('#tool_date_type', editelem).text('entry');
		$j('#tool_date_current', editelem).addClass('tool_data');
		$j('.tool_date_input', editelem).removeClass('tool_data');
	}
	if ( $j('#editbox_date_required_checkbox').prop('checked') ) {
		$j('#tool_required_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', editelem).prop('checked', false);
	}
	$j(editelem).removeClass('_form_element_notset');
}

/*
 * Copy the attachment edit frame information into the attachment tool.
 * [ab]
 */
 function formAttachmentUpdate() {
 	//$j('#tool_id',editelem).text( $j('#editbox_options_id').val() );
 	$j('#tool_label',editelem).text( $j('#editbox_options_label').val() );

	if ( $j('#editbox_options_set_as_title_checkbox').prop('checked') ) {
		clearSetAsTitle();
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', editelem).prop('checked', false);
	}

 	if ( $j('#editbox_options_required_checkbox').prop('checked') ) {
 		$j('#tool_required_checkbox', editelem).prop('checked', true);
 	} else {
 		$j('#tool_required_checkbox', editelem).prop('checked', false);
 	}
 	$j(editelem).removeClass('_form_element_notset');
 }	 

/*
 * Look up the entered destination and parse the information for required fields.
 */
function formDestinationUpdate() {
	if ( $j('#editbox_destination_URL_chk').prop('checked') ) {
		if ( ! $j('#editbox_destination_input').val().length ){
			$j('#editbox_destination_status').text('You must enter a destination URL');
			$j('#editbox_destination_status').css({'border-style': 'solid', 'border-color': 'red', 'border-radius': '5px', 'padding': '2px' });	
			return false;
		}
		$j('#_form_formdestination_submitURL').text('Y');
	} else {
		if ( ! $j('#editbox_destination_email_chk').prop('checked') ){
			$j('#editbox_destination_status').text('You must enable at least one destination option');
			$j('#editbox_destination_status').css({'border-style': 'solid', 'border-color': 'red', 'border-radius': '5px', 'padding': '2px' });	
			return false;
		} else {
			$j('#_form_formdestination_location').text('Email only');
		}
	}

	if ($j('#editbox_destination_email_chk').prop('checked')){
		$j('#_form_formdestination_submitemail').text('Y');
		$j('#_form_formdestination_email').text( $j('#editbox_destination_email').val().trim() );
	} else {
		$j('#_form_formdestination_submitemail').text('N');
	}
/*
	if ( $j('#editbox_destination_submitrefresh').prop('checked') ) {
		$j('#_form_formdestination_submitrefresh', editelem).text('Y');
	} else {
		$j('#_form_formdestination_submitrefresh', editelem).text('N');
	}
*/

	$j('#_form_formdestination_location').show();

	if ( ! checkDestination() ) {
		return false;
	}
/*
	} else {
		$j('#_form_formdestination_ID').text('');
		$j('#_form_formdestination_location').hide();
		$j('#_form_form_URL_info').hide();
		hideEditBox();
	}
*/
}

/*
 * Look up the categories for the destination and process accordingly
 */
function checkDestination() {
	if ( ! $j('#editbox_destination_URL_chk').prop('checked') ) {
		$j('#_form_formdestination_submitURL').text('N');
		$j('#_form_submit').removeClass('_form_element_notset');
		hideEditBox();
		return true;
	}
	var ret = false;
	var formDestinationURL = $j('#editbox_destination_input').val().toLowerCase();
	$j('#editbox_destination_input').attr('readonly', true);
	$j('#editbox_destination_status').text('Retrieving your location...');
	$j('#editbox_destination_status').css({'border-style': 'none' });

	// Look up the destination
	$j.ajax({
		type: 'GET',
		url: formDestinationURL,
		dataType: 'html',
		async: false,
		success: function (data) {
			if(data){
				
				var idLocation = data.indexOf(searchString) + searchString.length;
				var titleLocation = data.indexOf(titleString) + titleString.length;
				formdestination = '';
				formdestinationText = '';
				
				if(idLocation != -1){
					
					if(titleLocation != -1){
					
						//get the element between the <title> tags
						formdestinationText += (data.substring(titleLocation, data.indexOf('</title>', titleLocation)));
						
						//remove the ' | [INSTANCE]' from the end of the titles
						formdestinationText = formdestinationText.substring(0,formdestinationText.indexOf(' | '));
					}
					
					//parse out the containerBrowseId 
					formdestination += data.substring(idLocation, data.indexOf(';', idLocation)).replace(/\'/g,'');
					// Update the destination tool information.
					$j('#_form_formdestination_submitURL').text('Y');
					$j('#_form_formcategory_value').text('Not Set');
					$j('#_form_formcategory_type').text( '' );
					$j('#_form_formcategory_category').text( '' );
					$j('#_form_formdestination_URL',editelem).text( formDestinationURL );
					$j('#_form_formdestination_ID').text( formdestination );
					$j('#editbox_destination_status').text('Destination updated to ' + formdestinationText);
					$j('#_form_formdestination_location').text(formdestinationText)
					$j('#_form_submit').removeClass('_form_element_notset');
					$j('#editbox_destination_input').attr('readonly', false);
					ret = checkDestinationCategories();
				}else{
					// invalid location
					$j('#editbox_destination_input').attr('readonly', false);
					$j('#editbox_destination_status').text('No ID Found');
					$j('#editbox_destination_status').css({'border-style': 'solid', 'border-color': 'red', 'border-radius': '5px', 'padding': '2px' });	
					toggleFormDestinationOKButton();
				}
			}
		},
		error: function (xhr, ajaxOptions, thrownError){
			$j('#editbox_destination_input').attr('readonly', false);
			$j('#editbox_destination_status').text('Invalid URL');
			$j('#editbox_destination_status').css({'border-style': 'solid', 'border-color': 'red', 'border-radius': '5px', 'padding': '2px' });	
			toggleFormDestinationOKButton();
		},
		complete: function(){
		}
	});
	return ret;
}

/*
 * Look up the categories for the destination and process accordingly
 */
function checkDestinationCategories() {
	var ret = false;
	var categoryURL = '/api/core/v3/places/' + $j('#_form_formdestination_ID').text() + '/categories';
	$j('#editbox_destination_status').text('Retrieving categories...');
	$j('#editbox_destination_status').css({'border-style': 'none' });
    $j( "#editbox_category_enable" ).hide();
    $j( "#editbox_category_setorselect" ).hide();
    $j( "#editbox_category_set" ).hide();
    $j( "#editbox_category_singleormultiple" ).hide();

	// Look up the categories for the destination.
	$j.ajax({
		type: "GET",
		url: categoryURL,
		dataType: "json",
		success: function (data) {
			if(data.list.length){
				// Destination has categories.
				var opts = "";
				// Parse the categories into the set list.
				$j(data.list).each(function(index, opt){ 
					opts += '<option>' + data.list[index].name + '</option>';
				});
				$j('#editbox_category_set_list').html(opts);
				$j( "#editbox_editframe" ).hide();
				// Prompt the user if the form should be categorized.
				$j( "#editbox_category_enable" ).show();
				$j( "#editbox_category" ).show();
				formEditReposition();
			} else {
				//Destination has no categories.
				$j('#_form_formcategory_value').text('Destination has no categories');
				$j("#editbox_editframe").hide();
				$j('#editbox_tags').show();
				$j("#editbox_category").show();
			}
		},
		error: function (xhr, ajaxOptions, thrownError){
			alert( 'error: ' + thrownError);
		},
		complete: function(){
		}
	});
	$j('#editbox_destination_status').text('');
	return ret;
}

/*
 * User selected to enable categories.
 */
function enableCategory() {
	$j( "#editbox_category_enable" ).hide();
	formEditReposition();
	$j( "#editbox_category_setorselect" ).show();
}

/*
 * User selected to not enable categories.
 */
function removeCategory() {
	$j( "#editbox_category_enable" ).hide();
	categoryDone( '', '' );
}

/*
 * Prompt user whether to set or select categories.
 */
function setOrSelectCategoryCancel() {
	$j( "#editbox_category_setorselect" ).hide();
	$j( "#editbox_category_enable" ).show();
}

/*
 * User selected to set category.
 */
function setCategory() {
	$j( "#editbox_category_setorselect" ).hide();
	formEditReposition();
	$j( "#editbox_category_set" ).show();
}

/*
 * Set the category to the selected list item.
 */
function setCategoryOK() {
	$j("#editbox_category_set").hide();
	$j('#editbox_category_set_list option:selected').each(function(index, opt){
		categoryDone( 'set', $j(this).val() );
	}); 
}

/*
 * User cancelled the set category.
 */
function setCategoryCancel() {
	$j( "#editbox_category_set" ).hide();
	formEditReposition();
	$j( "#editbox_category_setorselect" ).show();
}

/*
 * User selected to select category.
 */
function selectCategory() {
	$j( "#editbox_category_setorselect" ).hide();
	formEditReposition();
	$j( "#editbox_category_singleormultiple" ).show();
}

/*
 * User selected to single select category.
 */
function singleCategory() {
	$j( "#editbox_category_singleormultiple" ).hide();
	categoryDone( 'single', '' );
}

/*
 * User selected to multiple select categories.
 */
function multipleCategory() {
	$j( "#editbox_category_singleormultiple" ).hide();
	categoryDone( 'multiple', '' );
}

/*
 * User cancelled the selection type.
 */
function singleOrMultipleCategoryCancel() {
	$j( "#editbox_category_singleormultiple" ).hide();
	formEditReposition();
	$j( "#editbox_category_setorselect" ).show();
}

/*
 * Copy the category information into the destination tool.
 */
function categoryDone(type, cat) {
	if (type != "" ) {
		$j('#_form_formcategory_type').text( type );
		$j('#_form_formcategory_category').text( cat );
		categoryUpdateLabel(type, cat);
	} else {
		$j('#_form_formcategory_value').text('None');
		$j('#_form_formcategory_type').text( '' );
		$j('#_form_formcategory_category').text( '' );
		$j('#_form_formdestination_category').text('-');
	}
	checkDestinationTags();
}

function categoryUpdateLabel(type, category) {
	if (type == 'set') {
		$j('#_form_formcategory_value').text(category);
		$j('#_form_formdestination_category').text(category);
	} else if (type == 'single') {
		$j('#_form_formcategory_value').text('The user will have to single-select from the available categories on the destination form');
		$j('#_form_formdestination_category').text('Single-Select');
	} else if (type == 'multiple') {
		$j('#_form_formcategory_value').text('The user will be able to multi-select from the available categories on the destination form');
		$j('#_form_formdestination_category').text('Multi-Select');
	}
}

function checkDestinationTags() {
	$j('#editbox_tags_input' ).val( $j('#_form_tags').text() );
	$j('#editbox_tags').show();
	formEditReposition();
}

/*
 * Set the tags to the entered list.
 */
function setTagsDone() {
	$j( '#editbox_tags' ).hide();
	tagsUpdateLabel( $j('#editbox_tags_input' ).val().trim() );
	$j('#editbox_category').hide();
	$j('#editbox_editframe').show();
	hideEditBox();
	check_form_formcontrols_showcode();
}

function tagsUpdateLabel(tags) {
	$j('#_form_tags').text( tags );
	if ( tags == "" ) {
		$j('#_form_formdestination_tags').text('-');
		$j('#_form_tags_value').text( 'None' );
	} else {
		$j('#_form_formdestination_tags').text(tags);
		$j('#_form_tags_value').text( tags );
	}
}

/*
 * Edit is complete, so process the information.
 */
function formUpdate() {
	var elem_type = $j(editelem).attr("id");
	if (elem_type == "_form_formname"){
		formNameUpdate();
	} else if (elem_type == "_form_submit"){
		if ( ! formDestinationUpdate() ) return false;
	} else if (elem_type == "tool_submitter"){
		if ( ! formSubmitterUpdate() ) return false;
	} else if (elem_type == "tool_personselector"){
		if ( ! formPersonSelectorUpdate() ) return false;
	} else if (elem_type == "tool_textblock"){
		formTextBlockUpdate();
	} else if (elem_type == "tool_input"){
		formInputUpdate();
	} else if (elem_type == "tool_textarea"){
		formTextAreaUpdate();
	} else if (elem_type == "tool_radio"){
		formRadioUpdate();
	} else if (elem_type == "tool_checkbox"){
		formCheckboxUpdate();
	} else if (elem_type == "tool_singleselect"){
		formSingleSelectUpdate();
	} else if (elem_type == "tool_multiselect"){
		formMultiSelectUpdate();
	} else if (elem_type == "tool_date"){
		formDateUpdate();
 	} else if (elem_type == "tool_attachment") {
 		formAttachmentUpdate();
	}
	changesMade = true;
	hideEditBox();
	check_form_formcontrols_showcode();
}

/*
 * Hide the edit box, put the toolbox back in the foreground, and resize the widget.
 */
function hideEditBox() {
	$j('#_form_editbox').hide();
	$j('#_form_toolbox').removeClass('toolbox_background');
	resizeForm();
}

/*
 * If any form elements are not set, disable show code.
 */
function check_form_formcontrols_showcode() {
	if ($j('#_form_form ._form_element_notset').length) {
		$j('#_form_formcontrols_showcode').prop('disabled', true);
	} else {
		$j('#_form_formcontrols_showcode').prop('disabled', false);
	}
}

function clearSetAsTitle() {
	$j.each($j('#_form_form #tool_set_as_title_checkbox'), function( index, elem ) {
		$j(elem).prop('checked', false);
	});
}

















/*
 * Format the submitter tool for saving.
 */
function _form_save_submitter(submitter) {
	var submitter_code	= '{ "type":"submitter",'
						+ ' "id":"' + $j('#tool_id',submitter).text() + '",'
						+ ' "label":"' + $j('#tool_label',submitter).text() + '",'
						+ ' "option_id":"';
	if ( $j('#tool_submitter_id_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "option_name":"';
	if ( $j('#tool_submitter_name_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "option_title":"';
	if ( $j('#tool_submitter_title_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "option_bu":"';
	if ( $j('#tool_submitter_bu_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "option_email":"';
	if ( $j('#tool_submitter_email_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "option_phone":"';
	if ( $j('#tool_submitter_phone_enable', submitter).text() == 'Yes' ) {
		submitter_code += "Y";
	} else {
		submitter_code += "N";
	}
	submitter_code += '", "set":"';
	if ( $j(submitter).hasClass('_form_element_notset') ) {
		submitter_code += "N";
	} else {
		submitter_code += "Y";
	}
	submitter_code += '"}';
	return submitter_code;
}

/*
 * Format the personselector tool for saving.
 */
function _form_save_personselector(personselector) {
	var personselector_code = '{ "type":"personselector",'
							+ ' "id":"' + $j('#tool_id',personselector).text() + '",'
							+ ' "label":"' + $j('#tool_personselector_search_label',personselector).text() + '",'
							+ ' "placeholder":"' + $j('#tool_personselector_search_input',personselector).attr('placeholder') + '",'
							+ ' "heading":"' + $j('#tool_personselector_heading_label', personselector).text() + '",'
							+ ' "option_id":"';
	if ( $j('#tool_personselector_id_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "option_name":"';
	if ( $j('#tool_personselector_name_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "option_title":"';
	if ( $j('#tool_personselector_title_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "option_bu":"';
	if ( $j('#tool_personselector_bu_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "option_email":"';
	if ( $j('#tool_personselector_email_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "option_phone":"';
	if ( $j('#tool_personselector_phone_enable', personselector).text() == 'Yes' ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "required":"';
	if ( $j('#tool_required_checkbox', personselector).prop('checked') ) {
		personselector_code += "Y";
	} else {
		personselector_code += "N";
	}
	personselector_code += '", "set":"';
	if ( $j(personselector).hasClass('_form_element_notset')) {
		personselector_code += "N";
	} else {
		personselector_code += "Y";
	}
	personselector_code += '"}';
	return personselector_code;
}

/*
 * Format the textblock tool for saving.
 */
function _form_save_textblock(textblock) {
	var textblock_code	= '{ "type":"textblock",'
						+ ' "label":"' + $j('#tool_label',textblock).text() + '",'
						+ ' "url":"' + $j('#tool_textblock_url',textblock).text() + '",'
						+ ' "include":"';
	if ( $j('#tool_textblock_include',textblock).text() == 'Yes') {
		textblock_code += "Y";
	} else {
		textblock_code += "N";
	}
	textblock_code += '", "set":"';
	if ( $j(textblock).hasClass('_form_element_notset')) {
		textblock_code += "N";
	} else {
		textblock_code += "Y";
	}
	textblock_code += '"}';
	return textblock_code;
}

/*
 * Format the input tool for saving.
 */
function _form_save_input(input) {
	var input_code	= '{ "type":"input",'
					+ ' "id":"' + $j('#tool_id',input).text() + '",'
					+ ' "label":"' + $j('#tool_label',input).text() + '",'
					+ ' "placeholder":"' + $j('#tool_input_input',input).attr('placeholder') + '",'
					+ ' "settitle":"';
	if ( $j('#tool_set_as_title_checkbox', input).prop('checked') ) {
		input_code += "Y";
	} else {
		input_code += "N";
	}
	input_code += '", "required":"';
	if ( $j('#tool_required_checkbox', input).prop('checked') ) {
		input_code += "Y";
	} else {
		input_code += "N";
	}
	input_code += '", "set":"';
	if ( $j(input).hasClass('_form_element_notset')) {
		input_code += "N";
	} else {
		input_code += "Y";
	}
	input_code += '"}';
	return input_code;
}

/*
 * Format the textarea tool for saving.
 */
function _form_save_textarea(textarea) {
	var textarea_code	= '{ "type":"textarea",'
						+ ' "id":"' + $j('#tool_id',textarea).text() + '",'
						+ ' "label":"' + $j('#tool_label',textarea).text() + '",'
						+ ' "placeholder":"' + $j('#tool_textarea_textarea',textarea).attr('placeholder') + '",'
						+ ' "required":"';
	if ( $j('#tool_required_checkbox', textarea).prop('checked') ) {
		textarea_code += "Y";
	} else {
		textarea_code += "N";
	}
	textarea_code += '", "set":"';
	if ( $j(textarea).hasClass('_form_element_notset')) {
		textarea_code += "N";
	} else {
		textarea_code += "Y";
	}
	textarea_code += '"}';
	return textarea_code;
}

/*
 * Format the radio button tool for saving.
 */
function _form_save_radio(radio) {
	var radio_code	= '{ "type":"radio",'
					+ ' "id":"' + $j('#tool_id',radio).text() + '",'
					+ ' "label":"' + $j('#tool_label',radio).text() + '",'
	// Format the options list into JSON array
					+ ' "options":[';
	var first = true;
	$j.each($j('#tool_radio_option_text',radio).text().split('\n'), function( index, value ) {
		if ( ! first ){
			radio_code += ',';
		} else {
			first = false;
		}
			radio_code += '{ "id":"' + $j('#tool_id',radio).text() + '-' + index + '", "value":"' + value + '" }';
	});
	radio_code += '], "required":"';
	if ( $j('#tool_required_checkbox', radio).prop('checked') ) {
		radio_code += "Y";
	} else {
		radio_code += "N";
	}
	radio_code += '", "settitle":"';
	if ( $j('#tool_set_as_title_checkbox', radio).prop('checked') ) {
		radio_code += "Y";
	} else {
		radio_code += "N";
	}
	radio_code += '", "set":"';
	if ( $j(radio).hasClass('_form_element_notset')) {
		radio_code += "N";
	} else {
		radio_code += "Y";
	}
	radio_code += '"}';
	return radio_code;
}

/*
 * Format the checkbox tool for saving.
 */
function _form_save_checkbox(checkbox) {
	var checkbox_code	= '{ "type":"checkbox",'
						+ ' "id":"' + $j('#tool_id',checkbox).text() + '",'
						+ ' "label":"' + $j('#tool_label',checkbox).text() + '",'
	// Format the options list into JSON array
						+ ' "options":[';
	var first = true;
	$j.each($j('#tool_checkbox_option_text',checkbox).text().split('\n'), function( index, value ) {
		if ( ! first ){
			checkbox_code += ',';
		} else {
			first = false;
		}
			checkbox_code += '{ "id":"' + $j('#tool_id',checkbox).text() + '-' + index + '", "value":"' + value + '" }';
	});
	checkbox_code += '], "required":"';
	if ( $j('#tool_required_checkbox', checkbox).prop('checked') ) {
		checkbox_code += "Y";
	} else {
		checkbox_code += "N";
	}
	checkbox_code += '", "set":"';
	if ( $j(checkbox).hasClass('_form_element_notset')) {
		checkbox_code += "N";
	} else {
		checkbox_code += "Y";
	}
	checkbox_code += '"}';
	return checkbox_code;
}

/*
 * Format the single select tool for saving.
 */
function _form_save_singleselect(singleselect) {
	var singleselect_code	= '{ "type":"singleselect",'
							+ ' "id":"' + $j('#tool_id',singleselect).text() + '",'
							+ ' "label":"' + $j('#tool_label',singleselect).text() + '",'
	// Format the options list into JSON array
							+ ' "options":[';
	var first = true;
	$j.each($j('#tool_singleselect_option_text',singleselect).text().split('\n'), function( index, value ) {
		if ( ! first ){
			singleselect_code += ",";
		} else {
			first = false;
		}
			singleselect_code += '{ "id":"' + $j('#tool_id',singleselect).text() + '-' + index + '", "value":"' + value + '" }';
	});
	singleselect_code += '], "required":"';
	if ( $j('#tool_required_checkbox', singleselect).prop('checked') ) {
		singleselect_code += "Y";
	} else {
		singleselect_code += "N";
	}
	singleselect_code += '", "settitle":"';
	if ( $j('#tool_set_as_title_checkbox', singleselect).prop('checked') ) {
		singleselect_code += "Y";
	} else {
		singleselect_code += "N";
	}
	singleselect_code += '", "set":"';
	if ( $j(singleselect).hasClass('_form_element_notset')) {
		singleselect_code += "N";
	} else {
		singleselect_code += "Y";
	}
	singleselect_code += '"}';
	return singleselect_code;
}

/*
 * Format the multi-select tool for saving.
 */
function _form_save_multiselect(multiselect) {
	var multiselect_code= '{ "type":"multiselect",'
						+ ' "id":"' + $j('#tool_id',multiselect).text() + '",'
						+ ' "label":"' + $j('#tool_label',multiselect).text() + '",'
	// Format the options list into JSON array
						+ ' "options":[';
	var first = true;
	$j.each($j('#tool_multiselect_option_text',multiselect).text().split('\n'), function( index, value ) {
		if ( ! first ){
			multiselect_code += ",";
		} else {
			first = false;
		}
			multiselect_code += '{ "id":"' + $j('#tool_id',multiselect).text() + '-' + index + '", "value":"' + value + '" }';
	});
	multiselect_code += '], "required":"';
	if (  $j('#tool_required_checkbox', multiselect).prop('checked') ) {
		multiselect_code += "Y";
	} else {
		multiselect_code += "N";
	}
	multiselect_code += '", "set":"';
	if ( $j(multiselect).hasClass('_form_element_notset')) {
		multiselect_code += "N";
	} else {
		multiselect_code += "Y";
	}
	multiselect_code += '"}';
	return multiselect_code;
}

/*
 * Format the date tool for saving.
 */
function _form_save_date(date) {
	var date_code	= '{ "type":"date",'
					+ ' "id":"' + $j('#tool_id',date).text() + '",'
					+ ' "label":"' + $j('#tool_label',date).text() + '",'
					+ ' "date_type":"' + $j('#tool_date_type', date).text() + '",'
					+ ' "required":"';
	if (  $j('#tool_required_checkbox', date).prop('checked') ) {
		date_code += "Y";
	} else {
		date_code += "N";
	}
	date_code += '", "set":"';
	if ( $j(date).hasClass('_form_element_notset')) {
		date_code += "N";
	} else {
		date_code += "Y";
	}
	date_code += '"}';
	return date_code;
}

/*
* [ab]
 * Format the attachment tool for saving.
 */
 function _form_save_attachment(attachment) {
 	var attachment_code	= '{ "type":"attachment",'
					 	+ ' "id":"' + $j('#tool_id',attachment).text()
					 	+ '", "label":"' + $j('#tool_label',attachment).text()
						+ '", "settitle":"';
	if ( $j('#tool_set_as_title_checkbox', attachment).prop('checked') ) {
		attachment_code += "Y";
	} else {
		attachment_code += "N";
	}
 	attachment_code	+= '", "required":"';
 	if ( $j('#tool_required_checkbox', attachment).prop('checked') ) {
 		attachment_code += "Y";
 	} else {
 		attachment_code += "N";
 	}
 	attachment_code += '", "set":"';
 	if ( $j(attachment).hasClass('_form_element_notset')) {
 		attachment_code += "N";
 	} else {
 		attachment_code += "Y";
 	}
 	attachment_code += '" }';
 	return attachment_code;
 }	 

/*
 * Write the formatted save document to the user's container.
 */
function _form_save_write(form_design) {
	var document_name = $j('#_form_form #_form_formname_title #_form_formname_text').text().replace(/^\s+|\s+$/g, '');

	// Search for the document...
	$j.ajax({ 
		type: 'GET', 
		url: '/api/core/v3/search/contents?filter=search(formwidgetbuilderdesign,' + document_name + ')', 
		dataType: 'json', 
		success: function (forms) { 
			var form_ndx = -1;
			// Search through the list of results and make sure an exact match of the form name is in the list.
			$j(forms.list).each(function(index, form){ 
				if (form.subject == document_name && form.contentID != "null" ) {
					form_ndx = index;
					return false;
				}
			});
			
			if (form_ndx != -1) {
				// The form design was found, so prompt the user to make sure it is supposed to be over-written
				if ( confirm("You already have a document named " + document_name + ".  If you proceed, you will over-write the contents and replace it with this form design.  Do you wish to continue?") ) {
					// Update the form design
					forms.list[form_ndx].content.text = "<body><p>" + form_design + "</p></body>";
					var form_data = JSON.stringify(forms.list[form_ndx]);

					// Update the document (PUT) using the contentID returned by the search
					$j.ajax({ 
						type: 'PUT', 
						headers: {'Content-Type':'application/json'}, 
						url: '/api/core/v3/contents/' + forms.list[form_ndx].contentID, 
						dataType: 'json', 
						data: form_data, 
						success: function (data) { 
							//alert(document_name + ' has been updated'); 
							//$j('.j-alert-container', parentWindow).html('<div class="j-alert j-rc5 j-alert-success clearfix j-alert-withbutton" style="bottom: 0px; display: block; opacity: 1; font-size: 16px;"><p>' + document_name + ' has been updated</p></div>').fadeIn(500);
							messageIn('<bold><a href="' + data.resources.html.ref + '">' + document_name + '</a></bold> has been updated',
							          'success');
						}, 
						error: function (xhr, ajaxOptions, thrownError){ 
							alert('ERROR: ' + thrownError + '\nAPI: /api/core/v3/contents/' + forms.list[form_ndx].contentID + '\n\nYou will need to talk to the administrator of this form about this.  Look in the People tab for the owners.');
						}
					});
				}
			} else {
				// The form design was not found, so save it as a new form design in the user's hidden container
				var form_data = '{ "content": { "type":"text/html", "text":' + form_design + ' },'
							 + ' "subject":"' + document_name + '",'
							 + ' "visibility":"hidden",'
							 + ' "type":"document",'
							 + ' "tags":["formWidgetBuilderDesign"]'
							 + '}';

				// POST the new document
				$j.ajax({
					type: 'POST',
					headers: {'Content-Type':'application/json'},
					url: '/api/core/v3/contents',
					dataType: 'json',
					data: form_data,
					success: function (data) {
						//alert(document_name + ' has been saved');
						messageIn('<bold><a href="' + data.resources.html.ref + '">' + document_name + '</a></bold> has been saved', 'success');
					},
					error: function (xhr, ajaxOptions, thrownError){
						var err = "";
						// If we are returned Conflict, then the document name already exists.
						if ( thrownError == 'Conflict' ) {
							// Search for the document with the entered name to get the contentID
						} else if ( thrownError == 'Forbidden' ) {
							err = 'You do not have permission to post to the destination of this form.';
						} else {
							err = 'data:\n' + form_data;
						}
						if ( err.length ) alert('ERROR: ' + thrownError + '\n' + err + '\n\nYou will need to talk to the administrator of this form about this.  Look in the People tab for the owners.'); 
					}
				});
			}
		},
		error: function (xhr, ajaxOptions, thrownError){ 
			alert('ERROR: ' + thrownError + '\n\nYou will need to talk to the administrator about this.'); 
		}
	});
}

/*
 * User clicked Save.  This will format the form design into XML format and save it to a document in
 * the user's container.
 */
function _form_saveCode() {
	// Format the code for the name.
	var form_code	= '{ "form_name":"' + $j('#_form_form #_form_formname_text').text() + '",'
					+ ' "form_name_title":"';
	if ( $j('#_form_form #tool_set_as_title_checkbox').prop('checked') ) {
		form_code += "Y";
	} else {
		form_code += "N";
	}
	form_code += '", "form_elements":[';

	// Loop through the form elements and format the code for each.
	var first = true;
	$j('#_form_form ._form_formelem').each(function(index, opt){ 
		var elem_type = $j(this).attr("id");
		if ( ! first ){
			form_code += ',';
		} else {
			first = false;
		}
		if (elem_type == "tool_submitter"){
			form_code += _form_save_submitter(this);
		} else if (elem_type == "tool_personselector"){
			form_code += _form_save_personselector(this);
		} else if (elem_type == "tool_textblock"){
			form_code += _form_save_textblock(this);
		} else if (elem_type == "tool_input"){
			form_code += _form_save_input(this);
		} else if (elem_type == "tool_textarea"){
			form_code += _form_save_textarea(this);
		} else if (elem_type == "tool_radio"){
			form_code += _form_save_radio(this);
		} else if (elem_type == "tool_checkbox"){
			form_code += _form_save_checkbox(this);
		} else if (elem_type == "tool_singleselect"){
			form_code += _form_save_singleselect(this);
		} else if (elem_type == "tool_multiselect"){
			form_code += _form_save_multiselect(this);
		} else if (elem_type == "tool_date"){
			form_code += _form_save_date(this);
		} else if (elem_type == "tool_attachment") {
			form_code += _form_save_attachment(this);
		}
	});

	// Format the code for the destination.
	form_code	+= '],'
				+ ' "counters": {'
				+ ' "submitter":"' + $j('#_form_form #_elemcount_submitter').text() + '",'
				+ ' "personselector":"' + $j('#_form_form #_elemcount_personselector').text() + '",'
				+ ' "textblock":"' + $j('#_form_form #_elemcount_textblock').text() + '",'
				+ ' "input":"' + $j('#_form_form #_elemcount_input').text() + '",'
				+ ' "textarea":"' + $j('#_form_form #_elemcount_textarea').text() + '",'
				+ ' "radio":"' + $j('#_form_form #_elemcount_radio').text() + '",'
				+ ' "checkbox":"' + $j('#_form_form #_elemcount_checkbox').text() + '",'
				+ ' "singleselect":"' + $j('#_form_form #_elemcount_singleselect').text() + '",'
				+ ' "multiselect":"' + $j('#_form_form #_elemcount_multiselect').text() + '",'
				+ ' "date":"' + $j('#_form_form #_elemcount_date').text() + '",'
				+ ' "attachment":"' + $j('#_form_form #_elemcount_attachment').text() + '"'
				+ '	}, "destination":{'
				+ ' "submiturl":"';
	if ($j('#editbox_destination_URL_chk').prop('checked')) {
		form_code += 'Y';
	} else {
		form_code += 'N';
	}
	form_code += '", "url":"' + $j('#_form_form #_form_formdestination_url').text() + '",'
				+ ' "id":"' + $j('#_form_form #_form_formdestination_ID').text() + '",'
				+ ' "location":"' + $j('#_form_form #_form_formdestination_location').text() + '",'
				+ ' "category_type":"' + $j('#_form_form #_form_formcategory_type').text() + '",'
				+ ' "category_cat":"' + $j('#_form_form #_form_formcategory_category').text() + '",'
				+ ' "color":"' + $j('#_form_form #_form_submit #_form_color_scheme').text() + '",'
				+ ' "submitemail":"';
	if ($j('#editbox_destination_email_chk').prop('checked')) {
		form_code += 'Y';
	} else {
		form_code += 'N';
	}
	form_code	+= '", "email":"' + $j('#_form_form #_form_email_value').text() + '",'
				+ ' "set":"';
	if ( $j('#_form_form #_form_submit').hasClass('_form_element_notset') ) {
		form_code += 'N';
	} else {
		form_code += 'Y';
	}
	form_code += '" },';
	form_code += ' "tags":"' + $j('#_form_tags').text() + '"';
	form_code += ' }';
	_form_save_write(form_code);
}
















/*
 * User clicked Load Form.  Search for this user's form designs and present a list.
 */
function _form_load_designs() {
	$j('#_form_load_prev').prop('disabled', true);
	$j('#_form_load_next').prop('disabled', true);
	$j('#_form_load #_form_load_designs').html( '<p style="text-align: center;"><img alt="" src="/images/jive-image-loading.gif"> Loading...</p>' );
	$j('#_form_load_load').prop('disabled', true);
	$j('#_form_form').hide();
	$j('#_form_toolbox').hide();
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').hide();
	$j('#_form_load').show();
	// Search for all the __form_design forms this user has access to...
	$j.ajax({ 
		type: 'GET', 
		url: '/api/core/v3/search/contents?filter=type(document)&filter=search(formWidgetBuilderDesign)&sort=updatedDesc&count=' + designMax + '&startIndex=' + designIndex, 
		dataType: 'json', 
		success: function (forms) {
			designCount = forms.list.length;
			if (designCount || designIndex > 0) {
				var form_list = "";
				// Search through the list of results and make sure an exact match of the form name is in the list.
				$j(forms.list).each(function(index, form){ 
					// Returned documents with no contentID are deleted, so ignore them...
					if ( form.contentID != "null" ) {
						form_list += '<a class="list-group-item" id="' + form.contentID + '">' + form.subject + "</a>";
					} else {
						form_list += '<a class="list-group-item design-deleted" id="' + form.contentID + '">[DELETED] ' + form.subject + "</a>";
					}
				});
				if (designCount < designMax) {
					form_list += '<a class="list-group-item">End of list</a>';
					for (ndx = designCount + 1; ndx < designMax; ndx++) {
						form_list += '<a  class="list-group-item"> </a>';
					}
				}
				$j('#_form_load #_form_load_designs').html( form_list );
				$j('#_form_load #_form_load_designs a').click(function(e){
					_form_loadCode_activate( $j(this) );
					return false;
				});
				if (designIndex > 0) {
					$j('#_form_load_prev').prop('disabled', false);
				} else {
					$j('#_form_load_prev').prop('disabled', true);
				}
				if (designCount < designMax) {
					$j('#_form_load_next').prop('disabled', true);
				} else {
					$j('#_form_load_next').prop('disabled', false);
				}
				resizeForm();
			} else {
				alert('No form designs are available.  Only form designs you have access to are available for you to load.'); 
			}
		}, 
		error: function (xhr, ajaxOptions, thrownError){ 
			alert('ERROR: ' + thrownError + '\n\nCould not retrieve the list of form designs.  You will need to talk to the administrator about this.'); 
		}
	}); 
}

function _form_prev_designs() {
	if (designIndex > designMax)
		designIndex -= designMax;
	else
		designIndex = 0;
	_form_load_designs();
}

function _form_next_designs() {
	designIndex += designMax;
	_form_load_designs();
}

/*
 * User clicked a design.  We need to remove the active class from all designs, and add it to the clicked design.
 */
function _form_loadCode_activate(design) {
	if ( $j(design).hasClass('design-deleted') || $j(design).attr('id') == undefined ){
		return false;
	}
	$j('#_form_load #_form_load_designs .list-group-item.active').removeClass('active');
	$j(design).addClass('active');
	$j('#_form_load_load').prop('disabled', false);
}

/*
 * Load the form name.
 */
function _form_load_formname(formname) {
	$j('#_form_formname_text').text(formname);
	$j('#_form_formname').removeClass('_form_element_notset');
}

/*
 * Load submitter configuration.
 */
function _form_load_submitter(submitter) {
	// Create a new submitter tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( submitter.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_submitter">'	+ $j('#_form_toolbox #_form_toolbox_tools #tool_submitter').html() + '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new submitter tool's configuration settings
	$j('#tool_id',newelem).text(submitter.id);
	$j('#tool_label',newelem).text(submitter.label);
	if ( submitter.label != '' ) {
		$j('#tool_label', newelem).show();
		$j('#tool_label', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_label', newelem).hide();
		$j('#tool_label', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_id == 'Y' ) {
		$j('#tool_submitter_id_enable', newelem).text('Yes');
		$j('#tool_submitter_id', newelem).show();
		$j('#tool_submitter_id', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_id_enable', newelem).text('No');
		$j('#tool_submitter_id', newelem).hide();
		$j('#tool_submitter_id', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_name == "Y" ) {
		$j('#tool_submitter_name_enable', newelem).text('Yes');
		$j('#tool_submitter_name', newelem).show();
		$j('#tool_submitter_name', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_name_enable', newelem).text('No');
		$j('#tool_submitter_name', newelem).hide();
		$j('#tool_submitter_name', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_title == 'Y' ) {
		$j('#tool_submitter_title_enable', newelem).text('Yes');
		$j('#tool_submitter_title', newelem).show();
		$j('#tool_submitter_title', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_title_enable', newelem).text('No');
		$j('#tool_submitter_title', newelem).hide();
		$j('#tool_submitter_title', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_bu == 'Y' ) {
		$j('#tool_submitter_bu_enable', newelem).text('Yes');
		$j('#tool_submitter_bu', newelem).show();
		$j('#tool_submitter_bu', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_bu_enable', newelem).text('No');
		$j('#tool_submitter_bu', newelem).hide();
		$j('#tool_submitter_bu', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_email == 'Y' ) {
		$j('#tool_submitter_email_enable', newelem).text('Yes');
		$j('#tool_submitter_email', newelem).show();
		$j('#tool_submitter_email', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_email_enable', newelem).text('No');
		$j('#tool_submitter_email', newelem).hide();
		$j('#tool_submitter_email', newelem).addClass('_form_formelem_remove');
	}
	if ( submitter.option_phone == 'Y' ) {
		$j('#tool_submitter_phone_enable', newelem).text('Yes');
		$j('#tool_submitter_phone', newelem).show();
		$j('#tool_submitter_phone', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_submitter_phone_enable', newelem).text('No');
		$j('#tool_submitter_phone', newelem).hide();
		$j('#tool_submitter_phone', newelem).addClass('_form_formelem_remove');
	}
}

/*
 * Load personselector configuration.
 */
function _form_load_personselector(personselector) {
	// Create a new person selector tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( personselector.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_personselector">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_personselector').html()
			+ toolRequired
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new person selector tool's configuration settings
	$j('#tool_id',newelem).text(personselector.id);
	$j('#tool_personselector_search_label',newelem).text(personselector.label);
	$j('#tool_personselector_search_input',newelem).attr('placeholder', personselector.placeholder);
	$j('#tool_personselector_heading_label',newelem).text(personselector.heading);
	if ( personselector.heading != '' ) {
		$j('#tool_personselector_heading', newelem).show();
		$j('#tool_personselector_heading', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_heading', newelem).hide();
		$j('#tool_personselector_heading', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_id == 'Y' ) {
		$j('#tool_personselector_id_enable', newelem).text('Yes');
		$j('#tool_personselector_id', newelem).show();
		$j('#tool_personselector_id', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_id_enable', newelem).text('No');
		$j('#tool_personselector_id', newelem).hide();
		$j('#tool_personselector_id', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_name == "Y" ) {
		$j('#tool_personselector_name_enable', newelem).text('Yes');
		$j('#tool_personselector_name', newelem).show();
		$j('#tool_personselector_name', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_name_enable', newelem).text('No');
		$j('#tool_personselector_name', newelem).hide();
		$j('#tool_personselector_name', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_title == 'Y' ) {
		$j('#tool_personselector_title_enable', newelem).text('Yes');
		$j('#tool_personselector_title', newelem).show();
		$j('#tool_personselector_title', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_title_enable', newelem).text('No');
		$j('#tool_personselector_title', newelem).hide();
		$j('#tool_personselector_title', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_bu == 'Y' ) {
		$j('#tool_personselector_bu_enable', newelem).text('Yes');
		$j('#tool_personselector_bu', newelem).show();
		$j('#tool_personselector_bu', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_bu_enable', newelem).text('No');
		$j('#tool_personselector_bu', newelem).hide();
		$j('#tool_personselector_bu', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_email == 'Y' ) {
		$j('#tool_personselector_email_enable', newelem).text('Yes');
		$j('#tool_personselector_email', newelem).show();
		$j('#tool_personselector_email', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_email_enable', newelem).text('No');
		$j('#tool_personselector_email', newelem).hide();
		$j('#tool_personselector_email', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.option_phone == 'Y' ) {
		$j('#tool_personselector_phone_enable', newelem).text('Yes');
		$j('#tool_personselector_phone', newelem).show();
		$j('#tool_personselector_phone', newelem).removeClass('_form_formelem_remove');
	} else {
		$j('#tool_personselector_phone_enable', newelem).text('No');
		$j('#tool_personselector_phone', newelem).hide();
		$j('#tool_personselector_phone', newelem).addClass('_form_formelem_remove');
	}
	if ( personselector.required == "Y" ) {
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', newelem).prop('checked', false);
	}
}
/*
 * Load textblock configuration.
 */
function _form_load_textblock(textblock) {
	// Create a new text block tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( textblock.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_textblock">' + $j('#_form_toolbox #_form_toolbox_tools #tool_textblock').html() + '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new text block tool's configuration settings
	if ( textblock.url == "" ) {
		$j('#tool_label',newelem).text(textblock.label);
	} else {
		$j('#tool_label',newelem).html( '<a href=\"' + textblock.url + '\">' + textblock.label + '</a>');
	}
	$j('#tool_textblock_URL',newelem).text( textblock.url );
	if ( textblock.include == "Y" ) {	
		$j('#tool_textblock_include',newelem).text( 'Yes' );
	} else {
		$j('#tool_textblock_include',newelem).text( 'No' );
	}
}

/*
 * Load input configuration.
 */
function _form_load_input(input) {
	// Create a new text input tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( input.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_input">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_input').html()
			+ toolRequired
			+ toolSetAsTitle
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new text input tool's configuration settings
	$j('#tool_id',newelem).text( input.id );
	$j('#tool_label',newelem).text( input.label );
	$j('#tool_input_input',newelem).attr('placeholder', input.placeholder );
	if ( input.settitle == "Y" ) {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', true);
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', false);
		if ( input.required == "Y" ) {
			$j('#tool_required_checkbox', newelem).prop('checked', true);
		} else {
			$j('#tool_required_checkbox', newelem).prop('checked', false);
		}
	}
}

/*
 * Load textarea configuration.
 */
function _form_load_textarea(textarea) {
	// Create a new text area tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( textarea.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_textarea">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_textarea').html()
			+ toolRequired
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new text area tool's configuration settings
	$j('#tool_id',newelem).text( textarea.id );
	$j('#tool_label',newelem).text( textarea.label );
	$j('#tool_textarea_textarea',newelem).attr('placeholder', textarea.placeholder );
	if ( textarea.required == "Y" ) {
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', newelem).prop('checked', false);
	}
}

/*
 * Load radio buttons configuration.
 */
function _form_load_radio(radio) {
	// Create a new radio button tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( radio.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_radio">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_radio').html()
			+ toolRequired
				+ toolSetAsTitle
			+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new radio button tool's configuration settings
	$j('#tool_id',newelem).text( radio.id );
	$j('#tool_label',newelem).text( radio.label );
	$j('#tool_label',newelem).attr("for", radio.id );
	var opts = "";
	var options_text = "";
	var first = true;
	$j.each(radio.options, function( index, option ) {
			opts += '<label class="radio-inline" for="' + radio.id + '"><input type="radio" name="' + radio.id + '" id="' + option.id + '" value="' + option.value + '">' + option.value + '</label>';
			if ( ! first )
				options_text += "\n";
			else
				first = false;
			options_text += option.value;
	});
	$j('#tool_radio_options',newelem).html(opts);
	$j('#tool_radio_option_text',newelem).text( options_text );
	if ( radio.settitle == "Y" ) {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', true);
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', false);
		if ( radio.required == "Y" ) {
			$j('#tool_required_checkbox', newelem).prop('checked', true);
		} else {
			$j('#tool_required_checkbox', newelem).prop('checked', false);
		}
	}
}

/*
 * Load checkbox configuration.
 */
function _form_load_checkbox(checkbox) {
	// Create a new checkbox tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( checkbox.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_checkbox">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_checkbox').html()
			+ toolRequired
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new checkbox tool's configuration settings
	$j('#tool_id',newelem).text( checkbox.id );
	$j('#tool_label',newelem).text( checkbox.label );
	$j('#tool_label',newelem).attr("for", checkbox.id );
	var opts = "";
	var options_text = "";
	var first = true;
	$j.each(checkbox.options, function( index, option ) {
			opts += '<label class="checkbox-inline" for="' + checkbox.id + '"><input type="checkbox" name="' + checkbox.id + '" id="' + option.id + '" value="' + option.value + '">' + option.value + '</label>'
			if ( ! first )
				options_text += "\n";
			else
				first = false;
			options_text += option.value;
	});
	$j('#tool_checkbox_options',newelem).html(opts);
	$j('#tool_checkbox_option_text',newelem).text( options_text );
	if ( checkbox.required == "Y" ) {
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', newelem).prop('checked', false);
	}
}

/*
 * Load single select configuration.
 */
function _form_load_singleselect(singleselect) {
	// Create a new single select tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( singleselect.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_singleselect">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_singleselect').html()
			+ toolRequired
			+ toolSetAsTitle
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new single select tool's configuration settings
	$j('#tool_id',newelem).text( singleselect.id );
	$j('#tool_label',newelem).text( singleselect.label );
	$j('#tool_label',newelem).attr("for", singleselect.id );
	var opts = "";
	var options_text = "";
	var first = true;
	$j.each(singleselect.options, function( index, option ) {
			opts += '<option id="' + option.id + '">' + option.value + '</option>';
			if ( ! first )
				options_text += "\n";
			else
				first = false;
			options_text += option.value;
	});
	$j('#tool_singleselect_options',newelem).html(opts);
	$j('#tool_singleselect_option_text',newelem).text( options_text );
	if ( singleselect.settitle == "Y" ) {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', true);
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', false);
		if ( singleselect.required == "Y" ) {
			$j('#tool_required_checkbox', newelem).prop('checked', true);
		} else {
			$j('#tool_required_checkbox', newelem).prop('checked', false);
		}
	}
}

/*
 * Load multi-select configuration.
 */
function _form_load_multiselect(multiselect) {
	// Create a new multiselect tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( multiselect.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_multiselect">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_multiselect').html()
			+ toolRequired
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new multiselect tool's configuration settings
	$j('#tool_id',newelem).text( multiselect.id );
	$j('#tool_label',newelem).text( multiselect.label );
	$j('#tool_label',newelem).attr("for", multiselect.id );
	var opts = "";
	var options_text = "";
	var first = true;
	$j.each(multiselect.options, function( index, option ) {
			opts += '<option id="' + option.id + '">' + option.value + '</option>';
			if ( ! first )
				options_text += "\n";
			else
				first = false;
			options_text += option.value;
	});
	$j('#tool_multiselect_options',newelem).html(opts);
	$j('#tool_multiselect_option_text',newelem).text( options_text );
	if ( multiselect.required == "Y" ) {
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', newelem).prop('checked', false);
	}
}

/*
 * Load date configuration.
 */
function _form_load_date(date) {
	// Create a new date tool using the tool in the toolbox
	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( date.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_date">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_date').html()
			+ toolRequired
				+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');

	// Load the new date tool's configuration settings
	$j('#tool_id',newelem).text( date.id );
	$j('.tool_date_input', newelem).attr('id',date.id);
	$j('#tool_label',newelem).text( date.label );
	if (date.date_type == 'date' || date.date_type == 'datetime-local' || date.date_type == 'time') {
		date.date_type = 'entry';
	}
	$j('#tool_date_type', newelem).text(date.date_type);
	if ( date.date_type == 'current' ) {
		$j('.tool_date_input', newelem).addClass('tool_data');
		$j('#tool_date_current', newelem).removeClass('tool_data');
	} else {
		$j('#tool_date_current', newelem).addClass('tool_data');
		$j('.tool_date_input', newelem).removeClass('tool_data');
	}
	if ( date.required == "Y" ) {
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_required_checkbox', newelem).prop('checked', false);
	}
}

/*
* [ab]
* Load Attachment configuration 
*/
function _form_load_attachment(attachment) {

	var newelem = '<div class="_form_formelem lastInsertedElem';
	if ( attachment.set == "N" ) {
		newelem += ' _form_element_notset';
	}
	newelem += '" id="tool_attachment">'
			+ $j('#_form_toolbox #_form_toolbox_tools #tool_attachment').html()
			+ toolSetAsTitle
			+ toolRequired
			+ '</div>';
	$j(newelem).insertBefore('#_form_form_fields_end');
	newelem = $j('.lastInsertedElem');
	$j(newelem).removeClass('lastInsertedElem');
	$j('#tool_id',newelem).text( attachment.id );
	$j('#tool_label',newelem).text( attachment.label );
	if ( attachment.settitle == "Y" ) {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', true);
		$j('#tool_required_checkbox', newelem).prop('checked', true);
	} else {
		$j('#tool_set_as_title_checkbox', newelem).prop('checked', false);
		if ( attachment.required == "Y" ) {
			$j('#tool_required_checkbox', newelem).prop('checked', true);
		} else {
			$j('#tool_required_checkbox', newelem).prop('checked', false);
		}
	}

}

/*
 * Load the form destination.
 */
function _form_load_counters(counters) {
	$j('#_elemcount_submitter').text( counters.submitter );
	$j('#_elemcount_personselector').text( counters.personselector );
	$j('#_elemcount_textblock').text( counters.textblock );
	$j('#_elemcount_input').text( counters.input );
	$j('#_elemcount_textarea').text( counters.textarea );
	$j('#_elemcount_radio').text( counters.radio );
	$j('#_elemcount_checkbox').text( counters.checkbox );
	$j('#_elemcount_singleselect').text( counters.singleselect );
	$j('#_elemcount_multiselect').text( counters.multiselect );
	$j('#_elemcount_date').text( counters.date );
	$j('#_elemcount_attachment').text( counters.attachment );
}

/*
 * Load the form destination.
 */
function _form_load_destination(destination) {
	$j('#_form_formdestination_submitURL').text( destination.submiturl );
	$j('#_form_formdestination_URL').text( destination.url );
	$j('#_form_formdestination_ID').text( destination.id );
	$j('#_form_formdestination_location').text( destination.location );
	$j('#_form_formcategory_type').text( destination.category_type );
	$j('#_form_formcategory_category').text( destination.category_cat );
	$j('#_form_formdestination_submitemail').text( destination.submitemail );
	$j('#_form_formdestination_email').text( destination.email );
	categoryUpdateLabel(destination.category_type, destination.category_cat);
	$j('#_form_color_scheme').text( destination.color );
/*
	if ( destination.refresh != "Y" ) {
		$j('#_form_formdestination_submitrefresh').prop('checked', false);
	} else {
		$j('#_form_formdestination_submitrefresh').prop('checked', true);
	}
*/
	if ( destination.set == "Y" ) {
		$j('#_form_submit').removeClass('_form_element_notset');
	}
	$j('#_form_formdestination_location').show();
}


/*
 * Load the form design.
 */
function _form_loadCode_Load() {
	var design = $j('#_form_load #_form_load_designs .list-group-item.active');
	$j.ajax({ 
		type: 'GET', 
		url: '/api/core/v3/contents/' + design[0].id, 
		dataType: 'json', 
		success: function (loaded_doc) {
			// The design is inside a span tag in the document content text field.  We have to parse it out...
			var design = $j('*:not(:has("*"))', loaded_doc.content.text).text().trim();
			try {
				json = $j.parseJSON(design);
			}
			catch (e) {
				alert("Parse error: "+e + "\n\nNotify your administrator that the following design is invalid:\n" + design);
				$j('#_form_load').hide();
				$j('#_form_form').show();
				$j('#_form_toolbox').show();
				$j('#_form_toolbox').removeClass('toolbox_background');
				$j('#_form_mainFrameFooter').show();
				return false;
			};
			$j('#_form_load').hide();
			$j('#_form_form').html( blankDesign );
			$j('._form_blank').remove();
			$j('#_form_form').show();

			_form_load_formname(json.form_name);
			if ( json.form_name_title == undefined || json.form_name_title == "Y" ) {
				$j('#_form_form #tool_required_checkbox').prop('checked', true);
			} else {
				$j('#_form_form #tool_required_checkbox').prop('checked', false);
			}

			for (ndx = 0; ndx < json.form_elements.length; ndx++ ) {
				if (json.form_elements[ndx].type == "submitter"){
					_form_load_submitter(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "personselector"){
					_form_load_personselector(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "textblock"){
					_form_load_textblock(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "input"){
					_form_load_input(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "textarea"){
					_form_load_textarea(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "radio"){
					_form_load_radio(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "checkbox"){
					_form_load_checkbox(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "singleselect"){
					_form_load_singleselect(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "multiselect"){
					_form_load_multiselect(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "date"){
					_form_load_date(json.form_elements[ndx]);
				} else if (json.form_elements[ndx].type == "attachment") {
					_form_load_attachment(json.form_elements[ndx]);
				}
			}

			_form_load_counters(json.counters);
			_form_load_destination(json.destination);

			tagsUpdateLabel( json.tags );

			$j('#_form_toolbox').show();
			$j('#_form_toolbox').removeClass('toolbox_background');
			$j('#_form_editbox').hide();
			$j('#_form_mainFrameFooter').show();
			changesMade = false
			$j('._form_formheader').click(function(e){
				formEdit( $j(this) );
				return false;
			});
			$j('._form_formfooter').click(function(e){
				formEdit( $j(this) );
				return false;
			});
			$j('#_form_form ._form_formelem').mousedown(function(e){
				editX = e.pageX;
				editY = e.pageY;
				editelem = $j(this);
				siblingElem = $j(this).next();
				toolboxElementMousedown(e, editelem, true );
			});
			check_form_formcontrols_showcode();
			resizeForm();
		}, 
		error: function (xhr, ajaxOptions, thrownError){ 
			alert('ERROR: ' + thrownError + '\ndata:\n' + data + '\n\nYou will need to talk to the administrator of this form about this.  Look in the People tab for the owners.'); 
		}
	});
}


/*
 * User cancelled loading a design.  Return to editing the current form.
 */
function _form_loadCode_Cancel() {
	$j('#_form_form').show();
	$j('#_form_toolbox').show();
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').show();
	$j('#_form_load').hide();
	resizeForm();
}
























/*
 * User clicked Start Over.  Have them verify before replacing the current work.
 */
function _form_startOver() {
	// If changes have been made, make the user verify they want to restart.
	if (changesMade) {
		if ( ! confirm('This will erase the current form design and start over.  Are you sure?')) {
			return false;
		}
	}
	$j('._form_blank').remove();
	$j('#_form_form').html( blankDesign );
	blankelem = $j('._form_blank');
	$j('#_form_form').show();
	$j('#_form_toolbox').removeClass('toolbox_background');
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').show();
	$j('#_form_code').hide();
	changesMade = false
	$j('._form_formheader').click(function(e){
		formEdit( $j(this) );
		return false;
	});
	$j('._form_formfooter').click(function(e){
		formEdit( $j(this) );
		return false;
	});
	resizeForm();
}

/*
 * User clicked Show Code.  Prompt user to select the output form color scheme.
 */
function _form_select_color() {
	$j('#_form_form').hide();
	$j('#_form_toolbox').hide();
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').hide();
	$j('#_form_select_color a').click(function(e){
		_form_select_color_scheme( $j(this) );
		return false;
	});
	$j('#_form_select_color').show();
	resizeForm();
}		


/*
 * User selected a color scheme for the output form.
 */
function _form_select_color_scheme(colorScheme) {
	$j('#_form_select_color').hide();
	$j('#_form_form #_form_submit #_form_color_scheme').text( colorScheme[0].id );
	_form_showCode();
}

/*
 * User clicked Show Code.  Validate form and format the output form.
 */
function _form_showCode() {
	var notset = $j('#_form_form ._form_element_notset');
	if (notset.length) {
		// Unset form element found.  Display error.
		$j('#_form_code #code').text( 'ERROR\nYou have not set all fields on your form.\nGo back to the form and click all fields with a light red background and set the field details.' );
	} else {
		// Format the output form.
		var code = $j('#_form_code_format');
		$j(code).html( $j('#_form_form').html() );
		$j('._form_formelem_remove', code).remove();
		$j('#_form_formdestination_ID').css({'display':'none'});
		$j('.tool_data', code).remove();
		$j('._form_formcontrols', code).remove();
		$j('#_form_formdestination_submit', code).prop('disabled', false);
		var codeHeader	= "<scr"+"ipt src='/api/core/v3/attachments/file/" + jquery_content_id + "/data'></scr"+"ipt>\n"
						+ "<scr"+"ipt src='/api/core/v3/attachments/file/" + library_loader_content_id + "/data'></scr"+"ipt>\n"
						+ "<scr"+"ipt>\n"
						+ "$j.load_library('bootstrap.css');\n"
						+ "$j.load_library('bootstrap-theme.css');\n"
						+ "$j.load_library('bootstrap-datepicker.css');\n"
						+ "$j.load_library('form_widget.css');\n"
						+ "$j.load_library('bootstrap.js');\n"
						+ "$j.load_library('bootstrap-datepicker.js');\n"
						+ "$j.load_library('jquery-placeholder.js');\n"
						+ "$j.load_library('form_widget.js');\n"
						+ "</scr"+"ipt>\n"
        				+ "<div id=\"_form_form\" class=\"form_frame form-horizontal\">\n"
        				+ $j('#_form_code_format').html()
        				+ "</div>";
		$j('#_form_code #code').text( codeHeader );
	}
	$j('#_form_form').hide();
	$j('#_form_toolbox').hide();
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').hide();
	$j('#_form_code_format').hide();
	$j('#_form_code').show();
	$j('#_form_code #code').select();
	resizeForm();
}

/*
 * Hide the code frame and display the main form frame and toolbox.
 */
function _form_hideCode() {
	$j('#_form_form').show();
	$j('#_form_toolbox').show();
	$j('#_form_editbox').hide();
	$j('#_form_mainFrameFooter').show();
	$j('#_form_code').hide();
	resizeForm();
}

/*
 * Position the trashcan (and right pointer) elements beside element being edited.
 */
function formTrashcanReposition() {
	var editTop = Math.round($j(editelem).position().top + ($j(editelem).height() / 2) - ($j('#_form_trashcan').height() / 2));
	var editDiff = 0;
	if (editTop < 0) {
		editDiff = -editTop;
		editTop = 0;
	}
	$j('#_form_trashcan').css({ 'top': editTop })
						.show();
	var pos = $j('.trashcan_container').position();
	$j('.trashcan_pointer').css({ 'left': pos.left - 20 })
						  .css({ 'top': Math.round( ($j('.trashcan_container').height() / 2) - editDiff) });
	resizeForm();
}

/*
 * User released the mouse button while dragging form tool.
 */
function fadeOutToolDrag(target) {
	$j('._form_tool_drag').css("display", "none");
/*
	var targetPos = $j(target).position();
	$j('._form_tool_drag').animate({
									 opacity: 0,
									 left: Math.round(targetPos.left + ( $j(target).width() / 2 )),
									 top: Math.round(targetPos.top + ( $j(target).height() / 2 )),
									 height: 0,
									 width: 0,
									 marginTop: Math.round( $j('._form_tool_drag').height() / 2 ),
									 marginLeft: Math.round( $j('._form_tool_drag').width() / 2 )
									},
									250,
									function() {
										$j(this).css("display", "none")
									});
*/
}

/*
 * Check if the destination appears to be valid and disable/enable the OK button accordingly.
 */
function toggleFormDestinationOKButton(){

	var selected = false;
	if ( $j('#editbox_destination_URL_chk').prop('checked') ) {
		selected = true;
		if($j('#editbox_destination_input').val().length < 1) {
			$j('#editbox_OK').prop('disabled', true);
			return false;
		}

		if($j('#editbox_destination_input').val().indexOf(baseURL) < 0) {
			$j('#editbox_OK').prop('disabled', true);
			return false;
		}
	} else {
		if ( ! $j('#editbox_destination_email_chk').prop('checked') ) {
			$j('#editbox_OK').prop('disabled', true);
			return false;
		}
	}
	$j('#editbox_OK').prop('disabled', false);
}

/*
 * User clicked down on the left mouse button on a toolbox element.
 */
function toolboxElementMousedown(event, elem, removeElem) {
	// Format the drag tool based on the tool clicked on.
	var pos = $j(elem).position();
	origToolHeight = $j(elem).height();
	$j('._form_tool_drag').stop()
						.attr("id", $j(elem).attr("id") )
						.html( elem.html() )
						.css({	opacity: 1,
								display: 'inline-block',
								left: pos.left,
								top: pos.top,
								height: $j(elem).height(),
								width: $j(elem).width(),
								marginTop: '0px',
								marginLeft: '0px' });
	if ( $j(elem).hasClass('_form_element_notset') ) {
		$j('._form_tool_drag').addClass('_form_element_notset');
	} else {
		$j('._form_tool_drag').removeClass('_form_element_notset');
	}
	// Insert the blank element at the end of the form.
	$j(blankelem).insertBefore( $j('#_form_form_fields_end') );
	blankelem = $j('._form_blank');
	blankAtEnd = true;
	$j(blankelem).css({'height':$j(elem).height() });
	// If the tool is in the form, remove it so it can be repositioned.
	if ( removeElem ) {
		formTrashcanReposition();
		$j('#_form_editbox').hide();
		$j(elem).remove();
		$j('#_form_toolbox').addClass('toolbox_background');
	}
	resizeForm();
	// Call the move event handler.
	toolDragMove(event);
	// Set the move and mouseup events.
	$j('#_form_mainFrame').mousemove(function(e){
		toolDragMove(e);
		return false;
	});
	$j('#_form_mainFrame').mouseup(function(e){
		toolDragMouseup(e);
		return false;
	});
}

/*
 * traverse up the DOM until one of the form elements is found, or we hit the end of the form, or the end of the DOM.
 */
function getParentElement(elem) {
	while (elem != null &&
		   elem != 'undefined' &&
		   $j(elem).attr("id") != '_form_form' &&
		   $j(elem).attr("id") != '_form_mainFrame' &&
		   ! $j(elem).hasClass('trashcan_container') &&
		   ! $j(elem).hasClass('_form_blank') &&
		   ! $j(elem).hasClass('_form_formelem') &&
		   ! $j(elem).hasClass('_form_formheader') &&
		   ! $j(elem).hasClass('_form_formfooter')) {
		elem = $j(elem).parent();
	}
	return elem;
}

/*
 * Event handler for the drag element's move.
 */
function toolDragMove(e) {
	// Position the drag element at the mouse location.
	$j('._form_tool_drag').css({'left':e.clientX - ( $j('._form_tool_drag').width() / 2) })
						  .css({'top': e.clientY - ( $j('._form_tool_drag').height() / 2) });
	
	// hide the drag element to get the underlying DIV, then put it back.
	$j('._form_tool_drag').css({'display':'none'});
	var backgroundElement = getParentElement( document.elementFromPoint(e.pageX, e.pageY) );
	$j('._form_tool_drag').css({'display':'inline-block'});
	
	// Adjust underlying elements as drag element moves over them
	if ( $j(backgroundElement).hasClass('_form_formelem') ) {
		// If blankelem is not as tall as the current element being dragged over, adjust it up
		if ($j(backgroundElement).height() >= $j(blankelem).height() ) {
			$j(blankelem).height( $j(backgroundElement).height() );
		// If original tool height is less than current element being dragged over, adjust blankelem to orig
		} else if (origToolHeight < $j(backgroundElement).height() ) {
			$j(blankelem).height( origToolHeight );
		}
		// Remove the blank and insert it before the current element being dragged over
		$j('._form_blank').remove();
		$j(blankelem).insertBefore(backgroundElement);
		blankAtEnd = false
	} else {
		$j(blankelem).removeClass('_form_blank_active');
		$j('.trashcan_container').removeClass('trashcan_active');
		if ( $j(backgroundElement).hasClass('_form_blank') ) {
			$j(blankelem).addClass('_form_blank_active');
		} else if ( $j(backgroundElement).hasClass('trashcan_container') ) {
			$j('.trashcan_container').addClass('trashcan_active');
		} else if (	! $j(backgroundElement).hasClass('_form_blank') && ! blankAtEnd ) {
			$j(blankelem).remove()
						.insertBefore( $j('#_form_form_fields_end') );
			blankAtEnd = true;
		}
	}
}

/*
 * Count the number of elements of the given type and increment the counter
 */
function next_elem(elemtype){
	var cnt = parseInt($j('#_form_form #_elemcount_' + elemtype).text()) + 1;
	$j('#_form_form #_elemcount_' + elemtype).text(cnt);
	return cnt;
}

/*
 * Insert element before target.
 */
function insertElem(elem, targetelem) {
	$j(elem).addClass('lastInsertedElem')
			.insertBefore(targetelem);
	var newelem = $j('.lastInsertedElem');
	// If this tool does not have an ID, get the next iteration and update it.
	if ( $j('#tool_id', newelem).text() == "" ) {
		var elemtype = $j(newelem).attr("id").substring(5);
		$j('#tool_id', newelem).text( elemtype + next_elem(elemtype) );
		if (elemtype == "radio"
			|| elemtype == "checkbox"
 			|| elemtype == "singleselect"
 			|| elemtype == "multiselect") {
			$j('#tool_label', newelem).attr("for", $j('#tool_id', newelem).text() );
		} else if (elemtype == 'date') {
			$j('.tool_date_input', newelem).attr("id", $j('#tool_id', newelem).text() );
		}
	}
	formEdit(newelem);
	$j(newelem).removeClass('lastInsertedElem');
}

/*
 * User has released the mouse button, so drag element needs to be handled.
 */
function toolDragMouseup(e) {
	// Unbind the move and mouseup events.
	$j('#_form_mainFrame').unbind('mousemove');
	$j('#_form_mainFrame').unbind('mouseup');

	// Hide the drag tool so we can get the background element, then re-display the drag tool.
	$j('._form_tool_drag').css("display", "none");
	var backgroundElement = document.elementFromPoint(e.pageX, e.pageY);
	$j('._form_tool_drag').css("display", "inline-block");
	// Put the toolbox back in the foreground.
	$j('#_form_toolbox').removeClass('toolbox_background');
	// If background element is not the trashcan, add the drag element into the DOM of the form.
	if ( backgroundElement.classList[0] != 'trashcan_container' ) {
		var newelem = '<div class="_form_formelem';
		if ( siblingElem == null || $j('._form_tool_drag').hasClass('_form_element_notset') ) {
			newelem += ' _form_element_notset';
		}
		newelem +=	'" id="' + $j('._form_tool_drag').attr("id") + '">'
				+	$j('._form_tool_drag').html();
		if ( ! $j(newelem).children('.tool_set_as_title').length &&
			 ( $j('._form_tool_drag').attr("id") == 'tool_input'
			   || $j('._form_tool_drag').attr("id") == 'tool_radio'
			   || $j('._form_tool_drag').attr("id") == 'tool_singleselect'
			   || $j('._form_tool_drag').attr("id") == 'tool_attachment' ) ) {
			newelem +=	toolSetAsTitle;
		}
		if (  ! $j(newelem).children('.tool_required').length
			 && $j('._form_tool_drag').attr("id") != 'tool_submitter'
			 && $j('._form_tool_drag').attr("id") != 'tool_textblock' ) {
			newelem +=	toolRequired;
		}
			newelem +=	'</div>';
			// If the drag tool was over the blank element, add it there.
		if (backgroundElement.id == "_form_blank"){
			insertElem( newelem, backgroundElement);
		} else {
			// If we have a sibling saved off, add it there.
			if (siblingElem) {
				backgroundElement = siblingElem;
				insertElem( newelem, backgroundElement);
			}
		}
		changesMade = true;
	}
	fadeOutToolDrag(backgroundElement);
	$j('.trashcan_frame').hide();
	// Remove the blank element.
	blankelem = $j('._form_blank');
	$j(blankelem).remove();
	blankAtEnd = true;
	// Set up event handlers for the form elements.
	$j('#_form_form ._form_formelem').unbind('click');
	$j('#_form_form ._form_formelem').unbind('mousedown');
	$j('#_form_form ._form_formelem').mousedown(function(e){
		editX = e.pageX;
		editY = e.pageY;
		editelem = $j(this);
		siblingElem = $j(this).next();
		toolboxElementMousedown(e, editelem, true );
	});
	resizeForm();
	siblingElem = null;
}

/*
 * The parent window was scrolled.  We need to see if the widget frame is scrolled up past the top
 * of the browser window (347 pixels).  If so, we need to keep the toolbox at the top of the window.  This will keep it
 * in sight when scrolling on large forms.
 */
 function parentWindowScrolled(e) {
 	if ($j(parentWindow).scrollTop() > 347) {
 		if ( $j('#_form_form').height() > 1000 ) {
 			if(($j(parentWindow).scrollTop() + 558) > $j(parentIframe).height()) {
 				$j('#_form_toolbox').addClass('_toolbox_fixed');
 			} else {

 				$j('#_form_toolbox').removeClass('_toolbox_fixed');
 				$j('#_form_toolbox').css('margin-top', $j(parentWindow).scrollTop() - ($j(parentIframe).offset().top + 30) );
 			}
 		}
 	} else {
 		$j('#_form_toolbox').css('margin-top', 0);
 	}
 }

/*
 * When the widget is ready we need to set up event handlers for the fields that do not change in the DOM.
 */
$j(document).ready(function() {
	// Determine browser details.
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	IEVersion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)));
	// Set up the blank form.
	_form_startOver();
	// Set up the event handler for the destination input field.
	if(IEVersion <= 8){	
		$j('#editbox_destination_input').css({ 'height': '16px'})
										.attr('onpropertychange', 'toggleFormDestinationOKButton()');
		$j('#editbox_destination_URL_chk').attr('onpropertychange', 'toggleFormDestinationOKButton()');
		$j('#editbox_destination_email_chk').attr('onpropertychange', 'toggleFormDestinationOKButton()');
/*
		$j('#editbox_destination_email').css({ 'height': '16px'})
										.attr('onpropertychange', 'toggleFormDestinationOKButton()');
*/
	} else {
		$j('#editbox_destination_input').bind('input', function() { 
			toggleFormDestinationOKButton();
		});
		$j('#editbox_destination_URL_chk').bind('change', function() { 
			toggleFormDestinationOKButton();
		});
		$j('#editbox_destination_email_chk').bind('change', function() { 
			toggleFormDestinationOKButton();
		});
/*
		$j('#editbox_destination_email').bind('input', function() { 
			toggleFormDestinationOKButton();
		});
*/
	}
	
	baseURL = window.parent._jive_base_absolute_url.replace(/.*?:\/\//g, "");
	
	// Set up the mousedown event for the toolbox.
	$j('.toolbox_element').mousedown(function(e){
		toolboxElementMousedown(e, $j(this), false );
		return false;
	});
	// Set up the scroll event handler for the parent window.
	window.parent.document.onscroll = function (e) {
		parentWindowScrolled(e);
		return true;
	} 

});