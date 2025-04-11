export class PlankaClient {
  private accessToken?: string;

  async login() {
    const body = new URLSearchParams();
    body.append('emailOrUsername', process.env.TICKET_BOT_PLANKA_EMAIL ?? '');
    body.append('password', process.env.TICKET_BOT_PLANKA_PASSWORD ?? '');

    const result = await fetch('https://project.stldsa.org/api/access-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data: { item?: string } = await result.json();
    this.accessToken = data.item;
  }

  async createCard(listId: string, name: string, description: string) {
    const result = await fetch(`https://project.stldsa.org/api/lists/${listId}/cards`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        name,
        description,
        position: Date.now(),
        dueDate: null,
        isDueDateCompleted: null,
      }),
    });

    const data = await result.json();
    console.log(data);

    const cardLink = `https://project.stldsa.org/cards/${data.item.id}`;
    return { cardLink };
  }
}
