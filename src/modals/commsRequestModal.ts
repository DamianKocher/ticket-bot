import { ModalView } from '@slack/types';
import { createCheckboxBlock, createDatePickerBlockParams, createDropdownBlock, createTextFieldBlock } from './utils';

export const ACTION_INPUT_FORMATION = 'input_formation';
export const INPUT_IS_EVENT = 'input_is_event';
export const INPUT_EVENT_DATE = 'input_event_date';
export const INPUT_DESCRIPTION = 'input_description';
export const INPUT_NEEDS = 'input_needs';
export const INPUT_PHYSICAL_MATERIALS = 'input_physical_materials';
export const INPUT_SOCIAL_DATES = 'input_social_dates';
export const INPUT_LOGO = 'input_logo';
export const INPUT_DESIGN = 'input_design';
export const INPUT_ADDITIONAL_NOTES = 'input_additional_notes';

export const COMMS_REQUEST_CALLBACK_ID = 'comms_request_modal';
export const COMMS_REQUEST_MODAL: ModalView = {
  title: {
    type: 'plain_text',
    text: 'Comms Request',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true,
  },
  type: 'modal',
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  callback_id: COMMS_REQUEST_CALLBACK_ID,
  blocks: [
    createDropdownBlock({
      id: ACTION_INPUT_FORMATION,
      label: 'Formation',
      optional: false,
      options: [
        { label: 'Administrative Committee', value: 'Admnistrative' },
        { label: 'Communications Committee', value: 'Communications' },
        { label: 'Electoral Organizing Committee', value: 'Electoral' },
        { label: 'Executive Committee', value: 'EC' },
        { label: 'Streets Organizing Committee', value: 'Streets' },
        { label: 'Labor Committee', value: 'Labor' },
        { label: 'Political Education Committee', value: 'Polid Ed' },
        { label: 'Growth & Development Committee', value: 'GDC' },
        { label: 'Caregivers\' Caucus', value: 'Caregivers' },
      ],
    }),
    createCheckboxBlock({
      id: INPUT_IS_EVENT,
      label: 'Is this for an event?',
      optional: true,
      options: [{ label: 'Yes, this is for an event', value: 'is_event' }],
    }),
    createDatePickerBlockParams({
      id: INPUT_EVENT_DATE,
      label: 'If Yes, when is the date of the event?',
      optional: true,
    }),
    createTextFieldBlock({
      id: INPUT_DESCRIPTION,
      label: 'Brief description of event or action item',
      optional: false,
      multiline: false,
    }),
    createCheckboxBlock({
      id: INPUT_NEEDS,
      label: 'Needs',
      optional: false,
      options: [
        { label: 'Graphics', value: 'Graphics' },
        { label: 'Merchandise', value: 'Merchandise' },
        { label: 'Press release', value: 'Press release' },
        { label: 'Print media', value: 'Print media' },
        { label: 'Photography/Videography', value: 'Photography/Videography' },
        { label: 'Social media posts', value: 'Social media posts' },
      ],
    }),
    createTextFieldBlock({
      id: INPUT_PHYSICAL_MATERIALS,
      label:
        'Physical materials: please provide as much detail as possible about what materials are needed and what date they are needed by (ALL PRINT REQUESTS REQUIRE TWO WEEK TURNAROUND TIME MINIMUM)',
      optional: true,
      multiline: true,
    }),
    createTextFieldBlock({
      id: INPUT_SOCIAL_DATES,
      label: 'Social media: dates to post',
      optional: true,
      multiline: true,
    }),
    createCheckboxBlock({
      id: INPUT_LOGO,
      label: 'Design: logo(s)',
      optional: false,
      options: [
        { label: 'Formation specific logo', value: 'Formation specific logo' },
        { label: 'STL DSA Logo', value: 'STL DSA Logo' },
        { label: 'Other (please specify in notes)', value: 'Other' },
      ],
    }),
    createTextFieldBlock({
      id: INPUT_DESIGN,
      label: 'Design: any ideas, inspiration, colors, etc',
      optional: true,
      multiline: true,
    }),
    createTextFieldBlock({
      id: INPUT_ADDITIONAL_NOTES,
      label: 'Additional notes',
      optional: true,
      multiline: true,
    }),
  ],
};
