import { createDropdownBlock, createModal, createTextFieldBlock } from './utils';

export const TECH_REQUEST_ID = 'tech_request_id';

export const TECH_REQUEST_MODAL_TICKET_TITLE = 'tech_request_modal_ticket_title';
export const TECH_REQUEST_MODAL_APPLICATION = 'tech_request_modal_app';
export const TECH_REQUEST_MODAL_DESCRIPTION = 'tech_request_modal_description';

export const TECH_REQUEST_MODAL = createModal({
  title: 'Tech Request',
  formId: TECH_REQUEST_ID,
  blocks: [
    createTextFieldBlock({
      id: TECH_REQUEST_MODAL_TICKET_TITLE,
      label: 'Ticket Title',
      optional: false,
      multiline: false,
    }),
    createDropdownBlock({
      id: TECH_REQUEST_MODAL_APPLICATION,
      label: 'Application',
      optional: false,
      options: [
        { label: 'Website', value: 'Websxite' },
        { label: 'Short Link App', value: 'Short Link App' },
        { label: 'Planka', value: 'Planka' },
        { label: 'New App', value: 'New App' },
        { label: 'Other', value: 'Other' },
      ],
    }),
    createTextFieldBlock({
      id: TECH_REQUEST_MODAL_DESCRIPTION,
      label: 'Description (please try to provide as much detail as possible)',
      optional: false,
      multiline: true,
    }),
  ],
});
