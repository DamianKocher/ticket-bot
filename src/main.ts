import { App } from '@slack/bolt';
import {
  CREATE_CHANNEL_REQUEST_ACTION_ID,
  CREATE_COMMS_REQUEST_TICKET_ACTION_ID,
  CREATE_OTHER_TICKET_ACTION,
  CREATE_TECH_REQUEST_TICKET_ACTION_ID,
  CREATE_TICKET_MODAL,
} from './modals/ticketModal';
import {
  ACTION_INPUT_FORMATION,
  COMMS_REQUEST_CALLBACK_ID,
  COMMS_REQUEST_MODAL,
  INPUT_ADDITIONAL_NOTES,
  INPUT_DESCRIPTION,
  INPUT_DESIGN,
  INPUT_EVENT_DATE,
  INPUT_IS_EVENT,
  INPUT_LOGO,
  INPUT_NEEDS,
  INPUT_PHYSICAL_MATERIALS,
  INPUT_SOCIAL_DATES,
} from './modals/commsRequestModal';
import { PlankaClient } from './planka/plankaClient';
import { ModalView } from '@slack/types';
import {
  OTHER_REQUEST_ID,
  OTHER_REQUEST_MODAL,
  OTHER_REQUEST_MODAL_TICKET_DESCRIPTION,
  OTHER_REQUEST_MODAL_TICKET_TITLE,
} from './modals/otherRequestModal';
import {
  TECH_REQUEST_ID,
  TECH_REQUEST_MODAL,
  TECH_REQUEST_MODAL_APPLICATION,
  TECH_REQUEST_MODAL_DESCRIPTION,
  TECH_REQUEST_MODAL_TICKET_TITLE,
} from './modals/techRequestModal';
import {
  CHANNEL_REQUEST_MODAL,
  CHANNEL_REQUEST_MODAL_CHANNEL_DROPDOWN,
  CHANNEL_REQUEST_MODAL_ID,
  CHANNEL_REQUEST_MODAL_REASON,
} from './modals/channelRequestModal';

const app = new App({
  token: process.env.TICKET_BOT_SLACK_TOKEN,
  signingSecret: process.env.TICKET_BOT_SLACK_SIGNING_SECRET,
});

app.command('/ticket', async ({ ack, body, client, logger }) => {
  await ack();
  logger.info(`/ticket command used by ${body.user_name}`);

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: CREATE_TICKET_MODAL,
    });
  } catch (error) {
    logger.error('error in ticket command', { error });
  }
});

function createModalActionCallback(modal: ModalView) {
  return async ({ body, ack, client, logger }: Parameters<Parameters<typeof app.action>[1]>[0]) => {
    await ack();

    try {
      logger.info(`attempting to open modal for user ${body.user.id}`);

      if (body.type === 'block_actions' && body.view) {
        await client.views.update({
          view_id: body.view.id,
          hash: body.view.hash,

          view: modal,
        });
      }
    } catch (error) {
      logger.error('error while attempting to open modal', {
        callback_id: modal.callback_id,
        user: body.user.id,
        error,
      });
    }
  };
}

type CreateTicketViewCallbackParams = {
  listId: string;
  parser: (body: Parameters<Parameters<typeof app.view>[1]>[0]['body']) => [cardTitle: string, cardBody: string];
  slack: {
    channelId: string;
  };
};

function createTicketViewCallback({ listId, parser, slack }: CreateTicketViewCallbackParams) {
  return async ({ body, ack, client, logger }: Parameters<Parameters<typeof app.view>[1]>[0]) => {
    await ack({
      response_action: 'clear',
    });

    try {
      const [cardTitle, cardBody] = parser(body);

      const planka = new PlankaClient();
      await planka.login();
      const { cardLink } = await planka.createCard(listId, cardTitle, cardBody);

      if (slack) {
        await client.chat.postMessage({
          channel: slack.channelId,
          text: `New Ticket: ${cardTitle}`,
          unfurl_links: false,
          unfurl_media: false,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `A ticket was created by <@${body.user.id}>:\n*<${cardLink}|${cardTitle}>*`,
                verbatim: true,
              },
            },
          ],
        });
      }
    } catch (error) {
      logger.error('error creating ticket', { error });
    }
  };
}

app.action(CREATE_COMMS_REQUEST_TICKET_ACTION_ID, createModalActionCallback(COMMS_REQUEST_MODAL));
app.action(CREATE_TECH_REQUEST_TICKET_ACTION_ID, createModalActionCallback(TECH_REQUEST_MODAL));
app.action(CREATE_CHANNEL_REQUEST_ACTION_ID, createModalActionCallback(CHANNEL_REQUEST_MODAL));
app.action(CREATE_OTHER_TICKET_ACTION, createModalActionCallback(OTHER_REQUEST_MODAL));

app.view(
  COMMS_REQUEST_CALLBACK_ID,
  createTicketViewCallback({
    listId: process.env.TICKET_BOT_COMMS_REQUEST_LIST_ID ?? '',
    slack: {
      channelId: process.env.TICKET_BOT_COMMS_REQUEST_CHANNEL_ID ?? '',
    },
    parser: (body) => {
      const values = body.view.state.values;

      const formation = values[ACTION_INPUT_FORMATION][ACTION_INPUT_FORMATION].selected_option?.value ?? '';
      const isEvent =
        values[INPUT_IS_EVENT][INPUT_IS_EVENT].selected_options?.some((option) => option.value === 'is_event') ?? false;
      const eventDate = values[INPUT_EVENT_DATE][INPUT_EVENT_DATE].selected_date ?? '';
      const description = values[INPUT_DESCRIPTION][INPUT_DESCRIPTION].value;
      const needs = values[INPUT_NEEDS][INPUT_NEEDS].selected_options?.map((option) => option.value) ?? [];
      const physicalMaterials = values[INPUT_PHYSICAL_MATERIALS][INPUT_PHYSICAL_MATERIALS].value ?? '';
      const socialDates = values[INPUT_SOCIAL_DATES][INPUT_SOCIAL_DATES].value ?? '';
      const logos = values[INPUT_LOGO][INPUT_LOGO].selected_options?.map((option) => option.value) ?? [];
      const design = values[INPUT_DESIGN][INPUT_DESIGN].value ?? '';
      const additionalNotes = values[INPUT_ADDITIONAL_NOTES][INPUT_ADDITIONAL_NOTES].value ?? '';

      const cardTitle = `${formation} - ${description}`;

      const cardBody = [
        `### Comms Request from ${body.user.name}`,
        `Formation: ${formation}`,
        `Is Event: ${isEvent ? '✅' : '❌'}`,
        `Event Date: ${eventDate}`,
        '',
        '#### Brief Description:',
        `${description}`,
        '',
        '#### Needs:',
        `${needs.map((need) => `- ${need}`).join('\n')}`,
        '',
        `#### Physical Materials:`,
        `${physicalMaterials}`,
        '',
        `#### Social Dates:`,
        `${socialDates}`,
        '',
        `#### Logo(s):`,
        `${logos.map((logo) => `- ${logo}`).join('\n')}`,
        '',
        `#### Design: any ideas, inspiration, colors, etc:`,
        `${design}`,
        '',
        `#### Additional Notes`,
        `${additionalNotes}`,
      ].join('\n');

      return [cardTitle, cardBody];
    },
  }),
);

app.view(
  TECH_REQUEST_ID,
  createTicketViewCallback({
    listId: process.env.TICKET_BOT_TECH_REQUEST_LIST_ID ?? '',
    slack: {
      channelId: process.env.TICKET_BOT_TECH_REQUEST_CHANNEL_ID ?? '',
    },
    parser: (body) => {
      const values = body.view.state.values;

      const title = values[TECH_REQUEST_MODAL_TICKET_TITLE][TECH_REQUEST_MODAL_TICKET_TITLE]?.value ?? '';
      const appName =
        values[TECH_REQUEST_MODAL_APPLICATION][TECH_REQUEST_MODAL_APPLICATION]?.selected_option?.value ?? '';
      const description = values[TECH_REQUEST_MODAL_DESCRIPTION][TECH_REQUEST_MODAL_DESCRIPTION]?.value ?? '';

      const cardTitle = `${appName} - ${title}`;

      const cardBody = [`**App:** ${appName}`, '', '**Description:**', description].join('\n');

      return [cardTitle, cardBody];
    },
  }),
);

app.view(
  CHANNEL_REQUEST_MODAL_ID,
  createTicketViewCallback({
    listId: process.env.TICKET_BOT_CHANNEL_REQUEST_LIST_ID ?? '',
    slack: {
      channelId: process.env.TICKET_BOT_CHANNEL_REQUEST_CHANNEL_ID ?? '',
    },
    parser: (body) => {
      const values = body.view.state.values;

      const channels =
        values[CHANNEL_REQUEST_MODAL_CHANNEL_DROPDOWN][CHANNEL_REQUEST_MODAL_CHANNEL_DROPDOWN]?.selected_options?.map(
          (option) => option.value,
        ) ?? [];
      const reason = values[CHANNEL_REQUEST_MODAL_REASON][CHANNEL_REQUEST_MODAL_REASON]?.value ?? '';

      const cardTitle = `${body.user.name} would like to join ${channels.join(', ')}`;
      const cardDescription = [
        '**User Id:**',
        `${body.user.name} (${body.user.id})`,
        '',
        '**Channels:**',
        ...channels.map((channel) => `- ${channel}`),
        '**User provided reason:**',
        reason,
      ].join('\n');

      return [cardTitle, cardDescription];
    },
  }),
);

app.view(
  OTHER_REQUEST_ID,
  createTicketViewCallback({
    listId: process.env.TICKET_BOT_OTHER_REQUEST_LIST_ID ?? '',
    slack: {
      channelId: process.env.TICKET_BOT_OTHER_REQUEST_CHANNEL_ID ?? '',
    },
    parser: (body) => {
      const values = body.view.state.values;

      const cardTitle = values[OTHER_REQUEST_MODAL_TICKET_TITLE][OTHER_REQUEST_MODAL_TICKET_TITLE]?.value ?? '';
      const cardDescription =
        values[OTHER_REQUEST_MODAL_TICKET_DESCRIPTION][OTHER_REQUEST_MODAL_TICKET_DESCRIPTION]?.value ?? '';

      return [cardTitle, cardDescription];
    },
  }),
);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();
