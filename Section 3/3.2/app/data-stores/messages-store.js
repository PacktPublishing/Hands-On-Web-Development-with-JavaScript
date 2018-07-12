export default class MessagesStore {
    constructor() {
        this.messages = [];
    }

    loadData() {
        return new Promise((resolve, reject) => {
            this.messages = [
                {
                    id: '1',
                    text: `Hey World! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book.`,
                    from: 'john4',
                    to: 'rama3',
                    time: '01/04/2018 11:23:34'
                },
                {
                    id: '2',
                    text: `Hey World! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book.`,
                    from: 'rama3',
                    to: 'john4',
                    time: '01/04/2018 11:23:34'
                },
                {
                    id: '3',
                    text: `Hey World! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book.`,
                    from: 'cathy',
                    to: 'rama3',
                    time: '01/04/2018 11:23:34'
                }
            ];
            resolve(this.messages);
        });
    }

    getMessagesByUser(userId) {
        return this.messages.filter(msg => msg.to === userId);
    }

    sendMessage(msgObj) {
        msgObj.id = Math.random() * 100;
        this.messages.push(msgObj);
    }
}