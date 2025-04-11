import { createModal, createTextFieldBlock } from './utils';

export const OTHER_REQUEST_ID = 'other_request_id';

export const OTHER_REQUEST_MODAL_TICKET_TITLE = 'other_request_modal_ticket_title';
export const OTHER_REQUEST_MODAL_TICKET_DESCRIPTION = 'other_request_modal_ticket_description';

export const OTHER_REQUEST_MODAL = createModal({
  title: 'Other Request',
  formId: OTHER_REQUEST_ID,
  blocks: [
    createTextFieldBlock({
      id: OTHER_REQUEST_MODAL_TICKET_TITLE,
      label: 'Ticket Title',
      optional: false,
      multiline: false,
    }),
    createTextFieldBlock({
      id: OTHER_REQUEST_MODAL_TICKET_DESCRIPTION,
      label: 'Description',
      optional: false,
      multiline: true,
    }),
  ],
});
