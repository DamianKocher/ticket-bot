import { ActionsBlockElement, ModalView } from '@slack/types';

export const CREATE_COMMS_REQUEST_TICKET_ACTION_ID = 'create_comms_request_ticket';
export const CREATE_TECH_REQUEST_TICKET_ACTION_ID = 'create_tech_request_ticket';
export const CREATE_TRINITY_SPACE_REQUEST_ACTION_ID = 'create_trinity_space_request_ticket';
export const CREATE_CHANNEL_REQUEST_ACTION_ID = 'create_channel_request_ticket';
export const CREATE_OTHER_TICKET_ACTION = 'create_other_ticket';

function createTicketAction(id: string, label: string): ActionsBlockElement {
  return {
    type: 'button',
    action_id: id,
    text: {
      type: 'plain_text',
      emoji: true,
      text: label,
    },
  };
}

export const CREATE_TICKET_MODAL: ModalView = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'St. Louis DSA Ticket Bot',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "damian is still working on this. please don't use this for real comms requests yet :)",
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Select the type of ticket you would like to create:*',
      },
    },
    {
      type: 'actions',
      elements: [
        createTicketAction(CREATE_COMMS_REQUEST_TICKET_ACTION_ID, 'Comms Request'),
        createTicketAction(CREATE_TECH_REQUEST_TICKET_ACTION_ID, 'Tech Request'),
        // createTicketAction(CREATE_TRINITY_SPACE_REQUEST_ACTION_ID, "Trinity Space Request"),
        createTicketAction(CREATE_CHANNEL_REQUEST_ACTION_ID, 'Channel Request'),
        createTicketAction(CREATE_OTHER_TICKET_ACTION, 'Other'),
      ],
    },
  ],
};
